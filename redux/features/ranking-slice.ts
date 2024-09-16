import { CBBRankingTable } from '@/types/cbb';
import { CFBRankingTable } from '@/types/cfb';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
  order: string,
  orderBy: string,
  hideCommitted: boolean,
  hideUnderTwoMPG: boolean,
  filterCommittedConf: boolean,
  filterOriginalConf: boolean,
  tableScrollTop: number,
  tableFullscreen: boolean,
  lastUpdated: string | null,
  columnView: string,
  customColumns: Array<string>,
  data: object | null,
  filteredRows: CBBRankingTable[] | CFBRankingTable[] | null | boolean,
};

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};

const initialState = {
  order: 'asc',
  orderBy: 'rank',
  hideCommitted: false,
  hideUnderTwoMPG: false,
  filterCommittedConf: true,
  filterOriginalConf: true,
  tableScrollTop: 0,
  tableFullscreen: false,
  lastUpdated: null,
  columnView: 'composite',
  customColumns: ['rank', 'name'],
  data: null,
  filteredRows: null,
} as InitialState;

const updateStateFromUrlParams = (state: InitialState) => {
  if (typeof window === 'undefined') {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const hideCommitted = urlParams.get('hideCommitted');
  const hideUnderTwoMPG = urlParams.get('hideUnderTwoMPG');
  const filterCommittedConf = urlParams.get('filterCommittedConf');
  const filterOriginalConf = urlParams.get('filterOriginalConf');
  // const view = urlParams.get('view');

  // Update state if URL parameters are present
  if (hideCommitted !== null) {
    state.hideCommitted = (+hideCommitted === 1);
  }
  if (hideUnderTwoMPG !== null) {
    state.hideUnderTwoMPG = (+hideUnderTwoMPG === 1);
  }
  if (filterCommittedConf !== null) {
    state.filterCommittedConf = (+filterCommittedConf === 1);
  }
  if (filterOriginalConf !== null) {
    state.filterOriginalConf = (+filterOriginalConf === 1);
  }

  // if (view !== null) {
  //   state.view = view;
  // }
};

// todo deprecate all but setDataKey

export const ranking = createSlice({
  name: 'ranking',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    setDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      state[action.payload.key] = action.payload.value;
    },
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
    setFilterCommittedConf: (state, action: PayloadAction<boolean>) => {
      state.filterCommittedConf = action.payload;
    },
    setFilterOriginalConf: (state, action: PayloadAction<boolean>) => {
      state.filterOriginalConf = action.payload;
    },
    setTableScrollTop: (state, action: PayloadAction<number>) => {
      state.tableScrollTop = action.payload;
    },
    setTableFullscreen: (state, action: PayloadAction<boolean>) => {
      state.tableFullscreen = action.payload;
    },
    // setSeason: (state, action: PayloadAction<number>) => {
    //   state.value.season = action.payload;
    // },
  },
});

export const {
  reset,
  setDataKey,
  setOrder, setOrderBy, setHideCommitted, setHideUnderTwoMPG, setFilterCommittedConf, setFilterOriginalConf, setTableScrollTop, setTableFullscreen,
} = ranking.actions;
export default ranking.reducer;

updateStateFromUrlParams(initialState);
