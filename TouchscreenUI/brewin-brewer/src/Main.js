import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Start from './pages/Start';
import FaceRecognition from './pages/FaceRecognition';
import FaceRecognized from './pages/FaceRecognized';
import FaceNotRecognized from './pages/FaceNotRecognized';
import IDBarcode from './pages/IDBarcode';
import IDFaceRecognition from './pages/IDFaceRecognition';
import TryAgain from './pages/TryAgain';
import IDFaceNotMatched from './pages/IDFaceNotMatched';
import InvalidID from './pages/InvalidID';
import Menu from './pages/Menu';
import QRCodeReader from './pages/QRCodeReader'
import AwaitPayment from './pages/AwaitPayment'
import InvalidQRCode from './pages/InvalidQRCode';
import SobrietyTest from './pages/SobrietyTest';
import SobrietyTestInstructions from './pages/SobrietyTestInstructions';

const Main = () => {
  return (
    <Routes> {/* The Switch decides which component to show based on the current URL.*/}
      <Route path='/' element={<Start/>}></Route>
      <Route path='/facialrecognition' element={<FaceRecognition/>}></Route>
      <Route path='/facerecognized' element={<FaceRecognized/>}></Route>
      <Route path='/facenotrecognized' element={<FaceNotRecognized/>}></Route>
      <Route path='/idbarcode' element={<IDBarcode/>}></Route>
      <Route path='/idfacerecognition' element={<IDFaceRecognition/>}></Route>
      <Route path='/tryagain' element={<TryAgain/>}></Route>
      <Route path='/invalidid' element={<InvalidID/>}></Route>
      <Route path='/idfacenotmatched' element={<IDFaceNotMatched/>}></Route>
      <Route path='/menu' element={<Menu/>}></Route>
      <Route path='/qrcodereader' element={<QRCodeReader/>}></Route>
      <Route path='/awaitpayment' element={<AwaitPayment/>}></Route>
      <Route path='/invalidqrcode' element={<InvalidQRCode/>}></Route>
      <Route path='/sobrietytest' element={<SobrietyTest/>}></Route>
      <Route path='/sobrietytestinstructions' element={<SobrietyTestInstructions/>}></Route>
    </Routes>
  );
}

export default Main;