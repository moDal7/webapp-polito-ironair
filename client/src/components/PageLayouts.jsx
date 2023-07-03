import { React, useContext, useState, useEffect } from 'react';
import { Row, Col, Button, Container} from 'react-bootstrap';
import { Link, useParams, useLocation, Outlet } from 'react-router-dom';

import plane1 from '../images/ATR72.jpg'; 
import plane2 from '../images/A220-100.jpg';
import plane3 from '../images/Boeing737.jpg';

import PlaneCard from './PlaneCard';
import SeatVisualization from './SeatVisualization';

const plane_images = [plane1, plane2, plane3];
const seats_array = [["1A", "2A", "3A", "4A", "5A", "6A", "7A", "8A", "9A", "10A", "11A", "12A", "13A", "14A", "15A"], ["1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "11B", "12B", "13B", "14B", "15B"]];


function HomeLayout() {
    return (
    <>
        <Col>
            <Link to="/plane/0">
                <PlaneCard className="col-8" plane_num={0}/>
            </Link>
            <div className="col-4">Total Seats: 100</div>
            <div className="col-4">Available Seats: 100</div>
        </Col>
        <Col>
            <Link to="/plane/1">
                <PlaneCard className="col-8" plane_num={1}/>
            </Link>
            <div className="col-4">Total Seats: 100</div>
            <div className="col-4">Available Seats: 100</div>
        </Col>
        <Col>
            <Link to="/plane/2">
                <PlaneCard className="col-8" plane_num={2}/>
            </Link>
            <div className="col-4">Total Seats: 100</div>
            <div className="col-4">Available Seats: 100</div>
        </Col>
    </>
  );
}

function PlaneLayout(props) {

    const { planeId } = useParams();

    return (
    <>  
        <Container fluid>
            <Col>
                <img src={plane_images[planeId]} alt="..." className="rounded-circle mx-auto d-block"/>
                <div className="mx-auto d-block">{planeId}</div>
                <div className="mx-auto d-block">Total Seats: 100</div>
                <div className="mx-auto d-block">Available Seats: 100</div>
            </Col>
        </Container>
        <Container fluid>
            <Row>
                <div> TEST DIV</div>
                <SeatVisualization SeatsArray={seats_array}/>
            </Row>
        </Container>
    </>
  );
}

export {HomeLayout, PlaneLayout};