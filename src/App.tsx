import {BrowserRouter} from "react-router";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {SnackbarProvider} from "notistack";
import MainLayout from "./main/MainLayout.tsx";
import {AuthProvider} from "./_component/accountProvider/AuthProvider.tsx";

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
      'Roboto',
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
          <AuthProvider autoLogin={true}>
            <BrowserRouter>
              <MainLayout />
            </BrowserRouter>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
  )
}

export default App