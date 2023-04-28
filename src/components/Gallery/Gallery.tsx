import { useTagStore } from '../../hooks/useTagStore';
import { useCardStore, iCard } from '../../hooks/useCardStore';
import { useDeckStore } from '../../hooks/useDeckStore';
import Card from '../Card';
import './Gallery.css';

import { useFlexAnimation } from '../../hooks/useFlexAnimation';
import { useEffect, useState } from 'react';


const Gallery = () => {
  const { cardStore } = useCardStore();
  const { activeTags } = useTagStore();
  const { activeDeck } = useDeckStore();

  const { getFlexItemsInfo, animateFlexItems } = useFlexAnimation('.gallery');
  const [prev_items, setPrevItems] = useState<any[]>([]);


  useEffect(() => {
    const new_items = getFlexItemsInfo();
    if ((prev_items?.length > 0) && (new_items?.length > 0)) animateFlexItems(prev_items, new_items);
    setPrevItems([...new_items]);
  }, [cardStore]);

  let required_tags: number[] = [];
  let optional_tags: number[] = [];

  if (activeDeck) {
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
    let cards_ = [...cards];
    if (activeTags.length > 0) {
      if (optional_tags.length > 0) {
        cards_ = cards_.reduce((results: any[], card: any) => {
          if (optional_tags.some((tag_id: number) => card.tags.includes(tag_id))) results.push(card);
          return results;
        }, []);
      }
      if (required_tags.length > 0) {
        cards_ = cards_.reduce((results: any[], card: any) => {
          if (required_tags.every((tag_id: number) => card.tags.includes(tag_id))) results.push(card);
          return results;
        }, []);
      }
    }
    return cards_.sort((a: iCard, b: iCard) => (Number(b.isPinned) - Number(a.isPinned)) === 0 ? ((a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : (a.label.toLowerCase() < b.label.toLowerCase()) ? -1 : 0) : (Number(b.isPinned) - Number(a.isPinned)));
  };

  return (
    <div className="gallery">
      {filterCards(cardStore).map((card: iCard) => <Card key={card.id} data={card} />)}
    </div>
  );
};

export default Gallery;

