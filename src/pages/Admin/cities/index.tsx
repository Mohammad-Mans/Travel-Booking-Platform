import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ResultsLayout from "../components/ResultsLayout";
import { Box } from "@mui/material";
import { AxiosError } from "axios";
import axios from "../../../api/axios";
import { useSnackbarError } from "../../../context/SnackbarErrorProvider";
import ResultsGrid from "../components/ResultsGrid";
import { useSnackbarSuccess } from "../../../context/SnackbarSuccessProvider";
import ActionDrawer from "../components/ActionDrawer";
import { CityFormValidation } from "../../../validation";

const GET_CITIES_URL = "/api/cities";

type City = {
  id: number;
  name: string;
  description: string;
};

type CitiesParams = {
  cityName: string;
  cityDescription: string;
  pageNumber: number;
  pageSize: number;
};

type ActionDrawer = {
  state: boolean;
  action: string;
};

const InitialCitiesQuery = {
  cityName: "",
  cityDescription: "",
  pageNumber: 1,
  pageSize: 10,
};

const InitialFormState = {
  id: 0,
  name: "",
  description: "",
};

type SubmitProps = {
  id: number;
  name: string;
  description: string;
};

function cities() {
  const userData = JSON.parse(localStorage.getItem("user_data")!);
  const accessToken = userData.accessToken;
  const { setErrorMessage } = useSnackbarError();
  const { setSuccessMessage } = useSnackbarSuccess();
  const [cities, setCities] = useState<City[]>();
  const [loadingCities, setLoadingCities] = useState<boolean>(true);
  const [citiesParams, setCitiesParams] =
    useState<CitiesParams>(InitialCitiesQuery);
  const [FormState, setFormState] = useState<City>(InitialFormState);
  const [drawerAction, setdrawerAction] = useState<string | null>(null);
  const [loadingFormSubmit, setLoadingFormSubmit] = useState<boolean>(false);

  const getCities = async () => {
    const { cityName, cityDescription, pageNumber, pageSize } = citiesParams;

    const params = {
      name: cityName,
      searchQuery: cityDescription,
      pageSize,
      pageNumber,
    };

    try {
      const response = await axios.get(GET_CITIES_URL, { params });
      setCities(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't fetch cities");
      }
    } finally {
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    getCities();
  }, [citiesParams]);

  const handleSearch = (value: string, searchBy: string) => {
    let cityName, cityDescription;

    if (searchBy === "name") {
      cityName = value;
      cityDescription = "";
    } else {
      cityName = "";
      cityDescription = value;
    }

    setCitiesParams({ ...citiesParams, cityName, cityDescription });
  };

  const handleChangePage = (pageNumber: number, pageSize: number) => {
    setCitiesParams({ ...citiesParams, pageNumber, pageSize });
  };

  const handleDelete = async (cityID: number | null) => {
    const DELETE_CITY_URL = `/api/cities/${cityID}`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      await axios.delete(DELETE_CITY_URL, { headers });
      setSuccessMessage("The city was deleted successfully");
      getCities();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else if (axiosError.response?.status === 404) {
        setErrorMessage("Specified city was not found");
      } else {
        setErrorMessage("Couldn't delete city");
      }
    }
  };

  const handleUpdate = (selectedRow: any) => {
    setdrawerAction("update");
    setFormState(selectedRow);
  };

  const handleCreateCity = () => {
    setdrawerAction("create");
    setFormState(InitialFormState);
  };

  const handleActionDrawerClose = () => {
    setFormState(InitialFormState);
    setdrawerAction(null);
  };

  const handleActionDrawerSubmit = (values: SubmitProps) => {
    drawerAction === "update"
      ? handleConfirmUpdate(values)
      : handleConfirmCreate(values);
  };

  const handleConfirmUpdate = async (values: SubmitProps) => {
    const UPDATE_CITY_URL = `/api/cities/${values.id}`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      setLoadingFormSubmit(true);
      await axios.put(UPDATE_CITY_URL, values, { headers });
      setSuccessMessage("The city was updated successfully");
      getCities();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else if (axiosError.response?.status === 404) {
        setErrorMessage("Specified city was not found");
      } else {
        setErrorMessage("Couldn't update city");
      }
    } finally {
      setLoadingFormSubmit(false);
      handleActionDrawerClose();
    }
  };

  const handleConfirmCreate = async (values: SubmitProps) => {
    const CREATE_CITY_URL = "/api/cities/";

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      setLoadingFormSubmit(true);
      const response = await axios.post(CREATE_CITY_URL, values, { headers });

      setSuccessMessage(`City ${response.data.name} was created successfully`);
      getCities();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't create city");
      }
    } finally {
      setLoadingFormSubmit(false);
      handleActionDrawerClose();
    }
  };

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <SearchBar label="Search for cities..." onSearch={handleSearch} />
        <ResultsLayout isLoading={loadingCities} onCreate={handleCreateCity}>
          {cities && (
            <ResultsGrid
              dataType="cities"
              data={cities}
              columnHeaders={[
                { field: "name", headerName: "Name" },
                { field: "description", headerName: "Description" },
              ]}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              totalCount={8}
              onChangePage={handleChangePage}
            />
          )}
        </ResultsLayout>
      </Box>

      <ActionDrawer
        dataType="cities"
        action={drawerAction}
        fields={[
          { name: "name", label: "City Name" },
          { name: "description", label: "City Description" },
        ]}
        open={drawerAction !== null}
        onClose={handleActionDrawerClose}
        initialFormState={FormState}
        validation={CityFormValidation}
        onSubmit={handleActionDrawerSubmit}
        loading={loadingFormSubmit}
      />
    </>
  );
}

export default cities;
