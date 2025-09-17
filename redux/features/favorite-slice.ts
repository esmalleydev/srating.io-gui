import Objector from '@/components/utils/Objector';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  team_ids: Array<string>,
  player_ids: Array<string>,
  game_ids: Array<string>,
  skip_sort_game_ids: Array<string>,
};

const initialState = {
  team_ids: [],
  player_ids: [],
  game_ids: [],
  skip_sort_game_ids: [],
} as InitialState;

const defaultState = Object.freeze(Objector.deepClone(initialState));

export const favorite = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    setTeamIds: (state, action: PayloadAction<Array<string>|null>) => {
      state.team_ids = action.payload || [];
    },
    setPlayerIds: (state, action: PayloadAction<Array<string>|null>) => {
      state.player_ids = action.payload || [];
    },
    setGameIds: (state, action: PayloadAction<Array<string>|null>) => {
      state.game_ids = action.payload || [];
    },
    updateGameIds: (state, action: PayloadAction<string>) => {
      const index = state.game_ids.indexOf(action.payload);
      if (index !== -1) {
        state.game_ids = [
          ...state.game_ids.slice(0, index),
          ...state.game_ids.slice(index + 1),
        ];
      } else {
        if (state.game_ids.length === 40) {
          state.game_ids = state.game_ids.slice(1);
        }
        state.game_ids = [...state.game_ids, action.payload];
      }
    },
    updateGameSort: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.skip_sort_game_ids = [...state.skip_sort_game_ids, action.payload];
      } else if (state.skip_sort_game_ids.length) {
        state.skip_sort_game_ids = [];
      }
    },
  },
});

export const { setTeamIds, setPlayerIds, setGameIds, updateGameIds, updateGameSort } = favorite.actions;
export default favorite.reducer;
