import State from '@/components/helpers/State';
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

type InitialStateKeys = keyof InitialState;

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};

const stateController = new State<InitialState>({
  type: 'conference',
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
});


export const conference = createSlice({
  name: 'conference',
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
} = conference.actions;
export default conference.reducer;

stateController.updateStateFromUrlParams(stateController.getInitialState());
