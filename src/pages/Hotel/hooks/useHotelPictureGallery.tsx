import { useState, useEffect } from "react";
import { axiosInstanceWithInterceptors } from "../../../services/axiosInstance";

interface PictureGallery {
  id: number;
  url: string;
}

const usePictureGallery = (hotelId: string) => {
  const [pictureGallery, setPictureGallery] = useState<PictureGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPictureGallery = async () => {
      try {
        const response = await axiosInstanceWithInterceptors.get(
          `/api/hotels/${hotelId}/gallery`
        );
        setPictureGallery(response.data);
      } catch (error) {
        setError("Failed to fetch picture gallery.");
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchPictureGallery();
    }
  }, [hotelId]);

  return { pictureGallery, loading, error };
};

export default usePictureGallery;
