import { useEffect, useState, FormEvent, useRef } from 'react';
import { animated, useSpring } from 'react-spring';

import { useTagStore, iTag } from '../../hooks/useTagStore';
import { useDeckStore } from '../../hooks/useDeckStore';
import { useSettingsStore } from '../../hooks/useSettingsStore';

import Tag from '../Tag';
import Deck from '../Deck';
import DeckMenu from '../DeckMenu';
import './TagBar.css';


const TagBar = (props: {
    displayDrawer: boolean;
}) => {
    const { tagStore, activeTags, createTag, setTagInactive, setTagActive } = useTagStore();
    const { deckStore, activeDeck } = useDeckStore();

    const [resultsTagsDrawer, setResultsTagsDrawer] = useState(tagStore);
    const [searchString, setSearchString] = useState('');

    const animation = useSpring({
        y: props.displayDrawer ? 0 : -100,
        height: props.displayDrawer ? '24em' : '0em',
        opacity: props.displayDrawer ? 1 : 0,
    });

    // TAG SEARCH
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


    const handleSearchKeyDown = (e: any) => {
        if (e.key === 'Enter' && resultsTagsDrawer.length === 0) {
            let new_tag = { label: searchString, type: 'default' };
            createTag(new_tag);
            setSearchString('');
        }
    };

    return (
        <>
            <div className={'tagbar'}>
                <DeckMenu />
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
                            clickHandler={() => setTagInactive(tag.id)}
                            canManageDeck
                        />))
                }
            </div>


            <animated.div className={`tagbar-drawer ${props.displayDrawer ? '' : 'hidden'}`} style={animation}>
                <div className={'results'}>
                    {
                        resultsTagsDrawer.reduce((results: any[], item: any) => {
                            if (!activeTags.includes(item.id) && (!activeDeck || activeDeck.id != item.id)) results.push(item);
                            return results;
                        }, [])
                            .sort((a: any, b: any) => (Number(b.isPinned) - Number(a.isPinned)) === 0 ? ((a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : (a.label.toLowerCase() < b.label.toLowerCase()) ? -1 : 0) : (Number(b.isPinned) - Number(a.isPinned)))
                            .map((item: any, index: number) => {
                                if (item.tags) {
                                    return (
                                        <Deck
                                            key={index}
                                            id={item.id}
                                            label={item.label}
                                            tags={item.tags}
                                            isPinned={item.isPinned}
                                        />
                                    );
                                } else {
                                    return (
                                        <Tag
                                            key={index}
                                            id={item.id}
                                            label={item.label}
                                            type={'big-tag'}
                                            clickHandler={() => setTagActive(item.id)}
                                            isPinned={item.isPinned}
                                            canDelete
                                        />
                                    );
                                }
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