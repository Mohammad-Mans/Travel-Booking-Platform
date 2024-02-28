import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ResultsLayout from "../components/ResultsLayout";
import { Box } from "@mui/material";
import { AxiosError } from "axios";
import axios from "../../../services/axiosInstance";
import { useSnackbarError } from "../../../context/SnackbarErrorProvider";
import ResultsGrid from "../components/ResultsGrid";
import { useSnackbarSuccess } from "../../../context/SnackbarSuccessProvider";
import ActionDrawer from "../components/ActionDrawer";
import { HotelUpdateFormValidation } from "../../../validation";
import { HotelCreationFormValidation } from "../../../validation";

const GET_HOTELS_URL = "/api/hotels";

type Hotel = {
  id: number;
  name: string;
  description: string;
  hotelType: number;
  starRating: number;
  latitude: number;
  longitude: number;
};

type HotelsParams = {
  hotelName: string;
  hotelDescription: string;
  pageNumber: number;
  pageSize: number;
};

const InitialHotelsQuery = {
  hotelName: "",
  hotelDescription: "",
  pageNumber: 1,
  pageSize: 10,
};

const InitialFormState = {
  cityId: "",
  id: 0,
  name: "",
  description: "",
  hotelType: 0,
  starRating: 0,
  latitude: 0,
  longitude: 0,
};

type SubmitProps = {
  cityId?: string;
  id: number;
  name: string;
  description: string;
  hotelType: number;
  starRating: number;
  latitude: number;
  longitude: number;
};

function hotels() {
  const userData = JSON.parse(localStorage.getItem("user_data")!);
  const accessToken = userData.accessToken;
  const { setErrorMessage } = useSnackbarError();
  const { setSuccessMessage } = useSnackbarSuccess();
  const [hotels, setHotels] = useState<Hotel[]>();
  const [loadingHotels, setLoadingHotels] = useState<boolean>(true);
  const [hotelsParams, setHotelsParams] =
    useState<HotelsParams>(InitialHotelsQuery);
  const [FormState, setFormState] = useState<Hotel>(InitialFormState);
  const [drawerAction, setdrawerAction] = useState<string | null>(null);
  const [loadingFormSubmit, setLoadingFormSubmit] = useState<boolean>(false);

  const getHotels = async () => {
    const { hotelName, hotelDescription, pageNumber, pageSize } = hotelsParams;

    const params = {
      name: hotelName,
      searchQuery: hotelDescription,
      pageSize,
      pageNumber,
    };

    try {
      const response = await axios.get(GET_HOTELS_URL, { params });
      setHotels(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't fetch hotels");
      }
    } finally {
      setLoadingHotels(false);
    }
  };

  useEffect(() => {
    getHotels();
  }, [hotelsParams]);

  const handleSearch = (value: string, searchBy: string) => {
    let hotelName, hotelDescription;

    if (searchBy === "name") {
      hotelName = value;
      hotelDescription = "";
    } else {
      hotelName = "";
      hotelDescription = value;
    }

    setHotelsParams({ ...hotelsParams, hotelName, hotelDescription });
  };

  const handleChangePage = (pageNumber: number, pageSize: number) => {
    setHotelsParams({ ...hotelsParams, pageNumber, pageSize });
  };

  const handleDelete = async (hotelID: number | null) => {
    const cityId = await getCityId(hotelID);

    const DELETE_HOTEL_URL = `/api/cities/${cityId}/hotels/${hotelID}`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      await axios.delete(DELETE_HOTEL_URL, { headers });
      setSuccessMessage("The hotel was deleted successfully");
      getHotels();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else if (axiosError.response?.status === 404) {
        setErrorMessage("Specified hotel was not found");
      } else {
        setErrorMessage("Couldn't delete hotel");
      }
    }
  };

  const handleUpdate = (selectedRow: any) => {
    setdrawerAction("update");
    setFormState(selectedRow);
  };

  const handleCreateHotel = () => {
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
    const UPDATE_HOTEL_URL = `/api/hotels/${values.id}`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      setLoadingFormSubmit(true);
      await axios.put(UPDATE_HOTEL_URL, values, { headers });
      setSuccessMessage("The hotel was updated successfully");
      getHotels();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else if (axiosError.response?.status === 404) {
        setErrorMessage("Specified hotel was not found");
      } else {
        setErrorMessage("Couldn't update hotel");
      }
    } finally {
      setLoadingFormSubmit(false);
      handleActionDrawerClose();
    }
  };

  const handleConfirmCreate = async (values: SubmitProps) => {
    const CREATE_HOTEL_URL = `/api/cities/${values.cityId}/hotels`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      setLoadingFormSubmit(true);
      const response = await axios.post(CREATE_HOTEL_URL, values, {
        headers,
      });

      setSuccessMessage(`Hotel ${response.data.name} was created successfully`);
      getHotels();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't create hotel");
      }
    } finally {
      setLoadingFormSubmit(false);
      handleActionDrawerClose();
    }
  };

  const getCityId = async (hotelId: number | null) => {
    const GET_HOTEL_INFO = `/api/hotels/${hotelId}`;
    try {
      const response = await axios.get(GET_HOTEL_INFO);

      return response.data.cityId;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't get the City of the hotel");
      }
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <SearchBar label="Search for hotels..." onSearch={handleSearch} />
      <ResultsLayout isLoading={loadingHotels} onCreate={handleCreateHotel}>
        {hotels && (
          <ResultsGrid
            dataType="hotels"
            data={hotels}
            columnHeaders={[
              { field: "name", headerName: "Name" },
              { field: "description", headerName: "Description" },
              { field: "hotelType", headerName: "Hotel Type" },
              { field: "starRating", headerName: "Star Rating" },
              { field: "latitude", headerName: "Latitude" },
              { field: "longitude", headerName: "Longitude" },
            ]}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            totalCount={122}
            onChangePage={handleChangePage}
          />
        )}
      </ResultsLayout>

      <ActionDrawer
        dataType="hotels"
        action={drawerAction}
        fields={[
          { name: "name", label: "Hotel Name" },
          { name: "description", label: "Hotel Description" },
          { name: "hotelType", label: "Hotel Type" },
          { name: "starRating", label: "Star Rating" },
          { name: "latitude", label: "Latitude" },
          { name: "longitude", label: "Longitude" },
        ]}
        open={drawerAction !== null}
        onClose={handleActionDrawerClose}
        initialFormState={FormState}
        validation={
          drawerAction === "create"
            ? HotelCreationFormValidation
            : HotelUpdateFormValidation
        }
        onSubmit={handleActionDrawerSubmit}
        loading={loadingFormSubmit}
      />
    </Box>
  );
}

export default hotels;
