import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const rankLocalStorageKey = 'CBB.DISPLAY.RANK';

let rankLocalStorage: string | null = null;

if (typeof window !== 'undefined') {
  rankLocalStorage = localStorage.getItem(rankLocalStorageKey);
}

type InitialState = {
  rank: string,
  hideCommitted: boolean,
  hideUnderTwoMPG: boolean,
};

const initialState = {
  rank: rankLocalStorage || 'composite_rank',
  hideCommitted: false,
  hideUnderTwoMPG: false,
} as InitialState;

const updateStateFromUrlParams = (state: InitialState) => {
  if (typeof window === 'undefined') {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const hideCommitted = urlParams.get('hideCommitted');
  const hideUnderTwoMPG = urlParams.get('hideUnderTwoMPG');
  // const view = urlParams.get('view');

  // Update state if URL parameters are present
  if (hideCommitted !== null) {
    state.hideCommitted = (+hideCommitted === 1);
  }
  if (hideUnderTwoMPG !== null) {
    state.hideUnderTwoMPG = (+hideUnderTwoMPG === 1);
  }
  
  // if (view !== null) {
  //   state.view = view;
  // }
};

export const ranking = createSlice({
  name: 'ranking',
  initialState: initialState,
  reducers: {
    setHideCommitted: (state, action: PayloadAction<boolean>) => {
      state.hideCommitted = action.payload;
    },
    setHideUnderTwoMPG: (state, action: PayloadAction<boolean>) => {
      state.hideUnderTwoMPG = action.payload;
    },
    // setSeason: (state, action: PayloadAction<number>) => {
    //   state.value.season = action.payload;
    // },
  }
});

export const { setHideCommitted, setHideUnderTwoMPG } = ranking.actions;
export default ranking.reducer;

updateStateFromUrlParams(initialState);
