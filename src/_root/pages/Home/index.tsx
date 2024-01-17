import { Grid, Typography } from "@mui/material";
import SearchBar from "./components/SearchBar";
import ResponsiveColoredGrid from "./components/ResponsiveColoredGrid";
import FeaturedDealsCard from "./components/FeaturedDealsCard";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { AxiosError } from "axios";
import SnackbarAlert from "../../../Common/SnackbarAlert";
import VisitedHotelCard from "./components/VisitedHotelCard";
import DestinationCard from "./components/TrendingDestinationCard";

const featuredDealsURL = import.meta.env.VITE_GET_FEATURED_DEALS;
const recentlyVisitedHotelsURL = import.meta.env
  .VITE_GET_RECENTLY_VISITED_HOTELS;
const trendingDestinationURL = import.meta.env.VITE_GET_TRENDING_DESTINATION;

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

type recentlyVisitedHotels = {
  hotelId: number;
  hotelName: string;
  starRating: number;
  visitDate: string;
  cityName: string;
  thumbnailUrl: string;
  priceLowerBound: number;
  priceUpperBound: number;
};

type TrendingDestination = {
  cityId: number;
  cityName: string;
  countryName: string;
  description: string;
  thumbnailUrl: string;
};

type SnackbarError = {
  state: boolean;
  message: string;
};

const HomePage = () => {
  const [featuredDeals, setFeaturedDeals] = useState<FeaturedDeals[]>();
  const [recentlyVisitedHotels, setRecentlyVisitedHotels] =
    useState<recentlyVisitedHotels[]>();
  const [trendingDestination, setTrendingDestination] =
    useState<TrendingDestination[]>();
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

  const getRecentlyVisitedHotels = async () => {
    const userData = JSON.parse(localStorage.getItem("user_data")!);
    const accessToken = userData.accessToken;
    const userId = userData.userId;

    try {
      const response = await axios.get(
        recentlyVisitedHotelsURL + userId + "/recent-hotels",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setRecentlyVisitedHotels(response?.data);
    } catch (err) {
      const axiosError = err as AxiosError;

      if (!axiosError?.response) {
        setError({ state: true, message: "No Server Response" });
      } else {
        setError({
          state: true,
          message: "Couldn't fetch recently visited hotels",
        });
      }
    }
  };

  const getTrendingDestination = async () => {
    try {
      const response = await axios.get(trendingDestinationURL);
      setTrendingDestination(response?.data);
    } catch (err) {
      const axiosError = err as AxiosError;

      if (!axiosError?.response) {
        setError({ state: true, message: "No Server Response" });
      } else {
        setError({ state: true, message: "Couldn't fetch trending destinations" });
      }
    }
  };

  useEffect(() => {
    getRecentlyVisitedHotels();
    getFeaturedDeals();
    getTrendingDestination();
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

      <ResponsiveColoredGrid color="white.main">
        <Typography variant="h4" pb={3}>
          Recently viewed
        </Typography>

        <Grid container spacing={4} flexDirection="row" justifyContent="center">
          {recentlyVisitedHotels?.slice(0, 3).map((hotel) => {
            return (
              <Grid item key={hotel.hotelId}>
                <VisitedHotelCard {...hotel} />
              </Grid>
            );
          })}
        </Grid>
      </ResponsiveColoredGrid>

      <ResponsiveColoredGrid color="white.main">
        <Typography variant="h4" pb={3}>
          Trending Destinations
        </Typography>

        <Grid container spacing={4} flexDirection="row" justifyContent="center">
          {trendingDestination?.map((destination) => {
            return (
              <Grid item key={destination.cityId}>
                <DestinationCard {...destination} />
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
