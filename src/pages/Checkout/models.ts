interface SubmitProps {
  firstName: string;
  lastName: string;
  email: string;
  paymentMethod: string;
  cardNumber: string;
  expirationDate: string;
  cvc: string;
  specialRequists: string;
}
interface BookingData {
  customerName: string;
  hotelName: string | undefined;
  roomNumber: string | undefined;
  roomType: string | undefined;
  bookingDateTime: string;
  totalCost: number | undefined;
  paymentMethod: string;
}
