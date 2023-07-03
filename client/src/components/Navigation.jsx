import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';

function Navigation() {

  return (
    <Navbar bg="primary" expand="sm" variant="dark" className="navbar-padding">
        <Link to="/">
          <Navbar.Brand>
            <span className="navbar-brand-text title">IRONAIR</span>
          </Navbar.Brand>
        </Link>
        <Link to="/reservation">
          <Navbar.Brand>
            <i className="bi bi-airplane-fill icon-size"/>
            <span className="navbar-brand-text" margin-left>Book a Flight!</span>
          </Navbar.Brand>
        </Link>
        <Link to="/login">
          <Navbar.Brand>
            <i className="bi bi-box-arrow-in-right"/>
            <span className="navbar-brand-text" margin-left>Login</span>
          </Navbar.Brand>
        </Link>
    </Navbar>
  );
}

export default Navigation; 