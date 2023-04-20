import { useState, createContext, useContext } from 'react';
import { useNpcStore } from './useNpcStore';
import { useCardStore } from './useCardStore';


export interface iTag {
    id: number,
    label: string,
    type: string;
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

    const { removeTagFromAllNpcs } = useNpcStore();
    const { removeTagFromAllCards } = useCardStore();

    const updateTagStore = (val: iTag[]) => {
        setTagStore(val);
        localStorage.setItem('tag_store', JSON.stringify(val));
    };

    const updateActiveTags = (val: number[]) => {
        console.log('UPDATING TAGS', val);
        setActiveTags(val);
        localStorage.setItem('active_tags', JSON.stringify(val));
    };

    const createTag = (tag: iTag) => {
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
        removeTagFromAllNpcs(id);
        removeTagFromAllCards(id);
        updateActiveTags([...activeTags.filter((tag: number) => tag != id)]);
    };

    const deleteAllTags = () => {
        updateTagStore([]);
        updateActiveTags([]);
    };

    const setTagActive = (id: number) => {
        if (!activeTags.find((tag) => tag === id)) updateActiveTags([...activeTags, id]);
    };

    const setTagInactive = (id: number) => {
        updateActiveTags([...activeTags.filter((tag: number) => tag != id)]);
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
            setTagInactive
        }}>
            {props.children}
        </TagStoreContext.Provider>
    );
};

export const useTagStore = () => useContext(TagStoreContext);