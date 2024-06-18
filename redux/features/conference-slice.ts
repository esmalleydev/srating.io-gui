import { TeamSeasonConferences, Rankings, StatisticRankings, Teams } from "@/types/cbb";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  view: string,
  scrollTop: number,
  team_season_conferences: TeamSeasonConferences | {};
  teams: Teams | {};
  cbb_statistic_rankings: StatisticRankings | {};
  cbb_rankings: Rankings | {};
};

const initialState = {
  view: 'trends',
  scrollTop: 0,
  team_season_conferences: {},
  teams: {},
  cbb_statistic_rankings: {},
  cbb_rankings: {},
} as InitialState;

const updateStateFromUrlParams = (state: InitialState) => {
  if (typeof window === 'undefined') {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');

  // Update state if URL parameters are present
  if (view !== null) {
    state.view = view;
  }
};

export const conference = createSlice({
  name: 'conference',
  initialState: initialState,
  reducers: {
    clear: (state) => {
      for (let key in initialState) {
        state[key] = initialState[key];
      }
    },
    reset: (state) => {
      updateStateFromUrlParams(state);
    },
    setScrollTop: (state, action: PayloadAction<number>) => {
      state.scrollTop = action.payload;
    },
    setView: (state, action: PayloadAction<string>) => {
      state.view = action.payload;
    },
    setTeamSeasonConferences: (state, action: PayloadAction<TeamSeasonConferences | {}>) => {
      state.team_season_conferences = action.payload;
    },
    setTeams: (state, action: PayloadAction<Teams | {}>) => {
      state.teams = action.payload;
    },
    setStatisticRankings: (state, action: PayloadAction<StatisticRankings | {}>) => {
      state.cbb_statistic_rankings = action.payload;
    },
    setRankings: (state, action: PayloadAction<Rankings | {}>) => {
      state.cbb_rankings = action.payload;
    },
  }
});

export const { setView, setScrollTop, clear, reset, setTeamSeasonConferences, setTeams, setStatisticRankings, setRankings } = conference.actions;
export default conference.reducer;

updateStateFromUrlParams(initialState);
