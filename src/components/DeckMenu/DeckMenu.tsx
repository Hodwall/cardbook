import { useState } from 'react';
import { Popover } from 'react-tiny-popover';
import DeckMenuAnimation from './DeckMenuAnimation';
import { MdOutlineClose } from 'react-icons/md';
import './DeckMenu.css';
import { useDeckStore } from '../../hooks/useDeckStore';
import { useTagStore } from '../../hooks/useTagStore';
import { MdAdd } from 'react-icons/md';
import { RiArrowGoBackFill } from 'react-icons/ri';


const DeckMenu = () => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const { activeDeck, createDeck, updateActiveDeck, updateDeckIsStrict } = useDeckStore();
    const { activeTags, updateActiveTags } = useTagStore();
    const handlePopover = () => setIsPopoverOpen(!isPopoverOpen);

    const handleCreateDeck = (e: any) => {
        console.log(e);
        e.preventDefault();
        if (e.target[0].value) {
            createDeck(e.target[0].value, false, activeTags);
            setIsPopoverOpen(false);
        }
    };

    console.log(activeDeck);

    return (
        <Popover
            isOpen={isPopoverOpen}
            positions={['bottom']} // if you'd like, you can limit the positions
            padding={6}
            align={'start'}
            reposition={false} // prevents automatic readjustment of content position that keeps your popover content within its parent's bounds
            onClickOutside={() => setIsPopoverOpen(false)} // handle click events outside of the popover/target here!
            content={({ position, nudgedLeft, nudgedTop }) => ( // you can also provide a render function that injects some useful stuff!
                <>
                    <DeckMenuAnimation >
                        <div className={'deck-input'}>
                            <form onSubmit={handleCreateDeck}>
                                <input type="text" />
                                <button type="submit"><MdAdd /></button>
                            </form>
                            <button onClick={handlePopover}><MdOutlineClose /></button>
                        </div>
                    </DeckMenuAnimation>
                </>
            )}
        >
            <div className={'deck-menu'}>
                {
                    activeDeck ?
                        <div className={`deck-equipped ${activeDeck.isStrict ? 'strict' : ''}`} >
                            <span onClick={() => {
                                updateActiveDeck(null);
                                updateActiveTags([...activeTags].filter((tag) => !activeDeck.tags.includes(tag)));
                            }}>
                                <RiArrowGoBackFill />
                            </span>
                            <span onClick={() => updateDeckIsStrict(activeDeck.id, !activeDeck.isStrict)}>{activeDeck.label}</span>
                        </div>
                        :
                        <div className={`deck-create ${activeTags.length <= 0 ? 'disabled' : ''}`} onClick={handlePopover}>
                            {activeTags.length > 0 && <MdAdd />}
                        </div>

                }
            </div >
        </Popover>
    );
};

export default DeckMenu;