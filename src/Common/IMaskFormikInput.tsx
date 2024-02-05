import { FC, forwardRef, memo, useMemo } from "react";
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";
import { IMaskInput } from "react-imask";
import { useField } from "formik";

type OmitMultiple<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type IMaskFormikInputProps = {
  name: string;
  format: string;
  label: string;
} & OmitMultiple<OutlinedInputProps, "name" | "label">;

type CustomProps = {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
};

const createTextMask = (maskFormat: string) =>
  forwardRef<HTMLInputElement, CustomProps>((props, ref) => {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={maskFormat}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  });

const TextMask = (maskFormat: string) => memo(createTextMask(maskFormat));

const IMaskFormikInput: FC<IMaskFormikInputProps> = ({
  name,
  label,
  format,
  ...rest
}) => {
  const TextMaskMemoized = useMemo(() => TextMask(format), [format]);

  const [field, meta] = useField(name);

  const configFormControl: FormControlProps = {
    margin: "normal",
    fullWidth: true,
  };

  const configOutlinedInput: OutlinedInputProps = {
    ...field,
    label,
    name,
    inputComponent: TextMaskMemoized as any,
    ...rest,
  };

  const configHilperText: FormHelperTextProps = {};

  if (meta.touched && meta.error) {
    configFormControl.error = true;
    configHilperText.children = meta.error;
  }

  return (
    <FormControl {...configFormControl}>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput {...configOutlinedInput} />
      <FormHelperText {...configHilperText} />
    </FormControl>
  );
};

export default IMaskFormikInput;
