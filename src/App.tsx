import { iNpc, useNpcStore } from './hooks/useNpcStore';
import { useTagStore } from './hooks/useTagStore';
import './App.css';

import { useState } from 'react';
import createNpc from './builders/npc/npcBuilder';
import AppBar from './components/AppBar';
import ResultsGallery from './components/ResultsGallery';
import NpcCard from './components/NpcCard';


function App() {
  const [showPinned, setShowPinned] = useState(true);
  const { npcStore, addNpc } = useNpcStore();
  const { activeTags } = useTagStore();
  const gender = 'male';
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
