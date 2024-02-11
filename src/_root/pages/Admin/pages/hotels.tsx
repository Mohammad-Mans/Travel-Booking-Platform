import { Box } from "@mui/material";
import SearchBar from "../components/SearchBar";
import ResultsLayout from "../components/ResultsLayout";

function hotels() {
  const handleSearch = (value: string) => {
    console.log("Search:", value);
  };

  const handleCreateHotel = () => {
    console.log("create");
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <SearchBar label="Search for hotels..." onSearch={handleSearch} />
      <ResultsLayout isLoading onCreate={handleCreateHotel}>
        <Box></Box>
      </ResultsLayout>
    </Box>
  );
}

export default hotels;
