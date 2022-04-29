import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import npcsReducer from '../features/npcsSlice';

export const store = configureStore({
  reducer: {
    npcs: npcsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
