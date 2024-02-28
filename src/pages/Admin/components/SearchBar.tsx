import { FC, useState, ChangeEvent } from "react";
import {
  TextField,
  Box,
  Button,
  InputAdornment,
  FormControl,
  Select,
  SelectChangeEvent,
  MenuItem,
  Paper,
} from "@mui/material";

interface SearchProps {
  label: string;
  onSearch: (value: string, searchBy: string) => void;
};

const SearchBar: FC<SearchProps> = ({ label, onSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  const handleSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchByChange = (event: SelectChangeEvent) => {
    setSearchBy(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchValue, searchBy);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        alignItems: "end",
        p: 2,
        borderRadius: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          label={""}
          placeholder={label}
          variant="standard"
          value={searchValue}
          onChange={handleSearchValueChange}
          InputProps={{
            endAdornment: <InputAdornment position="end"></InputAdornment>,
          }}
        />
        <FormControl>
          <Select
            variant="standard"
            value={searchBy}
            defaultValue="name"
            onChange={handleSearchByChange}
            sx={{
              width: "130px",
            }}
          >
            <MenuItem value={"name"}>By Name</MenuItem>
            <MenuItem value={"description"}>By Description</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSearch} sx={{ ml: 2 }}>
          Search
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchBar;
