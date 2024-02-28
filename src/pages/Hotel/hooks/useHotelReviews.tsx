import { useState, useEffect } from "react";
import { axiosInstanceWithInterceptors } from "../../../services/axiosInstance";

interface Review {
  reviewId: number;
  customerName: string;
  rating: number;
  description: string;
}

const useHotelReviews = (hotelId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstanceWithInterceptors.get(
          `/api/hotels/${hotelId}/reviews`
        );
        setReviews(response.data);
      } catch (error) {
        setError("Failed to fetch hotel reviews.");
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchReviews();
    }
  }, [hotelId]);

  return { reviews, loading, error };
};

export default useHotelReviews;
