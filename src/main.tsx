import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NpcStoreProvider } from './hooks/useNpcStore';
import { TagStoreProvider } from './hooks/useTagStore';
import { CardStoreProvider } from './hooks/useCardStore';
import { DeckStoreProvider } from './hooks/useDeckStore';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CardStoreProvider>
      <NpcStoreProvider>
        <DeckStoreProvider>
          <TagStoreProvider>
            <App />
          </TagStoreProvider>
        </DeckStoreProvider>
      </NpcStoreProvider>
    </CardStoreProvider>
  </React.StrictMode>,
);