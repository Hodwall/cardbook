import { Outlet } from 'react-router-dom';
import { NpcStoreProvider } from './hooks/useNpcStore';
import './App.css';


function App() {
  return (
    <div className="App">
      <NpcStoreProvider>
        <Outlet />
      </NpcStoreProvider>
    </div>
  );
}

export default App;
