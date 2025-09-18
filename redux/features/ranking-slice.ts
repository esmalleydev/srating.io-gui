import Objector from '@/components/utils/Objector';
import { RankingTable as CBBRankingTable } from '@/types/cbb';
import { RankingTable as CFBRankingTable } from '@/types/cfb';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  order: string,
  orderBy: string,
  hideCommitted: boolean,
  hideUnderTwoMPG: boolean,
  filterCommittedConf: boolean,
  filterOriginalConf: boolean,
  tableScrollTop: number,
  tableFullscreen: boolean,
  lastUpdated: string | null,
  columnView: string,
  customColumns: Array<string>,
  data: object | null,
  filteredRows: CBBRankingTable[] | CFBRankingTable[] | null | boolean,
  searchValue: string,
};

type InitialStateKeys = keyof InitialState;

type ActionPayload<K extends InitialStateKeys> = {
  key: K;
  value: InitialState[K];
};

const urlParamType_x_keys = {
  string: [
    'order',
    'orderBy',
    'columnView',
  ],
  array: [
    'customColumns',
  ],
  boolean: [
    'hideCommitted',
    'hideUnderTwoMPG',
    'filterCommittedConf',
    'filterOriginalConf',
  ],
};

const initialState = {
  order: 'asc',
  orderBy: 'rank',
  hideCommitted: false,
  hideUnderTwoMPG: false,
  filterCommittedConf: true,
  filterOriginalConf: true,
  tableScrollTop: 0,
  tableFullscreen: false,
  lastUpdated: null,
  columnView: 'composite',
  customColumns: ['rank', 'name'],
  data: null,
  filteredRows: null,
  searchValue: '',
} as InitialState;

const defaultState = Object.freeze(Objector.deepClone(initialState));

const updateStateFromUrlParams = (state: InitialState) => {
  if (typeof window === 'undefined') {
    return;
  }

  // we only want to run this if on first load, if the pathname is relevant
  if (!window.location.pathname.includes('ranking')) {
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);

  for (const type in urlParamType_x_keys) {
    for (let i = 0; i < urlParamType_x_keys[type].length; i++) {
      const key = urlParamType_x_keys[type][i];
      if (type === 'string') {
        const value = urlParams.get(key);
        if (value !== null) {
          state[key] = value;
        }
      }
      if (type === 'boolean') {
        const value = urlParams.get(key);
        if (value !== null) {
          state[key] = (+value === 1);
        }
      }
      if (type === 'array') {
        const value = urlParams.getAll(key);
        if (value !== null) {
          state[key] = [...new Set([...initialState[key], ...value])];
        }
      }
    }
  }
};

const updateURL = (key, value) => {
  let key_is_url_param = false;

  // eslint-disable-next-line no-restricted-syntax, no-labels
  outer: for (const t in urlParamType_x_keys) {
    for (let i = 0; i < urlParamType_x_keys[t].length; i++) {
      const k = urlParamType_x_keys[t][i];

      if (key === k) {
        key_is_url_param = true;
        // eslint-disable-next-line no-labels
        break outer;
      }
    }
  }

  if (key_is_url_param) {
    // Order here is kinda important, set url before the state
    const current = new URLSearchParams(window.location.search);
    if (value !== null) {
      current.delete(key);
      if (typeof value === 'object') {
        for (let i = 0; i < value.length; i++) {
          current.append(key, value[i]);
        }
      } else {
        current.set(key, value.toString());
      }
    } else {
      current.delete(key);
    }

    window.history.replaceState(null, '', `?${current.toString()}`);

    // use pushState if we want to add to back button history
    // window.history.pushState(null, '', `?${current.toString()}`);
  }
};

export const ranking = createSlice({
  name: 'ranking',
  initialState,
  reducers: {
    reset: (state) => {
      for (const key in defaultState) {
        // we do not have to reset this one, it is controlled by the contents changing
        if (key !== 'loadingView') {
          updateURL(key, defaultState[key]);
          state[key] = defaultState[key];
        }
      }

      updateStateFromUrlParams(state);
    },
    resetDataKey: (state: InitialState, action: PayloadAction<InitialStateKeys>) => {
      const keyToReset = action.payload as string;
      updateURL(keyToReset, defaultState[keyToReset]);
      state[keyToReset] = defaultState[keyToReset];
    },
    setDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      const { value, key } = action.payload;
      updateURL(key, value);
      state[key] = value;
    },
  },
});

export const {
  reset,
  setDataKey,
  resetDataKey,
} = ranking.actions;
export default ranking.reducer;

updateStateFromUrlParams(initialState);
