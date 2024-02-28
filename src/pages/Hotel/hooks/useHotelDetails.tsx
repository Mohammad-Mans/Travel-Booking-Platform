import { useState, useEffect } from "react";
import { axiosInstanceWithInterceptors } from "../../../services/axiosInstance";
import { Hotel } from "../../../Types";

const hotelInitialValues = {
  hotelName: "",
  location: "",
  description: "",
  latitude: 0,
  longitude: 0,
  amenities: [],
  starRating: 0,
  availableRooms: 0,
  imageUrl: "",
  cityId: 0,
};

const useHotelDetails = (hotelId: string) => {
  const [hotelDetails, setHotelDetails] = useState<Hotel>(hotelInitialValues);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await axiosInstanceWithInterceptors.get(
          `/api/hotels/${hotelId}?includeRooms=true`
        );
        setHotelDetails(response.data);
      } catch (err) {
        setError("Failed to fetch hotel details");
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchHotelDetails();
    }
  }, [hotelId]);

  return { hotelDetails, loading, error };
};

export default useHotelDetails;
