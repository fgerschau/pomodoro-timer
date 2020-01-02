import { createMuiTheme } from "@material-ui/core";
import { red } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ff6256',
      main: '#cc2c2c',
      dark: '#930003',
    },
    secondary: {
      light: '#4b91be',
      main: '#00648e',
      dark: '#003a60',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#EBEBEB',
    },
  },
});

export default theme;
