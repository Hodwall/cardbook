import { ReactNode, useEffect, useRef, useState } from 'react';
import { useSpring, animated, a } from 'react-spring';
import Tag from '../Tag';
import { useTagStore, iTag } from '../../hooks/useTagStore';
import { FaTags } from 'react-icons/fa';
import './Card.css';


const Card = (props: {
  tags: any,
  style?: string,
  label: string,
  art?: string,
  content?: ReactNode,
  color?: string,
  tools?: ReactNode,
  blockFlipped?: boolean,
  updateFlipped?: Function,
  handleDeleteTag: Function,
  handleAddTag: Function,
  editableLabel?: boolean,
  handleLabelEdit?: Function,
  handleOutsideClick?: Function;
}) => {
  const { tagStore, createTag } = useTagStore();
  const [flipped, setFlipped] = useState(false);
  const [displayTagsDialog, setDisplayTagsDialog] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [resultsTagsDialog, setResultsTagsDialog] = useState(tagStore);

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

  // handles outside clicks
  const ref = useRef<any>(null);
  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setDisplayTagsDialog(false);
      if (props.handleOutsideClick) props.handleOutsideClick();
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

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

  const handleFlip = () => {
    if (!props.blockFlipped) {
      setFlipped(!flipped);
      setSearchString('');
      setDisplayTagsDialog(false);
    }
  };

  const handleSearchChange = (e: any) => {
    setSearchString(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      if (resultsTagsDialog.length === 0) {
        let new_tag = { label: searchString, type: 'default' };
        e.preventDefault();
        props.handleAddTag(createTag(new_tag));
        setSearchString('');
      }
    }
  };

  return (
    <animated.div className={`card ${props.style}`} style={animation} ref={ref}>
      <a.div className={'card-side'} style={{ opacity: opacity.to(o => 1 - o), transform }} onClick={handleFlip}>
        <div className={'card-header'} style={{
          background: `linear-gradient(150deg, ${props.color || 'hsl(0deg 6% 45%)'} 0%, hsl(0, 0%, 20%) 100%)`
        }}>
          {
            props.editableLabel ?
              <input type="text" value={props.label} onChange={(e: any) => { if (props.handleLabelEdit) props.handleLabelEdit(e.target.value); }} />
              :
              <div className={'card-label'}>{props.label}</div>
          }
          {props.art && <div className='card-art'><img className="art" src={props.art} alt={props.art} /></div>}
        </div>
        <div className={'card-body'}>
          {props.content}
        </div>
        <div className={'card-tools'} onClick={(e) => e.stopPropagation()}>
          {!flipped && props.tools}
        </div>
      </a.div>
      <a.div className={'card-side card-back'} style={{
        opacity, transform, rotateY: '180deg', display: flipped ? 'grid' : 'none',
        background: `linear-gradient(150deg, ${props.color || 'hsl(0deg 6% 45%)'} 0%, hsl(0, 0%, 20%) 100%)`
      }} onClick={handleFlip}>
        <div className={'card-body'} onClick={handleFlip}>
          <div className={'card-tags'}>{
            props.tags?.reduce((results: any[], tag_id: any) => {
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
                  deleteHandler={props.handleDeleteTag ?? null}
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
                          if (!props.tags.includes(tag.id)) {
                            results.push(tag);
                          }
                          return results;
                        }, [])
                          .sort((a: iTag, b: iTag) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0)
                          .map((tag: iTag, index: number) => <Tag key={index} id={tag.id} label={tag.label} clickHandler={props.handleAddTag} deleteHandler={props.handleDeleteTag} />)
                      }
                    </div>
                    <form>
                      <input type="text" value={searchString} onChange={handleSearchChange} onKeyDown={handleKeyDown} autoFocus />
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