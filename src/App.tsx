import React from 'react';
import { Routes, Route } from "react-router-dom";

import Layout from "./components/pages/Layout";
import TokenIndex from "./components/pages/public/tokens/TokenIndex";
import TokenShow from "./components/pages/public/tokens/TokenShow";
import Home from "./components/pages/public/Home";
import Dashboard from './components/pages/private/Dashboard';
import CreateLock from './components/pages/private/CreateLock';

function App() {
  return (
    <Routes>
      <Route path='' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='create' element={<CreateLock />} />

        <Route path='tokens'>
          <Route index element={<TokenIndex />} />
          <Route path=':address' element={<TokenShow />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
