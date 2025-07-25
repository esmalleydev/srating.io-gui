
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


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
};

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

  // Update state if URL parameters are present
  if (view !== null) {
    state.view = view;
  }

  if (subview !== null) {
    state.subview = subview;
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
  setDataKey,
  reset,
} = game.actions;
export default game.reducer;

updateStateFromUrlParams(initialState);
