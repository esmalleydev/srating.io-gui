import { Coach, CoachTeamSeasons, Teams } from '@/types/general';
import { StatisticRankings as StatsCBB } from '@/types/cbb';
import { StatisticRankings as StatsCFB } from '@/types/cfb';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Objector from '@/components/utils/Objector';
import State from '@/components/helpers/State';

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

type InitialStateKeys = keyof InitialState;


const stateController = new State<InitialState>({
  type: 'compare',
});

stateController.set_url_param_type_x_keys({
  string: [
    'view',
    'subview',
  ],
  array: [],
  boolean: [],
});

stateController.setInitialState({
  view: 'trends',
  subview: null,
  scrollTop: 0,
  coach: {} as Coach,
  coach_team_seasons: {} as CoachTeamSeasons,
  teams: {} as Teams,
  statistic_rankings: {} as StatsCBB | StatsCFB,
  loadingView: false,
});


export const coach = createSlice({
  name: 'coach',
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
  },
});

export const {
  setDataKey,
  resetDataKey,
  reset,
} = coach.actions;
export default coach.reducer;

stateController.updateStateFromUrlParams(stateController.getInitialState());
