import AppBar from './components/AppBar';
import Gallery from './components/Gallery';
import AppBody from './components/AppBody/AppBody';
import './App.css';


function App() {
  return (
    <div className="App">
      <AppBar />
      <AppBody />
      {/* <Gallery /> */}
    </div>
  );
}

export default App;