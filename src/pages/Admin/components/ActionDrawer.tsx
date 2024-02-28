import { FC, useState, useEffect } from "react";
import { Form, Formik } from "formik";
import FormikTextField from "../../../components/common/FormikTextField";
import FormikSubmitButton from "../../../components/common/FormikSubmitButton";
import { Drawer, Box, Button, Grid, MenuItem } from "@mui/material";
import * as Yup from "yup";
import { AxiosError } from "axios";
import axios from "../../../services/axiosInstance";
import { useSnackbarError } from "../../../context/SnackbarErrorProvider";

const GET_CITIES_URL = "/api/cities";
const GET_HOTELS_URL = "/api/hotels";

type Field = {
  name: keyof City | keyof Hotel | keyof Room;
  label: string;
};

type City = {
  id: number;
  name: string;
  description: string;
};

type Hotel = {
  id: number;
  name: string;
  description: string;
  hotelType: number;
  starRating: number;
  latitude: number;
  longitude: number;
};

type Room = {
  id: number;
  roomNumber: string;
  cost: string;
};

type ActionDrawerProps = {
  dataType: string;
  action: string | null;
  fields: Field[];
  open: boolean;
  initialFormState: any;
  validation: Yup.AnyObjectSchema;
  onSubmit: (values: any) => void;
  onClose: () => void;
  loading: boolean;
};

const ActionDrawer: FC<ActionDrawerProps> = ({
  dataType,
  action,
  fields,
  open,
  onClose,
  initialFormState,
  validation,
  onSubmit,
  loading,
}) => {
  const [cities, setCities] = useState<City[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const { setErrorMessage } = useSnackbarError();

  const getCities = async () => {
    try {
      const response = await axios.get(GET_CITIES_URL);
      setCities(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;

      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't fetch cities");
      }
    }
  };

  const getHotels = async () => {
    try {
      const response = await axios.get(GET_HOTELS_URL);
      setHotels(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;

      if (!axiosError?.response) {
        setErrorMessage("No Server Response");
      } else {
        setErrorMessage("Couldn't fetch hotels");
      }
    }
  };

  useEffect(() => {
    dataType === "hotels" ? getCities() : "";
    dataType === "rooms" ? getHotels() : "";
  }, []);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: "520px" },
      }}
    >
      <Box sx={{ padding: 3 }}>
        <Box sx={{ mt: 1 }}>
          <Formik
            initialValues={{ ...initialFormState }}
            validationSchema={validation}
            onSubmit={onSubmit}
          >
            <Form>
              <Box sx={{ mt: 1 }}>
                {dataType === "hotels" && action === "create" && (
                  <FormikTextField
                    variant="outlined"
                    name="cityId"
                    label="City Name"
                    select
                  >
                    {cities.map((city) => {
                      return (
                        <MenuItem key={city.id} value={city.id}>
                          {city.name}
                        </MenuItem>
                      );
                    })}
                  </FormikTextField>
                )}

                {dataType === "rooms" && action === "create" && (
                  <FormikTextField
                    variant="outlined"
                    name="hotelId"
                    label="Hotel Name"
                    select
                  >
                    {hotels.map((hotel) => {
                      return (
                        <MenuItem key={hotel.id} value={hotel.id}>
                          {hotel.name}
                        </MenuItem>
                      );
                    })}
                  </FormikTextField>
                )}

                {fields.map((field, index) => {
                  return (
                    <FormikTextField
                      variant="outlined"
                      key={index}
                      name={field.name}
                      label={field.label}
                    />
                  );
                })}

                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Button fullWidth variant="outlined" onClick={onClose}>
                      cancel
                    </Button>
                  </Grid>

                  <Grid item>
                    <FormikSubmitButton
                      loading={loading}
                      loadingPosition="center"
                      sx={{ mt: 3, mb: 2 }}
                      type="button"
                    >
                      {`${action} ${action === "create" ? "new" : ""} ${
                        dataType === "cities"
                          ? "city"
                          : dataType === "hotels"
                          ? "hotel"
                          : "room"
                      }`}
                    </FormikSubmitButton>
                  </Grid>
                </Grid>
              </Box>
            </Form>
          </Formik>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ActionDrawer;
