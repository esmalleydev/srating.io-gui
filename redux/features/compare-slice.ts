import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  home_team_id: string | null,
  away_team_id: string | null,
  next_search: string | null,
  neutral_site: boolean,
  view: string,
  subview: string | null,
  scrollTop: number,
  hideLowerBench: boolean,
  topPlayersOnly: boolean,
  predictions: object,
  predictionsLoading: boolean,
};

const initialState = {
  home_team_id: null,
  away_team_id: null,
  next_search: null,
  neutral_site: false,
  view: 'team',
  subview: null,
  scrollTop: 0,
  hideLowerBench: true,
  topPlayersOnly: false,
  predictions: {},
  predictionsLoading: true,
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
    clear: (state) => {
      for (const key in initialState) {
        state[key] = initialState[key];
      }
    },
    reset: (state) => {
      updateStateFromUrlParams(state);
    },
    setNextSearch: (state, action: PayloadAction<string>) => {
      state.next_search = action.payload;
    },
    setPredictions: (state, action: PayloadAction<object>) => {
      state.predictions = action.payload;
    },
    setPredictionsLoading: (state, action: PayloadAction<boolean>) => {
      state.predictionsLoading = action.payload;
    },
    setTopPlayersOnly: (state, action: PayloadAction<boolean>) => {
      state.topPlayersOnly = action.payload;
    },
    setHideLowerBench: (state, action: PayloadAction<boolean>) => {
      state.hideLowerBench = action.payload;
    },
    setScrollTop: (state, action: PayloadAction<number>) => {
      state.scrollTop = action.payload;
    },
    setSubView: (state, action: PayloadAction<string | null>) => {
      state.subview = action.payload;
    },
    setView: (state, action: PayloadAction<string>) => {
      state.view = action.payload;
    },
    setNeutralSite: (state, action: PayloadAction<boolean>) => {
      state.neutral_site = action.payload;
    },
    setHomeTeamID: (state, action: PayloadAction<string|null>) => {
      state.home_team_id = action.payload;
    },
    setAwayTeamID: (state, action: PayloadAction<string|null>) => {
      state.away_team_id = action.payload;
    },
  },
});

export const {
  setHomeTeamID, setAwayTeamID, setNeutralSite, setView, setSubView, setScrollTop, setHideLowerBench, setTopPlayersOnly, setPredictions, setPredictionsLoading, setNextSearch, clear, reset,
} = compare.actions;
export default compare.reducer;

updateStateFromUrlParams(initialState);
