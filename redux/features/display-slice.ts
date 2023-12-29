import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const rankLocalStorageKey = 'CBB.DISPLAY.RANK';
const picksSortLocalStorageKey = 'CBB.DISPLAY.PICKS.SORT';
const conferencesLocalStorageKey = 'CBB.DISPLAY.CONFERENCES';

let rankLocalStorage: string | null = null;
let picksSortLocalStorage: string | null = null;
let conferencesLocalStorage: string | null = null;

if (typeof window !== 'undefined') {
  rankLocalStorage = localStorage.getItem(rankLocalStorageKey);
  picksSortLocalStorage = localStorage.getItem(picksSortLocalStorageKey);
  conferencesLocalStorage = localStorage.getItem(conferencesLocalStorageKey);
}

type InitialState = {
  value: {
    rank: string,
    picksSort: string,
    conferences: string[],
  };
};

const initialState = {
  value: {
    rank: rankLocalStorage || 'composite_rank',
    picksSort: picksSortLocalStorage || 'start_time',
    conferences: (conferencesLocalStorage && JSON.parse(conferencesLocalStorage)) || [],
  },
} as InitialState;

export const display = createSlice({
  name: 'display',
  initialState: initialState,
  reducers: {
    setRank: (state, action: PayloadAction<string>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(rankLocalStorageKey, action.payload);
      }
      state.value.rank = action.payload;
    },
    setPicksSort: (state, action: PayloadAction<string>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(picksSortLocalStorageKey, action.payload);
      }
      state.value.picksSort = action.payload;
    },
    updateConferences: (state, action: PayloadAction<string>) => {
      const index = state.value.conferences.indexOf(action.payload);
      if (index !== -1) {
        state.value.conferences = [
          ...state.value.conferences.slice(0, index),
          ...state.value.conferences.slice(index + 1)
        ];
      } else {
        state.value.conferences = [...state.value.conferences, action.payload];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(conferencesLocalStorageKey, JSON.stringify(state.value.conferences));
      }
    },
  }
});

export const { setRank, setPicksSort, updateConferences } = display.actions;
export default display.reducer;
