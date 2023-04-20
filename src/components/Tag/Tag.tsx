import './Tag.css';
import { useSpring, animated } from 'react-spring';
import { useTagStore } from '../../hooks/useTagStore';
import { useDeckStore } from '../../hooks/useDeckStore';

const Tag = (props: {
    id: number,
    label: string,
    type?: string,
    clickHandler?: Function,
    deleteHandler?: Function,
    canDelete?: boolean,
}) => {
    const animation = useSpring({ to: { opacity: 1, y: 0, rotateZ: 0 }, from: { opacity: 0, y: -10, rotateZ: -2 } });
    const { deleteTag } = useTagStore();
    const { activeDeck, getDeck } = useDeckStore();

    const is_in_deck = activeDeck && getDeck(activeDeck).tags.indexOf(props.id) !== -1;

    return (
        <animated.div className={`navtag ${props.type} ${is_in_deck && 'in-deck'}`} style={animation} onClick={(e) => {
            e.stopPropagation();
            if (props.clickHandler) props.clickHandler(props.id);
        }}>
            <span>{props.label}</span>
            {(props.canDelete && !is_in_deck) &&
                <span><button onClick={(e) => {
                    e.stopPropagation();
                    if (props.deleteHandler) props.deleteHandler(props.id);
                    else deleteTag(props.id);
                }}>X</button></span>
            }
        </animated.div>
    );
};

export default Tag;