import { useState, createContext, useContext } from 'react';

import { iTag } from './useTagStore';


export interface iDeck {
    id: number,
    label: string,
    tags: number[],
}

const DeckStoreContext = createContext<any>(null);

export const DeckStoreProvider = (props: { children: React.ReactNode; }) => {

    const [deckStore, setDeckStore] = useState<iDeck[]>((() => {
        let stored_data = localStorage.getItem('deck_store');
        if (stored_data) return JSON.parse(stored_data);
        else return [];
    })());

    const [activeDeck, setActiveDeck] = useState<number>((() => {
        let stored_data = localStorage.getItem('active_deck');
        if (stored_data) return JSON.parse(stored_data);
        else return [];
    })());


    const updateDeckStore = (val: iDeck[]) => {
        setDeckStore(val);
        localStorage.setItem('deck_store', JSON.stringify(val));
    };

    const updateActiveDeck = (deck_id: any) => {
        setActiveDeck(deck_id);
        localStorage.setItem('active_deck', JSON.parse(deck_id));
    };

    const createDeck = (label: string, tags: number[]) => {
        const new_id = Date.now();
        console.log(tags);
        updateDeckStore([...deckStore, {
            id: new_id,
            label: label,
            tags: [...tags]
        }]);
        updateActiveDeck(new_id);
    };

    const updateDeckLabel = (id: number, label: string) => {
        let store = [...deckStore];
        const deck_index = store.findIndex((deck: iDeck) => deck.id === id);
        if (deck_index !== -1) {
            store[deck_index].label = label;
            updateDeckStore(store);
            updateActiveDeck(id);
        }
    };

    const deleteDeck = (id: number) => {
        updateDeckStore(deckStore.filter((deck: iDeck) => deck.id != id));
        if (activeDeck === id) updateActiveDeck(null);
    };

    const getDeck = (id: number) => {
        return deckStore.find((deck: iDeck) => deck.id === id);
    };

    return (
        <DeckStoreContext.Provider value={{
            deckStore,
            activeDeck,
            updateActiveDeck,
            createDeck,
            deleteDeck,
            updateDeckLabel,
            getDeck
        }}>
            {props.children}
        </DeckStoreContext.Provider>
    );
};

export const useDeckStore = () => useContext(DeckStoreContext);