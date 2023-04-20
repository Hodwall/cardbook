import './Deck.css';
import { useDeckStore } from '../../hooks/useDeckStore';
import { useTagStore } from '../../hooks/useTagStore';
import { MdDeleteForever } from 'react-icons/md';


const Deck = (props: {
    id: number,
    label: string;
    tags: number[],
    art?: string;
}) => {
    const { updateActiveDeck, deleteDeck } = useDeckStore();
    const { updateActiveTags } = useTagStore();
    return (
        <div className="deck" onClick={() => {
            updateActiveDeck(props.id);
            updateActiveTags(props.tags);
        }}>
            <div className="delete-deck"
                onClick={(e: any) => {
                    e.stopPropagation();
                    deleteDeck(props.id);
                }}>
                <MdDeleteForever />
            </div>
            <span>{props.label}</span>
            <div className="stack-effect">
                <div className="stack-card"></div>
                <div className="stack-card"></div>
            </div>


        </div>
    );

};

export default Deck;





