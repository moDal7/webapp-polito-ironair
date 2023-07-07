import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { React, useState, useEffect } from 'react';
import { Container, Row, Spinner, Button} from 'react-bootstrap';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import API from './API';
import Login from './components/Login';
import Navigation from './components/Navigation';
import { HomeLayout, PlaneLayout, LoadingLayout} from './components/PageLayouts';


function App() {

  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const getPlanes = async () => {
      try {
        const planes = await API.readPlanes();
        if (loggedIn) {
          const reservations = await API.getReservationByUser();
          setReservations(reservations);
        }
        setPlanes(planes);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    getPlanes();
  }, []);

  return (
    <BrowserRouter>
      <Navigation loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user} setUser={setUser}/>
      <Container className="App" fluid>
        <Routes>
        <Route index element={ loading ? <LoadingLayout /> : <HomeLayout planes={planes} loggedIn={loggedIn}/>}/>
            <Route path="/login" element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user} setUser={setUser}/>}/>
            <Route path="/plane/:planeId" element={ loading ? <LoadingLayout /> : <PlaneLayout planes={planes} reservations={reservations} loggedIn={loggedIn}/>}/>
          <Route/>
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
