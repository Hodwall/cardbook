import { useState, createContext, useContext } from 'react';

const SettingsStoreContext = createContext<any>(null);

interface ISettings {
    cardScale: number,
}

export const SettingsStoreProvider = (props: { children: React.ReactNode; }) => {

    const [settingsStore, setSettingsStore] = useState<ISettings>((() => {
        let stored_data = localStorage.getItem('settings_store');
        if (stored_data) return JSON.parse(stored_data);
        else return {
            cardScale: 100
        };
    })());

    const updateSettingsStore = (val: any) => {
        setSettingsStore(val);
        localStorage.setItem('settings_store', JSON.stringify(val));
    };

    const updateCardScale = (val: number) => {
        updateSettingsStore({ ...settingsStore, cardScale: val });
    };


    return (
        <SettingsStoreContext.Provider value={{
            settingsStore,
            updateSettingsStore,
            updateCardScale,
        }}>
            {props.children}
        </SettingsStoreContext.Provider>
    );
};

export const useSettingsStore = () => useContext(SettingsStoreContext);