// โค้ดต่อไปนี้เป็น React ดังนั้นจะไม่ได้อธิบายรายละเอียดของโค้ดมาก

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import ProductDetail from './components/ProductDetail';
import AddProduct from './components/AddProduct';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/addProduct' element={<AddProduct/>} />
        <Route path='/productDetail/:id' element={<ProductDetail/>} />
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
