import { useState, createContext, useContext } from 'react';
// import { iNpc } from '../builders/npc/npc.model';

interface iTag {
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

    const updateTagStore = (val: iTag[]) => {
        setTagStore(val);
        localStorage.setItem('tag_store', JSON.stringify(val));
    };

    const createTag = (tag: iTag) => {
        updateTagStore([...tagStore, tag]);
    };

    const deleteTag = (id: number) => {
        updateTagStore(tagStore.filter((tag: iTag) => tag.id != id));
    };


    // const updateNpcStore = (val: iNpc[]) => {
    //     setNpcStore(val);
    //     localStorage.setItem('npc_store', JSON.stringify(val));
    // };

    // const addNpc = (npc: iNpc) => {
    //     updateNpcStore([...tagStore, npc]);
    // };

    // const deleteNpc = (id: number) => {
    //     updateNpcStore(tagStore.filter((npc: iNpc) => npc.id != id));
    // };

    // const deleteAllNpcs = () => {
    //     updateNpcStore([]);
    // };

    // const deleteNotPinnedNpcs = () => {
    //     updateNpcStore(tagStore.filter((npc: iNpc) => npc.isPinned === true));
    // };

    // const pinNpc = (id: number) => {
    //     let store = [...tagStore];
    //     const npc_index = store.findIndex((npc: iNpc) => npc.id === id);
    //     store[npc_index].isPinned = true;
    //     updateNpcStore(store);
    // };

    // const unpinNpc = (id: number) => {
    //     let store = [...tagStore];
    //     const npc_index = store.findIndex((npc: iNpc) => npc.id === id);
    //     store[npc_index].isPinned = false;
    //     updateNpcStore(store);
    // };

    return (
        <TagStoreContext.Provider value={{
            tagStore,
            // addNpc,
            // deleteNpc,
            // deleteAllNpcs,
            // deleteNotPinnedNpcs,
            // pinNpc,
            // unpinNpc
        }}>
            {props.children}
        </TagStoreContext.Provider>
    );
};

export const useNpcStore = () => useContext(TagStoreContext);