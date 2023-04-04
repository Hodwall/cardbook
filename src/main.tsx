import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NpcStoreProvider } from './hooks/useNpcStore';
import { TagStoreProvider } from './hooks/useTagStore';
import { CardStoreProvider } from './hooks/useCardStore';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CardStoreProvider>
      <NpcStoreProvider>
        <TagStoreProvider>
          <App />
        </TagStoreProvider>
      </NpcStoreProvider>
    </CardStoreProvider>
  </React.StrictMode>,
);