import { FC } from "react";
import { Typography, Box } from "@mui/material";

type ConfirmationDetailProps = {
  label: string;
  value: any;
};

const ConfirmationDetail: FC<ConfirmationDetailProps> = ({ label, value }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        my: 0.5,
      }}
    >
      <Typography variant="body1" width={140}>
        {label}
      </Typography>

      <Typography variant="body1" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  );
};

export default ConfirmationDetail;
