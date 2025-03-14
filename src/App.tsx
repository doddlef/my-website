import {BrowserRouter} from "react-router";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {SnackbarProvider} from "notistack";
import MainLayout from "./main/MainLayout.tsx";
import {AccountProvider} from "./_component/accountProvider/AccountProvider.tsx";

const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          default: "#141A21",
          paper: "rgba(20,26,33)",
        }
      }
    },
  },
  palette: {
    background: {
      paper: "rgb(255,255,255)"
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Sour gummy',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

function App() {

  return (
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={4}>
          <AccountProvider autoLogin={false}>
            <BrowserRouter>
              <MainLayout />
            </BrowserRouter>
          </AccountProvider>
        </SnackbarProvider>
      </ThemeProvider>
  )
}

export default App