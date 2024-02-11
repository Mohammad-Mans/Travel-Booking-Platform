import { Box } from "@mui/material";
import SearchBar from "../components/SearchBar";
import ResultsLayout from "../components/ResultsLayout";

function rooms() {
  const handleSearch = (value: string) => {
    console.log("Search:", value);
  };

  const handleCreateRoom = () => {
    console.log("create");
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <SearchBar label="Search for rooms..." onSearch={handleSearch} />

      <ResultsLayout isLoading onCreate={handleCreateRoom}>
        <Box></Box>
      </ResultsLayout>
    </Box>
  );
}

export default rooms;
