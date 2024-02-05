import { FC, ReactNode } from "react";
import { Typography, Box } from "@mui/material";

type RoomDetailProps = {
  label: string;
  value: any;
  icon: ReactNode;
};

const RoomDetail: FC<RoomDetailProps> = ({ label, value, icon }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        my: 0.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {icon}
        <Typography variant="h6" sx={{ pl: 1 }}>
          {label}
        </Typography>
      </Box>

      <Typography variant="body1" fontWeight="bold" ml={2}>
        {value}
      </Typography>
    </Box>
  );
};

export default RoomDetail;
