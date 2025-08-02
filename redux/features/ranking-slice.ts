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
  searchValue: string,
};

type InitialStateKeys = keyof InitialState;

type ActionPayload<K extends InitialStateKeys> = {
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
  searchValue: '',
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
  const columnView = urlParams.get('columnView');
  const customColumns = urlParams.getAll('customColumns');


  // const view = urlParams.get('view');

  // we only want to run this if on first load, if the pathname is relevant
  if (!window.location.pathname.includes('ranking')) {
    return;
  }

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

  if (columnView !== null) {
    state.columnView = columnView;
  }

  if (customColumns !== null) {
    state.customColumns = [...new Set([...initialState.customColumns, ...customColumns])];
  }


  // if (view !== null) {
  //   state.view = view;
  // }
};

export const ranking = createSlice({
  name: 'ranking',
  initialState,
  reducers: {
    reset: (state) => {
      for (const key in initialState) {
        // we do not have to reset this one, it is controlled by the contents changing
        if (key !== 'loadingView') {
          state[key] = initialState[key];
        }
      }

      updateStateFromUrlParams(state);
    },
    resetDataKey: (state: InitialState, action: PayloadAction<InitialStateKeys>) => {
      const keyToReset = action.payload as string;
      state[keyToReset] = initialState[keyToReset];
    },
    setDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  reset,
  setDataKey,
  resetDataKey,
} = ranking.actions;
export default ranking.reducer;

updateStateFromUrlParams(initialState);
