import { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import ResponsiveColoredGrid from "../../components/common/ResponsiveColoredGrid";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import { useSnackbarError } from "../../context/SnackbarErrorProvider";
import axios from "../../api/axios";
import { AxiosError } from "axios";
import ConfirmationDetail from "./components/confirmationDetail";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import Logo from "../../assets/logo/Vista-Voyage-Logo-DARK-MAGENTA.png";
import { useReactToPrint } from "react-to-print";

type ConfirmationData = {
  customerName: string;
  hotelName: string;
  roomNumber: string;
  roomType: string;
  bookingDate: string;
  totalCost: number;
  paymentMethod: string;
  bookingStatus: string;
  confirmationNumber: string;
};

const ConfirmationPage = () => {
  const { confirmationNumber } = useParams();
  const { setErrorMessage } = useSnackbarError();
  const [loadingConfirmationData, setLoadingConfirmationData] =
    useState<boolean>(true);

  const [confirmationData, setConfirmationData] = useState<ConfirmationData>();

  const GET_BOOKING_URL = "/api/bookings/" + confirmationNumber?.split("-")[1];

  const getHotelData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user_data")!);
      const accessToken = userData.accessToken;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.get(GET_BOOKING_URL, { headers });

      const formattedDate = new Date(
        response.data.bookingDateTime
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      setConfirmationData({
        ...response.data,
        bookingDate: formattedDate as string,
      });
    } catch (error) {
      const axiosError = error as AxiosError;

      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't fetch the confirmation data");
      }
    } finally {
      setLoadingConfirmationData(false);
    }
  };

  useEffect(() => {
    getHotelData();
  }, []);

  const confirmationRef = useRef<HTMLDivElement | null>(null);

  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    const content = confirmationRef.current;

    if (content) {
      doc.html(content, {
        callback: function (doc) {
          doc.save("Vista_Voyage_booking_Confirmation.pdf");
        },
        html2canvas: { scale: 0.26 },
      });
    }
  };

  const handlePrint = useReactToPrint({
    content: () => confirmationRef.current,
    documentTitle: "Vista_Voyage_booking_Confirmation",
  });

  return (
    <ResponsiveColoredGrid
      color="lightBackground.main"
      minHeight="calc(100vh - 64px)"
    >
      {loadingConfirmationData ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="400px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={5} sx={{ p: 4, bgcolor: "darkBackground.main" }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Booking Confirmed
          </Typography>
          <Typography variant="body1" textAlign="center" paragraph>
            We are pleased to inform you that your reservation request has been
            received and confirmed.
          </Typography>
          <Typography variant="body1" textAlign="center" mb={2} paragraph>
            Thank you for choosing Vista Voyage for your upcoming stay!
          </Typography>

          <Grid container>
            <Grid item xs={12} md={9}>
              <Box ref={confirmationRef}>
                <Paper
                  elevation={5}
                  sx={{ p: 4, bgcolor: "lightBackground.main" }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "transparent",
                      border: 1,
                      borderColor: "primary.main",
                      mb: 2,
                    }}
                  >
                    <img src={Logo} height={20} alt="Logo" />
                  </Avatar>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h5" gutterBottom>
                        Booking Details
                      </Typography>

                      <Divider />

                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <ConfirmationDetail
                          label={"Booking"}
                          value={
                            confirmationData?.confirmationNumber.split("-")[1]
                          }
                        />
                        <ConfirmationDetail
                          label={"Date"}
                          value={confirmationData?.bookingDate}
                        />
                        <ConfirmationDetail
                          label={"Hotel Name"}
                          value={confirmationData?.hotelName}
                        />
                        <ConfirmationDetail
                          label={"Room Number"}
                          value={confirmationData?.roomNumber}
                        />
                        <ConfirmationDetail
                          label={"Room Type"}
                          value={confirmationData?.roomType}
                        />
                        <ConfirmationDetail
                          label={"Booking Status"}
                          value={confirmationData?.bookingStatus}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="h5" gutterBottom>
                        Payment Details
                      </Typography>

                      <Divider />

                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <ConfirmationDetail
                          label={"Name"}
                          value={confirmationData?.customerName}
                        />
                        <ConfirmationDetail
                          label={"Payment Method"}
                          value={confirmationData?.paymentMethod}
                        />
                        <ConfirmationDetail
                          label={"Total"}
                          value={`$${confirmationData?.totalCost}`}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", md: "column" },
                  justifyContent: "end",
                  height: "100%",
                }}
              >
                <Button
                  onClick={handlePrint}
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  sx={{
                    mt: 2,
                    ml: 2,
                  }}
                >
                  Print
                </Button>

                <Button
                  onClick={handleSaveAsPDF}
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  sx={{
                    mt: 2,
                    ml: 2,
                  }}
                >
                  Save as PDF
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </ResponsiveColoredGrid>
  );
};

export default ConfirmationPage;
