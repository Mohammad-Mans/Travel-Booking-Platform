import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ResultsLayout from "../components/ResultsLayout";
import { Box } from "@mui/material";
import ResultsGrid from "../components/ResultsGrid";
import ActionDrawer from "../components/ActionDrawer";
import { RoomUpdateFormValidation } from "../../../validation";
import { RoomCreationFormValidation } from "../../../validation";
import useRoomActions from "./hooks/useRoomActions";
import useFetchRooms from "./hooks/useFetchRooms";

const InitialRoomsQuery = {
  roomNumber: "",
  roomCost: "",
  pageNumber: 1,
  pageSize: 10,
};

const InitialFormState = {
  hotelId: "",
  id: 0,
  roomNumber: "",
  cost: "",
};

function rooms() {
  const [roomsQuery, setRoomsQuery] = useState<RoomsQuery>(InitialRoomsQuery);

  const { rooms, loadingRooms, fetchRooms } = useFetchRooms(roomsQuery);
  const {
    createRoom,
    updateRoom,
    deleteRoom,
    loading: loadingFormSubmit,
  } = useRoomActions(fetchRooms);

  const [FormState, setFormState] = useState<Room>(InitialFormState);
  const [drawerAction, setdrawerAction] = useState<string | null>(null);

  const handleSearch = (value: string, searchBy: string) => {
    let roomNumber, roomCost;

    if (searchBy === "number") {
      roomNumber = value;
      roomCost = "";
    } else {
      roomNumber = "";
      roomCost = value;
    }

    setRoomsQuery({ ...roomsQuery, roomNumber, roomCost });
  };

  const handleChangePage = (pageNumber: number, pageSize: number) => {
    setRoomsQuery({ ...roomsQuery, pageNumber, pageSize });
  };

  const handleDelete = async (roomId: number | null) => {
    deleteRoom(roomId);
  };

  const handleUpdate = (selectedRow: any) => {
    setdrawerAction("update");
    setFormState(selectedRow);
  };

  const handleCreateRoom = () => {
    setdrawerAction("create");
    setFormState(InitialFormState);
  };

  const handleActionDrawerClose = () => {
    setFormState(InitialFormState);
    setdrawerAction(null);
  };

  const handleActionDrawerSubmit = (values: RoomSubmitProps) => {
    drawerAction === "update"
      ? handleConfirmUpdate(values)
      : handleConfirmCreate(values);
  };

  const handleConfirmUpdate = async (values: RoomSubmitProps) => {
    updateRoom(values.id, values);
  };

  const handleConfirmCreate = async (values: RoomSubmitProps) => {
    createRoom(values);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <SearchBar label="Search for rooms..." onSearch={handleSearch} />

      <ResultsLayout isLoading={loadingRooms} onCreate={handleCreateRoom}>
        {rooms && (
          <ResultsGrid
            dataType="rooms"
            data={rooms}
            columnHeaders={[
              { field: "roomNumber", headerName: "Room Number" },
              { field: "cost", headerName: "Cost" },
            ]}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            totalCount={122}
            onChangePage={handleChangePage}
          />
        )}
      </ResultsLayout>

      <ActionDrawer
        dataType="rooms"
        action={drawerAction}
        fields={[
          { name: "roomNumber", label: "Room Number" },
          { name: "cost", label: "Cost" },
        ]}
        open={drawerAction !== null}
        onClose={handleActionDrawerClose}
        initialFormState={FormState}
        validation={
          drawerAction === "create"
            ? RoomCreationFormValidation
            : RoomUpdateFormValidation
        }
        onSubmit={handleActionDrawerSubmit}
        loading={loadingFormSubmit}
      />
    </Box>
  );
}

export default rooms;
