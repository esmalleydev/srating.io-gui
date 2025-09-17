import { Coach, CoachTeamSeasons, Teams } from '@/types/general';
import { StatisticRankings as StatsCBB } from '@/types/cbb';
import { StatisticRankings as StatsCFB } from '@/types/cfb';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Objector from '@/components/utils/Objector';

type InitialState = {
  view: string,
  subview: string | null,
  scrollTop: number,
  coach: Coach,
  coach_team_seasons: CoachTeamSeasons;
  teams: Teams;
  statistic_rankings: StatsCBB | StatsCFB;
  loadingView: boolean;
};

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};

const initialState = {
  view: 'trends',
  subview: null,
  scrollTop: 0,
  coach: {},
  coach_team_seasons: {},
  teams: {},
  statistic_rankings: {},
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
  if (!window.location.pathname.includes('coach')) {
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

export const coach = createSlice({
  name: 'coach',
  initialState,
  reducers: {
    clear: (state) => {
      for (const key in defaultState) {
        state[key] = defaultState[key];
      }
    },
    setDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      state[action.payload.key] = action.payload.value;
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
} = coach.actions;
export default coach.reducer;

updateStateFromUrlParams(initialState);
