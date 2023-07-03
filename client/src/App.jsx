import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { React, useState, useEffect, useContext } from 'react';
import { Col, Container, Row, Spinner, Button} from 'react-bootstrap';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

//import API from './API';

import Login from './components/Login';

import Navigation from './components/Navigation';
import { HomeLayout, PlaneLayout } from './components/PageLayouts';


function App() {
  return (
    <BrowserRouter>
      <Navigation/>
      <Container className="App" fluid>
        <Routes>
          <Route path="/" element={<HomeLayout/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/plane/:planeId" element={<PlaneLayout/>}/>
          <Route/>
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
