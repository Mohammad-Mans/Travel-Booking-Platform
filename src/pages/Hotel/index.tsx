import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
  Rating,
  Typography,
} from "@mui/material";
import ResponsiveColoredGrid from "../../components/common/ResponsiveColoredGrid";
import PlaceIcon from "@mui/icons-material/Place";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import { useSnackbarError } from "../../context/SnackbarErrorProvider";
import { AxiosError } from "axios";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import CustomerReview from "./components/CustomerReview";
import { useBookings } from "../../context/BookingsProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// To prevent Google Maps from loading Roboto font
const head = document.head;
const insertBefore = head.insertBefore;
head.insertBefore = <T extends Node>(
  newElement: T,
  referenceElement: Node
): T => {
  if (
    newElement instanceof Element &&
    newElement?.hasAttribute("href") &&
    newElement?.getAttribute("href")?.includes("fonts.googleapis")
  ) {
    return newElement;
  }

  insertBefore.call(head, newElement, referenceElement);
  return newElement;
};

type Hotel = {
  hotelName: string;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  amenities: Amenity[];
  starRating: number;
  availableRooms: number;
  imageUrl: string;
  cityId: number;
};

const hotelInitialValues = {
  hotelName: "",
  location: "",
  description: "",
  latitude: 0,
  longitude: 0,
  amenities: [],
  starRating: 0,
  availableRooms: 0,
  imageUrl: "",
  cityId: 0,
};

type Review = {
  reviewId: number;
  customerName: string;
  rating: number;
  description: string;
};

type PictureGallery = {
  id: number;
  url: string;
};

type Room = {
  roomId: number;
  roomNumber: number;
  roomPhotoUrl: string;
  roomType: string;
  capacityOfAdults: number;
  capacityOfChildren: number;
  roomAmenities: Amenity[];
  price: number;
  availability: boolean;
};

const initialRoomData = {
  roomId: 0,
  roomNumber: 0,
  roomPhotoUrl: "",
  roomType: "",
  capacityOfAdults: 0,
  capacityOfChildren: 0,
  roomAmenities: [],
  price: 0,
  availability: false,
};

type Amenity = {
  name: string;
  description: string;
};

