import Objector from '@/components/utils/Objector';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  session_id: string | null,
  secret_id: string | null,
  kryptos: string | null,
  innerTag: string | null,
  isValidSession: boolean,
  loadingSecret: boolean,
  newUpdate: boolean,
};

const initialState = {
  session_id: (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null,
  secret_id: null,
  kryptos: null,
  innerTag: null,
  isValidSession: false,
  loadingSecret: false,
  newUpdate: false,
} as InitialState;

const defaultState = Object.freeze(Objector.deepClone(initialState));

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
    setKryptos: (state, action: PayloadAction<string|null>) => {
      if (typeof window !== 'undefined') {
        if (action.payload) {
          sessionStorage.setItem('kryptos', action.payload);
        } else {
          sessionStorage.removeItem('kryptos');
        }
      }
      state.kryptos = action.payload;
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
    setNewUpdate: (state, action: PayloadAction<boolean>) => {
      state.newUpdate = action.payload;
    },
  },
});

export const { setSession, setValidSession, setKryptos, setSecret, setLoadingSecret, setInnerTag, setNewUpdate } = user.actions;
export default user.reducer;
