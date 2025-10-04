import Objector from '@/components/utils/Objector';
import { Conferences, Divisions, Organizations } from '@/types/general';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  conference: Conferences,
  organization: Organizations,
  division: Divisions,
  division_id_x_conference_id_x_season_x_true: object,
  organization_id_x_division_id_x_season_x_count: object,
  organization_id_x_division_id_x_season_x_conference_id_x_true: object,
  organization_id_x_division_id_x_ranking_seasons: object,
};

const initialState = {
  conference: {},
  division_id_x_conference_id_x_season_x_true: {},
  organization_id_x_division_id_x_season_x_count: {},
  organization_id_x_division_id_x_season_x_conference_id_x_true: {},
  organization_id_x_division_id_x_ranking_seasons: {},
} as InitialState;

const defaultState = Object.freeze(Objector.deepClone(initialState));

export const dictionary = createSlice({
  name: 'dictionary',
  initialState,
  reducers: {
    load: (state, action: PayloadAction<object>) => {
      const data = action.payload;
      for (const table in data) {
        state[table] = data[table];
      }
    },
  },
});

export const { load } = dictionary.actions;
export default dictionary.reducer;
