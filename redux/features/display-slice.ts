
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Objector from '@/components/utils/Objector';

const rankLocalStorageKey = 'DISPLAY.RANK';
const picksSortLocalStorageKey = 'DISPLAY.PICKS.SORT';
const conferencesLocalStorageKey = 'DISPLAY.CONFERENCE_IDS';
const positionsLocalStorageKey = 'DISPLAY.POSITIONS';
const statusesLocalStorageKey = 'DISPLAY.STATUSES';
const cardsViewLocalStorageKey = 'DISPLAY.GAMES.CARDSVIEW';
const gamesFilterLocalStorageKey = 'DISPLAY.GAMES.FILTER';
const oddsLocalStorageKey = 'DISPLAY.ODDS';

let rankLocalStorage: string | null = null;
let picksSortLocalStorage: string | null = null;
let conferencesLocalStorage: string | null = null;
let positionsLocalStorage: string | null = null;
let statusesLocalStorage: string | null = null;
let cardsViewLocalStorage: string | null = null;
let gamesFilterLocalStorage: string | null = null;
let oddsLocalStorage: string | null = null;

if (typeof window !== 'undefined') {
  rankLocalStorage = localStorage.getItem(rankLocalStorageKey);
  picksSortLocalStorage = localStorage.getItem(picksSortLocalStorageKey);
  conferencesLocalStorage = localStorage.getItem(conferencesLocalStorageKey);
  positionsLocalStorage = localStorage.getItem(positionsLocalStorageKey);
  statusesLocalStorage = localStorage.getItem(statusesLocalStorageKey);
  cardsViewLocalStorage = localStorage.getItem(cardsViewLocalStorageKey);
  gamesFilterLocalStorage = localStorage.getItem(gamesFilterLocalStorageKey);
  oddsLocalStorage = localStorage.getItem(oddsLocalStorageKey);
}

type InitialState = {
  rank: string,
  picksSort: string,
  conferences: string[],
  positions: string[],
  statuses: string[],
  cardsView: string,
  gamesFilter: string,
  hideOdds: number, // 0 or 1
  loading: boolean,
  // season: number,
};

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K] | null;
};

const key_x_local_storage_key = {
  rank: rankLocalStorageKey,
  picksSort: picksSortLocalStorageKey,
  conferences: conferencesLocalStorageKey,
  positions: positionsLocalStorageKey,
  statuses: statusesLocalStorageKey,
  cardsView: cardsViewLocalStorageKey,
  gamesFilter: gamesFilterLocalStorageKey,
  hideOdds: oddsLocalStorageKey,
};

const defaultState: InitialState = Object.freeze({
  rank: 'rank',
  picksSort: 'start_time',
  conferences: [],
  positions: [],
  statuses: ['pre', 'live', 'final'],
  cardsView: 'compact',
  gamesFilter: 'all',
  hideOdds: 0,
  loading: false,
});

const initialState = {
  rank: rankLocalStorage || 'rank',
  picksSort: picksSortLocalStorage || 'start_time',
  conferences: (conferencesLocalStorage && JSON.parse(conferencesLocalStorage)) || [],
  positions: (positionsLocalStorage && JSON.parse(positionsLocalStorage)) || [],
  statuses: (statusesLocalStorage && JSON.parse(statusesLocalStorage)) || ['pre', 'live', 'final'],
  cardsView: cardsViewLocalStorage || 'compact',
  gamesFilter: gamesFilterLocalStorage || 'all',
  hideOdds: +(oddsLocalStorage || 0),
  loading: false,
  // season: new HelperCBB().getCurrentSeason(),
} as InitialState;

const updateStateFromUrlParams = (state: InitialState) => {
  if (typeof window === 'undefined') {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);

  const conferences = urlParams.getAll('conferences');
  const positions = urlParams.getAll('positions');


  if (conferences !== null && conferences.length) {
    state.conferences = conferences;
    setLocalStorage('conferences', conferences);
  }

  if (positions !== null && positions.length) {
    state.positions = positions;
    setLocalStorage('positions', positions);
  }
};

const setLocalStorage = (key, value) => {
  if (typeof window !== 'undefined' && key in key_x_local_storage_key) {
    let localStoreValue: string;
    if (typeof value === 'object' && value !== null) {
      localStoreValue = JSON.stringify(value);
    } else if (value === null) {
      localStorage.removeItem(key_x_local_storage_key[key]);
      return;
    } else {
      localStoreValue = String(value);
    }

    localStorage.setItem(key_x_local_storage_key[key], localStoreValue);
  }
};


export const display = createSlice({
  name: 'display',
  initialState,
  reducers: {
    setDataKey: <K extends keyof InitialState & keyof typeof key_x_local_storage_key>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      const { value, key } = action.payload;

      if (['conferences', 'positions', 'statuses'].includes(key)) {
        let strate = state[key] as string[];
        const v = value as string | string[];
        if (typeof v === 'object' && v !== null) {
          strate = Objector.deepClone(v);
        } else if (value !== null) {
          const index = strate.indexOf(v);
          if (index !== -1) {
            strate = [
              ...strate.slice(0, index),
              ...strate.slice(index + 1),
            ];
          } else {
            strate = [...strate, v];
          }
        } else {
          strate = [];
        }

        // Order here is kinda important, set url before the state
        const current = new URLSearchParams(window.location.search);
        if (strate !== null && strate.length) {
          current.delete(key);
          for (let i = 0; i < strate.length; i++) {
            current.append(key, strate[i]);
          }
        } else {
          current.delete(key);
        }

        window.history.replaceState(null, '', `?${current.toString()}`);

        // use pushState if we want to add to back button history
        // window.history.pushState(null, '', `?${current.toString()}`);

        state[key] = strate as InitialState[K];
      } else {
        // Can only pass null to one of the array ones
        if (value === null) {
          throw new Error('Can not pass null');
        }
        state[key] = value;
      }

      setLocalStorage(key, state[key]);
    },
    clear: (state) => {
      for (const key in defaultState) {
        state[key] = defaultState[key];
        setLocalStorage(key, state[key]);
      }
    },
    reset: (state) => {
      for (const key in defaultState) {
        // we do not have to reset this one, it is controlled by the contents changing
        if (key !== 'loadingView') {
          state[key] = defaultState[key];
          setLocalStorage(key, state[key]);
        }
      }

      updateStateFromUrlParams(state);
    },
    resetDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<K>) => {
      const key = action.payload;
      state[key] = defaultState[key];
      setLocalStorage(key, state[key]);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      // if you are wondering what sets this to false, check the handlers/MutationHandler
      state.loading = action.payload;
    },
  },
});

export const {
  setDataKey, setLoading, clear, reset, resetDataKey,
} = display.actions;
export default display.reducer;

updateStateFromUrlParams(initialState);
