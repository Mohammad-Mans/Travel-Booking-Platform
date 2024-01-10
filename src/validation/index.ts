import * as Yup from "yup";

export const LoginValidation = Yup.object().shape({
    userName: Yup.string().required("User Name is required"),
    password: Yup.string().required("Password is required"),
});