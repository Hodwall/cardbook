import Card from '../Card';
import { useNpcStore } from '../../hooks/useNpcStore';

import human_male from '../../assets/img/human-male.png';
import human_female from '../../assets/img/human-female.png';
import dwarf_male from '../../assets/img/dwarf-male.png';
import dwarf_female from '../../assets/img/dwarf-female.png';
import elf_male from '../../assets/img/elf-male.png';
import elf_female from '../../assets/img/elf-female.png';
import './NpcCard.css';


const ancestry_art: any = {
  'human': { 'male': human_male, 'female': human_female },
  'dwarf': { 'male': dwarf_male, 'female': dwarf_female },
  'elf': { 'male': elf_male, 'female': elf_female }
};


const NpcCard = (props: { data: any; }) => {
  const { pinNpc, unpinNpc, deleteNpc } = useNpcStore();

  const occupation_pre = (props.data.interaction.charAt(0) === ('a' || 'e' || 'i' || 'o' || 'u')) ? 'An' : 'A';

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

  return (
    <Card
      style={`npc-card ${props.data.ancestry}`}
      label={props.data.name}
      art={ancestry_art[props.data.ancestry][props.data.gender]}
      is_pinned={props.data.isPinned}
      front_tools={
        <>
          {props.data.isPinned
            ? <button onClick={() => unpinNpc(props.data.id)}>UNPIN</button>
            : <button onClick={() => pinNpc(props.data.id)}>PIN</button>
          }
          <button onClick={() => deleteNpc(props.data.id)}>DELETE</button>
        </>
      }
      front={
        <>
          <p className="alignment">{props.data.alignment}</p>
          <p className={`relationship ${props.data.relationship}`}>{props.data.relationship}</p>
          <p className='voice'>{`He ${props.data.voice}.`}</p>
          <p className='occupation'>{`${occupation_pre} ${props.data.interaction}, ${props.data.age} ${props.data.occupation}.`}</p>
          <p className='description'>{props.data.description}</p>
        </>
      }
      back={
        <>
          <p className='abilities'><span className="high-ability">▲ {props.data.high_ability}</span><span className="low-ability">▼ {props.data.low_ability}</span></p>
          <p className="occupation">+ {abilityDescriptions.high[props.data.high_ability]}</p>
          <p className="occupation">- {abilityDescriptions.low[props.data.low_ability]}</p>
        </>
      }
    />
  );
};

export default NpcCard;