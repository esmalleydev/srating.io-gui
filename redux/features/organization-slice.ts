
import Organization from '@/components/helpers/Organization';
import Division from '@/components/helpers/Division';
import Objector from '@/components/utils/Objector';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Initializer from '@/components/helpers/Initializer';



type InitialState = {
  organization_id: string,
  division_id: string,
  season: number,
};


const initalOrganizationID = Initializer.getInitialOrganizationID();
const initalDivisionID = Initializer.getInitialDivisionID();
const initalSeason = Initializer.getInitialSeason();

const initialState = {
  organization_id: initalOrganizationID,
  division_id: initalDivisionID,
  season: initalSeason,
} as InitialState;

const defaultState = Object.freeze(Objector.deepClone(initialState));

export const organization = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    updateOrganizationID: (state, action: PayloadAction<string>) => {
      // if changing the organization_id, set the division_id back to the default
      if (action.payload !== state.organization_id) {
        if (action.payload === Organization.getCBBID()) {
          state.division_id = Division.getD1();
        }
        if (action.payload === Organization.getCFBID()) {
          state.division_id = Division.getFBS();
        }
      }
      // eslint-disable-next-line no-param-reassign
      state.organization_id = action.payload;
    },
    updateDivisionID: (state, action: PayloadAction<string>) => {
      // eslint-disable-next-line no-param-reassign
      state.division_id = action.payload;
    },
  },
});

export const { updateOrganizationID, updateDivisionID } = organization.actions;
export default organization.reducer;
