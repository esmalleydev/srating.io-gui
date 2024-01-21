import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import HelperCBB from '@/components/helpers/CBB';


type InitialState = {
  value : {
    visibleGames: string[],
    nonVisibleGames: string[],
    displayedGames: string[],
    scores: object,
    dates_checked: object,
    scrollTop: number,
  }
};

const initialState = {
  value : {
    visibleGames: [],
    nonVisibleGames: [],
    displayedGames: [],
    scores: {},
    dates_checked: {},
    scrollTop: 0,
  }
} as InitialState;

export const games = createSlice({
  name: 'games',
  initialState: initialState,
  reducers: {
    setScrollTop: (state, action: PayloadAction<number>) => {
      state.value.scrollTop = action.payload;
    },
    updateVisibleGames: (state, action: PayloadAction<string>) => {
      const index = state.value.visibleGames.indexOf(action.payload);
      const nonVisibleIndex = state.value.nonVisibleGames.indexOf(action.payload);
      if (nonVisibleIndex !== -1) {
        state.value.nonVisibleGames = [
          ...state.value.nonVisibleGames.slice(0, nonVisibleIndex),
          ...state.value.nonVisibleGames.slice(nonVisibleIndex + 1)
        ];
      }
      if (index === -1) {
        state.value.visibleGames = [...state.value.visibleGames, action.payload];
      }
    },
    updateNonVisibleGames: (state, action: PayloadAction<string>) => {
      const index = state.value.nonVisibleGames.indexOf(action.payload);
      const visibleIndex = state.value.visibleGames.indexOf(action.payload);
      if (visibleIndex !== -1) {
        state.value.visibleGames = [
          ...state.value.visibleGames.slice(0, visibleIndex),
          ...state.value.visibleGames.slice(visibleIndex + 1)
        ];
      }
      if (index === -1) {
        state.value.nonVisibleGames = [...state.value.nonVisibleGames, action.payload];
      }
    },
    updateDisplayedGames: (state, action: PayloadAction<Array<string>>) => {
      state.value.displayedGames = action.payload || [];
    },
    updateScores: (state, action: PayloadAction<object>) => {
      state.value.scores = action.payload || {};
    },
    updateDateChecked: (state, action: PayloadAction<string>) => {
      state.value.dates_checked[action.payload] = true;
    },
    clearDatesChecked: (state, action: PayloadAction<string| null>) => {
      if (action.payload && action.payload in state.value.dates_checked) {
        state.value.dates_checked[action.payload] = false;
      } else {
        state.value.dates_checked = {};
      }
    },
  }
});

export const { updateVisibleGames, updateNonVisibleGames, updateDisplayedGames, updateScores, updateDateChecked, clearDatesChecked, setScrollTop } = games.actions;
export default games.reducer;
