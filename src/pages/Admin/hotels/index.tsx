import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ResultsLayout from "../components/ResultsLayout";
import { Box } from "@mui/material";
import ResultsGrid from "../components/ResultsGrid";
import ActionDrawer from "../components/ActionDrawer";
import { HotelUpdateFormValidation } from "../../../validation";
import { HotelCreationFormValidation } from "../../../validation";
import useHotelActions from "./hooks/useHotelActions";
import useFetchHotels from "./hooks/useFetchHotels";

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

function hotels() {
  const [hotelsQuery, setHotelsQuery] =
    useState<HotelsQuery>(InitialHotelsQuery);
  const { hotels, loadingHotels, fetchHotels } = useFetchHotels(hotelsQuery);
  const {
    createHotel,
    updateHotel,
    deleteHotel,
    loading: loadingFormSubmit,
  } = useHotelActions(fetchHotels);

  const [FormState, setFormState] = useState<Hotel>(InitialFormState);
  const [drawerAction, setdrawerAction] = useState<string | null>(null);

  const handleSearch = (value: string, searchBy: string) => {
    let hotelName, hotelDescription;

    if (searchBy === "name") {
      hotelName = value;
      hotelDescription = "";
    } else {
      hotelName = "";
      hotelDescription = value;
    }

    setHotelsQuery({ ...hotelsQuery, hotelName, hotelDescription });
  };

  const handleChangePage = (pageNumber: number, pageSize: number) => {
    setHotelsQuery({ ...hotelsQuery, pageNumber, pageSize });
  };

  const handleDelete = async (hotelId: number | null) => {
    deleteHotel(hotelId);
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

  const handleActionDrawerSubmit = (values: HotelSubmitProps) => {
    drawerAction === "update"
      ? handleConfirmUpdate(values)
      : handleConfirmCreate(values);
  };

  const handleConfirmUpdate = async (values: HotelSubmitProps) => {
    updateHotel(values.id, values);
  };

  const handleConfirmCreate = async (values: HotelSubmitProps) => {
    createHotel(values);
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
