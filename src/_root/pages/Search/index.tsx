import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Select,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ResponsiveColoredGrid from "../../../Common/ResponsiveColoredGrid";
import SearchBar from "../Home/components/SearchBar";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import HotelCard from "./Components/HotelCard";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { AxiosError } from "axios";
import { useSnackbarError } from "../../../context/SnackbarErrorProvider";

const homeSearchURL = import.meta.env.VITE_HOME_SEARCH_URL;
const getSearchResultsAmenities = import.meta.env
  .VITE_GET_SEARCH_RESULTS_AMENITIES;

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

type Filters = {
  state: boolean;
  amenities: string[];
  roomType: string;
  starRate: number | string;
};

const defaultFilters: Filters = {
  state: false,
  amenities: [],
  roomType: "",
  starRate: "",
};

const SearchPage = () => {
  const { setErrorMessage } = useSnackbarError();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingResutls, setLoadingResults] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(homeSearchURL, {
          params: searchParams,
        });

        const searchData = response.data;
        setFilters(defaultFilters);
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
    if (sortQuery && sortQuery.charAt(0) === "-") {
      setSortBy(sortQuery.slice(1));
      setSortOrder("-");
    } else {
      setSortBy(sortQuery);
      setSortOrder("");
    }
  }, [searchParams]);

  const [filterButton, setFilterButton] = useState<HTMLButtonElement | null>(
    null
  );

  const handleFilterButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setFilterButton(event.currentTarget);
  };

  const handleFiltersPopoverClose = () => {
    setFilterButton(null);
  };

  const [amenities, setAmenities] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(getSearchResultsAmenities);
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

  const StarRateOptions = [1, 2, 3, 4, 5];

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [filteredSearchResults, setFilteredSearchResults] = useState<
    SearchResult[]
  >([]);

  const handleFiltersSubmit = () => {
    const filteredResults = searchResults?.filter((hotel) => {
      const hasSelectedAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((selectedAmenity) =>
          hotel.amenities.some(
            (hotelAmenity) => hotelAmenity.name === selectedAmenity
          )
        );

      const hasSelectedRoomType =
        filters.roomType === "" || hotel.roomType === filters.roomType;

      const hasSelectedStarRating =
        filters.starRate === "" || hotel.starRating === filters.starRate;

      return (
        hasSelectedAmenities && hasSelectedRoomType && hasSelectedStarRating
      );
    });

    setFilteredSearchResults(filteredResults);
    setFilters({ ...filters, state: true });
    setFilterButton(null);
  };

  const handleFiltersReset = () => {
    setFilteredSearchResults([]);
    setFilters(defaultFilters);
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

  const [sortBy, setSortBy] = useState<string | null>(null);
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
    setSortBy(null);
    setSortOrder("");
  };

  return (
    <>
      <ResponsiveColoredGrid color="#f9f9f9">
        <SearchBar {...Object.fromEntries([...searchParams])} />
      </ResponsiveColoredGrid>

      <ResponsiveColoredGrid color="white.main">
        <Grid container sx={{ position: "relative" }}>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              position: "sticky",
              display: "flex",
              flexDirection: { xs: "row", md: "column" },
              height: "100%",
              top: ["50px", "56px", "64px"],
              borderRadius: 1,
              paddingRight: { xs: 0, md: 1 },
              pt: 1,
              zIndex: 2,
            }}
          >
            <Button
              fullWidth
              color="secondary"
              variant="contained"
              onClick={handleFilterButtonClick}
              sx={{
                mb: { xs: 0, md: 1 },
              }}
              endIcon={<ArrowDropDownIcon fontSize="large" />}
            >
              Filter
            </Button>

            <Popover
              open={Boolean(filterButton)}
              anchorEl={filterButton}
              onClose={handleFiltersPopoverClose}
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
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Amenities</InputLabel>
                  <Select
                    multiple
                    label="Amenities"
                    value={filters.amenities}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        amenities: e.target.value as string[],
                      })
                    }
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {amenities.map((amenity) => (
                      <MenuItem key={amenity} value={amenity}>
                        <ListItemIcon>
                          <Checkbox
                            checked={
                              filters.amenities.findIndex(
                                (selectedAmenity) => selectedAmenity === amenity
                              ) >= 0
                            }
                          />
                        </ListItemIcon>
                        <ListItemText primary={amenity} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Room type</InputLabel>
                  <Select
                    value={filters.roomType}
                    label="Room type"
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        roomType: e.target.value as string,
                      });
                    }}
                  >
                    {RoomTypeOptions.map((option) => {
                      return (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Hotel rating</InputLabel>
                  <Select
                    value={filters.starRate}
                    label="Room type"
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        starRate: e.target.value as number,
                      });
                    }}
                  >
                    {StarRateOptions.map((option) => {
                      return (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

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
                    Apply
                  </Button>
                </Box>
              </Box>
            </Popover>

            <Button
              fullWidth
              color="secondary"
              variant="contained"
              onClick={handleSortButtonClick}
              endIcon={<ArrowDropDownIcon fontSize="large" />}
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
                        <MenuItem
                          key={option}
                          value={option.replace(/\s/g, "")}
                        >
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
          </Grid>

          <Grid item xs={12} md={9} minHeight="85vh" bgcolor="white.main">
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
              filters.state ? (
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
