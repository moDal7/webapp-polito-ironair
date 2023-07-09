import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';
import API from '../API';

function Navigation(props) {

  // function to handle the logout
  const handleLogout = async () => {
    await API.logOut();
    props.setLoggedIn(false);
    props.setUser(null);
    props.setReservations([]);
  };
  /* Navbar component with the following features:
  It has links to the home page and to the login page
  It has a button to logout when the user is logged in 
  */
  return (
    <Navbar bg="primary" expand="sm" variant="dark" className="navbar-padding">
        <Link to="/">
          <Navbar.Brand>
            <span className="navbar-brand-text title">IRONAIR</span>
          </Navbar.Brand>
        </Link>
          <Navbar.Brand>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-airplane-fill" viewBox="0 0 16 16">
            <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z"/>
            </svg>
          </Navbar.Brand>
        {props.loggedIn ? 
        <Navbar.Brand>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
          <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
          </svg>
      
          <span onClick={handleLogout} className="navbar-brand-text Login" style={{'cursor':'pointer'}}>Logout</span>
        </Navbar.Brand> : 
        <Link to="/login">
        <Navbar.Brand>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
        <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
        </svg>
          <span className="navbar-brand-text Login">Login</span>
        </Navbar.Brand>
      </Link>
        }
    </Navbar>
  );
}

export default Navigation; 