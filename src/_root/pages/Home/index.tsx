import { Grid, Typography } from "@mui/material";
import SearchBar from "./components/SearchBar";
import ResponsiveColoredGrid from "./components/ResponsiveColoredGrid";

const HomePage = () => {
  return (
    <Grid
      container
      bgcolor="#f9f9f9"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ResponsiveColoredGrid sx={{ width: "100%" }}>
        <SearchBar />
        <Typography variant="h4" pt={4}>
          Greetings, Travel Enthusiasts!
        </Typography>
        <Typography variant="h6">
          Start Your Next Adventure with Vista Voyage!
        </Typography>
      </ResponsiveColoredGrid>
    </Grid>
  );
};

export default HomePage;
