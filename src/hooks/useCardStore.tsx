import { useState, createContext, useContext } from 'react';

export interface iCard {
    id: number,
    label: string,
    content?: any,
    tags: number[];
}

const CardStoreContext = createContext<any>(null);

export const CardStoreProvider = (props: { children: React.ReactNode; }) => {

    const [cardStore, setCardStore] = useState<iCard[]>((() => {
        let stored_data = localStorage.getItem('card_store');
        if (stored_data) {
            //protection for old cards with optional labels
            let parsed_data = JSON.parse(stored_data);
            parsed_data.forEach((card: iCard) => {
                if (!card.label) card.label = '';
            });
            return parsed_data;
        }
        else return [];
    })());

    const updateCardStore = (val: iCard[]) => {
        setCardStore(val);
        localStorage.setItem('card_store', JSON.stringify(val));
        console.log(cardStore);
    };

    const addCard = (tags: number[] | []) => {
        updateCardStore([...cardStore, {
            id: Date.now(),
            label: '',
            tags: tags
        }]);
    };

    const deleteCard = (id: number) => {
        updateCardStore(cardStore.filter((card: iCard) => card.id != id));
    };

    const addTagToCard = (card_id: number, tag_id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === card_id);
        if (card_index != -1) {
            const has_tag = store[card_index].tags.some((tag) => tag === tag_id);
            if (!has_tag) store[card_index].tags.push(tag_id);
            updateCardStore([...store]);
        }
    };

    const removeTagFromCard = (card_id: number, tag_id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === card_id);
        if (card_index != -1) {
            store[card_index].tags = store[card_index].tags.filter((tag) => tag != tag_id);
            updateCardStore([...store]);
        }
    };

    const removeTagFromAllCards = (tag_id: number) => {
        let store = [...cardStore];
        store.forEach((card) => { card.tags = card.tags.filter((tag: number) => tag != tag_id); });
        updateCardStore([...store]);
    };

    const updateCardContent = (content: any, id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === id);
        if (card_index != -1) {
            store[card_index].content = content;
            updateCardStore([...store]);
        }
    };

    const updateCardLabel = (label: string, id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === id);
        if (card_index != -1) {
            store[card_index].label = label;
            updateCardStore([...store]);
        }
    };

    return (
        <CardStoreContext.Provider value={{
            cardStore,
            addCard,
            deleteCard,
            addTagToCard,
            removeTagFromCard,
            removeTagFromAllCards,
            updateCardContent,
            updateCardLabel
        }}>
            {props.children}
        </CardStoreContext.Provider>
    );
};

export const useCardStore = () => useContext(CardStoreContext);