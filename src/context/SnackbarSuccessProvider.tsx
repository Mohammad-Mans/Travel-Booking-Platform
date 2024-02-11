import React, { FC, createContext, useContext, useState } from "react";
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";

type SnackbarContextValues = {
  setSuccessMessage: (message: string) => void;
};

type SnackBarProviderProps = AlertProps & {
  children: React.ReactNode;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionDown(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

const SnackbarSuccessContext = createContext<SnackbarContextValues>({
  setSuccessMessage: () => {},
});

export const SnackbarSuccessProvider: FC<SnackBarProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [shouldRenderSnackbar, setShouldRenderSnackbar] = useState(false);

  const setSuccessMessage = (message: string) => {
    setMessage(message);
    setIsOpen(true);
    setShouldRenderSnackbar(true);
  };

  const closeSnackbar = () => {
    setIsOpen(false);
  };

  const configSnackbar: SnackbarProps = {
    open: isOpen,
    anchorOrigin: { vertical: "top", horizontal: "center" },
    onClose: closeSnackbar,
    TransitionComponent: TransitionDown,
    transitionDuration: 500,
    autoHideDuration: 3000,
  };

  return (
    <SnackbarSuccessContext.Provider value={{ setSuccessMessage }}>
      {children}

      {shouldRenderSnackbar && (
        <Snackbar {...configSnackbar}>
          <Alert severity="success">{message}</Alert>
        </Snackbar>
      )}
    </SnackbarSuccessContext.Provider>
  );
};

export const useSnackbarSuccess = () => {
  const { setSuccessMessage } = useContext(SnackbarSuccessContext);

  if (!setSuccessMessage) {
    throw new Error(
      "useSnackbarSuccess must be used within a SnackbarSuccessProvider"
    );
  }

  return {
    setSuccessMessage,
  };
};

export default SnackbarSuccessContext;
