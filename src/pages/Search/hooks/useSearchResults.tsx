import { useState, useEffect } from "react";
import { axiosInstanceWithInterceptors } from "../../../services/axiosInstance";
import { useSearchParams } from "react-router-dom";

interface SearchResult {
  hotelId: number;
  hotelName: string;
  starRating: number;
  latitude: number;
  longitude: number;
  roomPrice: number;
  roomType: string;
  cityName: string;
  roomPhotoUrl: string;
  discount: number;
  amenities: [
    {
      id: number;
      name: string;
      description: string;
    }
  ];
}

const useSearchResults = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loadingResults, setLoadingResults] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axiosInstanceWithInterceptors.get(
          "/api/home/search",
          {
            params: Object.fromEntries([...searchParams]),
          }
        );
        setSearchResults(response.data);
      } catch (err) {
        setError("Failed to fetch search results.");
      } finally {
        setLoadingResults(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  return { searchResults, loadingResults, error };
};

export default useSearchResults;
