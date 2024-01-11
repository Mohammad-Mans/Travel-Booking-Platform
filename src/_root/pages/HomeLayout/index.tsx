import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import LuggageIcon from "@mui/icons-material/Luggage";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo/Vista-Voyage-Logo.svg";

function HomeLayout() {
  const navigate = useNavigate();

  return (
    <>
      <AppBar component="header">
        <Toolbar>
          <IconButton onClick={() => navigate("/")}>
            <img src={Logo} height={30} />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
            Vista Voyage
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mr: 2 }}>
            <Button color="inherit" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => {
                navigate("/login");
                localStorage.clear();
              }}
            >
              Logout
            </Button>
          </Stack>

          <Divider orientation="vertical" variant="middle" flexItem />

          <IconButton
            color="secondary"
            size="large"
            aria-label="bookings"
            onClick={() => navigate("/checkout")}
            sx={{ ml: 1 }}
          >
            <LuggageIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" pt={8}>
        <Outlet />
      </Box>
    </>
  );
}
export default HomeLayout;
