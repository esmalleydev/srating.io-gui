
import State from '@/components/helpers/State';
import { FantasyEntry, FantasyGroup } from '@/types/general';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type InitialState = {
  fantasy_entry: FantasyEntry;
  fantasy_group: FantasyGroup;
  loadingView: boolean;
};

export type InitialStateKeys = keyof InitialState;

type ActionPayload<K extends InitialStateKeys> = {
  key: K;
  value: InitialState[K];
};

export const stateController = new State<InitialState>({
  type: 'fantasy_entry',
});

stateController.set_url_param_type_x_keys({
  string: [
    // 'view',
  ],
  array: [
  ],
  boolean: [
  ],
});

// stateController.set_key_x_is_push_state({
//   view: true,
// });

stateController.setInitialState({
  fantasy_entry: {} as FantasyEntry,
  fantasy_group: {} as FantasyGroup,
  loadingView: true,
});


export const fantasy_entry = createSlice({
  name: 'fantasy_entry',
  initialState: stateController.getInitialState(),
  reducers: {
    updateFromURL: (state) => {
      stateController.updateStateFromUrlParams(state);
    },
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
  setDataKey, resetDataKey, reset, updateFromURL,
} = fantasy_entry.actions;
export default fantasy_entry.reducer;

stateController.updateStateFromUrlParams(stateController.getInitialState());
