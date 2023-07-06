import { React, useState, useEffect } from 'react';
import { Row, Col, Button, Container, Form} from 'react-bootstrap';
import { Link, useParams, useLocation, Outlet } from 'react-router-dom';

import plane1 from '../images/ATR72.jpg'; 
import plane2 from '../images/A220-100.jpg';
import plane3 from '../images/Boeing737.jpg';

import PlaneCard from './PlaneCard';
import SeatVisualization from './SeatVisualization';
import API from '../API';

const plane_images = [plane1, plane2, plane3];


function genSeatsArray(rows, columns) {
    let column_start = "A";
    let seats_array = [];

    for (let i = 0; i < columns; i++) {
        let column_array = [];
        for (let j = 1; j <= rows; j++) {
            column_array.push(j.toString() + column_start);
        }
        column_start = String.fromCharCode(column_start.charCodeAt(0) + 1);
        seats_array.push(column_array);
    }
    return seats_array;
}



function HomeLayout(props) {

    return (
    <>
        <Col>
            <Link to="/plane/0">
                <PlaneCard className="col-8" plane_num={0} plane={props.planes[0]}/>
            </Link>
            <div className="col-4">Total Seats: {props.planes[0]["seats"]}</div>
            <div className="col-4">Available Seats: {props.planes[0]["seats"] - props.planes[0]["occupied_seats"]}</div>
        </Col>
        <Col>
            <Link to="/plane/1">
                <PlaneCard className="col-8" plane_num={1} plane={props.planes[1]}/>
            </Link>
            <div className="col-4">Total Seats: {props.planes[1]["seats"]}</div>
            <div className="col-4">Available Seats: {props.planes[1]["seats"] - props.planes[1]["occupied_seats"]}</div>
        </Col>
        <Col>
            <Link to="/plane/2">
                <PlaneCard className="col-8" plane_num={2} plane={props.planes[2]}/>
            </Link>
            <div className="col-4">Total Seats: {props.planes[2]["seats"]}</div>
            <div className="col-4">Available Seats: {props.planes[2]["seats"] - props.planes[2]["occupied_seats"]}</div>
        </Col>
    </>
  );
}

function PlaneLayout(props) {

    const [selected, setSelected] = useState([]);  
    const [numSeats, setNumSeats] = useState(0);
    const [occupied, setOccupied] = useState([]);
    const [loading, setLoading] = useState(true);

    const { planeId } = useParams();

    const rows = props.planes[planeId]["num_rows"];
    const columns = props.planes[planeId]["num_columns"];
    
    const seats_array = genSeatsArray(rows, columns);

    useEffect(() => {
        const getPlaneOccupiedSeats = async (planeId) => {
          try {
            const seats = await API.getOccupiedSeats(planeId);
            for (let i = 0; i < seats.length; i++) {
                seats[i] = seats[i]["row"].toString() + seats[i]["column"];
            }
            setOccupied(seats);
            setLoading(false);
          } catch (err) {
            console.log(err);
          }
        };
        getPlaneOccupiedSeats(planeId+1);
      }, []);

    const handleClick = () => {

        let auto_selected = automaticSeatSelection(occupied, seats_array, numSeats);
        setSelected(auto_selected);
    }

    const handleAddReservation = () => {
        
        let reservation = {
            "user_id": 1,
            "plane_id": Number(planeId)+1,
            "seats": selectedToString(selected)
        }

        API.addReservation(reservation);
    }

    function automaticSeatSelection(occupied, seats_array, num_seats) {

        let t_seats = seats_array[0].map((_, colIndex) => seats_array.map(row => row[colIndex]));
        let selected_seats = []

        for (let i = 0; i < t_seats.length; i++) {
            for (let j = 0; j < t_seats[i].length; j++) {
                if (selected_seats.length < num_seats && !occupied.includes(seats_array[i][j])) {
                    selected_seats.push(seats_array[i][j]);
                }
            }
        }
        return selected_seats;
    }

    function selectedToString(selected) {
        let selected_string = "";
        for (let i = 0; i < selected.length; i++) {
            selected_string += selected[i] + " ";
        }
        return selected_string;
    }
    
    return (
    <>  
        <Container fluid>
            <Col>
                <img src={plane_images[planeId]} alt="..." className="rounded-circle planeImage"/>
                <div className="mx-auto d-block">{planeId}</div>
                <div className="mx-auto d-block">Total Seats: </div>
                <div className="mx-auto d-block">Available Seats: </div>
            </Col>
        </Container>
        <Container fluid>
            <Row>
                <SeatVisualization SeatsArray={seats_array} selected={selected} setSelected={setSelected} occupied={occupied}/>
            </Row>
            <div>
                <Button variant="primary" size="lg" onClick={handleClick}>
                    Automatic Seat Selection
                </Button>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Number of Seats</Form.Label>
                        <Form.Control type="number" placeholder="Enter number of seats" onChange={(e) => setNumSeats(e.target.value)}/>
                    </Form.Group>
                </Form>
            </div>
            <div>
                <h3>Selected seats: {selected}</h3>
                <Button variant="primary" size="lg" onClick={handleAddReservation}>
                    Add Reservation
                </Button>
                
            </div>
        </Container>
    </>
  );
}

function LoadingLayout() {
    return (
      <Row className="vh-100">
        <Col md={4} bg="light" className="below-nav" id="left-sidebar">
        </Col>
        <Col md={8} className="below-nav">
          <h1>IronAir - Loading...</h1>
        </Col>
      </Row>
    )
  }

export {HomeLayout, PlaneLayout, LoadingLayout};