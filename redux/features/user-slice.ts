import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  session_id: string | null,
  secret_id: string | null,
  innerTag: string | null,
  isValidSession: boolean,
  loadingSecret: boolean,
};

const initialState = {
  session_id: (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null,
  secret_id: null,
  innerTag: null,
  isValidSession: false,
  loadingSecret: false,
} as InitialState;

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<string|null>) => {
      state.session_id = action.payload;
    },
    setInnerTag: (state, action: PayloadAction<string|null>) => {
      state.innerTag = action.payload;
    },
    setValidSession: (state, action: PayloadAction<boolean>) => {
      state.isValidSession = action.payload;
    },
    setSecret: (state, action: PayloadAction<string|null>) => {
      if (typeof window !== 'undefined') {
        if (action.payload) {
          sessionStorage.setItem('secret', action.payload);
        } else {
          sessionStorage.removeItem('secret');
        }
      }
      state.secret_id = action.payload;
    },
    setLoadingSecret: (state, action: PayloadAction<boolean>) => {
      state.loadingSecret = action.payload;
    },
  },
});

export const { setSession, setValidSession, setSecret, setLoadingSecret, setInnerTag } = user.actions;
export default user.reducer;
