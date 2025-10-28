
import State from '@/components/helpers/State';
import { Player, PlayerTeamSeason, PlayerTeamSeasons, Team, Teams } from '@/types/general';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type InitialState = {
  view: string;
  subview: string | null;
  scrollTop: number;
  player: Player;
  player_team_season: PlayerTeamSeason | null;
  player_team_seasons: PlayerTeamSeasons;
  team: Team | null;
  teams: Teams;
  season: number | null;
  loadingView: boolean,
  trendsBoxscoreLine: boolean,
  trendsColumn: string | null,
  trendsSeasons: number[],
};

export type InitialStateKeys = keyof InitialState;

type ActionPayload<K extends InitialStateKeys> = {
  key: K;
  value: InitialState[K];
};

const stateController = new State<InitialState>({
  type: 'player',
});

stateController.set_url_param_type_x_keys({
  string: [
    'view',
    'subview',
    'season',
    'trendsColumn',
  ],
  array: [
    'trendsSeasons',
  ],
  boolean: [
    'trendsBoxscoreLine',
  ],
});

stateController.setInitialState({
  view: 'stats',
  subview: null,
  scrollTop: 0,
  player: {} as Player,
  player_team_season: null,
  player_team_seasons: {} as PlayerTeamSeasons,
  team: null,
  teams: {} as Teams,
  season: null,
  loadingView: true,
  trendsBoxscoreLine: true,
  trendsColumn: null,
  trendsSeasons: [],
});

/*
export const stateThunk = createAsyncThunk(
  'router',
  ({ router }: { router: AppRouterInstance }) => {
    stateController.setRouter(router);
  },
);
*/

export const player = createSlice({
  name: 'player',
  initialState: stateController.getInitialState(),
  reducers: {
    reset: {
      reducer: (state, action: PayloadAction<boolean | undefined>) => {
        stateController.reset(state, action.payload);
      },
      // prepare receives optional payload and returns { payload }
      prepare: (payload?: boolean) => ({ payload }),
    },
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
  setDataKey, resetDataKey, reset,
} = player.actions;
export default player.reducer;

stateController.updateStateFromUrlParams(stateController.getInitialState());
