// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Palette, PaletteOptions } from "@mui/material/styles";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TextFieldPropsColorOverrides } from "@mui/material/TextField";

declare module "@mui/material/styles" {
  interface Palette {
    white: Palette["primary"];
    black: Palette["primary"];

  }

  interface PaletteOptions {
    white?: PaletteOptions["primary"];
    black?: PaletteOptions["primary"];
  }
}

declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    white: true;
  }
}
