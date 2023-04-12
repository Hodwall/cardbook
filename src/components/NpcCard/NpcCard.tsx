import { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import Card from '../Card';
import Tag from '../Tag';
import { useNpcStore } from '../../hooks/useNpcStore';
import { useTagStore, iTag } from '../../hooks/useTagStore';
import human_male from '../../assets/img/human-male.png';
import human_female from '../../assets/img/human-female.png';
import dwarf_male from '../../assets/img/dwarf-male.png';
import dwarf_female from '../../assets/img/dwarf-female.png';
import elf_male from '../../assets/img/elf-male.png';
import elf_female from '../../assets/img/elf-female.png';
import { MdDeleteForever } from 'react-icons/md';
import { RiPushpinFill, RiPushpinLine } from 'react-icons/ri';

import './NpcCard.css';


interface abilityDescriptions {
  high: { [key: string]: string; },
  low: { [key: string]: string; },
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
};
const ancestry_art: any = {
  'human': { 'male': human_male, 'female': human_female },
  'dwarf': { 'male': dwarf_male, 'female': dwarf_female },
  'elf': { 'male': elf_male, 'female': elf_female }
};


const NpcCard = (props: { data: any; }) => {
  const { pinNpc, unpinNpc, deleteNpc, addTagToNpc, removeTagFromNpc } = useNpcStore();
  const occupation_pre = (props.data.interaction.charAt(0) === ('a' || 'e' || 'i' || 'o' || 'u')) ? 'An' : 'A';

  const addTagHandler = (tag_id: number) => {
    addTagToNpc(props.data.id, tag_id);
  };

  const deleteTagHandler = (tag_id: number) => {
    removeTagFromNpc(props.data.id, tag_id);
  };

  return (
    <Card
      tags={props.data.tags}
      handleAddTag={addTagHandler}
      handleDeleteTag={deleteTagHandler}
      style={`npc-card ${props.data.ancestry}`}
      label={props.data.name}
      art={ancestry_art[props.data.ancestry][props.data.gender]}
      content={
        <>
          <p className="alignment">{props.data.alignment}</p>
          <p className={`relationship ${props.data.relationship}`}>{props.data.relationship}</p>
          <p className='voice'>{`He ${props.data.voice}.`}</p>
          <p className='occupation'>{`${occupation_pre} ${props.data.interaction}, ${props.data.age} ${props.data.occupation}.`}</p>
          <p className='description'>{props.data.description}</p>
        </>
      }
      tools={
        <>
          {props.data.isPinned
            ? <button onClick={(e) => { e.preventDefault(); unpinNpc(props.data.id); }}><RiPushpinLine /></button>
            : <button onClick={(e) => { e.preventDefault(); pinNpc(props.data.id); }}><RiPushpinFill /></button>
          }
          <button onClick={(e) => { e.preventDefault(); deleteNpc(props.data.id); }}><MdDeleteForever /></button>
        </>
      }
    />
  );
};

export default NpcCard;