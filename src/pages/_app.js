import "@/styles/globals.css";
import {CssBaseline, ThemeProvider} from '@mui/material';
import {store} from "../../redux/Store";
import theme from '../theme';
import { Provider } from "react-redux";


export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}
