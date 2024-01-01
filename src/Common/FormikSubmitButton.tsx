import { FC } from "react";
import { useFormikContext } from "formik";
import { LoadingButton } from "@mui/lab";
import { LoadingButtonProps } from "@mui/lab/LoadingButton";

type FormikSubmitLoadingButtonProps = LoadingButtonProps & {
  children: React.ReactNode;
};

const FormikSubmitButton: FC<FormikSubmitLoadingButtonProps> = ({
  children,
  ...rest
}) => {
  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  };

  const configButton: LoadingButtonProps = {
    variant: "contained",
    color: "primary",
    fullWidth: true,
    disableRipple: true,
    type: "submit",
    onClick: handleSubmit,
    ...rest,
  };

  return (
    <LoadingButton {...configButton}>
      <span>{children}</span>
    </LoadingButton>
  );
};

export default FormikSubmitButton;
