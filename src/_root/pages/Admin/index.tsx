import {
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  AppBar,
  IconButton,
  Typography,
  Drawer,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import CityIcon from "@mui/icons-material/LocationCity";
import HotelIcon from "@mui/icons-material/Apartment";
import RoomIcon from "@mui/icons-material/KingBed";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ResponsiveColoredGrid from "../../../Common/ResponsiveColoredGrid";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo/Vista-Voyage-Logo-White.svg"
import { useLocation } from "react-router-dom";
import { SnackbarSuccessProvider } from "../../../context/SnackbarSuccessProvider";

const drawerWidth = 300;

type DrawerItem = {
  text: string;
  icon: JSX.Element;
};

export default function ResponsiveDrawer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [drawerState, setDrawerState] = useState<string>("");

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const determineDrawerState = (path: string) => {
    path.endsWith("/admin")
      ? setDrawerState("Manage Cities")
      : path.endsWith("/admin/hotels")
      ? setDrawerState("Manage Hotels")
      : path.endsWith("/admin/rooms")
      ? setDrawerState("Manage Rooms")
      : "";
  };

  useEffect(() => {
    determineDrawerState(location.pathname);
  }, [location]);

  const handleListItemClick = (item: DrawerItem) => {
    switch (item.text) {
      case "Manage Cities": {
        navigate("");
        break;
      }
      case "Manage Hotels": {
        navigate("hotels");
        break;
      }
      case "Manage Rooms": {
        navigate("rooms");
        break;
      }
    }
  };

  const handleLogout = () => {
    navigate("/login");
    localStorage.clear();
  };

  const drawerItems: DrawerItem[] = [
    { text: "Manage Cities", icon: <CityIcon /> },
    { text: "Manage Hotels", icon: <HotelIcon /> },
    { text: "Manage Rooms", icon: <RoomIcon /> },
  ];

  const drawer = (
    <>
      <Toolbar />

      <Divider />

      <List sx={{ height: "100%" }}>
        {drawerItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={item.text === drawerState}
              onClick={() => handleListItemClick(item)}
            >
              <ListItemIcon
                sx={{
                  color: item.text === drawerState ? "primary.main" : "",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        color="secondary"
        sx={{ m: 2 }}
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },

          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <IconButton onClick={() => navigate("")}>
            <img src={Logo} height={45} width={45} alt="Logo" />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            Vista Voyage
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: "100vh",
          pt: 8,
          bgcolor: "darkBackground.main",
        }}
      >
        <ResponsiveColoredGrid>
          <SnackbarSuccessProvider>
            <Outlet />
          </SnackbarSuccessProvider>
        </ResponsiveColoredGrid>
      </Box>
    </Box>
  );
}
