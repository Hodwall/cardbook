import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TagStoreProvider } from './hooks/useTagStore';
import { CardStoreProvider } from './hooks/useCardStore';
import { DeckStoreProvider } from './hooks/useDeckStore';
import { SettingsStoreProvider } from './hooks/useSettingsStore';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SettingsStoreProvider>
      <DeckStoreProvider>
        <CardStoreProvider>
          <TagStoreProvider>
            <App />
          </TagStoreProvider>
        </CardStoreProvider>
      </DeckStoreProvider>
    </SettingsStoreProvider>
  </React.StrictMode>,
);