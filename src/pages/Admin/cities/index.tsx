import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ResultsLayout from "../components/ResultsLayout";
import { Box } from "@mui/material";
import ResultsGrid from "../components/ResultsGrid";
import ActionDrawer from "../components/ActionDrawer";
import { CityFormValidation } from "../../../validation";
import useFetchCities from "./hooks/useFetchCities";
import useCityActions from "./hooks/useCityActions";

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

function cities() {
  const [citiesQuery, setCitiesQuery] =
    useState<CitiesQuery>(InitialCitiesQuery);

  const { cities, loadingCities, fetchCities } = useFetchCities(citiesQuery);

  const {
    createCity,
    updateCity,
    deleteCity,
    loading: loadingFormSubmit,
  } = useCityActions(fetchCities);

  const [FormState, setFormState] = useState<City>(InitialFormState);
  const [drawerAction, setdrawerAction] = useState<string | null>(null);

  const handleSearch = (value: string, searchBy: string) => {
    let cityName, cityDescription;

    if (searchBy === "name") {
      cityName = value;
      cityDescription = "";
    } else {
      cityName = "";
      cityDescription = value;
    }

    setCitiesQuery({ ...citiesQuery, cityName, cityDescription });
  };

  const handleChangePage = (pageNumber: number, pageSize: number) => {
    setCitiesQuery({ ...citiesQuery, pageNumber, pageSize });
  };

  const handleDelete = async (cityId: number | null) => {
    deleteCity(cityId);
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

  const handleActionDrawerSubmit = (values: CitySubmitProps) => {
    drawerAction === "update"
      ? handleConfirmUpdate(values)
      : handleConfirmCreate(values);
  };

  const handleConfirmUpdate = async (values: CitySubmitProps) => {
    updateCity(values.id, values);
  };

  const handleConfirmCreate = async (values: CitySubmitProps) => {
    createCity(values);
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
