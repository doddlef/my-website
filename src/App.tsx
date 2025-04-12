import {BrowserRouter} from "react-router";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {SnackbarProvider} from "notistack";
import MainLayout from "./main/MainLayout.tsx";
import {AuthProvider} from "./_component/accountProvider/AuthProvider.tsx";
import UploadApiProvider from "./main/driver_v2/_middleware/uploadApi2/UploadApiProvider.tsx";
import FileCacheProvider from "./main/driver_v2/_middleware/fileCache/FileCacheProvider.tsx";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

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
            <FileCacheProvider>
              <UploadApiProvider>
                <DndProvider backend={HTML5Backend}>
                  <BrowserRouter>
                    <MainLayout />
                  </BrowserRouter>
                </DndProvider>
              </UploadApiProvider>
            </FileCacheProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
  )
}

export default App