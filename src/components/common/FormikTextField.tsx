import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "formik";
import { FC } from "react";

type FormikTextFieldProps = { name: string } & Omit<TextFieldProps, "name">;

const FormikTextField: FC<FormikTextFieldProps> = ({ name, ...rest }) => {
  const [field, meta] = useField(name);

  const configTextField: TextFieldProps = {
    ...field,
    margin: "normal",
    variant: "filled",
    fullWidth: true,
    ...rest,
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return <TextField {...configTextField} />;
};

export default FormikTextField;
