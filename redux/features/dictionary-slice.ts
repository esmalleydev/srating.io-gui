import { Conference, Division, Organization } from '@/types/cbb';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// todo upate for new dictionary values
type InitialState = {
  conference: Conference[],
  organization: Organization[],
  division: Division[],
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
