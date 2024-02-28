import { useState, useEffect } from "react";
import { axiosInstanceWithInterceptors } from "../../services/axiosInstance";

interface FeaturedDeals {
  hotelId: number;
  hotelName: string;
  cityName: string;
  roomPhotoUrl: string;
  originalRoomPrice: number;
  finalPrice: number;
  hotelStarRating: number;
  discount: number;
}

const useFeaturedDeals = () => {
  const [featuredDeals, setFeaturedDeals] = useState<FeaturedDeals[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getFeaturedDeals = async () => {
      try {
        const response = await axiosInstanceWithInterceptors.get(
          "/api/home/featured-deals"
        );
        setFeaturedDeals(response.data);
        setError("");
      } catch (error) {
        setError(
          " We're sorry, we couldn't fetch the featured deals. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    getFeaturedDeals();
  }, []);

  return { featuredDeals, loading, error };
};

export default useFeaturedDeals;
