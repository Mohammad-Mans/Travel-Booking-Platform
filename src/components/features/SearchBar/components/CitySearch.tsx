import { Autocomplete, autocompleteClasses } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";

interface CitySearchProps {
  city: string | null;
  setCity: (city: string | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
  options: readonly string[];
}

const CitySearch: React.FC<CitySearchProps> = ({
  city,
  setCity,
  open,
  setOpen,
  loading,
  options,
}) => {
  return (
    <Autocomplete
      freeSolo={false}
      popupIcon={<SearchIcon />}
      autoHighlight
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
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
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      value={city}
      onChange={(_, newValue) => setCity(newValue)}
    />
  );
};

export default CitySearch;
