import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createTheme } from '@mui/material/styles';

const localStorageKey = 'theme';

const darkTheme = createTheme({
  'palette': {
    'mode': 'dark',
  },
});

const lightTheme = createTheme({
  'palette': {
    'mode': 'light',
    'background': {
      'default': "#efefef"
    },
  },
});

type InitialState = {
  value: {
    mode: string,
    theme: object,
  };
};

const initalMode = (typeof window !== 'undefined' && localStorage.getItem(localStorageKey)) || 'dark';

const initialState = {
  value: {
    mode: initalMode,
    theme: (initalMode == 'dark' ? darkTheme: lightTheme)
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
      return {
        value: {
          mode: action.payload,
          theme: (action.payload === 'dark' ? darkTheme: lightTheme),
        }
      };
    }
  }
});

export const { updateTheme } = theme.actions;
export default theme.reducer;
