import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Start from './pages/Start';
import TryAgain from './pages/TryAgain';
import Menu from './pages/Menu';
import QRCodeReader from './pages/QRCodeReader'
import AwaitPayment from './pages/AwaitPayment'
import InvalidQRCode from './pages/InvalidQRCode';
import SobrietyTest from './pages/SobrietyTest';
import SobrietyTestInstructions from './pages/SobrietyTestInstructions';
import DrinkBeingMade from './pages/DrinkBeingMade';

const Main = () => {
  return (
    <Routes> {/* The Switch decides which component to show based on the current URL.*/}
      <Route path='/' element={<Start/>}></Route>
      <Route path='/tryagain' element={<TryAgain/>}></Route>
      <Route path='/menu' element={<Menu/>}></Route>
      <Route path='/qrcodereader' element={<QRCodeReader/>}></Route>
      <Route path='/awaitpayment' element={<AwaitPayment/>}></Route>
      <Route path='/invalidqrcode' element={<InvalidQRCode/>}></Route>
      <Route path='/sobrietytest' element={<SobrietyTest/>}></Route>
      <Route path='/sobrietytestinstructions' element={<SobrietyTestInstructions/>}></Route>
      <Route path='/drinkbeingmade' element={<DrinkBeingMade/>}></Route>
    </Routes>
  );
}

export default Main;