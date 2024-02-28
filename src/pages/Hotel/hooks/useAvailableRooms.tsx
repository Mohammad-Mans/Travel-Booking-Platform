import { useState, useEffect } from "react";
import { axiosInstanceWithInterceptors } from "../../../services/axiosInstance";
import { Room } from "../../../Types";

const useAvailableRooms = (hotelId: string) => {
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await axiosInstanceWithInterceptors.get(
          `/api/hotels/${hotelId}/available-rooms?checkInDate=2%2F2%2F2020&CheckOutDate=1%2F1%2F2030`
        );
        setAvailableRooms(response.data);
      } catch (error) {
        setError("Failed to fetch available rooms.");
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchAvailableRooms();
    }
  }, [hotelId]);

  return { availableRooms, loading, error };
};

export default useAvailableRooms;
