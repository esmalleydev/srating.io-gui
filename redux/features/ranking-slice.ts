
import State from '@/components/helpers/State';
import { RankingTable as CBBRankingTable } from '@/types/cbb';
import { RankingTable as CFBRankingTable } from '@/types/cfb';
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

const stateController = new State<InitialState>({
  type: 'ranking',
});

stateController.set_url_param_type_x_keys({
  string: [
    'order',
    'orderBy',
    'columnView',
  ],
  array: [
    'customColumns',
  ],
  boolean: [
    'hideCommitted',
    'hideUnderTwoMPG',
    'filterCommittedConf',
    'filterOriginalConf',
  ],
});

stateController.setInitialState({
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
} as InitialState);


export const ranking = createSlice({
  name: 'ranking',
  initialState: stateController.getInitialState(),
  reducers: {
    reset: (state: InitialState) => stateController.reset(state),
    resetDataKey: (state: InitialState, action: PayloadAction<InitialStateKeys>) => {
      stateController.resetDataKey(state, action.payload);
    },
    setDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      const { value, key } = action.payload;
      stateController.setDataKey(state, key, value);
    },
  },
});

export const {
  reset,
  setDataKey,
  resetDataKey,
} = ranking.actions;
export default ranking.reducer;

stateController.updateStateFromUrlParams(stateController.getInitialState());
