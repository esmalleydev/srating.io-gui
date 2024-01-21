import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type InitialState = {
  value: {
    session_id: string | null,
    secret_id: string | null,
    isValidSession: boolean,
  };
};

const initialState = {
  value: {
    session_id: (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null,
    secret_id: null,
    isValidSession: false,
  },
} as InitialState;

export const user = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setSession: (state, action: PayloadAction<string|null>) => {
      state.value.session_id = action.payload;
    },
    setValidSession: (state, action: PayloadAction<boolean>) => {
      state.value.isValidSession = action.payload;
    },
    setSecret: (state, action: PayloadAction<string|null>) => {
      if (typeof window !== 'undefined') {
        if (action.payload) {
          sessionStorage.setItem('secret', action.payload);
        } else {
          sessionStorage.removeItem('secret');
        }
      }
      state.value.secret_id = action.payload;
    },
  }
});

export const { setSession, setValidSession, setSecret } = user.actions;
export default user.reducer;
