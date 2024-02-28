import { useState } from "react";
import {axiosInstanceWithInterceptors} from "../../../../services/axiosInstance";
import { useSnackbarError } from "../../../../context/SnackbarErrorProvider";
import { useSnackbarSuccess } from "../../../../context/SnackbarSuccessProvider";

const useRoomActions = (fetchRoomsCallback: () => void) => {
  const { setErrorMessage } = useSnackbarError();
  const { setSuccessMessage } = useSnackbarSuccess();
  const [loading, setLoading] = useState(false);

  const createRoom = async (roomData: RoomSubmitProps) => {
    setLoading(true);
    try {
      const response = await axiosInstanceWithInterceptors.post(
        `/api/hotels/${roomData.hotelId}/rooms`,
        {
          roomNumber: roomData.roomNumber,
          cost: roomData.cost,
        }
      );
      setSuccessMessage(`Room ${response.data.id} was created successfully.`);
      fetchRoomsCallback();
    } catch (error) {
      setErrorMessage("Failed to create the room.");
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async (roomId: number, roomData: RoomSubmitProps) => {
    setLoading(true);
    try {
      await axiosInstanceWithInterceptors.put(`/api/rooms/${roomId}`, {
        roomNumber: roomData.roomNumber,
        cost: roomData.cost,
      });
      setSuccessMessage("Room updated successfully.");
      fetchRoomsCallback();
    } catch (error) {
      setErrorMessage("Failed to update the room.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (roomId: number | null) => {
    setLoading(true);
    try {
      await axiosInstanceWithInterceptors.delete(`/api/hotels/1/rooms/${roomId}`);
      setSuccessMessage("Room deleted successfully.");
      fetchRoomsCallback();
    } catch (error) {
      setErrorMessage("Failed to delete the room.");
    } finally {
      setLoading(false);
    }
  };

  return {
    createRoom,
    updateRoom,
    deleteRoom,
    loading,
  };
};

export default useRoomActions;
