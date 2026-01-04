
import State from '@/components/helpers/State';
import { FantasyGroup, FantasyGroupInvites, FantasyGroupUser, FantasyGroupUsers } from '@/types/general';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type InitialState = {
  // view: string;
  fantasy_group: FantasyGroup,
  fantasy_group_user: FantasyGroupUser | null,
  fantasy_group_users: FantasyGroupUsers,
  fantasy_group_invites: FantasyGroupInvites,
  loadingView: boolean,
};

export type InitialStateKeys = keyof InitialState;

type ActionPayload<K extends InitialStateKeys> = {
  key: K;
  value: InitialState[K];
};

export const stateController = new State<InitialState>({
  type: 'fantasy_group',
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
  // view: 'home',
  fantasy_group: {} as FantasyGroup,
  fantasy_group_invites: {} as FantasyGroupInvites,
  fantasy_group_users: {} as FantasyGroupUsers,
  fantasy_group_user: null,
  loadingView: true,
});


export const fantasy_group = createSlice({
  name: 'fantasy_group',
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
} = fantasy_group.actions;
export default fantasy_group.reducer;

stateController.updateStateFromUrlParams(stateController.getInitialState());
