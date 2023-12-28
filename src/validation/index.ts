import * as Yup from "yup";

export const LoginValidation = Yup.object().shape({
    userName: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
});