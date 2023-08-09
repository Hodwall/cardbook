import { useRef, useEffect, createContext, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import './DisplayCard.css';

export const DisplayEditableContext = createContext(true);

const DisplayCard = (props: {
  setDisplayCard: Function,
  children: any;
}) => {
  const [displayEditable, setDisplayEditable] = useState(true);

  // HANDLE OUTSIDE CLICKS
  const ref = useRef<any>(null);
  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      if (props.setDisplayCard) {
        props.setDisplayCard(null);
        setDisplayEditable(false);
      }
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
    <div className={'display-card'} ref={ref}>
      <DisplayEditableContext.Provider value={displayEditable}>
        <button onClick={() => props.setDisplayCard(null)}>X</button>
        {props.children}
      </DisplayEditableContext.Provider>
    </div>
  );
};

export default DisplayCard;