import { useEffect, useRef, useState } from 'react';
import { useSpring, animated, a } from 'react-spring';
import ReactQuill from 'react-quill';
import { useTagStore, iTag } from '../../hooks/useTagStore';
import { useCardStore, iCard } from '../../hooks/useCardStore';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import CardStat from '../CardStat/CardStat';
import Tag from '../Tag';
import 'react-quill/dist/quill.snow.css';
import './Card.css';

import CardTools from './components/CardTools';


const Card = (props: {
  data: iCard;
  isDisplay: boolean,
}) => {
  const { tagStore } = useTagStore();
  const { updateCardContent, updateCardLabel, removeTagFromCard } = useCardStore();
  const { settingsStore, setDisplayCard } = useSettingsStore();
  const [editMode, setEditMode] = useState(false);
  const [editStatsMode, setEditStatsMode] = useState(false);
  const [label, setLabel] = useState(props.data.label);
  const [content, setContent] = useState(props.data.content || '');
  const [flipped, setFlipped] = useState(false);
  const [displayTagsDialog, setDisplayTagsDialog] = useState(false);

  const card_side_bg = `${props.data.background ? `url(${props.data.background})` : ''} 0 0 / auto 100%, linear-gradient(180deg, ${props.data.color || 'hsl(0deg 6% 45%)'} 0%, hsl(0, 0%, 20%) 125%)`;

  // EFFECTS
  useEffect(() => {
    if (!editMode) {
      updateCardLabel(label, props.data.id);
      updateCardContent(content, props.data.id);
    }
  }, [editMode]);

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
  // const modules = (() => {
  //   return {
  //     toolbar: [
  //       ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  //       [{ 'color': [] }],
  //       [{ 'lists': [{ 'list': 'ordered' }, { 'list': 'bullet' }] }],
  //       ['link'],
  //     ]
  //   };
  // })();

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
  const handleRemoveTag = (tag_id: number) => {
    removeTagFromCard(props.data.id, tag_id);
  };

  const handleFlip = () => {
    if (!editMode && !editStatsMode) {
      // if (settingsStore.displayMode && !props.isDisplay) setDisplayCard(props.data.id);
      setFlipped(!flipped);
    };
  };


  return (
    <animated.div
      id={`card-${props.data.id}`}
      className={`card ${props.isDisplay ? 'display' : ''}`}
      style={{ ...animation, fontSize: `${settingsStore.cardScale}%` }}
      ref={ref}
    >
      <a.div
        className={'card-front'}
        style={{
          opacity: opacity.to(o => 1 - o), transform,
          background: card_side_bg,
          backgroundPositionX: 'center'
        }}
        onClick={handleFlip}
      >
        <div className={'label'}>
          {
            editMode
              ? <textarea value={label} onChange={(e: any) => setLabel(e.target.value)} />
              : <div>{props.data.label}</div>
          }
        </div>
        <div className={'body'}>
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
          <div id={`#toolbar`} className={`ql-toolbar ql-snow ${editMode ? '' : 'hidden'} toolbar-${props.data.id}-${props.isDisplay ? 'd' : ''}`}>
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-blockquote" />
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-list" value="check" />
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
              toolbar: `.toolbar-${props.data.id}-${props.isDisplay ? 'd' : ''}`,
            }}
          />
        </div>
        <div className={'toolbar'}>
          {
            !flipped &&
            <CardTools
              data={props.data}
              isFlipped={flipped}
              isEditMode={editMode}
              setIsEditMode={setEditMode}
              isEditStatsMode={editStatsMode}
              setIsEditStatsMode={setEditStatsMode}
              isDisplayTagsDialog={displayTagsDialog}
              setIsDisplayTagsDialog={setDisplayTagsDialog}
            />
          }
        </div>
      </a.div>
      <a.div
        className={'card-back'}
        style={{
          opacity, transform, rotateY: '180deg', display: flipped ? 'grid' : 'none',
          background: card_side_bg,
          backgroundPositionX: 'center'
        }}
        onClick={handleFlip}
      >
        <div className={'tags'}>
          {
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
          }
        </div>
        <div className={'toolbar'}>
          {
            flipped &&
            <CardTools
              data={props.data}
              isFlipped={flipped}
              isEditMode={editMode}
              setIsEditMode={setEditMode}
              isEditStatsMode={editStatsMode}
              setIsEditStatsMode={setEditStatsMode}
              isDisplayTagsDialog={displayTagsDialog}
              setIsDisplayTagsDialog={setDisplayTagsDialog}
            />
          }
        </div>
      </a.div>
    </animated.div>
  );
};

export default Card;