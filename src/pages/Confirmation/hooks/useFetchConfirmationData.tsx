import { useState, useEffect } from "react";
import {axiosInstanceWithInterceptors} from "../../../services/axiosInstance";

const useFetchConfirmationData = (confirmationNumber: string) => {
  const [loadingConfirmationData, setLoadingConfirmationData] = useState(true);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData>();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConfirmationData = async () => {
      try {
        const response = await axiosInstanceWithInterceptors.get(`/api/bookings/${confirmationNumber?.split("-")[1]}`);
        setConfirmationData(response.data);
        setError("");
      } catch (error) {
        setError("Failed to fetch the confirmation data. Please try again.");
      } finally {
        setLoadingConfirmationData(false);
      }
    };

    if (confirmationNumber) {
      fetchConfirmationData();
    }
  }, [confirmationNumber, error]);

  return { loadingConfirmationData, confirmationData };
};

export default useFetchConfirmationData;
