import { useState } from "react";
import { axiosInstanceWithInterceptors } from "../../../../services/axiosInstance";
import { useSnackbarError } from "../../../../context/SnackbarErrorProvider";
import { useSnackbarSuccess } from "../../../../context/SnackbarSuccessProvider";

const useHotelActions = (fetchHotelsCallback: () => void) => {
  const { setErrorMessage } = useSnackbarError();
  const { setSuccessMessage } = useSnackbarSuccess();
  const [loading, setLoading] = useState(false);

  const createHotel = async (hotelData: HotelSubmitProps) => {
    setLoading(true);
    try {
      const response = await axiosInstanceWithInterceptors.post(
        `/api/cities/${hotelData.cityId}/hotels`,
        hotelData
      );
      setSuccessMessage(
        `Hotel ${response.data.name} was created successfully.`
      );
      fetchHotelsCallback();
    } catch (error) {
      setErrorMessage("Failed to create the hotel.");
    } finally {
      setLoading(false);
    }
  };

  const updateHotel = async (hotelId: number, hotelData: HotelSubmitProps) => {
    setLoading(true);
    try {
      await axiosInstanceWithInterceptors.put(
        `/api/hotels/${hotelId}`,
        hotelData
      );
      setSuccessMessage("Hotel updated successfully.");
      fetchHotelsCallback();
    } catch (error) {
      setErrorMessage("Failed to update the hotel.");
    } finally {
      setLoading(false);
    }
  };

  const deleteHotel = async (hotelId: number | null) => {
    setLoading(true);
    const cityId = await getCityId(hotelId);

    try {
      await axiosInstanceWithInterceptors.delete(
        `/api/cities/${cityId}/hotels/${hotelId}`
      );
      setSuccessMessage("Hotel deleted successfully.");
      fetchHotelsCallback();
    } catch (error) {
      setErrorMessage("Failed to delete the hotel.");
    } finally {
      setLoading(false);
    }
  };

  const getCityId = async (hotelId: number | null) => {
    const GET_HOTEL_INFO = `/api/hotels/${hotelId}`;
    try {
      const response = await axiosInstanceWithInterceptors.get(GET_HOTEL_INFO);

      return response.data.cityId;
    } catch (error) {
      setErrorMessage("Couldn't get the City of the hotel");
    }
  };

  return {
    createHotel,
    updateHotel,
    deleteHotel,
    loading,
  };
};

export default useHotelActions;
