import React, { FC, createContext, useContext, useState } from "react";
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";

type SnackbarContextValues = {
  setErrorMessage: (message: string) => void;
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

function TransitionRight(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

const SnackbarErrorContext = createContext<SnackbarContextValues>({
  setErrorMessage: () => {},
});

export const SnackbarErrorProvider: FC<SnackBarProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [shouldRenderSnackbar, setShouldRenderSnackbar] = useState(false);

  const setErrorMessage = (message: string) => {
    setMessage(message);
    setIsOpen(true);
    setShouldRenderSnackbar(true);
  };

  const closeSnackbar = () => {
    setIsOpen(false);
  };

  const configSnackbar: SnackbarProps = {
    open: isOpen,
    onClose: closeSnackbar,
    TransitionComponent: TransitionRight,
    transitionDuration: 500,
    autoHideDuration: 3000,
  };

  return (
    <SnackbarErrorContext.Provider value={{ setErrorMessage }}>
      {children}

      {shouldRenderSnackbar && (
        <Snackbar {...configSnackbar}>
          <Alert severity="error">{message}</Alert>
        </Snackbar>
      )}
    </SnackbarErrorContext.Provider>
  );
};

export const useSnackbarError = () => {
  const { setErrorMessage } = useContext(SnackbarErrorContext);

  if (!setErrorMessage) {
    throw new Error(
      "useSnackbarError must be used within a SnackbarErrorProvider"
    );
  }

  return {
    setErrorMessage,
  };
};

export default SnackbarErrorContext;
