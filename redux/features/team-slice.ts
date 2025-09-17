import Objector from '@/components/utils/Objector';
import { Team, TeamSeasonConference } from '@/types/general';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  view: string,
  subview: string | null,
  team: Team | object,
  team_season_conference: TeamSeasonConference | object,
  schedulePredictions: object,
  schedulePredictionsLoading: boolean,
  scheduleStats: object,
  scheduleStatsLoading: boolean,
  showScheduleDifferentials: boolean,
  showScheduleHistoricalRankRecord: boolean,
  visibleScheduleDifferentials: string[],
  scheduleView: string,
  scrollTop: number,
  loadingView: boolean,
  trendsBoxscoreLine: boolean,
  trendsColumn: string | null,
};

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};

const initialState: InitialState = {
  view: 'schedule',
  subview: null,
  team: {},
  team_season_conference: {},
  schedulePredictions: {},
  schedulePredictionsLoading: true,
  scheduleStats: {},
  scheduleStatsLoading: true,
  showScheduleDifferentials: false,
  showScheduleHistoricalRankRecord: true,
  visibleScheduleDifferentials: [],
  scheduleView: 'default',
  scrollTop: 0,
  loadingView: true,
  trendsBoxscoreLine: false,
  trendsColumn: null,
};

const defaultState = Object.freeze(Objector.deepClone(initialState));

const updateStateFromUrlParams = (state: InitialState) => {
  if (typeof window === 'undefined') {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');
  const subview = urlParams.get('subview');
  const trendsColumn = urlParams.get('trendsColumn');

  // we only want to run this if on first load, if the pathname is relevant
  if (!window.location.pathname.includes('team')) {
    return;
  }

  // Update state if URL parameters are present
  if (view !== null) {
    state.view = view;
  }
  if (subview !== null) {
    state.subview = subview;
  }
  if (trendsColumn !== null) {
    state.trendsColumn = trendsColumn;
  }
};

export const team = createSlice({
  name: 'team',
  initialState,
  reducers: {
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
    updateVisibleScheduleDifferentials: (state, action: PayloadAction<string>) => {
      const index = state.visibleScheduleDifferentials.indexOf(action.payload);
      if (index !== -1) {
        state.visibleScheduleDifferentials = [
          ...state.visibleScheduleDifferentials.slice(0, index),
          ...state.visibleScheduleDifferentials.slice(index + 1),
        ];
      } else {
        state.visibleScheduleDifferentials = [...state.visibleScheduleDifferentials, action.payload];
      }
    },
  },
});

export const {
  setDataKey,
  reset,
  updateVisibleScheduleDifferentials,
} = team.actions;
export default team.reducer;

updateStateFromUrlParams(initialState);
