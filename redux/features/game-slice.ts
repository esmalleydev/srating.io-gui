import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  gameStats: object,
  gameStatsLoading: boolean,
  gamePrediction: object,
  gamePredictionLoading: boolean,
};

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};

const initialState: InitialState = {
  gameStats: {},
  gameStatsLoading: true,
  gamePrediction: {},
  gamePredictionLoading: true,
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
