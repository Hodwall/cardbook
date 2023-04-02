import { ReactNode, useEffect, useRef, useState } from 'react';
import { useSpring, animated, a } from 'react-spring';
import './Card.css';
import Tag from '../Tag';
import { useTagStore, iTag } from '../../hooks/useTagStore';


const Card = (props: {
  tags: any,
  style?: string,
  label: string,
  art?: string,
  content?: ReactNode,
  tools?: ReactNode,
  updateFlipped?: Function,
  handleDeleteTag: Function,
  handleAddTag: Function,
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
    setFlipped(!flipped);
    setSearchString('');
    setDisplayTagsDialog(false);
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
    <animated.div className={`card ${props.style}`} style={animation}>
      <a.div className={'card-side'} style={{ opacity: opacity.to(o => 1 - o), transform }} >
        <div className={'card-clickable'} onClick={handleFlip}>
          <div className={'card-header'}>
            <div className="label">{props.label}</div>
            {props.art && <img className="art" src={props.art} alt={props.art} />}
          </div>
          <div className="card-body">
            {props.content}
          </div>
        </div>
        <div className="card-tools">
          {!flipped && props.tools}
        </div>
      </a.div>
      <a.div className="card-side back" style={{ opacity, transform, rotateY: '180deg', display: flipped ? 'initial' : 'none' }}>
        <div className={'card-clickable'} onClick={handleFlip}>
          <div className="card-body" onClick={handleFlip}>
            <div className="npc-tags">{
              props.tags?.map((tag: any, index: number) =>
                <Tag
                  key={index}
                  id={tag}
                  label={tagStore.find((el: any) => el.id === tag)?.label}
                  deleteHandler={props.handleDeleteTag ?? null}
                  canDelete />)
            }</div>
          </div>
        </div>
        <div className="card-tools">
          {
            flipped &&
            <>
              {
                displayTagsDialog
                  ?
                  <animated.div className="tags-dialog" style={animation} ref={ref} >
                    <div className="tags-results">
                      {
                        resultsTagsDialog.reduce((results: iTag[], tag: iTag) => {
                          if (!props.tags.includes(tag.id)) {
                            results.push(tag);
                          }
                          return results;
                        }, []).map((tag: iTag, index: number) => <Tag key={index} id={tag.id} label={tag.label} clickHandler={props.handleAddTag} deleteHandler={props.handleDeleteTag} />)
                      }
                    </div>
                    <form>
                      <input type="text" value={searchString} onChange={handleSearchChange} onKeyDown={handleKeyDown} autoFocus />
                    </form>
                  </animated.div>
                  :
                  <button onClick={(e) => { e.preventDefault(); setDisplayTagsDialog(!displayTagsDialog); }}>ADD TAG</button>
              }
            </>
          }
        </div>
      </a.div>
    </animated.div >
  );
};

export default Card;