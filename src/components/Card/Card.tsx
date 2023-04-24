import { useEffect, useRef, useState } from 'react';
import { useSpring, animated, a } from 'react-spring';
import ReactQuill from 'react-quill';
import { useTagStore, iTag } from '../../hooks/useTagStore';
import { useCardStore, iCard } from '../../hooks/useCardStore';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import BackgroundPicker from '../BackgroundPicker/BackgroundPicker';
import CardStat from '../CardStat/CardStat';
import ColorPicker from '../ColorPicker/ColorPicker';
import Tag from '../Tag';
import { FaTags } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { IoIosCopy } from 'react-icons/io';
import { MdAddCircle, MdBarChart, MdDeleteForever, MdEdit } from 'react-icons/md';
import 'react-quill/dist/quill.snow.css';
import './Card.css';


const Card = (props: { data: iCard; }) => {
  const { tagStore, createTag } = useTagStore();
  const { updateCardContent, updateCardLabel, updateCardColor, deleteCard, addTagToCard, removeTagFromCard, addStatToCard, copyCard, updateCardBackground } = useCardStore();
  const { settingsStore } = useSettingsStore();
  const [editMode, setEditMode] = useState(false);
  const [editStatsMode, setEditStatsMode] = useState(false);
  const [label, setLabel] = useState(props.data.label);
  const [content, setContent] = useState(props.data.content || '');
  const [flipped, setFlipped] = useState(false);
  const [displayTagsDialog, setDisplayTagsDialog] = useState(false);
  const [resultsTagsDialog, setResultsTagsDialog] = useState(tagStore);
  const [searchTagsString, setSearchTagsString] = useState('');

  useEffect(() => {
    if (!editMode) {
      updateCardLabel(label, props.data.id);
      updateCardContent(content, props.data.id);
    }
  }, [editMode]);

  useEffect(() => {
    if (!searchTagsString || searchTagsString === '') {
      setResultsTagsDialog(tagStore);
    } else {
      setResultsTagsDialog(tagStore.reduce((results: iTag[], tag: iTag) => {
        if (tag.label.search(searchTagsString) != -1) results.push(tag);
        return results;
      }, []));
    }
  }, [tagStore, searchTagsString]);

  // REACT-SPRING ANIMATIONS
  const animation = useSpring({
    to: { opacity: 1, y: 0, scale: 1, rotateZ: 0, rotateX: 0 },
    from: { opacity: 0, y: -10, scale: 1.2, rotateZ: -10, rotateX: -80 },
    config: { mass: 5, friction: 120, tension: 1000 }
  });
  const { transform, opacity, } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 10, friction: 150, tension: 1000 },
  });

  // REACT-QUILL SETUP
  const modules = (() => {
    return {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'color': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
      ]
    };
  })();

  // HANDLE OUTSIDE CLICKS
  const ref = useRef<any>(null);
  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setDisplayTagsDialog(false);
      setEditMode(false);
      setEditStatsMode(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  // HANDLERS
  const handleChangeColor = (color: any) => {
    updateCardColor(color, props.data.id);
  };

  const handleChangeBackground = (background: string) => {
    updateCardBackground(background, props.data.id);
  };

  const handleFlip = () => {
    if (!editMode && !editStatsMode) {
      setFlipped(!flipped);
      setSearchTagsString('');
      setDisplayTagsDialog(false);
    }
  };

  const handleSearchTagsChange = (e: any) => {
    setSearchTagsString(e.target.value);
  };

  const handleSearchTagsKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      if (resultsTagsDialog.length === 0) {
        e.preventDefault();
        addTagToCard(props.data.id, createTag({ label: searchTagsString, type: 'default' }));
        setSearchTagsString('');
      }
    }
  };

  console.log(settingsStore.cardScale);

  const card_side_bg = `${props.data.background ? `url(${props.data.background})` : ''} 0 0 / auto 100%, linear-gradient(180deg, ${props.data.color || 'hsl(0deg 6% 45%)'} 0%, hsl(0, 0%, 20%) 100%)`;

  return (
    <animated.div className={`card`} style={{ ...animation, fontSize: `${settingsStore.cardScale}%` }} ref={ref}>

      <a.div className={'card-side'} style={{
        opacity: opacity.to(o => 1 - o), transform,
        background: card_side_bg,
      }} onClick={handleFlip}>
        <div className={'card-header'}>
          {
            editMode ?
              <textarea value={label} onChange={(e: any) => setLabel(e.target.value)} />
              :
              <div className={'card-label'}>{props.data.label}</div>
          }
          {/* {props.art && <div className='card-art'><img className="art" src={props.art} alt={props.art} /></div>} */}
        </div>
        <div className={'card-body'}>
          <div className={'card-stats'}>
            {
              props.data.stats?.map((stat) =>
                <CardStat
                  stat={stat}
                  cardId={props.data.id}
                  editMode={editStatsMode}
                />
              )
            }
          </div>
          <ReactQuill
            className={editMode ? '' : 'hide_toolbar'}
            theme="snow"
            value={content}
            readOnly={!editMode}
            onChange={(val: any) => setContent(val)}
            modules={modules}
          />
        </div>
        <div className={'card-tools'} onClick={(e) => e.stopPropagation()}>
          {
            !flipped &&
            <>
              {
                (() => {
                  if (editMode) {
                    return <button onClick={() => setEditMode(false)}><RiArrowGoBackFill /></button>;
                  } else if (editStatsMode) {
                    return (
                      <>
                        <button onClick={() => setEditStatsMode(false)}><RiArrowGoBackFill /></button>
                        <button onClick={() => addStatToCard(props.data.id)}><MdAddCircle /></button>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <button onClick={() => setEditMode(true)}><MdEdit /></button>
                        <button onClick={() => setEditStatsMode(true)}><MdBarChart /></button>
                        <button onClick={() => copyCard(props.data.id)}><IoIosCopy /></button>
                        <button onClick={(e) => { e.preventDefault(); deleteCard(props.data.id); }}><MdDeleteForever /></button>
                        <ColorPicker defaultColor={props.data.color} changeColorHandler={handleChangeColor} />
                        <BackgroundPicker changeBackgroundHandler={handleChangeBackground} />
                      </>
                    );
                  }
                })()
              }
            </>
          }
        </div>
      </a.div>

      <a.div className={'card-side card-back'} style={{
        opacity, transform, rotateY: '180deg', display: flipped ? 'grid' : 'none',
        background: card_side_bg,
      }} onClick={handleFlip}>
        <div className={'card-body'} onClick={handleFlip}>
          <div className={'card-tags'}>{
            props.data.tags?.reduce((results: any[], tag_id: any) => {
              results.push({
                id: tag_id,
                label: tagStore.find((el: any) => el.id === tag_id)?.label
              });
              return results;
            }, [])
              .sort((a: iTag, b: iTag) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0)
              .map((tag: iTag, index: number) =>
                <Tag
                  key={index}
                  id={tag.id}
                  label={tag.label}
                  deleteHandler={removeTagFromCard(props.data.id, tag.id)}
                  canDelete />)
          }</div>
        </div>
        <div className={'card-tools'} onClick={(e) => e.stopPropagation()}>
          {
            flipped &&
            <>
              {
                displayTagsDialog
                  ?
                  <animated.div className={'card-tags-dialog'} style={animation} >
                    <div className={'card-tags-dialog-results'}>
                      {
                        resultsTagsDialog.reduce((results: iTag[], tag: iTag) => {
                          if (!props.data.tags.includes(tag.id)) {
                            results.push(tag);
                          }
                          return results;
                        }, [])
                          .sort((a: iTag, b: iTag) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0)
                          .map((tag: iTag, index: number) => <Tag key={index} id={tag.id} label={tag.label} clickHandler={addTagToCard(props.data.id, tag.id)} deleteHandler={removeTagFromCard(props.data.id, tag.id)} />)
                      }
                    </div>
                    <form>
                      <input type="text" value={searchTagsString} onChange={handleSearchTagsChange} onKeyDown={handleSearchTagsKeyDown} autoFocus />
                    </form>
                  </animated.div>
                  :
                  <button onClick={(e) => { e.preventDefault(); setDisplayTagsDialog(!displayTagsDialog); }}><FaTags /></button>
              }
            </>
          }
        </div>
      </a.div>
    </animated.div >
  );
};

export default Card;