import { useState, useEffect } from "react";
import { axiosInstanceWithInterceptors } from "../../../../services/axiosInstance";
import { useSnackbarError } from "../../../../context/SnackbarErrorProvider";

const useFetchCities = (citiesQuery: CitiesQuery) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const { setErrorMessage } = useSnackbarError();

  const { cityName, cityDescription, pageNumber, pageSize } = citiesQuery;
  const params = {
    name: cityName,
    searchQuery: cityDescription,
    pageSize,
    pageNumber,
  };

  const fetchCities = async () => {
    try {
      setLoadingCities(true);
      const response = await axiosInstanceWithInterceptors.get("/api/cities", {
        params,
      });
      setCities(response.data);
    } catch (error) {
      setErrorMessage("Failed to fetch cities");
    } finally {
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [citiesQuery]);

  return { cities, loadingCities, fetchCities };
};

export default useFetchCities;
