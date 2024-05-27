import { Coach, CoachTeamSeasons, StatisticRankings, Teams } from "@/types/cbb";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  view: string,
  scrollTop: number,
  coach: Coach | {},
  coach_team_seasons: CoachTeamSeasons | {};
  teams: Teams | {};
  cbb_statistic_rankings: StatisticRankings | {};
};

const initialState = {
  view: 'seasons',
  scrollTop: 0,
  coach: {},
  coach_team_seasons: {},
  teams: {},
  cbb_statistic_rankings: {},
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

export const coach = createSlice({
  name: 'coach',
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
    setCoach: (state, action: PayloadAction<Coach | {}>) => {
      state.coach = action.payload;
    },
    setCoachTeamSeasons: (state, action: PayloadAction<CoachTeamSeasons | {}>) => {
      state.coach_team_seasons = action.payload;
    },
    setTeams: (state, action: PayloadAction<Teams | {}>) => {
      state.teams = action.payload;
    },
    setStatisticRankings: (state, action: PayloadAction<StatisticRankings | {}>) => {
      state.cbb_statistic_rankings = action.payload;
    },
  }
});

export const { setView, setScrollTop, clear, reset, setCoach, setCoachTeamSeasons, setTeams, setStatisticRankings } = coach.actions;
export default coach.reducer;

updateStateFromUrlParams(initialState);
