import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import SearchBar from "./components/SearchBar";
import ResponsiveColoredGrid from "../../../Common/ResponsiveColoredGrid";
import FeaturedDealsCard from "./components/FeaturedDealsCard";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { AxiosError } from "axios";
import { useSnackbarError } from "../../../context/SnackbarErrorProvider";
import VisitedHotelCard from "./components/VisitedHotelCard";
import DestinationCard from "./components/TrendingDestinationCard";
import SectionHeader from "../../../Common/SectionHeader";

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

const HomePage = () => {
  const { setErrorMessage } = useSnackbarError();
  const [featuredDeals, setFeaturedDeals] = useState<FeaturedDeals[]>();
  const [recentlyVisitedHotels, setRecentlyVisitedHotels] =
    useState<recentlyVisitedHotels[]>();
  const [trendingDestination, setTrendingDestination] =
    useState<TrendingDestination[]>();

  const [loadingFeaturedDeals, setLoadingFeaturedDeals] = useState(true);
  const [loadingRecentlyVisitedHotels, setLoadingRecentlyVisitedHotels] =
    useState(true);
  const [loadingTrendingDestination, setLoadingTrendingDestination] =
    useState(true);

  const getFeaturedDeals = async () => {
    try {
      const response = await axios.get(featuredDealsURL);
      setFeaturedDeals(response?.data);
    } catch (err) {
      const axiosError = err as AxiosError;

      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't fetch featured deals");
      }
    } finally {
      setLoadingFeaturedDeals(false);
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
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't fetch recently visited hotels");
      }
    } finally {
      setLoadingRecentlyVisitedHotels(false);
    }
  };

  const getTrendingDestination = async () => {
    try {
      const response = await axios.get(trendingDestinationURL);
      setTrendingDestination(response?.data);
    } catch (err) {
      const axiosError = err as AxiosError;

      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't fetch trending destinations");
      }
    } finally {
      setLoadingTrendingDestination(false);
    }
  };

  useEffect(() => {
    getRecentlyVisitedHotels();
    getFeaturedDeals();
    getTrendingDestination();
  }, []);

  return (
    <>
      <ResponsiveColoredGrid color="darkBackground.main">
        <Box
          component="header"
          display="flex"
          flexDirection="column"
          alignItems="center"
          pb={4}
        >
          <Typography variant="h3">Greetings, Travel Enthusiasts!</Typography>
          <Typography variant="h5">
            Start Your Next Adventure with Vista Voyage!
          </Typography>
        </Box>
        <SearchBar />
      </ResponsiveColoredGrid>

      {loadingFeaturedDeals ||
      loadingRecentlyVisitedHotels ||
      loadingTrendingDestination ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="400px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <ResponsiveColoredGrid color="lightBackground.main">
            <SectionHeader title="Featured Deals" />

            <Grid
              container
              spacing={4}
              flexDirection="row"
              justifyContent="center"
            >
              {featuredDeals?.map((deal) => {
                return (
                  <Grid item key={deal.hotelId}>
                    <FeaturedDealsCard {...deal} />
                  </Grid>
                );
              })}
            </Grid>
          </ResponsiveColoredGrid>

          <ResponsiveColoredGrid color="lightBackground.main">
            <SectionHeader title="Recently viewed" />

            <Grid
              container
              spacing={4}
              flexDirection="row"
              justifyContent="center"
            >
              {recentlyVisitedHotels?.slice(0, 3).map((hotel) => {
                return (
                  <Grid item key={hotel.hotelId}>
                    <VisitedHotelCard {...hotel} />
                  </Grid>
                );
              })}
            </Grid>
          </ResponsiveColoredGrid>

          <ResponsiveColoredGrid color="lightBackground.main">
            <SectionHeader title="Trending Destinations" />

            <Grid
              container
              spacing={4}
              flexDirection="row"
              justifyContent="center"
            >
              {trendingDestination?.map((destination) => {
                return (
                  <Grid item key={destination.cityId}>
                    <DestinationCard {...destination} />
                  </Grid>
                );
              })}
            </Grid>
          </ResponsiveColoredGrid>

          <ResponsiveColoredGrid
            component="footer"
            color="secondary.light"
            py={2}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              align="right"
              width="100%"
            >
              {`Copyright © Vista Voyage ${new Date().getFullYear()}.`}
            </Typography>
          </ResponsiveColoredGrid>
        </>
      )}
    </>
  );
};

export default HomePage;
