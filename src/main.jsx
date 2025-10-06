import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store/store.js";
import "antd/dist/reset.css";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./component/commonComponent/ThemeProvider.jsx";
import { ToastContainer } from 'react-toastify';
import { setAxiosStore } from "./redux/axiosconfig.js";

setAxiosStore(store)

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PersistGate>
    <ToastContainer />
  </Provider>
);
