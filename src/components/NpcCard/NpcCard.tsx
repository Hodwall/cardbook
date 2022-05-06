import Card from '../Card';
import './NpcCard.css';
import { npc } from '../../features/npcsSlice.model';

import { useAppDispatch } from '../../app/hooks';
import { storeNpc, deleteNpc, removeNpc } from '../../features/npcsSlice';

import dwarfMale from '../../img/dwarf-male.png';
import human from '../../img/human.png';
import React from 'react';

const NpcCard = (props: { data: npc }) => {
  const dispatch = useAppDispatch();
  const occupation_pre = (props.data.interaction.charAt(0) === ('a' || 'e' || 'i' || 'o' || 'u')) ? 'An' : 'A';

  return (
    <Card
      class={`npc-card ${props.data.ancestry}`}
      label={props.data.name}
      art={props.data.ancestry === 'human' ? human : dwarfMale}
      stored={props.data.isStored}
      tools={
        <React.Fragment>
          {props.data.isStored
            ? <button onClick={() => dispatch(removeNpc(props.data.id))}>REMOVE</button>
            : <button onClick={() => dispatch(storeNpc(props.data.id))}>STORE</button>
          }
          <button onClick={() => dispatch(deleteNpc(props.data.id))}>DELETE</button>
        </React.Fragment>
      }
      front={
        <React.Fragment>
          <p className="alignment">{props.data.alignment}</p>
          <p className={`relationship ${props.data.relationship}`}>{props.data.relationship}</p>
          <p className='voice'>Has a gravel voice</p>
          <p className='occupation'>{`${occupation_pre} ${props.data.interaction} ${props.data.occupation}, who believes in Respect`}</p>
          <p className='description'>He has black long hair. His nose is wide. His beard is short and braided. He wears a worn leather hood.</p>
        </React.Fragment>
      }
      back={
        <React.Fragment>
          <p className='abilities'><span className="high-ability">▲ DEX</span><span className="low-ability">▼ CHA</span></p>
        </React.Fragment>
      }
    />
  )
}

export default NpcCard;