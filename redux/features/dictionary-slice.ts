import { Conference } from "@/types/cbb";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type InitialState = {
  conference: Conference[],
};

const initialState = {
  conference: {},
} as InitialState;

export const dictionary = createSlice({
  name: 'dictionary',
  initialState: initialState,
  reducers: {
    load: (state, action: PayloadAction<Object>) => {
      const data = action.payload;
      for (let table in data) {
        state[table] = data[table];
      }
    },
  }
});

export const { load } = dictionary.actions;
export default dictionary.reducer;
