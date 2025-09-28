import React from 'react';
import { Route, Routes } from 'react-router';

import Report from './pages/report';

import Employee from './pages/employee';
import Login from './pages/authentication/login';
import Register from './pages/authentication/register';
import ProductShowcase from './pages/user/showproduct';

import Product from './pages/product';
import Agency from './pages/agency';
import Customer from './pages/customer';
import Order from './pages/order';

import HistoryAddProduct from './pages/user/lichsumua';
import BaoDuongList from './pages/maintain'; 
import AccountList from './pages/account';

export default function App() {
  const isLoggedIn = localStorage.getItem("login") === "ok";
  return (
    <>
      {isLoggedIn ? (
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/baocao' element={<Report />} />
          <Route path='/danhsach' element={<Product />} />
          <Route path='/nhanvien' element={<Employee />} />
          
          <Route path='/daily' element={<Agency />} />
          <Route path='/khachhang' element={<Customer />} />
          <Route path='/donhang' element={<Order />} />
        
          <Route path='/baoduong' element={<BaoDuongList />} /> 
          <Route path='/taikhoan' element={<AccountList />}  />
        </Routes>
      ) : (
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      )}
      <Routes>
        <Route path='/sanphamcuauser' element={<ProductShowcase />} />
        <Route path='/lichsumua' element={<HistoryAddProduct />} />
      </Routes>
    </>
  );
}
