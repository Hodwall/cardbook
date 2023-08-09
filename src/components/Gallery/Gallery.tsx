//@ts-nocheck
import { useState, useEffect } from 'react';
import { useTagStore } from '../../hooks/useTagStore';
import { useCardStore, iCard } from '../../hooks/useCardStore';
import { useDeckStore } from '../../hooks/useDeckStore';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import Shelf from '../Shelf';
import DisplayCard from '../DisplayCard/DisplayCard';
import Card from '../Card/Card';
import './Gallery.css';


const Gallery = () => {
  const { cardStore } = useCardStore();
  const { activeTags } = useTagStore();
  const { activeDeck } = useDeckStore();
  const { settingsStore } = useSettingsStore();
  const [displayCard, setDisplayCard] = useState<any>(null);

  useEffect(() => {
    setDisplayCard(null);
  }, [settingsStore.displayMode]);

  useEffect(() => {
    console.log(displayCard);
  }, [displayCard]);

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


  const shelveCards = (cards: any[]) => {
    let card_shelves = [{ 'tags': [], 'cards': [] }];
    settingsStore?.shelves?.forEach((shelf) => {
      card_shelves.push({ 'tags': shelf, 'cards': [] });
    });

    cards.forEach((card) => {
      let assigned = false;
      let coincidences = {};

      card_shelves.forEach((shelf, shelf_index) => {
        if (assigned === true || shelf.tags.length < 1) return;
        if (!card.tags.length) return;

        coincidences[shelf_index] = 0;
        card.tags.forEach((tag) => {
          if (shelf.tags.includes(tag)) coincidences[shelf_index]++;
        });
      });

      let max_index = 0;
      let max_value = 0;
      Object.keys(coincidences).forEach((shelf_index) => {
        if (coincidences[shelf_index] > max_value) {
          max_value = coincidences[shelf_index];
          max_index = shelf_index;
        }
      });

      card_shelves[max_index].cards.push(card);
    });
    return card_shelves;
  };

  return (
    <>
      <div className="gallery">
        {shelveCards(filterCards(cardStore)).map((group, index) => <Shelf key={index} id={index} tags={group.tags} cards={group.cards} setDisplayCard={setDisplayCard} />)}
      </div>
      {displayCard && <DisplayCard setDisplayCard={setDisplayCard}><Card data={displayCard} isDisplay={true} setDisplayCard={setDisplayCard} /></DisplayCard>}
    </>
  );
};

export default Gallery;


