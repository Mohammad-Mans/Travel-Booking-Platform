import { useState } from "react";
import { axiosInstanceWithInterceptors } from "../../../../services/axiosInstance";
import { useSnackbarError } from "../../../../context/SnackbarErrorProvider";
import { useSnackbarSuccess } from "../../../../context/SnackbarSuccessProvider";

const useCityActions = (fetchCitiesCallback: () => void) => {
  const { setErrorMessage } = useSnackbarError();
  const { setSuccessMessage } = useSnackbarSuccess();
  const [loading, setLoading] = useState(false);

  const createCity = async (cityData: CitySubmitProps) => {
    setLoading(true);
    try {
      const response = await axiosInstanceWithInterceptors.post(
        "/api/cities",
        cityData
      );
      setSuccessMessage(`City ${response.data.name} was created successfully.`);
      fetchCitiesCallback();
    } catch (error) {
      setErrorMessage("Failed to create the city.");
    } finally {
      setLoading(false);
    }
  };

  const updateCity = async (cityId: number | null, cityData: CitySubmitProps) => {
    setLoading(true);
    try {
      await axiosInstanceWithInterceptors.put(
        `/api/cities/${cityId}`,
        cityData
      );
      setSuccessMessage("City updated successfully.");
      fetchCitiesCallback();
    } catch (error) {
      setErrorMessage("Failed to update the city.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCity = async (cityId: number | null) => {
    setLoading(true);
    try {
      await axiosInstanceWithInterceptors.delete(`/api/cities/${cityId}`);
      setSuccessMessage("City deleted successfully.");
      fetchCitiesCallback();
    } catch (error) {
      setErrorMessage("Failed to delete the city.");
    } finally {
      setLoading(false);
    }
  };

  return {
    createCity,
    updateCity,
    deleteCity,
    loading,
  };
};

export default useCityActions;