const HotelPage = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
  });

  const { hotelId } = useParams();
  const { setErrorMessage } = useSnackbarError();
  const [loadingHotelData, setLoadingHotelData] = useState<boolean>(true);

  const [hotelDetails, setHotelDetails] = useState<Hotel>(hotelInitialValues);
  const [pictureGallery, setPictureGallery] = useState<PictureGallery[]>();
  const [availableRooms, setAvailableRooms] = useState<Room[]>();
  const [reviews, setReviews] = useState<Review[]>();
  const [openReviewsModal, setOpenReviewsModal] = useState(false);

  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(null);

  const handleOpenImage = (imageURL: string) => {
    setSelectedImage(imageURL);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
    setOpenImageModal(false);
  };

  const GET_HOTEL_DETAILS_URL = `/api/hotels/${hotelId}?includeRooms=true`;
  const GET_PICTURE_GALLERY_URL = `/api/hotels/${hotelId}/gallery`;
  const GET_AVAILABLE_ROOMS_URL = `/api/hotels/${hotelId}/available-rooms?checkInDate=2%2F2%2F2020&CheckOutDate=1%2F1%2F2030`;
  const GET_REVIEWS_URL = `/api/hotels/${hotelId}/reviews`;

  const getHotelData = async () => {
    try {
      const [
        hotelDetailsResponse,
        pictureGalleryResponse,
        availableRoomsResponse,
        reviewsResponse,
      ] = await Promise.all([
        axios.get(GET_HOTEL_DETAILS_URL),
        axios.get(GET_PICTURE_GALLERY_URL),
        axios.get(GET_AVAILABLE_ROOMS_URL),
        axios.get(GET_REVIEWS_URL),
      ]);

      setHotelDetails(hotelDetailsResponse.data);
      setPictureGallery(pictureGalleryResponse.data);
      setAvailableRooms(availableRoomsResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't fetch hotel's data");
      }
    } finally {
      setLoadingHotelData(false);
    }
  };

  useEffect(() => {
    getHotelData();

    const today = dayjs(new Date());
    const tomorrow = today.add(1, "day");

    setCheckIn(today);
    setCheckOut(tomorrow);
  }, []);

  const { addBooking } = useBookings();
  const navigate = useNavigate();

  const [selectedRoom, setSelectedRoom] = useState<Room>(initialRoomData);

  const handleBooking = () => {
    addBooking({
      hotelName: hotelDetails.hotelName,
      roomNumber: selectedRoom.roomNumber,
      roomType: selectedRoom.roomType,
      roomPhotoUrl: selectedRoom.roomPhotoUrl,
      checkInDate: checkIn!.format("YYYY-MM-DD"),
      checkOutDate: checkOut!.format("YYYY-MM-DD"),
      adults: selectedRoom.capacityOfAdults,
      children: selectedRoom.capacityOfChildren,
      totalCost: selectedRoom.price,
    });
    navigate("/checkout");
  };

  return (
    <ResponsiveColoredGrid
      color="darkBackground.main"
      minHeight="calc(100vh - 64px)"
    >
      {loadingHotelData ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="400px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid
          container
          rowSpacing={2}
          columnSpacing={{ xs: 0, md: 2 }}
          width="100%"
        >
          <Grid item xs={12} md={3} sx={{ minheight: "500px" }}>
            <Card elevation={3} sx={{ height: "100%", padding: 2 }}>
              <Typography variant="h4" mb={1}>
                {hotelDetails.hotelName}
              </Typography>
              <Rating value={hotelDetails.starRating} readOnly />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  my: 1,
                }}
              >
                <PlaceIcon fontSize="small" />

                <Typography variant="body1" color="text.secondary">
                  {hotelDetails.location}
                </Typography>
              </Box>

              <Divider />

              <Typography my={1} variant="body2">
                {hotelDetails.description}
              </Typography>

              <Divider />

              {reviews &&
                (reviews.length < 3 ? (
                  reviews?.map((review) => {
                    return <CustomerReview key={review.reviewId} {...review} />;
                  })
                ) : (
                  <>
                    {reviews.slice(0, 2).map((review) => {
                      return (
                        <CustomerReview key={review.reviewId} {...review} />
                      );
                    })}
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setOpenReviewsModal(true)}
                    >
                      View all Reviews
                    </Button>
                    <Modal
                      open={openReviewsModal}
                      onClose={() => setOpenReviewsModal(false)}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          maxHeight: 500,
                          width: 400,
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          bgcolor: "lightBackground.main",
                          boxShadow: 24,
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="h5">Hotel Reviews</Typography>

                          <IconButton
                            onClick={() => setOpenReviewsModal(false)}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>

                        <Box sx={{ overflowY: "auto", maxHeight: 400, px: 2 }}>
                          {reviews.map((review) => (
                            <div key={review.reviewId}>
                              <Divider />
                              <CustomerReview {...review} />
                            </div>
                          ))}
                        </Box>
                      </Box>
                    </Modal>
                  </>
                ))}
            </Card>
          </Grid>
          <Grid item xs={12} md={9} sx={{ height: "500px" }}>
            <Card elevation={3}>
              <ImageList
                variant="quilted"
                cols={4}
                gap={8}
                sx={{ height: 484 }}
              >
                {" "}
                {pictureGallery?.map((image, index) => (
                  <ImageListItem
                    key={image.id}
                    onClick={() => handleOpenImage(image.url)}
                    sx={{
                      ":hover": {
                        boxShadow: 5,
                        cursor: "pointer",
                      },
                    }}
                  >
                    <img src={image.url} alt={`Hotel Image ${index + 1}`} />
                  </ImageListItem>
                ))}
              </ImageList>
            </Card>

            <Modal
              open={openImageModal}
              onClose={handleCloseImageModal}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  height: {
                    xs: "auto",
                    md: "100vh",
                  },
                  width: {
                    xs: "100vw",
                    md: "auto",
                  },
                  maxHeight: "100vh",
                  maxWidth: "100vw",
                  boxShadow: 24,
                  outline: "none",
                }}
              >
                {selectedImage && (
                  <img
                    src={selectedImage}
                    style={{
                      objectFit: "contain",
                      verticalAlign: "bottom",
                      width: "100%",
                      height: "100%",
                      maxHeight: "100vh",
                      maxWidth: "100vw",
                    }}
                  />
                )}

                <IconButton
                  sx={{
                    position: "absolute",
                    top: 15,
                    right: 15,
                    bgcolor: "white.main",
                    ":hover": {
                      bgcolor: " rgba(255,255,255,0.8)",
                    },
                  }}
                  onClick={handleCloseImageModal}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={3}>
              {!isLoaded ? (
                <div>Loading maps</div>
              ) : loadError ? (
                <div>Error loading maps</div>
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "270px" }}
                  zoom={12}
                  center={{
                    lat: hotelDetails.latitude,
                    lng: hotelDetails.longitude,
                  }}
                >
                  <MarkerF
                    position={{
                      lat: hotelDetails.latitude,
                      lng: hotelDetails.longitude,
                    }}
                  />
                </GoogleMap>
              )}
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box component="header" mb={3} display="flex" alignItems="center">
              <Box width="6px" height="30px" mr={1} bgcolor="primary.main" />

              <Typography variant="h5"> Currently Availabe Rooms</Typography>
            </Box>
            <ImageList
              gap={12}
              sx={{
                mb: 8,
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(360px, 1fr))!important",
              }}
            >
              <></>
              {availableRooms?.map((room) => (
                <Card key={room.roomId}>
                  <ImageListItem sx={{ height: "100% !important" }}>
                    <ImageListItemBar
                      sx={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)",
                      }}
                      title={"$" + room.price}
                      position="top"
                    />
                    <img src={room.roomPhotoUrl} alt={room.roomType} />
                    <ImageListItemBar
                      title={room.roomType}
                      subtitle={`${room.capacityOfAdults} ${
                        room.capacityOfAdults === 1 ? "adult" : "adults"
                      }, ${room.capacityOfChildren} ${
                        room.capacityOfChildren === 1 ? "child" : "children"
                      }`}
                      actionIcon={
                        <Button
                          variant="contained"
                          color={"secondary"}
                          sx={{ mr: 2 }}
                          onClick={() => {
                            setSelectedRoom(room);
                            setOpenBookingModal(true);
                          }}
                        >
                          Book
                        </Button>
                      }
                    />
                  </ImageListItem>
                </Card>
              ))}
              <Modal
                open={openBookingModal}
                onClose={() => setOpenBookingModal(false)}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    maxHeight: 500,
                    width: 400,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -60%)",
                    p: 2,
                    bgcolor: "lightBackground.main",
                    boxShadow: 24,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h5">
                    Please Select Your Stay Dates
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: "130px",
                      m: 3,
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="Check in"
                        format="DD-MM-YYYY"
                        value={checkIn}
                        minDate={dayjs(new Date())}
                        onChange={(newValue) => {
                          Number(newValue!.format("YYYYMMDD")) >
                          Number(checkOut!.format("YYYYMMDD"))
                            ? setCheckOut(newValue!.add(1, "day"))
                            : null;
                          setCheckIn(newValue);
                        }}
                        showDaysOutsideCurrentMonth
                        sx={{ width: "320px" }}
                      />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="Check out"
                        format="DD-MM-YYYY"
                        value={checkOut}
                        minDate={checkIn}
                        onChange={(newValue) => {
                          setCheckOut(newValue);
                        }}
                        showDaysOutsideCurrentMonth
                        sx={{ width: "320px" }}
                      />
                    </LocalizationProvider>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Button onClick={() => setOpenBookingModal(false)}>
                      cancel
                    </Button>
                    <Button variant="contained" onClick={() => handleBooking()}>
                      Confirm
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </ImageList>
          </Grid>
        </Grid>
      )}
    </ResponsiveColoredGrid>
  );
};

export default HotelPage;
