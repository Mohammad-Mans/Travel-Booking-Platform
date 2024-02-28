import { FC } from "react";
import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

type Review = {
  reviewId: number;
  customerName: string;
  rating: number;
  description: string;
};

const CustomerReview: FC<Review> = ({ customerName, rating, description }) => {
  return (
    <Box sx={{ my: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">
          <strong>{customerName}</strong> - {rating}.0
        </Typography>

        <StarIcon fontSize="small" sx={{ color: "#faaf00" }} />
      </Box>
      <Typography variant="body2">{description}</Typography>
    </Box>
  );
};

export default CustomerReview;
