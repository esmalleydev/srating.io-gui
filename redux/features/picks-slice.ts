import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import HelperCBB from '@/components/helpers/CBB';


type InitialState = {
  scrollTop: number,
  picksLoading: boolean,
  picks: object,
  dates_checked: object,
};

const initialState = {
  scrollTop: 0,
  picksLoading: false,
  picks: {},
  dates_checked: {},
} as InitialState;

export const picks = createSlice({
  name: 'picks',
  initialState: initialState,
  reducers: {
    setScrollTop: (state, action: PayloadAction<number>) => {
      state.scrollTop = action.payload;
    },
    setPicksLoading: (state, action: PayloadAction<boolean>) => {
      state.picksLoading = action.payload;
    },
    updatePicks: (state, action: PayloadAction<object>) => {
      state.picks = action.payload || {};
    },
    updateDateChecked: (state, action: PayloadAction<string>) => {
      state.dates_checked[action.payload] = true;
    },
    clearDatesChecked: (state, action: PayloadAction<string| null>) => {
      if (action.payload && action.payload in state.dates_checked) {
        state.dates_checked[action.payload] = false;
      } else {
        state.dates_checked = {};
      }
    },
  }
});

export const { setScrollTop, setPicksLoading, updatePicks, updateDateChecked, clearDatesChecked } = picks.actions;
export default picks.reducer;
