import { Outlet } from 'react-router-dom';
import { NpcStoreProvider } from './hooks/useNpcStore';
import { TagStoreProvider } from './hooks/useTagStore';
import './App.css';


function App() {
  return (
    <div className="App">
      <NpcStoreProvider>
        <TagStoreProvider>
          <Outlet />
        </TagStoreProvider>
      </NpcStoreProvider>
    </div>
  );
}

export default App;
