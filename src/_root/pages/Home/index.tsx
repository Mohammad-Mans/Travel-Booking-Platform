import { Grid, Typography } from "@mui/material";
import SearchBar from "./components/SearchBar";
import ResponsiveColoredGrid from "./components/ResponsiveColoredGrid";
import FeaturedDealsCard from "./components/FeaturedDealsCard";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { AxiosError } from "axios";
import SnackbarAlert from "../../../Common/SnackbarAlert";

const featuredDealsURL = import.meta.env.VITE_GET_FEATURED_DEALS;

type FeaturedDeals = {
  hotelId: number;
  hotelName: string;
  cityName: string;
  roomPhotoUrl: string;
  originalRoomPrice: number;
  finalPrice: number;
  hotelStarRating: number;
  discount: number;
};

type SnackbarError = {
  state: boolean;
  message: string;
};

const HomePage = () => {
  const [featuredDeals, setFeaturedDeals] = useState<FeaturedDeals[]>();
  const [error, setError] = useState<SnackbarError>({
    state: false,
    message: "",
  });

  const getFeaturedDeals = async () => {
    try {
      const response = await axios.get(featuredDealsURL);
      setFeaturedDeals(response?.data);
    } catch (err) {
      const axiosError = err as AxiosError;

      if (!axiosError?.response) {
        setError({ state: true, message: "No Server Response" });
      } else {
        setError({ state: true, message: "Couldn't fetch featured deals" });
      }
    }
  };

  useEffect(() => {
    getFeaturedDeals();
  }, []);

  return (
    <Grid
      container
      bgcolor="#f9f9f9"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ResponsiveColoredGrid>
        <SearchBar />
        <Typography variant="h3" pt={4}>
          Greetings, Travel Enthusiasts!
        </Typography>
        <Typography variant="h5">
          Start Your Next Adventure with Vista Voyage!
        </Typography>
      </ResponsiveColoredGrid>

      <ResponsiveColoredGrid color="white.main">
        <Typography variant="h4" pb={3}>
          Featured Deals
        </Typography>
        <Grid container spacing={4} flexDirection="row" justifyContent="center">
          {featuredDeals?.map((deal) => {
            return (
              <Grid item key={deal.hotelId}>
                <FeaturedDealsCard {...deal} />
              </Grid>
            );
          })}
        </Grid>
      </ResponsiveColoredGrid>

      <SnackbarAlert
        open={error.state}
        onClose={() => setError({ ...error, state: false })}
      >
        <>{error.message}</>
      </SnackbarAlert>
    </Grid>
  );
};

export default HomePage;
