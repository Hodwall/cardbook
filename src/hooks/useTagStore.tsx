import { useState, createContext, useContext } from 'react';
import { useNpcStore } from './useNpcStore';
// import { iNpc } from '../builders/npc/npc.model';

export interface iTag {
    id: number,
    label: string,
    type: string;
    is_active: boolean,
}

const TagStoreContext = createContext<any>(null);

export const TagStoreProvider = (props: { children: React.ReactNode; }) => {
    const [tagStore, setTagStore] = useState<iTag[]>((() => {
        let stored_data = localStorage.getItem('tag_store');
        if (stored_data) return JSON.parse(stored_data);
        else return [];
    })());

    const { removeTagFromAllNpcs } = useNpcStore();

    const updateTagStore = (val: iTag[]) => {
        setTagStore(val);
        localStorage.setItem('tag_store', JSON.stringify(val));
    };

    const createTag = (tag: iTag) => {
        updateTagStore([...tagStore, {
            ...tag,
            id: Date.now(),
            is_active: true
        }]);
    };

    const deleteTag = (id: number) => {
        updateTagStore(tagStore.filter((tag: iTag) => tag.id != id));
        removeTagFromAllNpcs(id);
    };

    const deleteAllTags = () => {
        updateTagStore([]);
    };

    return (
        <TagStoreContext.Provider value={{
            tagStore,
            createTag,
            deleteTag,
        }}>
            {props.children}
        </TagStoreContext.Provider>
    );
};

export const useTagStore = () => useContext(TagStoreContext);