import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Locations from './pages/Locations';
import Npcs from './pages/Npcs';
import Treasures from './pages/Treasures';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1>An error has occured</h1>,
    children: [
      {
        path: '/treasures',
        element: <Treasures />,
      },
      {
        path: '/npcs',
        element: <Npcs />,
      },
      {
        path: '/locations',
        element: <Locations />,
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
