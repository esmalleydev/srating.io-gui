
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import State from '@/components/helpers/State';

// dont add anything else to this slice
type InitialState = {
  loading: boolean,
};

type InitialStateKeys = keyof InitialState;

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};

const stateController = new State<InitialState>({
  type: 'loading',
});

stateController.setInitialState({
  loading: false,
});


export const loading = createSlice({
  name: 'loading',
  initialState: stateController.getInitialState(),
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      // if you are wondering what sets this to false, check the handlers/MutationHandler
      state.loading = action.payload;
    },
  },
});

export const {
  setLoading,
} = loading.actions;
export default loading.reducer;

stateController.updateStateFromUrlParams(stateController.getInitialState());
