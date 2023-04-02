import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NpcStoreProvider } from './hooks/useNpcStore';
import { TagStoreProvider } from './hooks/useTagStore';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NpcStoreProvider>
      <TagStoreProvider>
        <App />
      </TagStoreProvider>
    </NpcStoreProvider>
  </React.StrictMode>,
);
