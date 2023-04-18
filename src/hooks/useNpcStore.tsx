import { useState, createContext, useContext } from 'react';

export interface iNpc {
    id: number,
    name: string,
    ancestry: string,
    gender: string,
    age: string,
    high_ability: string,
    low_ability: string,
    alignment: string,
    occupation: string,
    interaction: string,
    relationship: string,
    isPinned: boolean,
    voice: string,
    description: string;
    tags: number[];
}

const NpcStoreContext = createContext<any>(null);

export const NpcStoreProvider = (props: { children: React.ReactNode; }) => {
    const [npcStore, setNpcStore] = useState<iNpc[]>((() => {
        let stored_data = localStorage.getItem('npc_store');
        if (stored_data) return JSON.parse(stored_data);
        else return [];
    })());

    const updateNpcStore = (val: iNpc[]) => {
        setNpcStore(val);
        localStorage.setItem('npc_store', JSON.stringify(val));
    };

    const addNpc = (npc: iNpc) => {
        updateNpcStore([...npcStore, npc]);
    };

    const deleteNpc = (id: number) => {
        updateNpcStore(npcStore.filter((npc: iNpc) => npc.id != id));
    };

    const deleteAllNpcs = () => {
        updateNpcStore([]);
    };

    const deleteNotPinnedNpcs = () => {
        updateNpcStore(npcStore.filter((npc: iNpc) => npc.isPinned === true));
    };

    const pinNpc = (id: number) => {
        let store = [...npcStore];
        const npc_index = store.findIndex((npc: iNpc) => npc.id === id);
        store[npc_index].isPinned = true;
        updateNpcStore(store);
    };

    const unpinNpc = (id: number) => {
        let store = [...npcStore];
        const npc_index = store.findIndex((npc: iNpc) => npc.id === id);
        store[npc_index].isPinned = false;
        updateNpcStore(store);
    };

    const addTagToNpc = (npc_id: number, tag_id: number) => {
        let store = [...npcStore];
        const npc_index = store.findIndex((npc: iNpc) => npc.id === npc_id);
        if (npc_index != -1) {
            const has_tag = store[npc_index].tags.some((tag) => tag === tag_id);
            if (!has_tag) store[npc_index].tags.push(tag_id);
            updateNpcStore([...store]);
        }
    };

    const removeTagFromNpc = (npc_id: number, tag_id: number) => {
        let store = [...npcStore];
        const npc_index = store.findIndex((npc: iNpc) => npc.id === npc_id);
        if (npc_index != -1) {
            store[npc_index].tags = store[npc_index].tags.filter((tag) => tag != tag_id);
            updateNpcStore([...store]);
        }
    };

    const removeTagFromAllNpcs = (tag_id: number) => {
        let store = [...npcStore];
        store.forEach((npc) => { npc.tags = npc.tags.filter((tag: number) => tag != tag_id); });
        updateNpcStore([...store]);
    };

    return (
        <NpcStoreContext.Provider value={{
            npcStore,
            updateNpcStore,
            addNpc,
            deleteNpc,
            deleteAllNpcs,
            deleteNotPinnedNpcs,
            pinNpc,
            unpinNpc,
            addTagToNpc,
            removeTagFromNpc,
            removeTagFromAllNpcs
        }}>
            {props.children}
        </NpcStoreContext.Provider>
    );
};

export const useNpcStore = () => useContext(NpcStoreContext);