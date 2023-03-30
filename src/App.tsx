import { Outlet } from 'react-router-dom';
import { NpcStoreProvider } from './hooks/useNpcStore';
import { TagStoreProvider } from './hooks/useTagStore';
import './App.css';


function App() {
  return (
    <div className="App">
      <TagStoreProvider>
        <NpcStoreProvider>
          <Outlet />
        </NpcStoreProvider>
      </TagStoreProvider>
    </div>
  );
}

export default App;
