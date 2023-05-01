import './Deck.css';
import { useDeckStore } from '../../hooks/useDeckStore';
import { useSpring, animated } from 'react-spring';
import { useTagStore } from '../../hooks/useTagStore';
import { MdDeleteForever } from 'react-icons/md';
import { RiPushpinFill, RiPushpinLine } from 'react-icons/ri';


const Deck = (props: {
    id: number,
    label: string;
    tags: number[],
    art?: string;
    isPinned?: boolean,
}) => {
    const { updateActiveDeck, deleteDeck, toggleIsDeckPinned } = useDeckStore();
    const { updateActiveTags } = useTagStore();

    const animation = useSpring({
        to: { opacity: 1, y: 0 },
        from: { opacity: 0, y: 15 },
        config: { mass: 15, friction: 220, tension: 4000 }
    });


    return (
        <animated.div className={'deck'} style={animation}>
            <span>
                <button onClick={() => toggleIsDeckPinned(props.id)}>
                    {props.isPinned ? <RiPushpinFill /> : <RiPushpinLine />}
                </button>
                <button onClick={(e: any) => {
                    e.stopPropagation();
                    deleteDeck(props.id);
                }}>
                    <MdDeleteForever />
                </button>
            </span>
            <span onClick={(e) => {
                e.stopPropagation();
                updateActiveDeck(props.id);
                updateActiveTags(props.tags);
            }}>
                {props.label}
            </span>
        </animated.div>
    );

};

export default Deck;





