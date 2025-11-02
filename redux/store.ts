import { configureStore } from '@reduxjs/toolkit';

import themeReducer from './features/theme-slice';
import userReducer from './features/user-slice';
import favoriteReducer from './features/favorite-slice';
import displayReducer from './features/display-slice';
import gamesReducer from './features/games-slice';
import rankingReducer from './features/ranking-slice';
import teamReducer from './features/team-slice';
import picksReducer from './features/picks-slice';
import compareReducer from './features/compare-slice';
import dictionaryReducer from './features/dictionary-slice';
import coachReducer from './features/coach-slice';
import conferenceReducer from './features/conference-slice';
import organizationReducer from './features/organization-slice';
import gameReducer from './features/game-slice';
import playerReducer from './features/player-slice';
import loadingReducer from './features/loading-slice';


export const makeStore = () => configureStore({
  reducer: {
    themeReducer,
    userReducer,
    favoriteReducer,
    displayReducer,
    gamesReducer,
    rankingReducer,
    teamReducer,
    picksReducer,
    compareReducer,
    dictionaryReducer,
    coachReducer,
    conferenceReducer,
    organizationReducer,
    gameReducer,
    playerReducer,
    loadingReducer,
  },
});

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
