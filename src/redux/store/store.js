import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "../slice/auth/authSlice";
import distributorReducer from "../slice/distributor/distributorSlice";
import dealerReducer from "../slice/dealer/dealerSlice";
import technicianReducer from "../slice/technician/technicianSlice";
import productReducer from "../slice/product/productSlice";
import bannerReducer from "../slice/banner/bannerSlice";

const appReducer = combineReducers({
  auth: authReducer,
  distributor: distributorReducer,
  dealer:dealerReducer,
  technician:technicianReducer,
  product:productReducer,
  banner: bannerReducer
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    const { auth } = state;
    return appReducer({ auth }, action);
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);