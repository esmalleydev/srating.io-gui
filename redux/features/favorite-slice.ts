import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type InitialState = {
  value: {
    team_ids: Array<string>,
    player_ids: Array<string>,
    cbb_game_ids: Array<string>,
    skip_sort_cbb_game_ids: Array<string>,
  };
};

const initialState = {
  value: {
    team_ids: [],
    player_ids: [],
    cbb_game_ids: [],
    skip_sort_cbb_game_ids: [],
  },
} as InitialState;

export const favorite = createSlice({
  name: 'favorite',
  initialState: initialState,
  reducers: {
    setTeamIds: (state, action: PayloadAction<Array<string>|null>) => {
      state.value.team_ids = action.payload || [];
    },
    setPlayerIds: (state, action: PayloadAction<Array<string>|null>) => {
      state.value.player_ids = action.payload || [];
    },
    setCbbGameIds: (state, action: PayloadAction<Array<string>|null>) => {
      state.value.cbb_game_ids = action.payload || [];
    },
    updateCbbGameIds: (state, action: PayloadAction<string>) => {
      const index = state.value.cbb_game_ids.indexOf(action.payload);
      if (index !== -1) {
        state.value.cbb_game_ids = [
          ...state.value.cbb_game_ids.slice(0, index),
          ...state.value.cbb_game_ids.slice(index + 1)
        ];
      } else {
        if (state.value.cbb_game_ids.length === 40) {
          state.value.cbb_game_ids = state.value.cbb_game_ids.slice(1);
        }
        state.value.cbb_game_ids = [...state.value.cbb_game_ids, action.payload];
      }
    },
    updateGameSort: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.value.skip_sort_cbb_game_ids = [...state.value.skip_sort_cbb_game_ids, action.payload];
      } else {
        state.value.skip_sort_cbb_game_ids = [];
      }
    },
  }
});

export const { setTeamIds, setPlayerIds, setCbbGameIds, updateCbbGameIds, updateGameSort } = favorite.actions;
export default favorite.reducer;
