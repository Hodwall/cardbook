import { useState } from 'react';
import { iNpc, useNpcStore } from './hooks/useNpcStore';
import { useTagStore } from './hooks/useTagStore';
import { iCard, useCardStore } from './hooks/useCardStore';
import AppBar from './components/AppBar';
import ResultsGallery from './components/ResultsGallery';
import NpcCard from './components/NpcCard';
import './App.css';

import CustomCard from './components/CustomCard/CustomCard';


function App() {
  const { npcStore } = useNpcStore();
  const { cardStore } = useCardStore();
  const { activeTags } = useTagStore();
  return (
    <div className="App">
      <AppBar />
      {/* <CustomCard edit={false} />
      <CustomCard edit={true} /> */}
      <ResultsGallery>
        {
          (() => {
            let npcs = [];
            let cards = [];
            if (activeTags.length > 0) {
              npcs = npcStore.reduce((results: iNpc[], npc: iNpc) => {
                if (activeTags.every((tag_id: number) => npc.tags.includes(tag_id))) results.push(npc);
                return results;
              }, []);
              cards = cardStore.reduce((results: iCard[], card: iCard) => {
                if (activeTags.every((tag_id: number) => card.tags.includes(tag_id))) results.push(card);
                return results;
              }, []);
            } else {
              npcs = npcStore;
              cards = cardStore;
            }
            return (
              <>
                {npcs.map((npc: iNpc) => <NpcCard key={npc.id} data={npc} />)}
                {cards.map((card: iCard) => <CustomCard key={card.id} data={card} />)}
              </>
            );
          })()
        }
      </ResultsGallery>
    </div>
  );
}

export default App;






// return (
//   <>
//     {/* {
//       npcStore.reduce((results: iNpc[], npc: iNpc) => {
//         if (activeTags.every((tag_id: number) => npc.tags.includes(tag_id))) {
//           results.push(npc);
//         }
//         return results;
//       }, []).map((npc: iNpc) => <NpcCard key={npc.id} data={npc} />)
//     } */}
//     {/* {
//       cardStore.reduce((results: iCard[], card: iCard) => {
//         if (activeTags.every((tag_id: number) => card.tags.includes(tag_id))) {
//           results.push(card);
//         }
//         return results;
//       }, []).map((card: iCard) => <CustomCard />)
//     } */}
//   </>
// );
// // const npcs = npcStore.reduce((results: iNpc[], npc: iNpc) => {
// //   if (activeTags.every((tag_id: number) => npc.tags.includes(tag_id))) {
// //     results.push(npc);
// //   }
// //   return results;
// // }, []).map((npc: iNpc) => <NpcCard key={npc.id} data={npc} />);
// // const cards = cardStore.reduce((results: iCard[], card: iCard) => {
// //   if (activeTags.every((tag_id: number) => card.tags.includes(tag_id))) {
// //     results.push(card);
// //   }
// //   return results;
// // }, []).map((card: iCard) => <CustomCard />);
// // return [...npcs];
