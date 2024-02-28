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
import { RoomUpdateFormValidation } from "../../../validation";
import { RoomCreationFormValidation } from "../../../validation";

const GET_ROOMS_URL = "/api/rooms";

type Room = {
  id: number;
  roomNumber: string;
  cost: string;
};

type RoomsParams = {
  roomNumber: string;
  roomCost: string;
  pageNumber: number;
  pageSize: number;
};

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

type SubmitProps = {
  hotelId?: string;
  id: number;
  roomNumber: string;
  cost: string;
};

function rooms() {
  const userData = JSON.parse(localStorage.getItem("user_data")!);
  const accessToken = userData.accessToken;
  const { setErrorMessage } = useSnackbarError();
  const { setSuccessMessage } = useSnackbarSuccess();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState<boolean>(true);
  const [roomsParams, setRoomsParams] =
    useState<RoomsParams>(InitialRoomsQuery);
  const [FormState, setFormState] = useState<Room>(InitialFormState);
  const [drawerAction, setdrawerAction] = useState<string | null>(null);
  const [loadingFormSubmit, setLoadingFormSubmit] = useState<boolean>(false);

  const getRooms = async () => {
    const { roomNumber, roomCost, pageNumber, pageSize } = roomsParams;

    const params = {
      number: roomNumber,
      cost: roomCost,
      pageSize,
      pageNumber,
    };

    try {
      const response = await axios.get(GET_ROOMS_URL, { params });

      setRooms(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't fetch rooms");
      }
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    getRooms();
  }, [roomsParams]);

  const handleSearch = (value: string, searchBy: string) => {
    let roomNumber, roomCost;

    if (searchBy === "number") {
      roomNumber = value;
      roomCost = "";
    } else {
      roomNumber = "";
      roomCost = value;
    }

    setRoomsParams({ ...roomsParams, roomNumber, roomCost });
  };

  const handleChangePage = (pageNumber: number, pageSize: number) => {
    setRoomsParams({ ...roomsParams, pageNumber, pageSize });
  };

  const handleDelete = async (roomId: number | null) => {
    const DELETE_ROOM_URL = `/api/hotels/1/rooms/${roomId}`;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      await axios.delete(DELETE_ROOM_URL, { headers });
      setSuccessMessage("The room was deleted successfully");
      getRooms();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else if (axiosError.response?.status === 404) {
        setErrorMessage("Specified room was not found");
      } else {
        setErrorMessage("Couldn't delete room");
      }
    }
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

  const handleActionDrawerSubmit = (values: SubmitProps) => {
    drawerAction === "update"
      ? handleConfirmUpdate(values)
      : handleConfirmCreate(values);
  };

  const handleConfirmUpdate = async (values: SubmitProps) => {
    const UPDATE_ROOM_URL = `/api/rooms/${values.id}`;

    const updatedRoom = {
      roomNumber: values.roomNumber,
      cost: Number(values.cost),
    };
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      setLoadingFormSubmit(true);
      await axios.put(UPDATE_ROOM_URL, updatedRoom, { headers });
      setSuccessMessage("The room was updated successfully");
      getRooms();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else if (axiosError.response?.status === 404) {
        setErrorMessage("Specified room was not found");
      } else {
        setErrorMessage("Couldn't update room");
      }
    } finally {
      setLoadingFormSubmit(false);
      handleActionDrawerClose();
    }
  };

  const handleConfirmCreate = async (values: SubmitProps) => {
    const CREATE_ROOM_URL = `/api/hotels/${values.hotelId}/rooms`;

    const newRoom = {
      roomNumber: values.roomNumber,
      cost: Number(values.cost),
    };

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      setLoadingFormSubmit(true);
      const response = await axios.post(CREATE_ROOM_URL, newRoom, {
        headers,
      });

      setSuccessMessage(`Room ${response.data.id} was created successfully`);
      getRooms();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't create room");
      }
    } finally {
      setLoadingFormSubmit(false);
      handleActionDrawerClose();
    }
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
