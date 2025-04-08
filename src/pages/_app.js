import "@/styles/globals.css";
import "@/styles/search-overrides.css";
import {CssBaseline, ThemeProvider} from '@mui/material';
import {store} from "../../redux/Store";
import theme from '../theme';
import { Provider } from "react-redux";
import "@elastic/react-search-ui-views/lib/styles/styles.css"



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
