import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';
import API from '../API';

function Navigation(props) {

  const handleLogout = async () => {
    await API.logOut();
    props.setLoggedIn(false);
    props.setUser(null);
    props.setReservations([]);
  };

  return (
    <Navbar bg="primary" expand="sm" variant="dark" className="navbar-padding">
        <Link to="/">
          <Navbar.Brand>
            <span className="navbar-brand-text title">IRONAIR</span>
          </Navbar.Brand>
        </Link>
          <Navbar.Brand>
            <i className="bi bi-airplane-fill icon-size"/>
          </Navbar.Brand>
        {props.loggedIn ? 
        <Navbar.Brand>
          <i className="bi bi-person-circle icon-size"/>
      
          <span onClick={handleLogout} className="navbar-brand-text Login" style={{'cursor':'pointer'}}>Logout</span>
        </Navbar.Brand> : 
        <Link to="/login">
        <Navbar.Brand>
          <i className="bi bi-box-arrow-in-right"/>
          <span className="navbar-brand-text Login">Login</span>
        </Navbar.Brand>
      </Link>
        }
    </Navbar>
  );
}

export default Navigation; 