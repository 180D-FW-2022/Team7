import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DeviceManagement from './pages/deviceManagement';
import Login from './pages/login';

const Main = () => {
  return (
    <Routes> {/* The Switch decides which component to show based on the current URL.*/}
      <Route path='/' element={<Login/>}></Route>
      <Route path='/devicemanagement' element={<DeviceManagement/>}></Route>
    </Routes>
  );
}

export default Main;