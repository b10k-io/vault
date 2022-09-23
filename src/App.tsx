import React from 'react';
import { Routes, Route } from "react-router-dom";

import Layout from "./components/pages/Layout";
import Tokens from "./components/pages/Tokens";
import Show from "./components/pages/Show";
import Home from "./components/pages/Home";
import Dashboard from './components/pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path='' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='dashboard' element={<Dashboard />} />

        <Route path='tokens'>
          <Route index element={<Tokens />} />
          <Route path=':id' element={<Show />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
