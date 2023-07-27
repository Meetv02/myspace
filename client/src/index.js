import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import authReducer from "./state/index";
import { Provider } from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from 'redux-persist/integration/react';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

const persistConfig = { key:"root",storage, version:1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware : (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck : {
        ignoreActions : [FLUSH, REHYDRATE, PAUSE, PURGE, REGISTER],
      },
    }),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);


