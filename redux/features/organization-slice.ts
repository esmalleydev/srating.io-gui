import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const localStorageKey = 'organization_id';

type InitialState = {
  organization_id: string,
};

// todo put this in displayReducer instead?

const getInitialOrganizationID = () => {
  if (typeof window !== 'undefined' && localStorage.getItem(localStorageKey)) {
    return localStorage.getItem(localStorageKey);
  }

  return 'f1c37c98-3b4c-11ef-94bc-2a93761010b8'; // CBB
};

const initalOrganizationID = getInitialOrganizationID();

const initialState = {
  organization_id: initalOrganizationID,
} as InitialState;

export const organization = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    updateOrganizationID: (state, action: PayloadAction<string>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(localStorageKey, action.payload);
      }
      // eslint-disable-next-line no-param-reassign
      state.organization_id = action.payload;
    },
  },
});

export const { updateOrganizationID } = organization.actions;
export default organization.reducer;
