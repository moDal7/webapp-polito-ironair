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
        <Row>
            <Col sm={10}>
                <Link to="/plane/0">
                    <PlaneCard plane_num={0} plane={props.planes[0]} loggedIn={props.loggedIn}/>
                </Link>
            </Col>
            <Col>
                <Row>Total Seats: {props.planes[0]["seats"]}</Row>
                <Row>Available Seats: {props.planes[0]["seats"] - props.planes[0]["occupied_seats"]} </Row>
            </Col>
        </Row>
        <Row>
            <Link to="/plane/1">
                <PlaneCard plane_num={1} plane={props.planes[1]} loggedIn={props.loggedIn}/>
            </Link>
            <div className="col-4">Total Seats: {props.planes[1]["seats"]}</div>
            <div className="col-4">Available Seats: {props.planes[1]["seats"] - props.planes[1]["occupied_seats"]}</div>
        </Row>
        <Row>
            <Link to="/plane/2">
                <PlaneCard  plane_num={2} plane={props.planes[2]} loggedIn={props.loggedIn}/>
            </Link>
            <div className="col-4">Total Seats: {props.planes[2]["seats"]}</div>
            <div className="col-4">Available Seats: {props.planes[2]["seats"] - props.planes[2]["occupied_seats"]}</div>
        </Row>
    </>
  );
}

function ButtonsAndBottoms(props) {

    return (
    <>
        {props.alreadyReserved ?
        <div>
            <div>
                <Button variant="primary" size="lg" onClick={props.handleDeleteReservation}>
                    Delete Reservation
                </Button>
            </div>
            <div>
                <h3>You have reserved the following seats: {selectedToString(props.selected)}</h3>
            </div>
        </div>
        :
        <div>
            <div>
                <Button variant="primary" size="lg" onClick={props.handleClick}>
                    Automatic Seat Selection
                </Button>
                <Form>
                    <Form.Group controlId="formNumSeats">
                        <Form.Label>Number of Seats</Form.Label>
                        <Form.Control type="number" placeholder="Enter number of seats" onChange={(e) => props.setNumSeats(e.target.value)}/>
                    </Form.Group>
                </Form>
            </div>
            <div>
                <h3>Selected seats: {props.selectedToString}</h3>
                <Button variant="primary" size="lg" onClick={props.handleAddReservation}>
                    Confirm Reservation
                </Button>
                <Button variant="primary" size="lg" onClick={props.handleResetReservation}>
                    Reset Reservation
                </Button>
            </div>
        </div>
        }
    </>
    );
}


function PlaneLayout(props) {

    const [selected, setSelected] = useState([]);  
    const [numSeats, setNumSeats] = useState(0);
    const [occupied, setOccupied] = useState([]);
    const [loading, setLoading] = useState(true);
    const [auto, setAuto] = useState(false);
    const [alreadyReserved, setAlreadyReserved] = useState(false);

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

            for (let i = 0; i < props.reservations.length; i++) {
                if (props.reservations[i]["plane_id"] === Number(planeId)+1) {
                    let seats = props.reservations[i]["seats"];
                    setAlreadyReserved(true);
                    setSelected(seats.split(", "));
                }
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
        setAuto(true);
    }

    const handleAddReservation = () => {
        
        let reservation = {
            "user_id": 1,
            "plane_id": Number(planeId)+1,
            "seats": selectedToString(selected)
        }
        console.log(reservation);
        API.addReservation(reservation);
    }

    const handleResetReservation = () => {
        setSelected([]);
        setAuto(false);
    }

    const handleDeleteReservation = () => {
        API.deleteReservationByUser();
        setSelected([]);
        setAuto(false);
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
            selected_string += selected[i] + ", ";
        }
        selected_string = selected_string.slice(0, -2);
        return selected_string;
    }


    
    return (
    <>  
        <Container fluid>
            <Col>
                <img src={plane_images[planeId]} alt="..." className="rounded-circle planeImage"/>
                <div className="mx-auto d-block">Total Seats: {props.planes[planeId]["seats"]}</div>
                <div className="mx-auto d-block">Available Seats: {props.planes[planeId]["seats"]-props.planes[planeId]["seats"]} </div>
            </Col>
        </Container>
        <Container fluid>
            <Row>
                <SeatVisualization SeatsArray={seats_array} selected={selected} setSelected={setSelected} occupied={occupied} loggedIn={props.loggedIn} auto={auto} setAuto={setAuto}/>
            </Row>
            <Container fluid>
            {props.loggedIn ? 
            <div>
             <ButtonsAndBottoms alreadyReserved={alreadyReserved} handleClick={handleClick} handleAddReservation={handleAddReservation} 
             handleResetReservation={handleResetReservation} handleDeleteReservation={handleDeleteReservation} selectedToString={selectedToString(selected)} setNumSeats={setNumSeats}/> 
            </div>
            :
            <div>
                <h3>Please login to select seats</h3>
            </div>
            }
            </Container>
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