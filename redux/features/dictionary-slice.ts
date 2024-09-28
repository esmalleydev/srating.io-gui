import { Conferences, Divisions, Organizations } from '@/types/general';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  conference: Conferences,
  organization: Organizations,
  division: Divisions,
};

const initialState = {
  conference: {},
} as InitialState;

export const dictionary = createSlice({
  name: 'dictionary',
  initialState,
  reducers: {
    load: (state, action: PayloadAction<object>) => {
      const data = action.payload;
      for (const table in data) {
        state[table] = data[table];
      }
    },
  },
});

export const { load } = dictionary.actions;
export default dictionary.reducer;
