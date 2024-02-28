import { useState } from "react";
import { axiosInstanceWithInterceptors } from "../../../services/axiosInstance";
import { useSnackbarError } from "../../../context/SnackbarErrorProvider";

const useSubmitBooking = () => {
  const [loading, setLoading] = useState(false);
  const { setErrorMessage } = useSnackbarError();

  const submitBooking = async (
    bookingData: BookingData,
    onSuccess: (confirmationNumber: string) => void
  ) => {
    setLoading(true);
    try {
      const response = await axiosInstanceWithInterceptors.post(
        "/api/bookings",
        bookingData
      );

      if (
        response.status === 201 &&
        response.data.bookingStatus === "Confirmed"
      ) {
        onSuccess(response.data.confirmationNumber);
      } else {
        setErrorMessage("Booking declined. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, submitBooking };
};

export default useSubmitBooking;
