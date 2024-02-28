import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { FC, ReactNode } from "react";

interface ResultsLayoutProps {
  isLoading: boolean;
  onCreate: () => void;
  children: ReactNode;
};

const ResultsLayout: FC<ResultsLayoutProps> = ({
  isLoading,
  onCreate,
  children,
}) => {
  return (
    <Paper
      elevation={5}
      sx={{ width: "100%", mt: 4, bgcolor: "lightBackground.main" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor:"secondary.main",
          p: 2,
          borderRadius:1
        }}
      >
        <Typography variant="h6" color="white.main">Results</Typography>
        <Button variant="contained" onClick={onCreate}>
          Create
        </Button>
      </Box>

      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="400px"
        >
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </Paper>
  );
};

export default ResultsLayout;
