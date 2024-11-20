import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Explore from './pages/Explore';
import ItemDetail from './pages/ItemDetail';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadComplete from './pages/Upload-complete';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload-complete" element={<UploadComplete />} />
      </Routes>
    </Layout>
  );
}

export default App; 