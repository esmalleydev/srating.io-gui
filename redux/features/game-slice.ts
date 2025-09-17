
import Objector from '@/components/utils/Objector';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


// todo this is really the /sport/games/abc path, this name of "game" is confusing


type InitialState = {
  game: object,
  coaches: object,
  coach_team_seasons: object,
  gameStats: object,
  coachStats: object,
  conferenceStats: object,
  gameStatsLoading: boolean,
  gamePrediction: object,
  gamePredictionLoading: boolean,
  refreshRate: number,
  refreshCountdown: number,
  refreshLoading: boolean,
  refreshEnabled: boolean,
  loadingView: boolean,
  view: string | null,
  subview: string | null,
  trendsColumn: string | null,
};

type ActionPayload<K extends keyof InitialState> = {
  key: K;
  value: InitialState[K];
};

const initialState: InitialState = {
  game: {},
  coaches: {},
  coach_team_seasons: {},
  gameStats: {},
  coachStats: {},
  conferenceStats: {},
  gameStatsLoading: true,
  gamePrediction: {},
  gamePredictionLoading: true,
  refreshRate: 15,
  refreshCountdown: 15,
  refreshLoading: false,
  refreshEnabled: true,
  loadingView: true,
  view: null,
  subview: null,
  trendsColumn: null,
};

const defaultState = Object.freeze(Objector.deepClone(initialState));

const updateStateFromUrlParams = (state: InitialState) => {
  if (typeof window === 'undefined') {
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);

  // we only want to run this if on first load, if the pathname is relevant
  if (!window.location.pathname.includes('games')) {
    return;
  }

  const view = urlParams.get('view');
  const subview = urlParams.get('subview');
  const trendsColumn = urlParams.get('trendsColumn');

  // Update state if URL parameters are present
  if (view !== null) {
    state.view = view;
  }

  if (subview !== null) {
    state.subview = subview;
  }

  if (trendsColumn !== null) {
    state.trendsColumn = trendsColumn;
  }
};


export const game = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setDataKey: <K extends keyof InitialState>(state: InitialState, action: PayloadAction<ActionPayload<K>>) => {
      state[action.payload.key] = action.payload.value;
    },
    reset: (state) => {
      for (const key in defaultState) {
        // we do not have to reset this one, it is controlled by the contents changing
        if (key !== 'loadingView') {
          state[key] = defaultState[key];
        }
      }

      updateStateFromUrlParams(state);
    },
  },
});

export const {
  setDataKey,
  reset,
} = game.actions;
export default game.reducer;

updateStateFromUrlParams(initialState);
