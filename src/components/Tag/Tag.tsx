import { useSpring, animated } from 'react-spring';
import { useTagStore } from '../../hooks/useTagStore';
import { useDeckStore } from '../../hooks/useDeckStore';
import { RiPushpinFill, RiPushpinLine } from 'react-icons/ri';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import './Tag.css';


const Tag = (props: {
    id: number,
    label: string,
    clickHandler?: Function,
    canManageDeck?: boolean,
    canDelete?: boolean,
    type?: string,
    isPinned?: boolean,
}) => {
    const { deleteTag, toggleIsPinned } = useTagStore();
    const { activeDeck, updateDeckTags } = useDeckStore();
    const animation = useSpring({
        to: { opacity: 1, y: 0 },
        from: { opacity: 0, y: 15 },
        config: { mass: 15, friction: 220, tension: 4000 }
    });
    const is_in_deck = activeDeck && activeDeck.tags.indexOf(props.id) !== -1;
    const is_strict = activeDeck && activeDeck.isStrict;

    return (
        <animated.div className={`tag ${props.type || ''}  ${is_in_deck ? 'in-deck' : ''} ${is_strict ? 'strict' : ''}`} style={animation}>
            <span>
                {
                    (props.canManageDeck && activeDeck) &&
                    <>
                        {
                            (is_in_deck) ?
                                <button onClick={() => updateDeckTags(activeDeck.id, activeDeck.tags.filter((tag: number) => tag != props.id))}><FaMinusCircle /></button>
                                :
                                <button onClick={() => updateDeckTags(activeDeck.id, [...activeDeck.tags, props.id])}><FaPlusCircle /></button>
                        }

                    </>
                }
                {
                    (props.type === 'big-tag') &&
                    <button onClick={() => toggleIsPinned(props.id)}>{props.isPinned ? <RiPushpinFill /> : <RiPushpinLine />}</button>
                }
                {
                    ((props.canDelete) &&
                        <button onClick={(e: any) => {
                            e.stopPropagation();
                            deleteTag(props.id);
                        }}><MdDeleteForever /></button>
                    )
                }
            </span>
            <span onClick={(e: any) => {
                e.stopPropagation();
                if (is_in_deck) return;
                else if (props.clickHandler) props.clickHandler(props.id);
            }}>{props.label}</span>
        </animated.div >
    );
};

export default Tag;