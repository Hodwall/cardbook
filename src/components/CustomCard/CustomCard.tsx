import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useCardStore, iCard } from '../../hooks/useCardStore';
import Card from '../Card';
import CardStat from '../CardStat/CardStat';
import { MdDeleteForever, MdEdit, MdEditOff, MdAdd } from 'react-icons/md';
import { IoIosCopy } from 'react-icons/io';
import ColorPicker from '../ColorPicker/ColorPicker';
import BackgroundPicker from '../BackgroundPicker/BackgroundPicker';

import 'react-quill/dist/quill.snow.css';
import './CustomCard.css';


const CustomCard = (props: { data: iCard; }) => {
  const { updateCardContent, updateCardLabel, updateCardColor, deleteCard, addTagToCard, removeTagFromCard, addStatToCard, copyCard, updateCardBackground } = useCardStore();
  const [editMode, setEditMode] = useState(false);
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
                  editMode={editMode}
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
          <button onClick={() => setEditMode(!editMode)}>{editMode ? <MdEditOff /> : <MdEdit />}</button>
          {!editMode && <button onClick={() => addStatToCard(props.data.id)}><MdAdd /></button>}
          {!editMode && <button onClick={() => copyCard(props.data.id)}><IoIosCopy /></button>}
          {!editMode && <button onClick={(e) => { e.preventDefault(); deleteCard(props.data.id); }}><MdDeleteForever /></button>}
          {!editMode && <ColorPicker changeColorHandler={handleChangeColor} />}
          {!editMode && <BackgroundPicker changeBackgroundHandler={handleChangeBackground} />}
        </>
      }
    />
  );
};

export default CustomCard;