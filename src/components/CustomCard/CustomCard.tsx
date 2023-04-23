import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useCardStore, iCard } from '../../hooks/useCardStore';
import Card from '../Card';
import CardStat from '../CardStat/CardStat';
import { MdDeleteForever, MdEdit, MdEditOff, MdBarChart, MdAddCircle } from 'react-icons/md';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { IoIosCopy } from 'react-icons/io';
import ColorPicker from '../ColorPicker/ColorPicker';
import BackgroundPicker from '../BackgroundPicker/BackgroundPicker';

import 'react-quill/dist/quill.snow.css';
import './CustomCard.css';


const CustomCard = (props: { data: iCard; }) => {
  const { updateCardContent, updateCardLabel, updateCardColor, deleteCard, addTagToCard, removeTagFromCard, addStatToCard, copyCard, updateCardBackground } = useCardStore();
  const [editMode, setEditMode] = useState(false);
  const [editStatsMode, setEditStatsMode] = useState(false);
  const [label, setLabel] = useState(props.data.label);
  const [content, setContent] = useState(props.data.content || '');

  useEffect(() => {
    if (!editMode) {
      updateCardLabel(label, props.data.id);
      updateCardContent(content, props.data.id);
    }
  }, [editMode]);

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

  const handleChangeColor = (color: any) => {
    updateCardColor(color, props.data.id);
  };

  const handleChangeBackground = (background: string) => {
    updateCardBackground(background, props.data.id);
  };

  return (
    <Card
      tags={props.data.tags}
      handleAddTag={(tag_id: number) => addTagToCard(props.data.id, tag_id)}
      handleDeleteTag={(tag_id: number) => removeTagFromCard(props.data.id, tag_id)}
      label={label}
      color={props.data.color}
      background={props.data.background}
      blockFlipped={editMode}
      editableLabel={editMode}
      handleLabelEdit={(val: string) => setLabel(val)}
      handleOutsideClick={() => setEditMode(false)}
      content={
        <>
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
        </>
      }

      tools={
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
    />
  );
};

export default CustomCard;