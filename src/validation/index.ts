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

export const CityFormValidation = Yup.object().shape({
  name: Yup.string().required("City Name is required"),
  description: Yup.string().required("City Description is required"),
});

const HotelBaseSchema = Yup.object().shape({
  name: Yup.string().required("Hotel Name is required"),
  description: Yup.string().required("Hotel Description is required"),
  hotelType: Yup.string().required("Hotel Type is required"),
  starRating: Yup.string().required("Star Rating is required"),
  latitude: Yup.string().required("Latitude is required"),
  longitude: Yup.string().required("Longitude is required"),
});

export const HotelUpdateFormValidation = HotelBaseSchema;

export const HotelCreationFormValidation = HotelBaseSchema.shape({
  cityId: Yup.string().required("City Name is required"),
});

const RoomBaseSchema = Yup.object().shape({
  roomNumber: Yup.string().required("Room Number is required"),
  cost: Yup.string().required("Cost is required"),
});

export const RoomUpdateFormValidation = RoomBaseSchema;

export const RoomCreationFormValidation = RoomBaseSchema.shape({
  hotelId: Yup.string().required("Hotel Name is required"),
});
