import { useState, createContext, useContext } from 'react';

const SettingsStoreContext = createContext<any>(null);

interface iSettings {
    cardScale: number,
    cardDefaultBg: {};
}

export const SettingsStoreProvider = (props: { children: React.ReactNode; }) => {
    const [settingsStore, setSettingsStore] = useState<iSettings>((() => {
        let stored_data = localStorage.getItem('settings_store');
        if (stored_data) {
            //protection for old cards with optional parameters
            let parsed_data = JSON.parse(stored_data);
            if (!parsed_data.cardDefaultBg) parsed_data.cardDefaultBg = {};
            return parsed_data;
        } else return {
            cardScale: 100,
            cardDefaultBg: {}
        };
    })());

    const updateSettingsStore = (val: any) => {
        setSettingsStore(val);
        localStorage.setItem('settings_store', JSON.stringify(val));
    };

    const updateCardScale = (val: number) => {
        updateSettingsStore({ ...settingsStore, cardScale: val });
    };

    const updateCardDefaultBg = (label: string, url: string) => {
        const updated_settings = {
            cardScale: settingsStore.cardScale,
            cardDefaultBg: {
                ...settingsStore.cardDefaultBg,
                [label]: url,
            }
        };
        console.log(updated_settings);
        updateSettingsStore(updated_settings);
        localStorage.setItem('settings_store', JSON.stringify(updated_settings));
    };


    return (
        <SettingsStoreContext.Provider value={{
            settingsStore,
            updateSettingsStore,
            updateCardScale,
            updateCardDefaultBg
        }}>
            {props.children}
        </SettingsStoreContext.Provider>
    );
};

export const useSettingsStore = () => useContext(SettingsStoreContext);