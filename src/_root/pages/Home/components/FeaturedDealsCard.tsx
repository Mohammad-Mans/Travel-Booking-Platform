import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Rating,
  Grid,
} from "@mui/material";
import React from "react";
import PlaceIcon from "@mui/icons-material/Place";

interface CardProps {
  hotelName: string;
  cityName: string;
  roomPhotoUrl: string;
  originalRoomPrice: number;
  finalPrice: number;
  hotelStarRating: number;
  discount: number;
}

const FeaturedDealsCard: React.FC<CardProps> = ({
  hotelName,
  cityName,
  roomPhotoUrl,
  originalRoomPrice,
  finalPrice,
  hotelStarRating,
  discount,
}) => {
  return (
    <Box sx={{ width: ["400px", "260px"] }}>
      <Card
        elevation={5}
        sx={{
          display: "flex",
          flexDirection: { xs: "row", sm: "column" },
          justifyContent: "space-between",
        }}
      >
        <CardMedia
          component="img"
          image={roomPhotoUrl}
          alt={hotelName}
          sx={{
            maxHeight: { xs: "250px" },
            height: { sm: "200px" },
            width: { xs: "200px", sm: "100%" },
          }}
        />
        <CardContent sx={{ width: ["200px", "100%"] }}>
          <Typography gutterBottom variant="h5">
            {hotelName}
          </Typography>

          <Grid container flexDirection="row" spacing={1} pb={1}>
            <Grid item>
              <Rating size="small" value={hotelStarRating} readOnly />
            </Grid>

            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PlaceIcon fontSize="small" />

                <Typography variant="body1" color="text.secondary">
                  {cityName}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              width: "100%",
              borderRadius: 1,
              bgcolor: "primary.main",
              color: "white.main",
            }}
          >
            <Typography textAlign="center">{discount * 100}% OFF</Typography>
          </Box>

          <Box
            mt={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body1"
              pr={1}
              sx={{ textDecoration: "line-through" }}
            >
              ${originalRoomPrice}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "40px",
                minWidth: "40px",
                border: 1,
                borderColor: "primary.main",
                borderRadius: 1,
              }}
            >
              ${finalPrice}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeaturedDealsCard;
