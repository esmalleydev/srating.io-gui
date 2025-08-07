
import Division from '@/components/helpers/Division';
import Organization from '@/components/helpers/Organization';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



type InitialState = {
  organization_id: string,
  division_id: string,
};

const getInitialOrganizationID = () => {
  if (typeof window !== 'undefined') {
    const pathName = window.location.pathname;
    const splat = pathName.split('/');
    if (splat.length > 1) {
      if (splat[1] === 'cfb') {
        return Organization.getCFBID();
      }

      if (splat[1] === 'cbb') {
        return Organization.getCBBID();
      }
    }
  }

  return Organization.getCBBID();
};

const getInitialDivisionID = () => {
  const organization_id = getInitialOrganizationID();

  // default to FBS
  if (organization_id === Organization.getCFBID()) {
    return Division.getFBS();
  }

  if (organization_id === Organization.getCBBID()) {
    return Division.getD1();
  }

  return Division.getD1();
};

const initalOrganizationID = getInitialOrganizationID();
const initalDivisionID = getInitialDivisionID();

const initialState = {
  organization_id: initalOrganizationID,
  division_id: initalDivisionID,
} as InitialState;

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
