import { useEffect, useState } from 'react';
import Card from '../Card';
import { useNpcStore } from '../../hooks/useNpcStore';
import { useTagStore, iTag } from '../../hooks/useTagStore';
import human_male from '../../assets/img/human-male.png';
import human_female from '../../assets/img/human-female.png';
import dwarf_male from '../../assets/img/dwarf-male.png';
import dwarf_female from '../../assets/img/dwarf-female.png';
import elf_male from '../../assets/img/elf-male.png';
import elf_female from '../../assets/img/elf-female.png';
import './NpcCard.css';
import NavTag from '../NavTag';
import { animated, useSpring } from 'react-spring';


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
  const { tagStore, createTag } = useTagStore();
  const [flipped, setFlipped] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [displayTagsDialog, setDisplayTagsDialog] = useState(false);
  const [resultsTagsDialog, setResultsTagsDialog] = useState(tagStore);
  const animation = useSpring({
    to: { opacity: 1, y: 0, scale: 1, rotateZ: 0, rotateX: 0 },
    from: { opacity: 0, y: -10, scale: 1.2, rotateZ: -10, rotateX: -80 },
    config: { mass: 5, friction: 120, tension: 1000 }
  });
  const occupation_pre = (props.data.interaction.charAt(0) === ('a' || 'e' || 'i' || 'o' || 'u')) ? 'An' : 'A';

  useEffect(() => {
    setSearchString('');
    setDisplayTagsDialog(false);
  }, [flipped]);

  useEffect(() => {
    if (!searchString || searchString === '') {
      setResultsTagsDialog(tagStore);
    } else {
      setResultsTagsDialog(tagStore.reduce((results: iTag[], tag: iTag) => {
        if (tag.label.search(searchString) != -1) results.push(tag);
        return results;
      }, []));
    }
  }, [tagStore, searchString]);

  const handleSearchChange = (e: any) => {
    setSearchString(e.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('search change');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (resultsTagsDialog.length === 0) {
        let new_tag = { label: searchString, type: 'default' };
        createTag(new_tag);
        setSearchString('');
      }
    }
  };

  const handleAddTag = (tag_id: number) => {
    addTagToNpc(props.data.id, tag_id);
  };

  const handleDeleteTag = (tag_id: number) => {
    removeTagFromNpc(props.data.id, tag_id);
  };

  return (
    <Card
      style={`npc-card ${props.data.ancestry} ${displayTagsDialog && 'priority'}`}
      label={props.data.name}
      art={ancestry_art[props.data.ancestry][props.data.gender]}
      is_pinned={props.data.isPinned}
      updateFlipped={setFlipped}
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
          {/* <p className='abilities'><span className="high-ability">▲ {props.data.high_ability}</span><span className="low-ability">▼ {props.data.low_ability}</span></p>
          <p className="occupation">+ {abilityDescriptions.high[props.data.high_ability]}</p>
          <p className="occupation">- {abilityDescriptions.low[props.data.low_ability]}</p> */}
          <div className="npc-tags">{props.data.tags?.map((tag: any, index: number) => <NavTag key={index} id={tag} label={tagStore.find((el: any) => el.id === tag)?.label} deleteHandler={handleDeleteTag} />)}</div>
        </>
      }
      front_tools={
        <>
          {props.data.isPinned
            ? <button onClick={(e) => { e.preventDefault(); unpinNpc(props.data.id); }}>UNPIN</button>
            : <button onClick={(e) => { e.preventDefault(); pinNpc(props.data.id); }}>PIN</button>
          }
          <button onClick={(e) => { e.preventDefault(); deleteNpc(props.data.id); }}>DELETE</button>
        </>
      }
      back_tools={
        <>
          <button onClick={(e) => { e.preventDefault(); setDisplayTagsDialog(!displayTagsDialog); }}>ADD TAG</button>
          {
            displayTagsDialog &&
            <animated.div className="tags-dialog" style={animation}>
              <div className="tags-results">
                {
                  resultsTagsDialog.map((tag: iTag, index: number) => <NavTag key={index} id={tag.id} label={tag.label} clickHandler={handleAddTag} />)
                }
              </div>
              <form>
                <input type="text" value={searchString} onChange={handleSearchChange} onKeyDown={handleKeyDown} autoFocus />
              </form>
            </animated.div>
          }
        </>
      }
    />
  );
};

export default NpcCard;