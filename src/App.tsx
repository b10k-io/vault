import React from 'react';
import { Routes, Route } from "react-router-dom";

import Layout from "./components/pages/Layout";
import Index from "./components/pages/Index";
import Show from "./components/pages/Show";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Index />} />
        <Route path='/:contractId' element={<Show />} />
      </Route>
    </Routes>
  );
}

export default App;
