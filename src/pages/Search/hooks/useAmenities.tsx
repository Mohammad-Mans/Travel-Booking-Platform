import { useState, useEffect } from "react";
import { axiosInstanceWithInterceptors } from "../../../services/axiosInstance";
import { Amenity } from "../../../Types";

const useAmenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loadingAmenities, setLoadingAmenities] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axiosInstanceWithInterceptors.get(
          "/api/search-results/amenities"
        );
        setAmenities(response.data.map((amenity: Amenity) => amenity.name));
      } catch (err) {
        setError("Failed to fetch amenities.");
      } finally {
        setLoadingAmenities(false);
      }
    };

    fetchAmenities();
  }, []);

  return { amenities, loadingAmenities, error };
};

export default useAmenities;
