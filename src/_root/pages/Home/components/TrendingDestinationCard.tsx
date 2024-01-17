import React from "react";
import { Card, Typography, CardMedia, Box } from "@mui/material";

type DestinationCardProps = {
  cityName: string;
  thumbnailUrl: string;
};

const DestinationCard: React.FC<DestinationCardProps> = ({
  cityName,
  thumbnailUrl,
}) => {
  return (
    <Card elevation={5}>
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          alt={cityName}
          image={thumbnailUrl}
          sx={{
            position: "relative",
            width: ["120px", "200px"],
            height: ["200px", "300px"],
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: 10,
          }}
        >
          <Typography
            variant="body1"
            bgcolor="white.main"
            color="primary"
            borderRadius={1}
            py={0.5}
            px={1}
          >
            {cityName}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default DestinationCard;
