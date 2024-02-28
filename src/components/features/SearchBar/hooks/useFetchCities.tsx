import { useState, useEffect } from "react";
import { axiosInstanceWithInterceptors } from "../../../../services/axiosInstance";
import { useSnackbarError } from "../../../../context/SnackbarErrorProvider";

const useFetchCities = (open: boolean) => {
  const { setErrorMessage } = useSnackbarError();
  const [options, setOptions] = useState<readonly string[]>([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) return;

    const fetchCities = async () => {
      try {
        const response = await axiosInstanceWithInterceptors.get("/api/cities");
        const cities = response.data.map((city: { name: string }) => city.name);

        if (active) {
          setOptions(cities);
        }
      } catch (err) {
        setErrorMessage("Couldn't fetch cities");
      }
    };

    fetchCities();

    return () => {
      active = false;
    };
  }, [open]);

  return { loading, options };
};

export default useFetchCities;
