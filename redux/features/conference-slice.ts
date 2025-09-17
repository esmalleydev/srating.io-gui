import Objector from '@/components/utils/Objector';
import { StatisticRankings as StatsCBB } from '@/types/cbb';
import { StatisticRankings as StatsCFB } from '@/types/cfb';
import { Elos, Teams, TeamSeasonConferences } from '@/types/general';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  view: string,
  subview: string | null,
  scrollTop: number,
  // conference_id: string | null,
  team_season_conferences: TeamSeasonConferences | object;
  teams: Teams | object;
  statistic_rankings: StatsCBB | StatsCFB;
  elos: Elos | object;
  predictions: object,
  predictionsLoading: boolean,
  loadingView: boolean,
};

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};

const initialState = {
  view: 'standings',
  subview: null,
  scrollTop: 0,
  // conference_id: null,
  team_season_conferences: {},
  teams: {},
  statistic_rankings: {},
  elos: {},
  predictions: {},
  predictionsLoading: true,
  loadingView: false,
} as InitialState;

const defaultState = Object.freeze(Objector.deepClone(initialState));

const updateStateFromUrlParams = (state: InitialState) => {
  if (typeof window === 'undefined') {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');
  const subview = urlParams.get('subview');

  // we only want to run this if on first load, if the pathname is relevant
  if (!window.location.pathname.includes('conference')) {
    return;
  }

  // Update state if URL parameters are present
  if (view !== null) {
    state.view = view;
  }
  if (subview !== null) {
    state.subview = subview;
  }
};

export const conference = createSlice({
  name: 'conference',
  initialState,
  reducers: {
    setDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      state[action.payload.key] = action.payload.value;
    },
    clear: (state) => {
      for (const key in defaultState) {
        state[key] = defaultState[key];
      }
    },
    reset: (state) => {
      for (const key in defaultState) {
        // we do not have to reset this one, it is controlled by the contents changing
        if (key !== 'loadingView') {
          state[key] = defaultState[key];
        }
      }

      updateStateFromUrlParams(state);
    },
  },
});

export const {
  setDataKey,
  clear,
  reset,
} = conference.actions;
export default conference.reducer;

updateStateFromUrlParams(initialState);
