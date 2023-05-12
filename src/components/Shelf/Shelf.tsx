import { useEffect, useState } from 'react';
import { useFlexAnimation } from '../../hooks/useFlexAnimation';
import { useCardStore, iCard } from '../../hooks/useCardStore';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import { useTagStore } from '../../hooks/useTagStore';
import Card from '../Card';
import TagPicker from '../TagPicker';
import Tag from '../Tag';

import { FaPlusCircle, FaMinusCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

import './Shelf.css';


const Shelf = (props: {
    id: number,
    tags: any[],
    cards: iCard[];
}) => {
    const [expanded, setExpanded] = useState(true);
    const { getTagById } = useTagStore();
    const { addShelf, removeShelf, removeTagFromShelf } = useSettingsStore();

    const { cardStore } = useCardStore();
    const { getFlexItemsInfo, animateFlexItems } = useFlexAnimation(`#shelf-${props.id}>.shelf-cards`);
    const [prev_items, setPrevItems] = useState<any[]>([]);

    useEffect(() => {
        const new_items = getFlexItemsInfo();
        if ((prev_items?.length > 0) && (new_items?.length > 0)) animateFlexItems(prev_items, new_items);
        setPrevItems([...new_items]);
    }, [cardStore]);


    const handleRemoveTag = ((tag_id: number) => {
        if (props.tags.length > 1) {
            removeTagFromShelf(props.id - 1, tag_id);
        } else {
            removeShelf(props.id - 1);
        }
    });


    return (
        <div id={`shelf-${props.id}`} className={`shelf ${props.cards.length ? '' : 'empty'}`}>
            <div className="shelf-header" onClick={() => setExpanded(!expanded)}>
                <div className="shelf-tags">
                    {props.tags.map((tag, index) => {
                        const tag_data = getTagById(tag);
                        return (
                            <Tag
                                key={index}
                                id={tag_data.id}
                                label={tag_data.label}
                                clickHandler={() => handleRemoveTag(tag_data.id)}
                                isPinned={tag_data.isPinned}
                            />
                        );
                    })}
                </div>
                <button onClick={(e: any) => {
                    e.stopPropagation();
                    addShelf();
                }}><FaPlusCircle /></button>
                {props.id > 0 &&
                    <>
                        <button onClick={() => removeShelf(props.id - 1)}><FaMinusCircle /></button>
                        <TagPicker shelfIndex={props.id - 1} tags={props.tags} />
                    </>}
                <button onClick={() => setExpanded(!expanded)}>{expanded ? <FaChevronDown /> : <FaChevronUp />}</button>
            </div>
            <div className={`shelf-cards ${expanded ? '' : 'hidden'}`}>
                {props.cards.map((card: iCard) => <Card key={card.id} data={card} />)}
            </div>
        </div>
    );
};

export default Shelf;