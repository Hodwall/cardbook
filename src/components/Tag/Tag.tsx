import './Tag.css';
import { useSpring, animated } from 'react-spring';
import { useTagStore } from '../../hooks/useTagStore';
import { useDeckStore } from '../../hooks/useDeckStore';
import { RiArrowGoBackFill } from 'react-icons/ri';

import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

const Tag = (props: {
    id: number,
    label: string,
    type?: string,
    clickHandler?: Function,
    deleteHandler?: Function,
    canDelete?: boolean,
    canManageDeck?: boolean,
}) => {
    const animation = useSpring({ to: { opacity: 1, y: 0, rotateZ: 0 }, from: { opacity: 0, y: -10, rotateZ: -2 } });
    const { deleteTag } = useTagStore();
    const { activeDeck, updateDeckTags } = useDeckStore();

    const is_in_deck = activeDeck && activeDeck.tags.indexOf(props.id) !== -1;
    const is_strict = activeDeck && activeDeck.isStrict;

    return (
        <animated.div className={`navtag ${props.type} ${is_in_deck && 'in-deck'} ${is_strict && 'strict'}`} style={animation} onClick={(e) => {
            e.stopPropagation();
            if (props.clickHandler) props.clickHandler(props.id);
        }}>
            <span>
                {
                    (props.canDelete && !is_in_deck) &&
                    <button onClick={(e) => {
                        e.stopPropagation();
                        if (props.deleteHandler) props.deleteHandler(props.id);
                        else deleteTag(props.id);
                    }}>
                        <RiArrowGoBackFill />
                    </button>
                }
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
            </span>
            <span>{props.label}</span>
        </animated.div >
    );
};

export default Tag;