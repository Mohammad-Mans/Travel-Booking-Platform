import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Rating,
  Divider,
} from "@mui/material";
import React from "react";
import PlaceIcon from "@mui/icons-material/Place";
import RemoveIcon from "@mui/icons-material/Remove";

interface CardProps {
  hotelName: string;
  starRating: number;
  visitDate: string;
  cityName: string;
  thumbnailUrl: string;
  priceLowerBound: number;
  priceUpperBound: number;
}

const VisitedHotelCard: React.FC<CardProps> = ({
  hotelName,
  starRating,
  cityName,
  thumbnailUrl,
  priceLowerBound,
  priceUpperBound,
}) => {
  return (
    <Box sx={{ width: "350px" }}>
      <Card
        elevation={5}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          ":hover": {
            boxShadow: 12,
            cursor: "pointer",
          },
        }}
      >
        <CardMedia
          component="img"
          image={thumbnailUrl}
          alt={hotelName}
          sx={{
            height: "150px",
            width: "150px",
          }}
        />
        <CardContent sx={{ width: "200px", height: "150px" }}>
          <Typography gutterBottom variant="h6">
            {hotelName}
          </Typography>

          <Rating value={starRating} size="small" readOnly />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <PlaceIcon fontSize="small" />

            <Typography variant="body1" color="text.secondary">
              {cityName}
            </Typography>
          </Box>

          <Divider />
          <Box
            mt={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary" pr={0.5}>
              Pricing:
            </Typography>
            <Typography
              variant="body1"
              border={1}
              borderRadius={1}
              borderColor="primary.main"
              p={0.5}
            >
              ${priceLowerBound}
            </Typography>

            <RemoveIcon fontSize="small" />

            <Typography
              variant="body1"
              border={1}
              borderRadius={1}
              borderColor="primary.main"
              p={0.5}
            >
              ${priceUpperBound}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VisitedHotelCard;
