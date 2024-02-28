import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import SearchBar from "../../components/features/SearchBar/SearchBar";
import ResponsiveColoredGrid from "../../components/common/ResponsiveColoredGrid";
import FeaturedDealsCard from "./components/FeaturedDealsCard";
import VisitedHotelCard from "./components/VisitedHotelCard";
import DestinationCard from "./components/TrendingDestinationCard";
import SectionHeader from "../../components/common/SectionHeader";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Logo from "../../assets/logo/Vista-Voyage-Logo-White.svg";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import useFeaturedDeals from "./hooks/useFeaturedDeals";
import useRecentlyVisitedHotels from "./hooks/useRecentlyVisitedHotels ";
import useTrendingDestinations from "./hooks/useTrendingDestinations ";

const HomePage = () => {
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user_data") ?? "").userId;

  const {
    featuredDeals,
    loading: loadingFeaturedDeals,
    error: featuredDealsError,
  } = useFeaturedDeals();
  const {
    recentlyVisitedHotels,
    loading: loadingRecentlyVisitedHotels,
    error: recentlyVisitedHotelsError,
  } = useRecentlyVisitedHotels(userId);
  const {
    trendingDestinations,
    loading: loadingTrendingDestinations,
    error: trendingDestinationsError,
  } = useTrendingDestinations();

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
          <Typography sx={{ typography: { xs: "h5", sm: "h4", md: "h3" } }}>
            Greetings, Travel Enthusiasts!
          </Typography>
          <Typography sx={{ typography: { xs: "body1", sm: "h6", md: "h5" } }}>
            Start Your Next Adventure with Vista Voyage!
          </Typography>
        </Box>
        <SearchBar />
      </ResponsiveColoredGrid>

      {loadingFeaturedDeals ||
      loadingRecentlyVisitedHotels ||
      loadingTrendingDestinations ? (
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
              {featuredDealsError ? (
                <Typography color="error">{featuredDealsError}</Typography>
              ) : (
                featuredDeals.map((deal) => {
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
                })
              )}
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
              {recentlyVisitedHotelsError ? (
                <Typography color="error">
                  {recentlyVisitedHotelsError}
                </Typography>
              ) : (
                recentlyVisitedHotels.slice(0, 3).map((hotel) => {
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
                })
              )}
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
              {trendingDestinationsError ? (
                <Typography color="error">
                  {trendingDestinationsError}
                </Typography>
              ) : (
                trendingDestinations.map((destination) => {
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
                })
              )}
            </Grid>
          </ResponsiveColoredGrid>

          <ResponsiveColoredGrid
            component="footer"
            color="secondary.main"
            py={2}
          >
            <Box
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={() => navigate("/")}>
                  <img src={Logo} height={45} width={45} alt="Logo" />
                </IconButton>

                <Typography variant="h6" color="secondary.contrastText" ml={1}>
                  Vista Voyage
                </Typography>
              </Box>
              <Box>
                <IconButton
                  aria-label="facebook"
                  href="https://facebook.com"
                  sx={{ color: "secondary.contrastText" }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  aria-label="twitter"
                  href="https://twitter.com"
                  sx={{ color: "secondary.contrastText" }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  aria-label="instagram"
                  href="https://instagram.com"
                  sx={{ color: "secondary.contrastText" }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  aria-label="linkedin"
                  href="https://linkedin.com"
                  sx={{ color: "secondary.contrastText" }}
                >
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ bgcolor: "primary.main" }} />
            <Typography
              variant="body2"
              color="secondary.contrastText"
              textAlign="center"
              mt={1}
            >
              {`Copyright © Vista Voyage ${new Date().getFullYear()} | All rights reserved. Design by `}
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "primary.main" }}
              >
                Mohammad Mansour
              </Typography>
            </Typography>
          </ResponsiveColoredGrid>
        </>
      )}
    </>
  );
};

export default HomePage;
