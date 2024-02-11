import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const scheduleViewLocalStorageKey = 'CBB.DISPLAY.TEAM.SCHEDULE';

let scheduleViewLocalStorage: string | null = null;

if (typeof window !== 'undefined') {
  scheduleViewLocalStorage = localStorage.getItem(scheduleViewLocalStorageKey);
}

type InitialState = {
  schedulePredictions: object,
  schedulePredictionsLoading: boolean,
  showScheduleDifferentials: boolean,
  scheduleDifferentials: object,
  scheduleDifferentialsLoading: boolean,
  visibleScheduleDifferentials: string[],
  scheduleView: string,
  scrollTop: number,
};

const initialState = {
  schedulePredictions: {},
  schedulePredictionsLoading: true,
  showScheduleDifferentials: false,
  scheduleDifferentials: {},
  scheduleDifferentialsLoading: true,
  visibleScheduleDifferentials: [],
  scheduleView: scheduleViewLocalStorage || 'default',
  scrollTop: 0,
} as InitialState;

export const games = createSlice({
  name: 'games',
  initialState: initialState,
  reducers: {
    setScrollTop: (state, action: PayloadAction<number>) => {
      state.scrollTop = action.payload;
    },
    setSchedulePredictionsLoading: (state, action: PayloadAction<boolean>) => {
      state.schedulePredictionsLoading = action.payload;
    },
    updateSchedulePredictions: (state, action: PayloadAction<object>) => {
      state.schedulePredictions = action.payload || {};
    },
    setShowScheduleDifferentials: (state, action: PayloadAction<boolean>) => {
      state.showScheduleDifferentials = action.payload;
    },
    setScheduleDifferentialsLoading: (state, action: PayloadAction<boolean>) => {
      state.scheduleDifferentialsLoading = action.payload;
    },
    updateVisibleScheduleDifferentials: (state, action: PayloadAction<string>) => {
      const index = state.visibleScheduleDifferentials.indexOf(action.payload);
      if (index !== -1) {
        state.visibleScheduleDifferentials = [
          ...state.visibleScheduleDifferentials.slice(0, index),
          ...state.visibleScheduleDifferentials.slice(index + 1)
        ];
      } else {
        state.visibleScheduleDifferentials = [...state.visibleScheduleDifferentials, action.payload];
      }
    },
    updateScheduleDifferentials: (state, action: PayloadAction<object>) => {
      state.scheduleDifferentials = action.payload || {};
    },
    setScheduleView: (state, action: PayloadAction<string>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(scheduleViewLocalStorageKey, action.payload);
      }
      state.scheduleView = action.payload;
    },
  }
});

export const { updateSchedulePredictions, setScrollTop, setScheduleView, setSchedulePredictionsLoading, updateScheduleDifferentials, setScheduleDifferentialsLoading, setShowScheduleDifferentials, updateVisibleScheduleDifferentials } = games.actions;
export default games.reducer;
