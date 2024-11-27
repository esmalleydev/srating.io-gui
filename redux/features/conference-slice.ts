import { StatisticRankings as StatsCBB } from '@/types/cbb';
import { StatisticRankings as StatsCFB } from '@/types/cfb';
import { Elos, Teams, TeamSeasonConferences } from '@/types/general';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  view: string,
  scrollTop: number,
  // conference_id: string | null,
  team_season_conferences: TeamSeasonConferences | object;
  teams: Teams | object;
  statistic_rankings: StatsCBB | StatsCFB;
  elos: Elos | object;
  predictions: object,
  predictionsLoading: boolean,
};

const initialState = {
  view: 'trends',
  scrollTop: 0,
  // conference_id: null,
  team_season_conferences: {},
  teams: {},
  statistic_rankings: {},
  elos: {},
  predictions: {},
  predictionsLoading: true,
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
  initialState,
  reducers: {
    clear: (state) => {
      for (const key in initialState) {
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
    // setConferenceID: (state, action: PayloadAction<string>) => {
    //   state.conference_id = action.payload;
    // },
    setTeamSeasonConferences: (state, action: PayloadAction<TeamSeasonConferences | object>) => {
      state.team_season_conferences = action.payload;
    },
    setTeams: (state, action: PayloadAction<Teams | object>) => {
      state.teams = action.payload;
    },
    setStatisticRankings: (state, action: PayloadAction<StatsCBB | StatsCFB>) => {
      state.statistic_rankings = action.payload;
    },
    setElos: (state, action: PayloadAction<Elos>) => {
      state.elos = action.payload;
    },
    setPredictions: (state, action: PayloadAction<object>) => {
      state.predictions = action.payload;
    },
    setPredictionsLoading: (state, action: PayloadAction<boolean>) => {
      state.predictionsLoading = action.payload;
    },
  },
});

export const {
  setView, setScrollTop, clear, reset, setTeamSeasonConferences, setTeams, setStatisticRankings, setElos, setPredictions, setPredictionsLoading,
} = conference.actions;
export default conference.reducer;

updateStateFromUrlParams(initialState);
