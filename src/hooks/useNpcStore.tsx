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

    return (
        <NpcStoreContext.Provider value={{
            npcStore,
            addNpc,
            deleteNpc,
            deleteAllNpcs,
            deleteNotPinnedNpcs,
            pinNpc,
            unpinNpc
        }}>
            {props.children}
        </NpcStoreContext.Provider>
    );
};

export const useNpcStore = () => useContext(NpcStoreContext);