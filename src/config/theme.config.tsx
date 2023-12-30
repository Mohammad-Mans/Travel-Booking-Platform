import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import type {} from '@mui/lab/themeAugmentation';

type ThemeProp = {
  children: JSX.Element;
};

enum themePalette {
  MintGreen = "#66cdaa",
  White = "#fff",
  Black = "#000",
  Gray = "#808080",
}

const theme = createTheme({
  palette: {
    primary: {
      main: themePalette.MintGreen,
      contrastText: themePalette.White,
    },
    secondary: {
      main: themePalette.Gray,
    },
    white:{
        main: themePalette.White
    },
    black:{
        main: themePalette.Black
    }
  },
});

const ThemeConfig: React.FC<ThemeProp> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeConfig;
