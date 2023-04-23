import { useState, createContext, useContext } from 'react';

export interface iCardStat {
    id: number,
    label: string,
    color?: string,
    useTotal?: boolean,
    value: number | null,
}

export interface iCard {
    id: number,
    label: string,
    color?: string,
    background?: string,
    content?: any,
    isFlipped?: boolean,
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
        const new_id = Date.now();
        updateCardStore([...cardStore, {
            id: new_id,
            label: '',
            stats: [],
            tags: tags
        }]);
    };

    const deleteCard = (id: number) => {
        let store = [...cardStore];
        store = cardStore.filter((card: iCard) => card.id != id);
        store = [...updateStatTotals(store)];
        updateCardStore(store);
    };

    const copyCard = (id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === id);
        if (card_index != -1) {
            store = [...store, {
                id: Date.now(),
                label: store[card_index].label,
                color: store[card_index].color,
                background: store[card_index].background,
                content: store[card_index].content,
                stats: store[card_index].stats.map((stat, index) => { return { ...stat, id: Date.now() + index }; }),
                tags: [...store[card_index].tags]
            }];
            store = [...updateStatTotals(store)];
            updateCardStore(store);
        }
    };

    const addTagToCard = (card_id: number, tag_id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === card_id);
        if (card_index != -1) {
            const has_tag = store[card_index].tags.some((tag) => tag === tag_id);
            if (!has_tag) store[card_index].tags.push(tag_id);
            store = [...updateStatTotals(store)];
            updateCardStore(store);
        }
    };

    const removeTagFromCard = (card_id: number, tag_id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === card_id);
        if (card_index != -1) {
            store[card_index].tags = store[card_index].tags.filter((tag) => tag != tag_id);
            store = [...updateStatTotals(store)];
            updateCardStore(store);
        }
    };

    const removeTagFromAllCards = (tag_id: number) => {
        let store = [...cardStore];
        store.forEach((card) => { card.tags = card.tags.filter((tag: number) => tag != tag_id); });
        store = [...updateStatTotals(store)];
        updateCardStore(store);
    };

    const updateCardContent = (content: any, id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === id);
        if (card_index != -1) {
            store[card_index].content = content;
            updateCardStore(store);
        }
    };

    const updateCardLabel = (label: string, id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === id);
        if (card_index != -1) {
            store[card_index].label = label;
            updateCardStore(store);
        }
    };

    const updateCardColor = (color: string, id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === id);
        if (card_index != -1) {
            store[card_index].color = color;
            updateCardStore(store);
        }
    };

    const updateCardBackground = (background: string, id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === id);
        if (card_index != -1) {
            store[card_index].background = background;
            updateCardStore(store);
        }
    };

    const addStatToCard = (card_id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === card_id);
        if (card_index != -1) {
            store[card_index].stats.push({
                id: Date.now(),
                label: '',
                useTotal: false,
                value: null,
            });
            updateCardStore(store);
        }
    };

    const removeStatFromCard = (stat_id: number, card_id: number) => {
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === card_id);
        console.log(store[card_index].stats);
        if (card_index != -1) {
            store[card_index].stats = [...store[card_index].stats.filter((stat: iCardStat) => stat.id != stat_id)];
            console.log(store[card_index].stats);
            store = [...updateStatTotals(store)];
            console.log(store[card_index].stats);
            updateCardStore(store);
        }
    };

    const updateStat = (stat_id: number, card_id: number, data: { label?: string, value?: number, color?: string; useTotal?: boolean; }) => {
        console.log(data);
        let store = [...cardStore];
        const card_index = store.findIndex((card: iCard) => card.id === card_id);
        if (card_index != -1) {
            const stat_index = store[card_index].stats?.findIndex((stat: iCardStat) => stat.id === stat_id);
            if (stat_index != -1) {
                if (data.label) store[card_index].stats[stat_index].label = data.label;
                if (typeof data.value !== 'undefined') store[card_index].stats[stat_index].value = data.value;
                if (data.color) store[card_index].stats[stat_index].color = data.color;
                if (typeof data.useTotal === 'boolean') store[card_index].stats[stat_index].useTotal = !!data.useTotal;
                if (data.value || typeof data.useTotal === 'boolean') store = [...updateStatTotals(store)];
                updateCardStore(store);
            }
        }
    };

    const updateStatTotals = (store: iCard[]) => {
        let tmp_store = [...store];
        tmp_store.forEach((card_to_update) => {
            if (card_to_update.stats && card_to_update.stats.length > 0) {
                card_to_update.stats.forEach((stat_to_update) => {
                    if (stat_to_update.useTotal) {
                        //found a card with a stat that uses total
                        let values: number[] = [];
                        tmp_store.forEach((card_being_checked: iCard) => {
                            if (card_being_checked.id === card_to_update.id) return;
                            // If all the tags in the card to update are in the card being checked
                            if (card_to_update.tags.every((tag) => card_being_checked.tags.includes(tag))) {
                                const valid_stat = card_being_checked.stats.find((stat_being_checked) => stat_being_checked.label?.toLowerCase() === stat_to_update.label?.toLowerCase());
                                if (valid_stat) {
                                    if (valid_stat.useTotal) return;
                                    values.push(valid_stat.value || 0);
                                }
                            }
                        });
                        stat_to_update.value = values.reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
                    }
                });
            }
        });
        return tmp_store;
    };





    return (
        <CardStoreContext.Provider value={{
            cardStore,
            updateCardStore,
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
            updateStat,
        }}>
            {props.children}
        </CardStoreContext.Provider>
    );
};

export const useCardStore = () => useContext(CardStoreContext);