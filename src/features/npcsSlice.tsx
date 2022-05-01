import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { npcsSliceState, npc } from './npcsSlice.model';

import { RootState } from '../app/store';


const previousState = document.cookie && JSON.parse(document.cookie);

const initialState: npcsSliceState = previousState || {
  gender: 'male',
  generated: [],
  stored: []
}

const npcsSlice = createSlice({
  name: 'npcs',
  initialState,
  reducers: {
    addNpc: (state, action: PayloadAction<npc>) => {
      state.generated.push(action.payload);
      document.cookie = JSON.stringify(state);
    },
    deleteAllNpcs: (state) => {
      state.generated = [];
      state.stored = [];
      document.cookie = JSON.stringify(state);
    },
    deleteNotStoredNpcs: (state) => {
      state.generated = state.generated.filter((npc) => npc.isStored === true);
      document.cookie = JSON.stringify(state);
    },
    storeNpc: (state, action: PayloadAction<number>) => {
      const npc = state.generated.find(npc => npc.id === action.payload);
      if (npc) {
        npc.isStored = true;
        state.stored.push(npc);
        document.cookie = JSON.stringify(state);
      }
    },
    removeNpc: (state, action: PayloadAction<number>) => {
      const npc = state.generated.find(npc => npc.id === action.payload);
      if (npc) {
        npc.isStored = false;
        state.stored = state.stored.filter((npc) => npc.id != action.payload);
        document.cookie = JSON.stringify(state);
      }
    },
    deleteNpc: (state, action: PayloadAction<number>) => {
      state.generated = state.generated.filter((npc) => npc.id != action.payload);
      state.stored = state.stored.filter((npc) => npc.id != action.payload);
      document.cookie = JSON.stringify(state);
    }
  }
})

export const { addNpc, deleteAllNpcs, storeNpc, removeNpc, deleteNpc, deleteNotStoredNpcs } = npcsSlice.actions;
export const selectGeneratedNpcs = (state: RootState) => state.npcs.generated;
export const selectStoredNpcs = (state: RootState) => state.npcs.stored;
export const selectGender = (state: RootState) => state.npcs.gender;
export default npcsSlice.reducer;