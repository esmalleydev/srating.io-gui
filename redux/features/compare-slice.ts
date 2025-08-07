import { Teams } from '@/types/general';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  teams: Teams,
  home_team_id: string | null,
  away_team_id: string | null,
  next_search: string | null,
  neutral_site: boolean,
  view: string | null,
  subview: string | null,
  season: number,
  scrollTop: number,
  hideLowerBench: boolean,
  topPlayersOnly: boolean,
  predictions: object,
  predictionsLoading: boolean,
  loadingView: boolean,
  trendsColumn: string | null,
};

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};


const initialState = {
  teams: {},
  home_team_id: null,
  away_team_id: null,
  next_search: null,
  neutral_site: false,
  view: 'team',
  subview: null,
  season: 0,
  scrollTop: 0,
  hideLowerBench: true,
  topPlayersOnly: false,
  predictions: {},
  predictionsLoading: true,
  loadingView: true,
  trendsColumn: null,
} as InitialState;

const updateStateFromUrlParams = (state: InitialState) => {
  if (typeof window === 'undefined') {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const home_team_id = urlParams.get('home_team_id');
  const away_team_id = urlParams.get('away_team_id');
  const neutral_site = urlParams.get('neutral');
  const view = urlParams.get('view');
  const subview = urlParams.get('subview');

  // we only want to run this if on first load, if the pathname is relevant
  if (!window.location.pathname.includes('compare')) {
    return;
  }

  // Update state if URL parameters are present
  if (home_team_id !== null) {
    state.home_team_id = home_team_id;
  }
  if (away_team_id !== null) {
    state.away_team_id = away_team_id;
  }
  if (neutral_site !== null) {
    state.neutral_site = (+neutral_site === 1);
  }
  if (view !== null) {
    state.view = view;
  }
  if (subview !== null) {
    state.subview = subview;
  }
};

export const compare = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    setDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      state[action.payload.key] = action.payload.value;
    },
    reset: (state) => {
      for (const key in initialState) {
        // we do not have to reset this one, it is controlled by the contents changing
        if (key !== 'loadingView') {
          state[key] = initialState[key];
        }
      }

      updateStateFromUrlParams(state);
    },
  },
});

export const {
  setDataKey,
  reset,
} = compare.actions;
export default compare.reducer;

updateStateFromUrlParams(initialState);
