import { useState, createContext, useContext } from 'react';
import { useNpcStore } from './useNpcStore';
import { useCardStore } from './useCardStore';
import { useDeckStore, iDeck } from './useDeckStore';


export interface iTag {
    id: number,
    label: string,
    type: string,
    isPinned?: boolean;
}

const TagStoreContext = createContext<any>(null);

export const TagStoreProvider = (props: { children: React.ReactNode; }) => {
    const [tagStore, setTagStore] = useState<iTag[]>((() => {
        let stored_data = localStorage.getItem('tag_store');
        if (stored_data) return JSON.parse(stored_data);
        else return [];
    })());
    const [activeTags, setActiveTags] = useState<number[]>((() => {
        let stored_data = localStorage.getItem('active_tags');
        if (stored_data) return JSON.parse(stored_data);
        else return [];
    })());

    const { removeTagFromAllCards } = useCardStore();
    const { deckStore, updateDeckTags, deleteDeck, deleteAllDecks } = useDeckStore();

    const updateTagStore = (val: iTag[]) => {
        setTagStore(val);
        localStorage.setItem('tag_store', JSON.stringify(val));
    };

    const updateActiveTags = (val: number[]) => {
        setActiveTags(val || []);
        localStorage.setItem('active_tags', JSON.stringify(val || []));
    };

    const createTag = (tag: any) => {
        const new_id = Date.now();
        updateTagStore([...tagStore, {
            ...tag,
            id: new_id
        }]);
        updateActiveTags([...activeTags, new_id]);
        return new_id;
    };

    const deleteTag = (id: number) => {
        updateTagStore(tagStore.filter((tag: iTag) => tag.id != id));
        removeTagFromAllCards(id);
        updateActiveTags([...activeTags.filter((tag: number) => tag != id)]);
        deckStore?.forEach((deck: iDeck) => {
            if (deck.tags.findIndex((tag: number) => tag === id) !== -1) {
                const filtered_tags = deck.tags.filter((tag) => tag != id);
                if (filtered_tags.length > 0) updateDeckTags(deck.id, filtered_tags);
                else deleteDeck(deck.id);
            }
        });

    };

    const deleteAllTags = () => {
        updateTagStore([]);
        updateActiveTags([]);
        deleteAllDecks();
    };

    const setTagActive = (id: number) => {
        if (!activeTags.find((tag) => tag === id)) updateActiveTags([...activeTags, id]);
    };

    const setTagInactive = (id: number) => {
        updateActiveTags([...activeTags.filter((tag: number) => tag != id)]);
    };

    const getTagByLabel = (label: string) => {
        return tagStore.find((tag) => tag.label === label)?.id || createTag({ label: label });
    };

    const getTagById = (id: number) => {
        return tagStore.find((tag) => tag.id === id);
    };

    const toggleIsPinned = (id: number) => {
        let store = [...tagStore];
        const tag_index = store.findIndex((tag) => tag.id === id);
        if (tag_index !== -1) {
            store[tag_index].isPinned = !store[tag_index].isPinned;
            updateTagStore(store);
        }
    };

    return (
        <TagStoreContext.Provider value={{
            tagStore,
            updateTagStore,
            activeTags,
            updateActiveTags,
            createTag,
            deleteTag,
            deleteAllTags,
            setTagActive,
            setTagInactive,
            getTagByLabel,
            toggleIsPinned,
            getTagById
        }}>
            {props.children}
        </TagStoreContext.Provider>
    );
};

export const useTagStore = () => useContext(TagStoreContext);