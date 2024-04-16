import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const rankLocalStorageKey = 'CBB.DISPLAY.RANK';

let rankLocalStorage: string | null = null;

if (typeof window !== 'undefined') {
  rankLocalStorage = localStorage.getItem(rankLocalStorageKey);
}

type InitialState = {
  rank: string,
  order: string,
  orderBy: string,
  hideCommitted: boolean,
  hideUnderTwoMPG: boolean,
  tableScrollTop: number,
};

const initialState = {
  rank: rankLocalStorage || 'composite_rank',
  order: 'asc',
  orderBy: 'composite_rank',
  hideCommitted: false,
  hideUnderTwoMPG: false,
  tableScrollTop: 0,
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
    setOrder: (state, action: PayloadAction<string>) => {
      state.order = action.payload;
    },
    setOrderBy: (state, action: PayloadAction<string>) => {
      state.orderBy = action.payload;
    },
    setHideCommitted: (state, action: PayloadAction<boolean>) => {
      state.hideCommitted = action.payload;
    },
    setHideUnderTwoMPG: (state, action: PayloadAction<boolean>) => {
      state.hideUnderTwoMPG = action.payload;
    },
    setTableScrollTop: (state, action: PayloadAction<number>) => {
      state.tableScrollTop = action.payload;
    },
    // setSeason: (state, action: PayloadAction<number>) => {
    //   state.value.season = action.payload;
    // },
  }
});

export const { setOrder, setOrderBy, setHideCommitted, setHideUnderTwoMPG, setTableScrollTop } = ranking.actions;
export default ranking.reducer;

updateStateFromUrlParams(initialState);
