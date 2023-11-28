import { configureStore } from '@reduxjs/toolkit';

import themeReducer from './features/theme-slice';
import userReducer from './features/user-slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      themeReducer,
      userReducer,
    }
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
