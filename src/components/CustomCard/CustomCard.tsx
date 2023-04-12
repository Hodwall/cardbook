import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useCardStore, iCard } from '../../hooks/useCardStore';
import Card from '../Card';
import CardStat from '../CardStat/CardStat';
import 'react-quill/dist/quill.snow.css';
import './CustomCard.css';


const CustomCard = (props: { data: iCard; }) => {
  const { updateCardContent, updateCardLabel, deleteCard, addTagToCard, removeTagFromCard, addStatToCard, removeStatFromCard } = useCardStore();
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

  return (
    <Card
      tags={props.data.tags}
      handleAddTag={(tag_id: number) => addTagToCard(props.data.id, tag_id)}
      handleDeleteTag={(tag_id: number) => removeTagFromCard(props.data.id, tag_id)}
      label={label}
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
          <button onClick={() => setEditMode(!editMode)}>{editMode ? 'X' : 'EDIT'}</button>
          {!editMode && <button onClick={() => addStatToCard(props.data.id)}>ADD STAT</button>}
          {!editMode && <button onClick={(e) => { e.preventDefault(); deleteCard(props.data.id); }}>DELETE</button>}
        </>
      }
    />
  );
};

export default CustomCard;