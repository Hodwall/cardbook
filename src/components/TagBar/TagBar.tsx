import { useEffect, useState, FormEvent, useRef } from 'react';
import { animated, useSpring } from 'react-spring';

import { useTagStore, iTag } from '../../hooks/useTagStore';
import { useDeckStore } from '../../hooks/useDeckStore';
import { useSettingsStore } from '../../hooks/useSettingsStore';

import Tag from '../Tag';
import Deck from '../Deck';
import BigTag from '../BigTag';

import { RiArrowGoBackFill } from 'react-icons/ri';
import './TagBar.css';



const TagBar = (props: {
    displayDrawer: boolean;
}) => {
    const { tagStore, activeTags, updateActiveTags, createTag, setTagInactive } = useTagStore();
    const { deckStore, createDeck, activeDeck, updateActiveDeck, updateDeckIsStrict } = useDeckStore();
    const { settingsStore, updateCardScale } = useSettingsStore();

    const [resultsTagsDrawer, setResultsTagsDrawer] = useState(tagStore);
    const [searchString, setSearchString] = useState('');
    const [deckLabel, setDeckLabel] = useState('');
    const [deckStrictMode, setDeckStrictMode] = useState(activeDeck?.isStrict);

    const animation = useSpring({
        y: props.displayDrawer ? 0 : -100,
        height: props.displayDrawer ? '22.3em' : '0em',
        opacity: props.displayDrawer ? 1 : 0,
    });

    // SEARCH TAGS
    useEffect(() => {
        const search_store = [... new Set([...tagStore, ...deckStore])];
        if (!searchString || searchString === '') {
            setResultsTagsDrawer(search_store);
        } else {
            setResultsTagsDrawer(search_store.reduce((results: any[], item: any) => {
                if (item.label.search(searchString) != -1) results.push(item);
                return results;
            }, []));
        }
    }, [tagStore, deckStore, searchString]);

    useEffect(() => {
        if (activeDeck) setDeckStrictMode(activeDeck.isStrict);
    }, [activeDeck]);

    const handleSearchKeyDown = (e: any) => {
        if (e.key === 'Enter' && resultsTagsDrawer.length === 0) {
            let new_tag = { label: searchString, type: 'default' };
            createTag(new_tag);
            setSearchString('');
        }
    };


    // DECK MANAGEMENT
    const handleCreateDeck = (e: any) => {
        if (e.key === 'Enter') {
            createDeck(e.target.value, deckStrictMode, activeTags);
            setDeckLabel('');
        }
    };

    const handleReturnDeck = () => {
        updateActiveDeck(null);
        updateActiveTags(null);
    };

    const handleStrictMode = () => {
        if (activeDeck) updateDeckIsStrict(activeDeck.id, !deckStrictMode);
        setDeckStrictMode(!deckStrictMode);
    };


    return (
        <>
            <div className={'tag-deck-bar'}>
                <div className={'tagbar'}>
                    {
                        activeTags.reduce((results: iTag[], tag_id: number) => {
                            results.push(tagStore.find((tag: iTag) => tag.id === tag_id));
                            return results;
                        }, [])
                            .sort((a: iTag, b: iTag) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0)
                            .map((tag: iTag, index: number) =>
                            (<Tag
                                key={index}
                                id={tag.id}
                                label={tag.label}
                                type={tag.type}
                                deleteHandler={() => setTagInactive(tag.id)}
                                canDelete
                                canManageDeck
                            />))
                    }
                </div>
                <div className={'deckbar'}>
                    <button onClick={() => updateActiveTags([])}>CLEAR</button>
                    <button className={`${deckStrictMode ? 'strict' : ''}`} onClick={handleStrictMode}>STRICT</button>
                    {activeDeck &&
                        <>
                            {/* <button onClick={() => updateDeckTags(activeDeck.id, activeTags)}><MdSave /></button> */}
                            <button onClick={handleReturnDeck}><RiArrowGoBackFill /></button>
                            <button>{activeDeck?.label}</button>
                        </>
                    }
                    {!activeDeck && <input type="text" value={deckLabel} onChange={(e) => setDeckLabel(e.target.value)} onKeyDown={handleCreateDeck} />}
                </div>
            </div>


            <animated.div className={`tags-drawer ${props.displayDrawer ? '' : 'hidden'}`} style={animation}>
                <div className={'results'}>
                    {
                        resultsTagsDrawer.reduce((results: any[], item: any) => {
                            if (!activeTags.includes(item.id) && (!activeDeck || activeDeck.id != item.id)) results.push(item);
                            return results;
                        }, [])
                            .sort((a: any, b: any) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0)
                            .map((item: any, index: number) => {
                                if (item.tags) return <Deck key={index} id={item.id} label={item.label} tags={item.tags} />;
                                else return <BigTag key={index} id={item.id} label={item.label} />;
                            })
                    }
                </div>
                <form onSubmit={(e: FormEvent) => { e.preventDefault(); }}>
                    <input type="text" value={searchString} onChange={(e) => setSearchString(e.target.value)} onKeyDown={handleSearchKeyDown} />
                </form>
            </animated.div>
        </>
    );
};

export default TagBar;