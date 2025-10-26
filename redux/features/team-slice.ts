import State from '@/components/helpers/State';
import { Team, TeamSeasonConference } from '@/types/general';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  view: string,
  subview: string | null,
  team: Team,
  team_season_conference: TeamSeasonConference,
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

type InitialStateKeys = keyof InitialState;

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};


const stateController = new State<InitialState>({
  type: 'team',
});

stateController.set_url_param_type_x_keys({
  string: [
    'view',
    'subview',
    // 'season',
    'trendsColumn',
  ],
  array: [],
  boolean: [],
});

stateController.setInitialState({
  view: 'schedule',
  subview: null,
  team: {} as Team,
  team_season_conference: {} as TeamSeasonConference,
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
});



export const team = createSlice({
  name: 'team',
  initialState: stateController.getInitialState(),
  reducers: {
    reset: (state: InitialState) => stateController.reset(state),
    resetDataKey: (state: InitialState, action: PayloadAction<InitialStateKeys>) => {
      stateController.resetDataKey(state, action.payload);
    },
    setDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      const { value, key } = action.payload;
      stateController.setDataKey(state, key, value);
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

stateController.updateStateFromUrlParams(stateController.getInitialState());
