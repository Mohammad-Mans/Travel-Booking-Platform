import { Button, ButtonProps } from "@mui/material";
import { useFormikContext } from "formik";
import { FC } from "react";

type FormikSubmitButtonProps = ButtonProps & {
  children: React.ReactNode;
};

const FormikSubmitButton: FC<FormikSubmitButtonProps> = ({
  children,
  ...rest
}) => {
  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  };

  const configButton: ButtonProps = {
    variant: "contained",
    color: "primary",
    fullWidth: true,
    onClick: handleSubmit,
    ...rest,
  };

  return <Button {...configButton}>{children}</Button>;
};

export default FormikSubmitButton;
