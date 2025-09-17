import Objector from '@/components/utils/Objector';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const localStorageKey = 'theme';

type InitialState = {
  mode: string,
};

const getInitialMode = () => {
  if (typeof window !== 'undefined' && localStorage.getItem(localStorageKey)) {
    return localStorage.getItem(localStorageKey);
  }

  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  return 'dark';
};

const initalMode = getInitialMode();

const initialState = {
  mode: initalMode,
} as InitialState;

const defaultState = Object.freeze(Objector.deepClone(initialState));

export const theme = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<string>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(localStorageKey, action.payload);
      }
      state.mode = action.payload;
    },
  },
});

export const { updateTheme } = theme.actions;
export default theme.reducer;
