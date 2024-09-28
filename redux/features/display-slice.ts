import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const rankLocalStorageKey = 'DISPLAY.RANK';
const picksSortLocalStorageKey = 'DISPLAY.PICKS.SORT';
const conferencesLocalStorageKey = 'DISPLAY.CONFERENCE_IDS';
const positionsLocalStorageKey = 'DISPLAY.POSITIONS';
const statusesLocalStorageKey = 'DISPLAY.STATUSES';
const cardsViewLocalStorageKey = 'DISPLAY.GAMES.CARDSVIEW';

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
  rank: string,
  picksSort: string,
  conferences: string[],
  positions: string[],
  statuses: string[],
  cardsView: string,
  loading: boolean,
  // season: number,
};

const initialState = {
  rank: rankLocalStorage || 'rank',
  picksSort: picksSortLocalStorage || 'start_time',
  conferences: (conferencesLocalStorage && JSON.parse(conferencesLocalStorage)) || [],
  positions: (positionsLocalStorage && JSON.parse(positionsLocalStorage)) || [],
  statuses: (statusesLocalStorage && JSON.parse(statusesLocalStorage)) || ['pre', 'live', 'final'],
  cardsView: cardsViewLocalStorage || 'compact',
  loading: false,
  // season: new HelperCBB().getCurrentSeason(),
} as InitialState;

export const display = createSlice({
  name: 'display',
  initialState,
  reducers: {
    clearLocalStorage: (state) => {
      localStorage.removeItem(rankLocalStorageKey);
      localStorage.removeItem(conferencesLocalStorageKey);
      localStorage.removeItem(positionsLocalStorageKey);
      rankLocalStorage = null;
      conferencesLocalStorage = null;
      positionsLocalStorage = null;

      ['rank', 'positions', 'conferences'].forEach((value) => {
        state[value] = initialState[value];
      });
    },

    setRank: (state, action: PayloadAction<string>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(rankLocalStorageKey, action.payload);
      }
      state.rank = action.payload;
    },
    setPicksSort: (state, action: PayloadAction<string>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(picksSortLocalStorageKey, action.payload);
      }
      state.picksSort = action.payload;
    },
    updateConferences: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        const index = state.conferences.indexOf(action.payload);
        if (index !== -1) {
          state.conferences = [
            ...state.conferences.slice(0, index),
            ...state.conferences.slice(index + 1),
          ];
        } else {
          state.conferences = [...state.conferences, action.payload];
        }
      } else {
        state.conferences = [];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(conferencesLocalStorageKey, JSON.stringify(state.conferences));
      }
    },
    updatePositions: (state, action: PayloadAction<string>) => {
      const index = state.positions.indexOf(action.payload);
      if (index !== -1) {
        state.positions = [
          ...state.positions.slice(0, index),
          ...state.positions.slice(index + 1),
        ];
      } else {
        state.positions = [...state.positions, action.payload];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(positionsLocalStorageKey, JSON.stringify(state.positions));
      }
    },
    clearPositions: (state) => {
      state.positions = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem(positionsLocalStorageKey);
      }
    },
    updateStatuses: (state, action: PayloadAction<string>) => {
      const index = state.statuses.indexOf(action.payload);
      if (index !== -1) {
        state.statuses = [
          ...state.statuses.slice(0, index),
          ...state.statuses.slice(index + 1),
        ];
      } else {
        state.statuses = [...state.statuses, action.payload];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(statusesLocalStorageKey, JSON.stringify(state.statuses));
      }
    },
    setCardView: (state, action: PayloadAction<string>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(cardsViewLocalStorageKey, action.payload);
      }
      state.cardsView = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  clearLocalStorage, setRank, setPicksSort, updateConferences, updatePositions, clearPositions, updateStatuses, setCardView, setLoading,
} = display.actions;
export default display.reducer;
