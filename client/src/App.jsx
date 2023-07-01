import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Col, Container, Row, Spinner, Button} from 'react-bootstrap';
import { Fragment, useEffect, useState } from 'react';

//import API from './API';

//import Login from './components/Login.js';

import Navigation from './components/Navigation';
import PlaneCard from './components/PlaneCard';
import SeatVisualization from './components/SeatVisualization';

const seats_array = [["1A", "2A", "3A", "4A", "5A", "6A", "7A", "8A", "9A", "10A", "11A", "12A", "13A", "14A", "15A"], ["1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "11B", "12B", "13B", "14B", "15B"]];


function App() {
  return (
    <>
    <Navigation className="Navigation"/>
    <Container className="App" fluid>
        <PlaneCard plane_num={0}/>
        <PlaneCard plane_num={1}/>
        <PlaneCard plane_num={2}/>
        <Row>
          <Col>
          <SeatVisualization SeatsArray={seats_array}/>
          </Col>
        </Row>
    </Container>
    </>
  );
}

export default App;
