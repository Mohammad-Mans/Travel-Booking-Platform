import { useState, useEffect } from "react";
import { axiosInstanceWithInterceptors } from "../../../services/axiosInstance";

interface RecentlyVisitedHotels {
  hotelId: number;
  hotelName: string;
  starRating: number;
  visitDate: string;
  cityName: string;
  thumbnailUrl: string;
  priceLowerBound: number;
  priceUpperBound: number;
}

const useRecentlyVisitedHotels = (userId: number) => {
  const [recentlyVisitedHotels, setRecentlyVisitedHotels] = useState<
    RecentlyVisitedHotels[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axiosInstanceWithInterceptors.get(
          `/api/home/users/${userId}/recent-hotels`
        );
        setRecentlyVisitedHotels(response.data);
        setError("");
      } catch (error) {
        setError("Failed to fetch the Recently Visited Hotels.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchHotels();
  }, [userId]);

  return { recentlyVisitedHotels, loading, error };
};

export default useRecentlyVisitedHotels;
