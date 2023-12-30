import React, { FC } from "react";
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";

type SnackbarAlertProps = SnackbarProps & {
  children: React.ReactNode;
};

function TransitionRight(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

const SnackbarAlert: FC<SnackbarAlertProps> = ({ children, ...rest }) => {
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const configSnackbar: SnackbarProps = {
    TransitionComponent: TransitionRight,
    transitionDuration: 500,
    autoHideDuration: 3000,
    ...rest,
  };

  return (
    <Snackbar {...configSnackbar}>
      <Alert severity="error" sx={{ width: "100%" }}>
        {children}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
