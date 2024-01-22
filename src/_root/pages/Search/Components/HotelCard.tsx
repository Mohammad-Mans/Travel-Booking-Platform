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

            <Button variant="outlined">View Hotel</Button>
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

            <Button variant="contained" fullWidth>
              Book
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
