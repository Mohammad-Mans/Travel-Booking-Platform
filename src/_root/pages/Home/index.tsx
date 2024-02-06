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
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const GET_FEATURED_DEALS_URL = "/api/home/featured-deals";
const GET_TRENDING_DESTINATION_URL = "/api/home/destinations/trending";

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
  const navigate = useNavigate();
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
      const response = await axios.get(GET_FEATURED_DEALS_URL);
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
    const GET_RECENTLY_VISITED_HOTELS_URL = `/api/home/users/${userId}/recent-hotels`;

    try {
      const response = await axios.get(GET_RECENTLY_VISITED_HOTELS_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

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
      const response = await axios.get(GET_TRENDING_DESTINATION_URL);
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

  const viewHotel = (hotleID: number) => {
    navigate(`/hotel/${hotleID}`);
  };

  const viewCity = (cityName: string) => {
    const today = dayjs(new Date());
    const tomorrow = today.add(1, "day");
    const checkInDate = today.format("YYYY-MM-DD");
    const checkOutDate = tomorrow.format("YYYY-MM-DD");

    const searchQuery = `city=${cityName}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${2}&children=${0}&numberOfRooms=${1}`;

    navigate(`/search?${searchQuery}`);
  };

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
                  <Grid
                    item
                    key={deal.hotelId}
                    onClick={() => {
                      viewHotel(deal.hotelId);
                    }}
                  >
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
                  <Grid
                    item
                    key={hotel.hotelId}
                    onClick={() => {
                      viewHotel(hotel.hotelId);
                    }}
                  >
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
                  <Grid
                    item
                    key={destination.cityId}
                    onClick={() => {
                      viewCity(destination.cityName);
                    }}
                  >
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
