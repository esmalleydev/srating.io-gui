import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  gameStats: object,
  coachStats: object,
  conferenceStats: object,
  gameStatsLoading: boolean,
  gamePrediction: object,
  gamePredictionLoading: boolean,
  refreshRate: number,
  refreshCountdown: number,
  refreshLoading: boolean,
  refreshEnabled: boolean,
};

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};

const initialState: InitialState = {
  gameStats: {},
  coachStats: {},
  conferenceStats: {},
  gameStatsLoading: true,
  gamePrediction: {},
  gamePredictionLoading: true,
  refreshRate: 15,
  refreshCountdown: 15,
  refreshLoading: false,
  refreshEnabled: true,
};


export const game = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  setDataKey,
} = game.actions;
export default game.reducer;
