import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

import Home from './sections/Home';
import Treasures from './sections/Treasures';
import Npcs from './sections/Npcs';
import Locations from './sections/Locations';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NavBar from './containers/NavBar';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/treasures" element={<Treasures />} />
          <Route path="/npcs" element={<Npcs />} />
          <Route path="/locations" element={<Locations />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
