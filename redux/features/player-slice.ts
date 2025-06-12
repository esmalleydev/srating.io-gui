
import { Player, PlayerTeamSeason, PlayerTeamSeasons, Team, Teams } from '@/types/general';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  view: string;
  subview: string | null;
  scrollTop: number;
  player: Player;
  player_team_season: PlayerTeamSeason | null;
  player_team_seasons: PlayerTeamSeasons;
  team: Team | null;
  teams: Teams;
  season: number | null;
  loadingView: boolean,
  trendsBoxscoreLine: boolean,
};

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};

const initialState = {
  view: 'stats',
  subview: null,
  scrollTop: 0,
  player: {},
  player_team_season: null,
  player_team_seasons: {},
  team: null,
  teams: {},
  season: null,
  loadingView: true,
  trendsBoxscoreLine: true,
} as InitialState;

const updateStateFromUrlParams = (state: InitialState) => {
  if (typeof window === 'undefined') {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');
  const subview = urlParams.get('subview');

  // we only want to run this if on first load, if the pathname is relevant
  if (!window.location.pathname.includes('player')) {
    return;
  }

  // Update state if URL parameters are present
  if (view !== null) {
    state.view = view;
  }
  if (subview !== null) {
    state.subview = subview;
  }
};

export const player = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      state[action.payload.key] = action.payload.value;
    },
    reset: (state) => {
      for (const key in initialState) {
        // we do not have to reset this one, it is controlled by the contents changing
        if (key !== 'loadingView') {
          state[key] = initialState[key];
        }
      }

      updateStateFromUrlParams(state);
    },
  },
});

export const {
  setDataKey, reset,
} = player.actions;
export default player.reducer;

updateStateFromUrlParams(initialState);
