import { useState, useEffect } from "react";
import { axiosInstanceWithInterceptors } from "../../../../services/axiosInstance";
import { useSnackbarError } from "../../../../context/SnackbarErrorProvider";

const useFetchHotels = (hotelsQuery: HotelsQuery) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const { setErrorMessage } = useSnackbarError();

  const { hotelName, hotelDescription, pageNumber, pageSize } = hotelsQuery;

  const params = {
    name: hotelName,
    searchQuery: hotelDescription,
    pageSize,
    pageNumber,
  };

  const fetchHotels = async () => {
    try {
      setLoadingHotels(true);
      const response = await axiosInstanceWithInterceptors.get("/api/hotels", {
        params,
      });
      setHotels(response.data);
    } catch (error) {
      setErrorMessage("Failed to fetch hotels.");
    } finally {
      setLoadingHotels(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [hotelsQuery]);

  return { hotels, loadingHotels, fetchHotels };
};

export default useFetchHotels;
