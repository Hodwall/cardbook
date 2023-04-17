import { useState, createContext, useContext } from 'react';

export interface iCardStat {
    id: number,
    label: string,
    value: number | null,
}

export interface iCard {
    id: number,
    label: string,
    color?: string,
    background?: string,
    content?: any,
    stats: iCardStat[],
    tags: number[];
}

const CardStoreContext = createContext<any>(null);

export const CardStoreProvider = (props: { children: React.ReactNode; }) => {

    const [cardStore, setCardStore] = useState<iCard[]>((() => {
        let stored_data = localStorage.getItem('card_store');
        if (stored_data) {
            //protection for old cards with optional parameters
            let parsed_data = JSON.parse(stored_data);
            parsed_data.forEach((card: iCard) => {
                if (!card.label) card.label = '';
                if (!card.stats) card.stats = [];
            });
            return parsed_data;
        }
        else return [];
    })());

    const updateCardStore = (val: iCard[]) => {
        setCardStore(val);
        localStorage.setItem('card_store', JSON.stringify(val));
    };

    const addCard = (tags: number[] | []) => {
        updateCardStore([...cardStore, {
            id: Date.now(),
            label: '',
            stats: [],
            tags: tags
        }]);
    };

    const deleteCard = (id: number) => {
        updateCardStore(cardStore.filter((card: iCard) => card.id != id));
    };

    const copyCard = (id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === id);
        if (card_index != -1) {
            updateCardStore([...store, {
                id: Date.now(),
                label: store[card_index].label,
                color: store[card_index].color,
                background: store[card_index].background,
                content: store[card_index].content,
                stats: [...store[card_index].stats],
                tags: [...store[card_index].tags]
            }]);
        }
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

    const updateCardColor = (color: string, id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === id);
        if (card_index != -1) {
            store[card_index].color = color;
            updateCardStore([...store]);
        }
    };

    const updateCardBackground = (background: string, id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === id);
        if (card_index != -1) {
            store[card_index].background = background;
            updateCardStore([...store]);
        }
    };

    const addStatToCard = (id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === id);
        if (card_index != -1) {
            store[card_index].stats.push({
                id: Date.now(),
                label: '',
                value: null,
            });
            updateCardStore([...store]);
        }
    };

    const removeStatFromCard = (stat_id: number, card_id: number) => {
        console.log('removing');
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === card_id);
        if (card_index != -1) {
            console.log(store[card_index].stats);
            store[card_index].stats = [...store[card_index].stats.filter((stat: iCardStat) => stat.id != stat_id)];
            console.log(store[card_index].stats);
            updateCardStore(store);
        }
    };

    const updateStat = (stat_id: number, card_id: number, data: { label: string, value: number; }) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === card_id);
        if (card_index != -1) {
            const stat_index = store[card_index].stats?.findIndex((stat: iCardStat) => stat.id === stat_id);
            if (stat_index != -1) {
                //@ts-ignore
                store[card_index].stats[stat_index].label = data.label;
                store[card_index].stats[stat_index].value = data.value;
                updateCardStore(store);
            }
        }
    };

    return (
        <CardStoreContext.Provider value={{
            cardStore,
            addCard,
            deleteCard,
            copyCard,
            addTagToCard,
            removeTagFromCard,
            removeTagFromAllCards,
            updateCardContent,
            updateCardLabel,
            updateCardColor,
            updateCardBackground,
            addStatToCard,
            removeStatFromCard,
            updateStat
        }}>
            {props.children}
        </CardStoreContext.Provider>
    );
};

export const useCardStore = () => useContext(CardStoreContext);