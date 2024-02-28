import { Fragment, useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Box,
  Popover,
  Typography,
  IconButton,
} from "@mui/material";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import BedIcon from "@mui/icons-material/Bed";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import axios from "../../../../api/axios";
import { AxiosError } from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import { useSnackbarError } from "../../../../context/SnackbarErrorProvider";

const GET_CITIES_URL = "/api/cities";

type City = {
  name: string;
};

type GuestsAndRooms = {
  adults: number;
  children: number;
  rooms: number;
  popoverOpen: boolean;
};

type SearchComponentProps = {
  city?: string;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  adults?: string | null;
  children?: string | null;
  numberOfRooms?: string | null;
};

const SearchComponent: React.FC<SearchComponentProps> = (props) => {
  const { setErrorMessage } = useSnackbarError();

  const [city, setCity] = useState<string | null>(props.city || null);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [autocompleteOptions, setautocompleteOptions] = useState<
    readonly string[]
  >([]);
  const loading = openAutocomplete && autocompleteOptions.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      try {
        const response = await axios.get(GET_CITIES_URL);

        const cityNames = response.data.map((city: City) => city.name);

        if (active) {
          setautocompleteOptions([...cityNames]);
        }
      } catch (err) {
        const axiosError = err as AxiosError;

        if (!axiosError?.response) {
          setErrorMessage("No Server Response");
        } else {
          setErrorMessage("Couldn't fetch cities");
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [GET_CITIES_URL, loading]);

  useEffect(() => {
    if (!openAutocomplete) {
      setautocompleteOptions([]);
    }
  }, [openAutocomplete]);

  const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(null);

  useEffect(() => {
    const today = dayjs(new Date());
    const tomorrow = today.add(1, "day");

    props.checkInDate
      ? setCheckIn(dayjs(props.checkInDate, { format: "YYYY-MM-DD" }))
      : setCheckIn(today);
    props.checkOutDate
      ? setCheckOut(dayjs(props.checkOutDate, { format: "YYYY-MM-DD" }))
      : setCheckOut(tomorrow);
  }, [props.checkInDate, props.checkOutDate]);

  const [guestsAndRooms, setGuestsAndRooms] = useState<GuestsAndRooms>({
    adults: Number(props.adults) || 2,
    children: Number(props.children) || 0,
    rooms: Number(props.numberOfRooms) || 1,
    popoverOpen: false,
  });

  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleAdultsChange = (value: number) => {
    setGuestsAndRooms((prevState) => ({
      ...prevState,
      adults: Math.max(1, prevState.adults + value),
    }));
  };

  const handleChildrenChange = (value: number) => {
    setGuestsAndRooms((prevState) => ({
      ...prevState,
      children: Math.max(0, prevState.children + value),
    }));
  };

  const handleRoomsChange = (value: number) => {
    setGuestsAndRooms((prevState) => ({
      ...prevState,
      rooms: Math.max(1, prevState.rooms + value),
    }));
  };

  const handleApplyGuestsAndRooms = () => {
    setGuestsAndRooms({ ...guestsAndRooms, popoverOpen: false });
  };

  const handleResetGuestsAndRooms = () => {
    setGuestsAndRooms({ ...guestsAndRooms, adults: 2, children: 0, rooms: 1 });
  };

  const navigate = useNavigate();

  const handleSearch = () => {
    const searchQuery = `city=${city ? city : ""}&checkInDate=${checkIn?.format(
      "YYYY-MM-DD"
    )}&checkOutDate=${checkOut?.format("YYYY-MM-DD")}&adults=${
      guestsAndRooms.adults
    }&children=${guestsAndRooms.children}&numberOfRooms=${
      guestsAndRooms.rooms
    }`;

    navigate(`/search?${searchQuery}`);
  };

  return (
    <Paper elevation={4}>
      <Grid
        container
        sx={{
          justifyItems: "center",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Grid item xs={12} md={2.5} m={1}>
          {
            <Autocomplete
              freeSolo={false}
              popupIcon={<SearchIcon />}
              autoHighlight
              open={openAutocomplete}
              onOpen={() => {
                setOpenAutocomplete(true);
              }}
              onClose={() => {
                setOpenAutocomplete(false);
              }}
              options={autocompleteOptions}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              loading={loading}
              sx={{
                [`& .${autocompleteClasses.popupIndicator}`]: {
                  transform: "none",
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search for cities..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    ),
                  }}
                />
              )}
              value={city}
              onChange={(_event, newValue: string | null) => {
                setCity(newValue);
              }}
            />
          }
        </Grid>

        <Divider
          orientation="vertical"
          flexItem
          aria-hidden="true"
          sx={{
            display: {
              xs: "none",
              md: "inline-block",
            },
          }}
        />

        <Grid item xs={12} md={4.5} m={1}>
          <Box display="flex" justifyContent="space-between">

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Check in"
                format="DD-MM-YYYY"
                value={checkIn}
                minDate={dayjs(new Date())}
                onChange={(newValue) => {
                  Number(newValue!.format("YYYYMMDD")) >
                  Number(checkOut!.format("YYYYMMDD"))
                    ? setCheckOut(newValue!.add(1, "day"))
                    : null;
                  setCheckIn(newValue);
                }}
                showDaysOutsideCurrentMonth
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>

            <Divider
              orientation="vertical"
              flexItem
              aria-hidden="true"
              sx={{mx:2}}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Check out"
                format="DD-MM-YYYY"
                value={checkOut}
                minDate={checkIn}
                onChange={(newValue) => {
                  setCheckOut(newValue);
                }}
                showDaysOutsideCurrentMonth
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
          </Box>
        </Grid>

        <Divider
          orientation="vertical"
          flexItem
          aria-hidden="true"
          sx={{
            display: {
              xs: "none",
              md: "inline-block",
            },
          }}
        />

        <Grid item xs={12} md={2.5} m={1}>
          <TextField
            ref={textFieldRef}
            fullWidth
            label="Guests and rooms"
            value={`${guestsAndRooms.adults + guestsAndRooms.children} Guest${
              guestsAndRooms.adults + guestsAndRooms.children > 1 ? "s" : ""
            }, ${guestsAndRooms.rooms} Room${
              guestsAndRooms.rooms > 1 ? "s" : ""
            }`}
            onClick={() => {
              setGuestsAndRooms({ ...guestsAndRooms, popoverOpen: true });
            }}
            InputProps={{
              readOnly: true,
              endAdornment: <BedIcon color="secondary" />,
            }}
          />
          <Popover
            open={guestsAndRooms.popoverOpen}
            anchorEl={guestsAndRooms.popoverOpen ? textFieldRef.current : null}
            onClose={() =>
              setGuestsAndRooms({ ...guestsAndRooms, popoverOpen: false })
            }
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box
              p={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "350px",
              }}
            >
              <Box
                pb={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Adults</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleAdultsChange(-1)}
                    sx={{
                      marginRight: 2,
                      border: 1,
                    }}
                    disabled={guestsAndRooms.adults <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "32px",
                      minWidth: "32px",
                      border: 1,
                      borderColor: "secondary.main",
                      borderRadius: 1,
                    }}
                  >
                    {guestsAndRooms.adults}
                  </Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleAdultsChange(1)}
                    sx={{
                      marginLeft: 2,
                      border: 1,
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box
                pb={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Children</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleChildrenChange(-1)}
                    sx={{
                      marginRight: 2,
                      border: 1,
                    }}
                    disabled={guestsAndRooms.children <= 0}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "32px",
                      minWidth: "32px",
                      border: 1,
                      borderColor: "secondary.main",
                      borderRadius: 1,
                    }}
                  >
                    {guestsAndRooms.children}
                  </Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleChildrenChange(1)}
                    sx={{
                      marginLeft: 2,
                      border: 1,
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box
                pb={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Rooms</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleRoomsChange(-1)}
                    sx={{
                      marginRight: 2,
                      border: 1,
                    }}
                    disabled={guestsAndRooms.rooms <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "32px",
                      minWidth: "32px",
                      border: 1,
                      borderColor: "secondary.main",
                      borderRadius: 1,
                    }}
                  >
                    {guestsAndRooms.rooms}
                  </Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleRoomsChange(1)}
                    sx={{
                      marginLeft: 2,
                      border: 1,
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>

              <Divider />

              <Box
                pt={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button onClick={handleResetGuestsAndRooms}>Reset</Button>

                <Button variant="contained" onClick={handleApplyGuestsAndRooms}>
                  Apply
                </Button>
              </Box>
            </Box>
          </Popover>
        </Grid>

        <Grid item xs={12} md={1.5} p={1}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchComponent;
