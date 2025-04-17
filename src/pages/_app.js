import "@/styles/globals.css";
import "@/styles/search-overrides.css";
import {CssBaseline, ThemeProvider} from '@mui/material';
import { PersistGate } from "redux-persist/integration/react";
// import {} from "../../redux/Store";
import theme from '../theme';
import { Provider } from "react-redux";
import "@elastic/react-search-ui-views/lib/styles/styles.css"
import store, { persistor } from "../../redux/Store";



export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}
