import { FC } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Rating,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useBookings } from "../../../../context/BookingsProvider";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

type Amenity = {
  id: number;
  name: string;
  description: string;
};

type HotelCardProps = {
  hotelId: number;
  hotelName: string;
  starRating: number;
  roomPrice: number;
  roomType: string;
  cityName: string;
  roomPhotoUrl: string;
  amenities: Amenity[];
};

const HotelCard: FC<HotelCardProps> = ({
  hotelId,
  hotelName,
  starRating,
  roomPrice,
  roomType,
  cityName,
  roomPhotoUrl,
  amenities,
}) => {
  const { addBooking } = useBookings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const viewHotel = (hotleID: number) => {
    navigate(`/hotel/${hotleID}`);
  };

  const handleBooking = () => {
    const checkInDate = searchParams.get("checkInDate");
    const checkOutDate = searchParams.get("checkOutDate");
    const adults = Number(searchParams.get("adults"));
    const children = Number(searchParams.get("children"));

    addBooking({
      hotelName,
      roomNumber: 1,
      roomType,
      roomPhotoUrl,
      checkInDate,
      checkOutDate,
      adults,
      children,
      totalCost: roomPrice,
    });
    navigate("/checkout");
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        boxShadow: 5,
        my: 1,
        "&:hover": {
          boxShadow: 20,
        },
      }}
    >
      <CardMedia
        sx={{
          width: ["150px", "250px"],
          height: "170px",
          marginRight: [0, 2],
        }}
        image={roomPhotoUrl}
        title={hotelName}
      />
      <CardContent
        sx={{
          height: "100%",
          width: "100%",
          p: [1, 2],
          "&:last-child": { pb: [1, 2] },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "space-between",
              height: "130px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography pb={1} sx={{ typography: { xs: "body1", md: "h5" } }}>
                {hotelName}
              </Typography>

              <Rating value={starRating} size="small" readOnly />

              <Typography variant="body2" py={1}>
                {cityName}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              onClick={() => {
                viewHotel(hotelId);
              }}
            >
              View Hotel
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "130px",
              width: ["170px", "200px"],
            }}
          >
            <Box
              p={1}
              mb={1}
              border={1}
              borderRadius={1}
              borderColor="primary.main"
              sx={{ width: "100%", height: "100%" }}
            >
              <Typography variant="body1" color="textSecondary">
                {roomType} - ${roomPrice}
              </Typography>

              {amenities.map((amenity) => (
                <Box
                  key={`${hotelId}-${amenity.name}`}
                  color="primary.main"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <CheckIcon fontSize="small" />
                  <Typography variant="body2">{amenity.name}</Typography>
                </Box>
              ))}
            </Box>

            <Button variant="contained" fullWidth onClick={handleBooking}>
              Book
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
