import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { npcsSliceState, npc } from './npcsSlice.model';

import { RootState } from '../app/store';

const initialState: npcsSliceState = {
  gender: 'male',
  generated: [],
  saved: []
}

const npcsSlice = createSlice({
  name: 'npcs',
  initialState,
  reducers: {
    addNpc: (state, action: PayloadAction<npc>) => {
      state.generated.push(action.payload);
    },
    deleteAllNpcs: (state) => {
      state.generated = [];
    }
  }
})

export const { addNpc, deleteAllNpcs } = npcsSlice.actions;
export const selectGeneratedNpcs = (state: RootState) => state.npcs.generated;
export const selectGender = (state: RootState) => state.npcs.gender;
export default npcsSlice.reducer;