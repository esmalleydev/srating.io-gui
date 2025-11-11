
import State from '@/components/helpers/State';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  rankingData: object,
};

type InitialStateKeys = keyof InitialState;

type ActionPayload<K extends InitialStateKeys> = {
  key: K;
  value: InitialState[K];
};

const stateController = new State<InitialState>({
  type: 'cache',
});

stateController.setInitialState({
  rankingData: {},
} as InitialState);


export const cache = createSlice({
  name: 'cache',
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
  reset,
  setDataKey,
  resetDataKey,
} = cache.actions;
export default cache.reducer;

stateController.updateStateFromUrlParams(stateController.getInitialState());
