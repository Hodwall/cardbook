import { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import Card from '../Card';
import Tag from '../Tag';
import { useTagStore, iTag } from '../../hooks/useTagStore';
import { useCardStore, iCard } from '../../hooks/useCardStore';

import './CustomCard.css';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



const CustomCard = (props: { data: iCard; }) => {
  const { updateCardContent, updateCardLabel, deleteCard, addTagToCard, removeTagFromCard } = useCardStore();
  const [editMode, setEditMode] = useState(false);

  const addTagHandler = (tag_id: number) => {
    addTagToCard(props.data.id, tag_id);
  };
  const deleteTagHandler = (tag_id: number) => {
    removeTagFromCard(props.data.id, tag_id);
  };

  const handleChange = (val: any) => {
    updateCardContent(val, props.data.id);
  };

  const handleEditLabel = (val: string) => {
    updateCardLabel(val, props.data.id);
  };

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

  return (
    <Card
      tags={props.data.tags}
      handleAddTag={addTagHandler}
      handleDeleteTag={deleteTagHandler}
      label={props.data.label ?? ''}
      blockFlipped={editMode}
      editableLabel={editMode}
      handleLabelEdit={handleEditLabel}
      content={
        <>
          <ReactQuill
            className={editMode ? '' : 'hide_toolbar'}
            theme="snow"
            value={props.data.content}
            readOnly={!editMode}
            onChange={handleChange}
            modules={modules}
          />
        </>
      }
      tools={
        <>
          <button onClick={() => setEditMode(!editMode)}>{editMode ? 'X' : 'EDIT'}</button>
          {!editMode && <button onClick={(e) => { e.preventDefault(); deleteCard(props.data.id); }}>DELETE</button>}
        </>
      }
    />
  );
};

export default CustomCard;