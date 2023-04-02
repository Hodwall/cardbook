import { useState } from 'react';
import { iNpc, useNpcStore } from './hooks/useNpcStore';
import { useTagStore } from './hooks/useTagStore';
import AppBar from './components/AppBar';
import ResultsGallery from './components/ResultsGallery';
import NpcCard from './components/NpcCard';
import './App.css';


function App() {
  const { npcStore } = useNpcStore();
  const { activeTags } = useTagStore();
  return (
    <div className="App">
      <AppBar />
      <ResultsGallery>
        {
          (() => {
            if (activeTags.length > 0) {
              return npcStore.reduce((results: iNpc[], npc: iNpc) => {
                if (activeTags.every((tag_id: number) => npc.tags.includes(tag_id))) {
                  results.push(npc);
                }
                return results;
              }, []);
            } else {
              return npcStore;
            }
          })().map((npc: iNpc) => <NpcCard key={npc.id} data={npc} />)
        }
      </ResultsGallery>
    </div>
  );
}

export default App;
