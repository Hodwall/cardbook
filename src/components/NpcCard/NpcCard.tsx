import Card from '../Card';
import './NpcCard.css';
import { npc } from '../../features/npcsSlice.model';
import { storeNpc, deleteNpc, removeNpc } from '../../features/npcsSlice';
import { useAppDispatch } from '../../app/hooks';

import humanMale from '../../img/human-male.png';
import humanFemale from '../../img/human-female.png';
import dwarfMale from '../../img/dwarf-male.png';
import dwarfFemale from '../../img/dwarf-female.png';
import elfMale from '../../img/elf-male.png';
import elfFemale from '../../img/elf-female.png';

import React from 'react';

const ancestryArt: any = { 
  'human': {'male': humanMale, 'female': humanFemale},
  'dwarf': {'male': dwarfMale, 'female': dwarfFemale},
  'elf': {'male': elfMale, 'female': elfFemale}
 };


const NpcCard = (props: { data: npc }) => {
  const dispatch = useAppDispatch();
  const occupation_pre = (props.data.interaction.charAt(0) === ('a' || 'e' || 'i' || 'o' || 'u')) ? 'An' : 'A';

  interface abilityDescriptions {
    high: { [key: string]: string },
    low: { [key: string]: string },
  }
  const abilityDescriptions: abilityDescriptions = {
    high: {
      str: 'Powerful, brawny. Strong as an ox.',
      dex: 'Lithe, agile, graceful.',
      con: 'Hardy, hale, healthy.',
      int: 'Studious, learned, inquisitive.',
      wis: 'Perceptive, spiritual, insightful.',
      cha: 'Persuasive, forceful, born leader.'
    },
    low: {
      str: 'Feeble, scrawny. Weak.',
      dex: 'Clumsy, fumbling.',
      con: 'Sickly, pale.',
      int: 'Dim-witted, slow.',
      wis: 'Oblivious, absent-minded.',
      cha: 'Dull, boring.'
    }
  }

  return (
    <Card
      class={`npc-card ${props.data.ancestry}`}
      label={props.data.name}
      art={ancestryArt[props.data.ancestry][props.data.gender]}
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
          <p className='voice'>{`He ${props.data.voice}.`}</p>
          <p className='occupation'>{`${occupation_pre} ${props.data.interaction}, ${props.data.age} ${props.data.occupation}.`}</p>
          <p className='description'>{props.data.description}</p>
        </React.Fragment>
      }
      back={
        <React.Fragment>
          <p className='abilities'><span className="high-ability">▲ {props.data.high_ability}</span><span className="low-ability">▼ {props.data.low_ability}</span></p>
          <p className="occupation">+ {abilityDescriptions.high[props.data.high_ability]}</p>
          <p className="occupation">- {abilityDescriptions.low[props.data.low_ability]}</p>
        </React.Fragment>
      }
    />
  )
}

export default NpcCard;