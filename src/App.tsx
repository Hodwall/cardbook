import { useNpcStore, iNpc } from './hooks/useNpcStore';
import { useTagStore } from './hooks/useTagStore';
import { useCardStore, iCard } from './hooks/useCardStore';
import { useDeckStore } from './hooks/useDeckStore';
import AppBar from './components/AppBar';
import ResultsGallery from './components/ResultsGallery';
import NpcCard from './components/NpcCard';
import CustomCard from './components/CustomCard/CustomCard';
import './App.css';
import Card from './components/Card';


function App() {
  const { npcStore } = useNpcStore();
  const { cardStore } = useCardStore();
  const { activeTags } = useTagStore();
  const { activeDeck } = useDeckStore();

  let required_tags: number[] = [];
  let optional_tags: number[] = [];

  if (activeDeck) {
    console.log(activeDeck);
    if (activeDeck.isStrict) {
      required_tags = [... new Set([...activeDeck.tags, ...activeTags])];
    } else {
      required_tags = [...(activeTags.filter((tag: number) => !activeDeck.tags.includes(tag)))];
      optional_tags = [...activeDeck.tags];
    }
  } else {
    required_tags = [...activeTags];
  }

  const filterCards = (cards: any[]) => {
    let result_cards = [...cards];
    if (activeTags.length > 0) {
      if (optional_tags.length > 0) {
        result_cards = result_cards.reduce((results: any[], card: any) => {
          if (optional_tags.some((tag_id: number) => card.tags.includes(tag_id))) results.push(card);
          return results;
        }, []);
      }
      if (required_tags.length > 0) {
        result_cards = result_cards.reduce((results: any[], card: any) => {
          if (required_tags.every((tag_id: number) => card.tags.includes(tag_id))) results.push(card);
          return results;
        }, []);
      }
    }
    return result_cards.sort((a: iCard, b: iCard) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0);
  };

  return (
    <div className="App">
      <AppBar />
      <ResultsGallery>
        {/* {filterCards(npcStore).map((card: iCard) => <NpcCard key={card.id} data={card} />)} */}
        {filterCards(cardStore).map((card: iCard) => <Card key={card.id} data={card} />)}
      </ResultsGallery>
    </div>
  );
}

export default App;