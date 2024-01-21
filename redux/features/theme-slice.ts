import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const localStorageKey = 'theme';

type InitialState = {
  value: {
    mode: string,
  };
};

const initalMode = (typeof window !== 'undefined' && localStorage.getItem(localStorageKey)) || 'dark';

const initialState = {
  value: {
    mode: initalMode,
  },
} as InitialState;

export const theme = createSlice({
  name: 'theme',
  initialState: initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<string>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(localStorageKey, action.payload);
      }
      state.value.mode = action.payload;
    }
  }
});

export const { updateTheme } = theme.actions;
export default theme.reducer;
