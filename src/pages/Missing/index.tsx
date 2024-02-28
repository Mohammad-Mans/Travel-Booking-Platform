import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MissingPage = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h1" style={{ color: "black" }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: "black" }}>
        The page you're looking for doesn't exist.
      </Typography>
      <Button variant={"contained"} onClick={goBack} sx={{ mt: 3 }}>
        Go Back
      </Button>
    </Box>
  );
};

export default MissingPage;
