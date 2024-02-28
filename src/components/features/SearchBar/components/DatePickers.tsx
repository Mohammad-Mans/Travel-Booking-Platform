import { Divider } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface DatePickersProps  {
  checkIn: Dayjs | null;
  setCheckIn: (date: Dayjs | null) => void;
  checkOut: Dayjs | null;
  setCheckOut: (date: Dayjs | null) => void;
};

const DatePickers: React.FC<DatePickersProps> = ({
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
}) => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Check in"
          format="DD-MM-YYYY"
          value={checkIn}
          minDate={dayjs(new Date())}
          onChange={(newValue) => {
            Number(newValue!.format("YYYYMMDD")) >
            Number(checkOut!.format("YYYYMMDD"))
              ? setCheckOut(newValue!.add(1, "day"))
              : null;
            setCheckIn(newValue);
          }}
          showDaysOutsideCurrentMonth
          sx={{ width: "100%" }}
        />
      </LocalizationProvider>

      <Divider
        orientation="vertical"
        flexItem
        aria-hidden="true"
        sx={{ mx: 2 }}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Check out"
          format="DD-MM-YYYY"
          value={checkOut}
          minDate={checkIn}
          onChange={(newValue) => {
            setCheckOut(newValue);
          }}
          showDaysOutsideCurrentMonth
          sx={{ width: "100%" }}
        />
      </LocalizationProvider>
    </>
  );
};

export default DatePickers;
