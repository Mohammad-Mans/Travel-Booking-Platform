import * as Yup from "yup";

export const LoginValidation = Yup.object().shape({
  userName: Yup.string().required("User Name is required"),
  password: Yup.string().required("Password is required"),
});

export const CheckoutValidation = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),

  cardNumber: Yup.string().when("paymentMethod", ([paymentMethod], schema) => {
    return paymentMethod === "creditCard"
      ? schema
          .required("Card Number is required ")
          .matches(/^\d{4} \d{4} \d{4} \d{4}$/, "Invalid card number format")
      : schema.notRequired();
  }),

  cvc: Yup.string().when("paymentMethod", ([paymentMethod], schema) => {
    return paymentMethod === "creditCard"
      ? schema.required("CVC is required")
      : schema.notRequired();
  }),

  expirationDate: Yup.string().when(
    "paymentMethod",
    ([paymentMethod], schema) => {
      return paymentMethod === "creditCard"
        ? schema
            .matches(/^\d{2}\/\d{2}$/, "Invalid expiration date format")
            .required("Expiry Date is required")
        : schema.notRequired();
    }
  ),
});
