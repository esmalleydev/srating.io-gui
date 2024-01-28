import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import HelperCBB from '@/components/helpers/CBB';

const rankLocalStorageKey = 'CBB.DISPLAY.RANK';
const picksSortLocalStorageKey = 'CBB.DISPLAY.PICKS.SORT';
const conferencesLocalStorageKey = 'CBB.DISPLAY.CONFERENCES';
const positionsLocalStorageKey = 'CBB.DISPLAY.POSITIONS';
const statusesLocalStorageKey = 'CBB.DISPLAY.STATUSES';
const cardsViewLocalStorageKey = 'CBB.DISPLAY.GAMES.CARDSVIEW';

let rankLocalStorage: string | null = null;
let picksSortLocalStorage: string | null = null;
let conferencesLocalStorage: string | null = null;
let positionsLocalStorage: string | null = null;
let statusesLocalStorage: string | null = null;
let cardsViewLocalStorage: string | null = null;

if (typeof window !== 'undefined') {
  rankLocalStorage = localStorage.getItem(rankLocalStorageKey);
  picksSortLocalStorage = localStorage.getItem(picksSortLocalStorageKey);
  conferencesLocalStorage = localStorage.getItem(conferencesLocalStorageKey);
  positionsLocalStorage = localStorage.getItem(positionsLocalStorageKey);
  statusesLocalStorage = localStorage.getItem(statusesLocalStorageKey);
  cardsViewLocalStorage = localStorage.getItem(cardsViewLocalStorageKey);
}

type InitialState = {
  value: {
    rank: string,
    picksSort: string,
    conferences: string[],
    positions: string[],
    statuses: string[],
    cardsView: string,
    // season: number,
  };
};

const initialState = {
  value: {
    rank: rankLocalStorage || 'composite_rank',
    picksSort: picksSortLocalStorage || 'start_time',
    conferences: (conferencesLocalStorage && JSON.parse(conferencesLocalStorage)) || [],
    positions: (positionsLocalStorage && JSON.parse(positionsLocalStorage)) || [],
    statuses: (statusesLocalStorage && JSON.parse(statusesLocalStorage)) || ['pre', 'live', 'final'],
    cardsView: cardsViewLocalStorage || 'compact',
    // season: new HelperCBB().getCurrentSeason(),
  },
} as InitialState;

export const display = createSlice({
  name: 'display',
  initialState: initialState,
  reducers: {
    // setSeason: (state, action: PayloadAction<number>) => {
    //   state.value.season = action.payload;
    // },
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
    updatePositions: (state, action: PayloadAction<string>) => {
      const index = state.value.positions.indexOf(action.payload);
      if (index !== -1) {
        state.value.positions = [
          ...state.value.positions.slice(0, index),
          ...state.value.positions.slice(index + 1)
        ];
      } else {
        state.value.positions = [...state.value.positions, action.payload];
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(positionsLocalStorageKey, JSON.stringify(state.value.positions));
      }
    },
    clearPositions: (state) => {
      state.value.positions = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem(positionsLocalStorageKey);
      }
    },
    updateStatuses: (state, action: PayloadAction<string>) => {
      const index = state.value.statuses.indexOf(action.payload);
      if (index !== -1) {
        state.value.statuses = [
          ...state.value.statuses.slice(0, index),
          ...state.value.statuses.slice(index + 1)
        ];
      } else {
        state.value.statuses = [...state.value.statuses, action.payload];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(statusesLocalStorageKey, JSON.stringify(state.value.statuses));
      }
    },
    setCardView: (state, action: PayloadAction<string>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(cardsViewLocalStorageKey, action.payload);
      }
      state.value.cardsView = action.payload;
    },
  }
});

export const { /*setSeason,*/ setRank, setPicksSort, updateConferences, updatePositions, clearPositions, updateStatuses, setCardView } = display.actions;
export default display.reducer;
