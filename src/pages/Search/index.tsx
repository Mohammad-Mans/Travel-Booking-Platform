import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ResponsiveColoredGrid from "../../components/common/ResponsiveColoredGrid";
import SearchBar from "../../components/features/SearchBar/SearchBar";
import { useEffect, useState } from "react";
import axios from "../../services/axiosInstance";
import HotelCard from "./Components/HotelCard";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { AxiosError } from "axios";
import { useSnackbarError } from "../../context/SnackbarErrorProvider";
import StickyBox from "react-sticky-box";

const GET_HOME_SEARCH_URL = "/api/home/search";
const GET_SEARCH_RESULTS_AMENITIES_URL = "/api/search-results/amenities";

type SearchResult = {
  hotelId: number;
  hotelName: string;
  starRating: number;
  latitude: number;
  longitude: number;
  roomPrice: number;
  roomType: string;
  cityName: string;
  roomPhotoUrl: string;
  discount: number;
  amenities: [
    {
      id: number;
      name: string;
      description: string;
    }
  ];
};

type Amenity = {
  name: string;
  description: string;
};

const SearchPage = () => {
  const { setErrorMessage } = useSnackbarError();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingResutls, setLoadingResults] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(GET_HOME_SEARCH_URL, {
          params: searchParams,
        });

        const searchData = response.data;
        handleFiltersReset();
        setSearchResults(searchData);
      } catch (err) {
        const axiosError = err as AxiosError;

        if (!axiosError?.response) {
          setErrorMessage("No Server Response");
        } else {
          setErrorMessage("Couldn't fetch Search Results");
        }
      } finally {
        setLoadingResults(false);
      }
    })();

    const sortQuery = searchParams.get("sort");
    if (sortQuery) {
      if (sortQuery.charAt(0) === "-") {
        setSortOrder("-");
        setSortBy(sortQuery.slice(1));
      } else {
        setSortOrder("");
        setSortBy(sortQuery);
      }
    } else {
      setSortBy("");
      setSortOrder("");
    }
  }, [searchParams]);

  const [amenities, setAmenities] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(GET_SEARCH_RESULTS_AMENITIES_URL);
        const amenitiesData = response.data;
        const amenitiesNames = amenitiesData.map(
          (amenity: Amenity) => amenity.name
        );
        setAmenities(amenitiesNames);
      } catch (err) {
        const axiosError = err as AxiosError;

        if (!axiosError?.response) {
          setErrorMessage("No Server Response");
        } else {
          setErrorMessage("Couldn't fetch Amenities");
        }
      }
    })();
  }, []);

  const RoomTypeOptions = [
    "Double",
    "King Suite",
    "Standard",
    "Cabin",
    "Ocean View",
  ];

  const StarRateOptions = [3, 4, 5];

  const [filterState, setFilterState] = useState<boolean>(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [roomType, setRoomType] = useState<string>("");
  const [starRate, setStarRate] = useState<number>(-1);
  const [priceRange, setPriceRange] = useState<number[]>([100, 200]);

  const [filteredSearchResults, setFilteredSearchResults] = useState<
    SearchResult[]
  >([]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleFiltersSubmit = () => {
    const filteredResults = searchResults?.filter((hotel) => {
      const isWithinPriceRange =
        hotel.roomPrice >= priceRange[0] && hotel.roomPrice <= priceRange[1];

      const hasSelectedAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((selectedAmenity) =>
          hotel.amenities.some(
            (hotelAmenity) => hotelAmenity.name === selectedAmenity
          )
        );

      const hasSelectedRoomType =
        roomType === "" || hotel.roomType === roomType;

      const hasSelectedStarRating =
        starRate === -1 || hotel.starRating === starRate;

      return (
        isWithinPriceRange &&
        hasSelectedAmenities &&
        hasSelectedRoomType &&
        hasSelectedStarRating
      );
    });

    setFilteredSearchResults(filteredResults);
    setFilterState(true);
  };

  const handleFiltersReset = () => {
    setFilteredSearchResults([]);
    setFilterState(false);
    setSelectedAmenities([]);
    setRoomType("");
    setStarRate(-1);
    setPriceRange([100, 200]);
  };

  const [sortButton, setSortButton] = useState<HTMLButtonElement | null>(null);

  const handleSortButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setSortButton(event.currentTarget);
  };

  const handleSortPopoverClose = () => {
    setSortButton(null);
  };

  const sortOptions = ["Room Price", "Star Rating"];

  const [sortBy, setSortBy] = useState<string | null>("");
  const [sortOrder, setSortOrder] = useState<string>("");

  const handleSortSubmit = () => {
    const sortQuery = sortOrder + sortBy;
    setSearchParams((searchParams) => {
      searchParams.set("sort", sortQuery);
      return searchParams;
    });

    setSortButton(null);
  };

  const handleSortReset = () => {
    setSortBy("");
    setSortOrder("");
    setSearchParams((searchParams) => {
      searchParams.delete("sort");
      return searchParams;
    });
  };

  return (
    <>
      <ResponsiveColoredGrid color="darkBackground.main">
        <SearchBar {...Object.fromEntries([...searchParams])} />
      </ResponsiveColoredGrid>

      <ResponsiveColoredGrid color="lightBackground.main">
        <Box
          sx={{ display: "flex", justifyContent: "end", pr: 2, width: "100%" }}
        >
          <Button
            color="secondary"
            variant="contained"
            onClick={handleSortButtonClick}
            endIcon={<ArrowDropDownIcon fontSize="large" />}
            sx={{
              display: { xs: "none", md: "flex" },
              width: "200px",
            }}
          >
            Sort
          </Button>
          <Popover
            open={Boolean(sortButton)}
            anchorEl={sortButton}
            onClose={handleSortPopoverClose}
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
                width: "300px",
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => {
                    setSortBy(e.target.value as string);
                  }}
                >
                  {sortOptions.map((option) => {
                    return (
                      <MenuItem key={option} value={option.replace(/\s/g, "")}>
                        {option}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <Box
                my={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <IconButton
                  color={sortOrder == "" ? "primary" : "secondary"}
                  onClick={() => setSortOrder("")}
                  sx={{
                    border: 1,
                  }}
                >
                  <ArrowUpwardIcon />
                </IconButton>

                <IconButton
                  color={sortOrder == "-" ? "primary" : "secondary"}
                  onClick={() => setSortOrder("-")}
                  sx={{
                    border: 1,
                  }}
                >
                  <ArrowDownwardIcon />
                </IconButton>
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
                <Button onClick={handleSortReset}>Reset</Button>

                <Button onClick={handleSortSubmit} variant="contained">
                  Apply
                </Button>
              </Box>
            </Box>
          </Popover>
        </Box>

        <Grid container sx={{ height: "100%" }}>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              flexDirection: { xs: "row", md: "column" },
              borderRadius: 1,
              paddingRight: { xs: 0, md: 1 },
              pt: 1,
            }}
          >
            <StickyBox
              offsetTop={72}
              offsetBottom={8}
              style={{ width: "100%" }}
            >
              <Card
                elevation={3}
                sx={{
                  p: 3,
                  bgcolor: "darkBackground.main",
                }}
              >
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                  Room Price:
                </Typography>

                <Slider
                  getAriaLabel={() => "Room-price-range"}
                  value={priceRange}
                  min={20}
                  max={280}
                  step={10}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => {
                    return `$${value}`;
                  }}
                />

                <Box
                  sx={{
                    p: 1,
                    mb: 2,
                    border: 1,
                    borderRadius: 1,
                    borderColor: "primary.main",
                    bgcolor: "lightBackground.main",
                  }}
                >
                  <Typography variant="body1" textAlign="center">
                    {priceRange[0] === priceRange[1]
                      ? `$${priceRange[0]}`
                      : `$${priceRange[0]} - $${priceRange[1]}`}
                  </Typography>
                </Box>

                <Typography variant="body1" fontWeight="bold" sx={{ my: 1 }}>
                  Amenities:
                </Typography>

                <FormGroup>
                  {amenities.map((amenity) => (
                    <FormControlLabel
                      key={amenity}
                      control={
                        <Checkbox
                          checked={selectedAmenities.includes(amenity)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSelectedAmenities(() => {
                              const newAmenities = checked
                                ? [...selectedAmenities, amenity]
                                : selectedAmenities.filter(
                                    (a) => a !== amenity
                                  );
                              return newAmenities;
                            });
                          }}
                          name={amenity}
                        />
                      }
                      label={amenity}
                    />
                  ))}
                </FormGroup>

                <Typography variant="body1" fontWeight="bold" sx={{ my: 1 }}>
                  Room Type:
                </Typography>

                <RadioGroup
                  aria-label="room-type"
                  name="roomType"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <FormControlLabel
                    value=""
                    control={<Radio />}
                    label="All Types"
                  />
                  {RoomTypeOptions.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>

                <Typography variant="body1" fontWeight="bold" sx={{ my: 1 }}>
                  Hotel Rating:
                </Typography>

                <RadioGroup
                  aria-label="hotel-rating"
                  name="hotelRating"
                  value={starRate}
                  onChange={(e) => setStarRate(Number(e.target.value))}
                >
                  <FormControlLabel
                    value={-1}
                    control={<Radio />}
                    label="All Ratings"
                  />
                  {StarRateOptions.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>

                <Divider />

                <Box
                  pt={2}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button onClick={handleFiltersReset}>Reset</Button>

                  <Button variant="contained" onClick={handleFiltersSubmit}>
                    Filter
                  </Button>
                </Box>
              </Card>

              <Button
                fullWidth
                color="secondary"
                variant="contained"
                onClick={handleSortButtonClick}
                endIcon={<ArrowDropDownIcon fontSize="large" />}
                sx={{
                  display: { xs: "", md: "none" },
                }}
              >
                Sort
              </Button>
            </StickyBox>
          </Grid>

          <Grid
            item
            xs={12}
            md={9}
            minHeight="85vh"
            bgcolor="lightBackground.main"
          >
            {loadingResutls ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="400px"
              >
                <CircularProgress />
              </Box>
            ) : searchResults.length > 0 ? (
              filterState ? (
                filteredSearchResults.length > 0 ? (
                  filteredSearchResults.map((hotel) => (
                    <HotelCard key={hotel.hotelId} {...hotel} />
                  ))
                ) : (
                  <Paper elevation={5} sx={{ m: 1 }}>
                    <Box textAlign="center" p={2}>
                      <Typography variant="h6">
                        We couldn't find any hotels matching your selected
                        filters.
                      </Typography>
                    </Box>
                  </Paper>
                )
              ) : (
                searchResults.map((hotel) => (
                  <HotelCard key={hotel.hotelId} {...hotel} />
                ))
              )
            ) : (
              <Paper elevation={5} sx={{ m: 1 }}>
                <Box textAlign="center" p={1}>
                  <Typography variant="h6">
                    We couldn't find any hotels matching your search.
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </ResponsiveColoredGrid>
    </>
  );
};

export default SearchPage;
