import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form } from 'react-bootstrap';
import '../App.css';

function Navigation() {

  return (
    <Navbar bg="primary" expand="sm" variant="dark" fixed="top" className="navbar-padding">
        <Navbar.Brand>
        <i className="bi bi-collection-play icon-size"/> 
          <span className="navbar-brand-text">IronAir</span>
        </Navbar.Brand>
      <Nav className="ml-md-auto">
        <Nav.Item>
          <Nav.Link href="#">
            <i className="bi bi-airplane-fill icon-size"/>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}

export default Navigation; 