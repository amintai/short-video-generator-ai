import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import userReducer from './sclices/counterSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger);
  },
});

// Infer the `RootState` and `AppDispatch` types
export const RootState = store.getState;
export const AppDispatch = store.dispatch;