import { useEffect, useRef, useState } from 'react';
import { useSpring, animated, a } from 'react-spring';
import ReactQuill, { Quill } from 'react-quill';
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
import { RiPushpinFill, RiPushpinLine } from 'react-icons/ri';
import 'react-quill/dist/quill.snow.css';
import './Card.css';


const Card = (props: { data: iCard; }) => {
  const { tagStore, createTag, getTagByLabel } = useTagStore();
  const { updateCardContent, updateCardLabel, updateCardColor, deleteCard, addTagToCard, removeTagFromCard, addStatToCard, copyCard, updateCardBackground, setCardPinned } = useCardStore();
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
        [{ 'lists': [{ 'list': 'ordered' }, { 'list': 'bullet' }] }],
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
    }
  };

  const handleSearchTagsChange = (e: any) => {
    setSearchTagsString(e.target.value);
  };

  const handleSearchTagsKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (resultsTagsDialog.length === 0) addTagToCard(props.data.id, createTag({ label: searchTagsString, type: 'default' }));
      else addTagToCard(props.data.id, getTagByLabel(searchTagsString));
      setSearchTagsString('');
    }
  };

  const handleAddTag = (tag_id: number) => {
    addTagToCard(props.data.id, tag_id);
  };

  const handleRemoveTag = (tag_id: number) => {
    removeTagFromCard(props.data.id, tag_id);
  };

  const card_side_bg = `${props.data.background ? `url(${props.data.background})` : ''} 0 0 / auto 100%, linear-gradient(180deg, ${props.data.color || 'hsl(0deg 6% 45%)'} 0%, hsl(0, 0%, 20%) 125%)`;

  return (
    <animated.div id={`card-${props.data.id}`} className={`card`} style={{ ...animation, fontSize: `${settingsStore.cardScale}%` }} ref={ref}>
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
              props.data.stats?.map((stat, index) =>
                <CardStat
                  key={index}
                  stat={stat}
                  cardId={props.data.id}
                  editMode={editStatsMode}
                />
              )
            }
          </div>
          <div id={`#toolbar`} className={`ql-toolbar ql-snow ${editMode ? '' : 'hidden'} toolbar-${props.data.id}`}>
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-blockquote" />
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <select className="ql-align" />
            <select className="ql-color" />
            <button className="ql-link" />
          </div>
          <ReactQuill
            theme="snow"
            value={content}
            readOnly={!editMode}
            onChange={(val: any) => setContent(val)}
            modules={{
              toolbar: `.toolbar-${props.data.id}`,
            }}
          />
        </div>
        <div className={'card-tools'} onClick={(e) => e.stopPropagation()}>
          {
            !flipped &&
            <>
              {
                (() => {
                  if (editMode) {
                    return (
                      <div className={'card-tools-right'}>
                        <button onClick={() => setEditMode(false)}><RiArrowGoBackFill /></button>
                      </div>
                    );
                  } else if (editStatsMode) {
                    return (
                      <>
                        <div className={'card-tools-right'}>
                          <button onClick={() => addStatToCard(props.data.id)}><MdAddCircle /></button>
                          <button onClick={() => setEditStatsMode(false)}><RiArrowGoBackFill /></button>
                        </div>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <div className={'card-tools-left'}>
                          <button onClick={() => setCardPinned(!props.data.isPinned, props.data.id)}>{props.data.isPinned ? <RiPushpinFill /> : <RiPushpinLine />}</button>
                          <button className={'copy-button'} onClick={() => copyCard(props.data.id)}><IoIosCopy /></button>
                          <button onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteCard(props.data.id);
                          }}><MdDeleteForever /></button>
                        </div>
                        <div className={'card-tools-right'}>
                          <button onClick={() => setEditStatsMode(true)}><MdBarChart /></button>
                          <button onClick={() => setEditMode(true)}><MdEdit /></button>
                        </div>
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
                  clickHandler={handleRemoveTag}
                />
              )
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
                          .map((tag: iTag, index: number) => <Tag key={index} id={tag.id} label={tag.label} clickHandler={handleAddTag} />)
                      }
                    </div>
                    <form>
                      <input type="text" value={searchTagsString} onChange={handleSearchTagsChange} onKeyDown={handleSearchTagsKeyDown} autoFocus />
                    </form>
                  </animated.div>
                  :
                  <>
                    <div className={'card-tools-left'}>
                      <ColorPicker defaultColor={props.data.color} changeColorHandler={handleChangeColor} />
                      <BackgroundPicker changeBackgroundHandler={handleChangeBackground} />
                    </div>
                    <div className={'card-tools-right'}>
                      <button onClick={(e) => { e.preventDefault(); setDisplayTagsDialog(!displayTagsDialog); }}><FaTags /></button>
                    </div>
                  </>
              }
            </>
          }
        </div>
      </a.div>
    </animated.div >
  );
};

export default Card;