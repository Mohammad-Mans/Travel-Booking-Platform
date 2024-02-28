import { useState, useEffect } from "react";
import { axiosInstanceWithInterceptors } from "../../../../services/axiosInstance";
import { useSnackbarError } from "../../../../context/SnackbarErrorProvider";

const useFetchRooms = (roomsQuery: RoomsQuery) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const { setErrorMessage } = useSnackbarError();

  const { roomNumber, roomCost, pageNumber, pageSize } = roomsQuery;

  const params = {
    number: roomNumber,
    cost: roomCost,
    pageSize,
    pageNumber,
  };

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const response = await axiosInstanceWithInterceptors.get("/api/rooms", {
        params,
      });
      setRooms(response.data);
    } catch (error) {
      setErrorMessage("Failed to fetch rooms.");
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [roomsQuery]);

  return { rooms, loadingRooms, fetchRooms };
};

export default useFetchRooms;
