import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import userReducer from './sclices/userDetailsSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { videoListSlice } from './sclices/videoListSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const reducers = combineReducers({
  user: userReducer,
  videos: videoListSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const isDevEnv = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: false,
    });

    if (isDevEnv) {
      middlewares.push(logger);
    }

    return middlewares;
  },
});

// Infer the `RootState` and `AppDispatch` types
export const RootState = store.getState;
export const AppDispatch = store.dispatch;
