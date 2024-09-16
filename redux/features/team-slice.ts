import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  schedulePredictions: object,
  schedulePredictionsLoading: boolean,
  scheduleStats: object,
  scheduleStatsLoading: boolean,
  showScheduleDifferentials: boolean,
  showScheduleHistoricalRankRecord: boolean,
  visibleScheduleDifferentials: string[],
  scheduleView: string,
  scrollTop: number,
};

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};

const initialState: InitialState = {
  schedulePredictions: {},
  schedulePredictionsLoading: true,
  scheduleStats: {},
  scheduleStatsLoading: true,
  showScheduleDifferentials: false,
  showScheduleHistoricalRankRecord: true,
  visibleScheduleDifferentials: [],
  scheduleView: 'default',
  scrollTop: 0,
};

// todo move all these setFoo functions to use setDataKey

export const team = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      state[action.payload.key] = action.payload.value;
    },
    setScrollTop: (state, action: PayloadAction<number>) => {
      state.scrollTop = action.payload;
    },
    setScheduleStats: (state, action: PayloadAction<object>) => {
      state.scheduleStats = action.payload;
    },
    setScheduleStatsLoading: (state, action: PayloadAction<boolean>) => {
      state.scheduleStatsLoading = action.payload;
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
    setShowScheduleHistoricalRankRecord: (state, action: PayloadAction<boolean>) => {
      state.showScheduleHistoricalRankRecord = action.payload;
    },
    updateVisibleScheduleDifferentials: (state, action: PayloadAction<string>) => {
      const index = state.visibleScheduleDifferentials.indexOf(action.payload);
      if (index !== -1) {
        state.visibleScheduleDifferentials = [
          ...state.visibleScheduleDifferentials.slice(0, index),
          ...state.visibleScheduleDifferentials.slice(index + 1),
        ];
      } else {
        state.visibleScheduleDifferentials = [...state.visibleScheduleDifferentials, action.payload];
      }
    },
    setScheduleView: (state, action: PayloadAction<string>) => {
      state.scheduleView = action.payload;
    },
  },
});

export const {
  setDataKey,
  updateSchedulePredictions,
  setScrollTop,
  setScheduleStats,
  setScheduleStatsLoading,
  setScheduleView,
  setSchedulePredictionsLoading,
  setShowScheduleDifferentials,
  setShowScheduleHistoricalRankRecord,
  updateVisibleScheduleDifferentials,
} = team.actions;
export default team.reducer;
