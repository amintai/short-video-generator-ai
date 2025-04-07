import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import userReducer from './sclices/counterSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist';


const persistConfig = {
  key: 'root',
  storage
};

const reducers = combineReducers({
    user: userReducer,
 });

const persistedReducer = persistReducer(persistConfig, reducers);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger);
  },
});

// Infer the `RootState` and `AppDispatch` types
export const RootState = store.getState;
export const AppDispatch = store.dispatch;