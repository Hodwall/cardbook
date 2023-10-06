import { useRef, useEffect, useState } from 'react';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import { useCardStore } from '../../hooks/useCardStore';
import Card from '../Card';
import './DisplayCard.css';


const DisplayCard = () => {
  const { settingsStore, setDisplayCard } = useSettingsStore();
  const { cardStore } = useCardStore();
  const [card, setCard] = useState(null);

  useEffect(() => {
    setCard(cardStore.find((c: any) => c.id === settingsStore.displayCard));
  }, [settingsStore.displayCard]);

  console.log(card);

  // HANDLE OUTSIDE CLICKS
  const ref = useRef<any>(null);
  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setDisplayCard(null);
    }
  };
  useEffect(() => {
    const delta = 6;
    let startX: number;
    let startY: number;
    document.addEventListener('mousedown', function (event) {
      startX = event.pageX;
      startY = event.pageY;
    });
    document.addEventListener('mouseup', function (event) {
      const diffX = Math.abs(event.pageX - startX);
      const diffY = Math.abs(event.pageY - startY);
      if (diffX < delta && diffY < delta) {
        handleClickOutside(event);
      }
    });
  }, []);

  return (
    <div className={`display-card ${!card ? 'hidden' : ''}`} ref={ref}>
      {card && <Card data={card} isDisplay />}
    </div>
  );
};

export default DisplayCard;