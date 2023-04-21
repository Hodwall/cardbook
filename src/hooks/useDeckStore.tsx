import { useState, createContext, useContext, useEffect } from 'react';

const DeckStoreContext = createContext<any>(null);

export interface iDeck {
    id: number,
    label: string,
    isStrict: boolean,
    tags: number[],
}

export const DeckStoreProvider = (props: { children: React.ReactNode; }) => {
    const [deckStore, setDeckStore] = useState<iDeck[]>((() => {
        let stored_data = localStorage.getItem('deck_store');
        if (stored_data) return JSON.parse(stored_data);
        else return [];
    })());
    const [activeDeck, setActiveDeck] = useState<iDeck | null>((() => {
        let stored_data = localStorage.getItem('active_deck');
        if (stored_data) {
            if (typeof stored_data === 'string') return deckStore.find((deck: iDeck) => deck.id === parseInt(stored_data || ''));
            else return JSON.parse(stored_data);
        }
        else return null;
    })());

    const updateDeckStore = (val: iDeck[]) => {
        setDeckStore(val);
        localStorage.setItem('deck_store', JSON.stringify(val));
    };

    const updateActiveDeck = (deck_id: number | null) => {
        const deck = deck_id ? deckStore.find((deck: iDeck) => deck.id === deck_id) : null;
        setActiveDeck(deck || null);
        localStorage.setItem('active_deck', JSON.stringify(deck));
    };

    useEffect(() => {
        if (activeDeck) {
            const deck = deckStore.find((deck: iDeck) => deck.id === activeDeck.id);
            setActiveDeck(deck ?? null);
            localStorage.setItem('active_deck', JSON.stringify(deck));
        }
    }, [deckStore]);

    const createDeck = (label: string, isStrict: boolean, tags: number[]) => {
        const new_id = Date.now();
        console.log(tags);
        updateDeckStore([...deckStore, {
            id: new_id,
            label: label,
            isStrict: isStrict,
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
        }
    };

    const updateDeckIsStrict = (id: number, strict: boolean) => {
        let store = [...deckStore];
        const deck_index = store.findIndex((deck: iDeck) => deck.id === id);
        if (deck_index !== -1) {
            store[deck_index].isStrict = strict;
            updateDeckStore(store);
        }
    };

    const updateDeckTags = (id: number, tags: number[]) => {
        let store = [...deckStore];
        const deck_index = store.findIndex((deck: iDeck) => deck.id === id);
        if (deck_index !== -1) {
            store[deck_index].tags = [...tags];
            updateDeckStore(store);
        }
    };

    const deleteDeck = (id: number) => {
        updateDeckStore(deckStore.filter((deck: iDeck) => deck.id != id));
        if (activeDeck && activeDeck.id === id) updateActiveDeck(null);
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
            updateDeckIsStrict,
            updateDeckTags,
            getDeck
        }}>
            {props.children}
        </DeckStoreContext.Provider>
    );
};

export const useDeckStore = () => useContext(DeckStoreContext);