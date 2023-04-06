import { iNpc, useNpcStore } from './hooks/useNpcStore';
import { useTagStore } from './hooks/useTagStore';
import { iCard, useCardStore } from './hooks/useCardStore';
import AppBar from './components/AppBar';
import ResultsGallery from './components/ResultsGallery';
import NpcCard from './components/NpcCard';
import CustomCard from './components/CustomCard/CustomCard';
import './App.css';


function App() {
  const { npcStore } = useNpcStore();
  const { cardStore } = useCardStore();
  const { activeTags } = useTagStore();

  return (
    <div className="App">
      <AppBar />
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
            const npcs_sorted = npcs.sort((a: iNpc, b: iNpc) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
            const cards_sorted = cards.sort((a: iCard, b: iCard) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0);
            return (
              <>
                {npcs_sorted.map((npc: iNpc) => <NpcCard key={npc.id} data={npc} />)}
                {cards_sorted.map((card: iCard) => <CustomCard key={card.id} data={card} />)}
              </>
            );
          })()
        }
      </ResultsGallery>
    </div>
  );
}

export default App;