import State from '@/components/helpers/State';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// this is the /sport/games path

type InitialState = {
  // visibleGames: string[],
  // nonVisibleGames: string[],
  // displayedGames: string[],
  scores: object,
  dates_checked: object,
  scrollTop: number,
  refreshRate: number,
  refreshCountdown: number,
  refreshLoading: boolean,
  refreshEnabled: boolean,
  gameStatsLoading: boolean,
  gameStats: object,
};

type InitialStateKeys = keyof InitialState;

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};

const stateController = new State<InitialState>({
  type: 'games',
});

// stateController.set_url_param_type_x_keys({
//   string: [],
//   array: [],
//   boolean: [],
// });

stateController.setInitialState({
  // visibleGames: [],
  // nonVisibleGames: [],
  // displayedGames: [],
  scores: {},
  dates_checked: {},
  scrollTop: 0,
  refreshRate: 15,
  refreshCountdown: 15,
  refreshLoading: false,
  refreshEnabled: true,
  gameStatsLoading: true,
  gameStats: {},
});


export const games = createSlice({
  name: 'games',
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
    updateDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      const { value, key } = action.payload;
      stateController.updateDataKey(state, key, value);
    },
  },
});

export const {
  updateDataKey,
  setDataKey,
  reset,
  resetDataKey,
} = games.actions;
export default games.reducer;
