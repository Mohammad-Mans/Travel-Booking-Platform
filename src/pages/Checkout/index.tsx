import { useState } from "react";
import {
  Typography,
  Button,
  Box,
  Divider,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import ResponsiveColoredGrid from "../../components/common/ResponsiveColoredGrid";
import { useBookings } from "../../context/BookingsProvider";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import { Formik, Form } from "formik";
import FormikSubmitButton from "../../components/common/FormikSubmitButton";
import FormikTextField from "../../components/common/FormikTextField";
import { CheckoutValidation } from "../../validation";
import axios from "../../services/axiosInstance";
import { AxiosError } from "axios";
import { useSnackbarError } from "../../context/SnackbarErrorProvider";
import RoomDetail from "./components/RoomDetail";
import ImaskFormikTextField from "../../components/common/IMaskFormikInput";
import ApartmentIcon from "@mui/icons-material/Apartment";
import KingBedIcon from "@mui/icons-material/KingBed";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  paymentMethod: "",
  cardNumber: "",
  expirationDate: "",
  cvc: "",
  specialRequists: "",
};

type SubmitProps = {
  firstName: string;
  lastName: string;
  email: string;
  paymentMethod: string;
  cardNumber: string;
  expirationDate: string;
  cvc: string;
  specialRequists: string;
};

const POST_BOOKINGS_URL = "/api/bookings";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { bookedRoom, clearBooking } = useBookings();

  const [loading, setLoading] = useState(false);
  const { setErrorMessage } = useSnackbarError();

  const handleSubmit = async (values: SubmitProps) => {
    try {
      setLoading(true);

      const data = {
        customerName: `${values.firstName} ${values.lastName}`,
        hotelName: bookedRoom?.hotelName,
        roomNumber: bookedRoom?.roomNumber.toString(),
        roomType: bookedRoom?.roomType,
        bookingDateTime: new Date().toISOString(),
        totalCost: bookedRoom?.totalCost,
        paymentMethod: values.paymentMethod,
      };

      const userData = JSON.parse(localStorage.getItem("user_data")!);
      const accessToken = userData.accessToken;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.post(POST_BOOKINGS_URL, data, {
        headers,
      });

      const confirmationNumber = response.data.confirmationNumber;

      if (response.data.bookingStatus === "Confirmed") {
        navigate(`/confirmation/${confirmationNumber}`);
        clearBooking();
      } else {
        setErrorMessage("Something went wrong. Please try again");
      }
    } catch (err) {
      const axiosError = err as AxiosError;

      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Checkout Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveColoredGrid
      color="darkBackground.main"
      minHeight="calc(100vh - 64px)"
    >
      {bookedRoom ? (
        <Grid
          container
          display="flex"
          spacing={3}
          sx={{
            minHeight: "calc(100vh - 102px)",
            flexDirection: { xs: "column-reverse", md: "row" },
          }}
        >
          <Grid item xs={12} md={7}>
            <SectionHeader title="Guest Details" />
            <Formik
              initialValues={{ ...INITIAL_FORM_STATE }}
              validationSchema={CheckoutValidation}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange }) => (
                <Form>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormikTextField
                          name="firstName"
                          label="First Name"
                          variant="outlined"
                          autoFocus
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormikTextField
                          name="lastName"
                          label="Last Name"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>

                    <FormikTextField
                      name="email"
                      label="Email"
                      variant="outlined"
                    />

                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        name="paymentMethod"
                        label="Payment Method"
                        onChange={handleChange}
                        defaultValue="cash"
                      >
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="creditCard">Credit Card</MenuItem>
                      </Select>
                    </FormControl>

                    {values.paymentMethod === "creditCard" && (
                      <>
                        <ImaskFormikTextField
                          name="cardNumber"
                          label="Card Number"
                          format="0000 0000 0000 0000"
                        />

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <FormikTextField
                              name="cvc"
                              label="CVC"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <ImaskFormikTextField
                              name="expirationDate"
                              label="Expiration Date"
                              format="00/00"
                            />
                          </Grid>
                        </Grid>
                      </>
                    )}

                    <TextField
                      name="specialRequests"
                      label="Special Requests"
                      margin="normal"
                      multiline
                      rows={3}
                      fullWidth
                    />

                    <FormikSubmitButton
                      loading={loading}
                      loadingPosition="center"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Checkout
                    </FormikSubmitButton>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper elevation={5} sx={{ p: 2 }}>
              <Typography variant="h5" textAlign="center" sx={{ pb: 1 }}>
                Order Summary
              </Typography>

              <Divider />

              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  height: "200px",
                  my: 2,
                  borderRadius: 1,
                  "&::before": {
                    content: "''",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${bookedRoom.roomPhotoUrl})`,
                    filter: "blur(10px)",
                  },
                }}
              >
                <img
                  src={bookedRoom.roomPhotoUrl}
                  alt={bookedRoom.roomType}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "secondary.main",
                    position: "absolute",
                  }}
                />
              </Box>

              <RoomDetail
                label={"Hotel Name"}
                value={bookedRoom.hotelName}
                icon={<ApartmentIcon />}
              />
              <RoomDetail
                label={"Room Type"}
                value={bookedRoom.roomType}
                icon={<KingBedIcon />}
              />
              <RoomDetail
                label={"Check In"}
                value={bookedRoom.checkInDate}
                icon={<CalendarMonthIcon />}
              />
              <RoomDetail
                label={"Check Out"}
                value={bookedRoom.checkOutDate}
                icon={<CalendarMonthIcon />}
              />
              <RoomDetail
                label={"Guests"}
                value={`${bookedRoom.adults} ${
                  bookedRoom.adults && bookedRoom.adults > 1
                    ? "Adults"
                    : "Adult"
                }
                ${
                  bookedRoom.children && bookedRoom.children > 0
                    ? `, ${bookedRoom.children} ` +
                      (bookedRoom.children > 1 ? "Children" : "Child")
                    : ""
                }`}
                icon={<FamilyRestroomIcon />}
              />

              <Divider>
                <Typography variant="h6">Total</Typography>
              </Divider>

              <Typography
                variant="h5"
                fontWeight="bold"
                textAlign="center"
                sx={{ pt: 1 }}
              >
                ${bookedRoom.totalCost}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Paper
          elevation={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
          }}
        >
          <Typography variant="h5">
            Oops! Looks like you didn't book a room.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={goBack}>
            Go back
          </Button>
        </Paper>
      )}
    </ResponsiveColoredGrid>
  );
};

export default CheckoutPage;
