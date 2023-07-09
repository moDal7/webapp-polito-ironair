import { React, useState, useEffect } from 'react';
import { Row, Col, Button, Container, Form, Alert} from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';


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
            <Col className="homeTitle">
                <Row xs={12}>
                    <h1 className="homeTitle">Welcome to IronAir</h1>
                    <i className="bi bi-airplane-fill icon-size"/>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col className="homeCols" sm={8}>
                <Link className="noHyperTextLink" to="/plane/0">
                    <PlaneCard plane_num={0} plane={props.planes[0]} loggedIn={props.loggedIn}/>
                </Link>
            </Col>
            <Col sm={4} className='planeInfo align-items-center'>
                <Row>
                    <Col className="SeatsInfo">Seats: {props.planes[0]["seats"]}</Col>
                    <Col className="SeatsInfo">Available: {props.planes[0]["seats"] - props.planes[0]["occupied_seats"]} </Col>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col className="homeCols" sm={8}>
                <Link className="noHyperTextLink" to="/plane/1">
                    <PlaneCard plane_num={1} plane={props.planes[1]} loggedIn={props.loggedIn}/>
                </Link>
            </Col>
            <Col sm={4} className='planeInfo align-items-center'>
                <Row>
                    <Col className="SeatsInfo">Seats: {props.planes[1]["seats"]}</Col>
                    <Col className="SeatsInfo">Available: {props.planes[1]["seats"] - props.planes[1]["occupied_seats"]} </Col>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col className="homeCols" sm={8}>
                <Link className="noHyperTextLink" to="/plane/2">
                    <PlaneCard plane_num={2} plane={props.planes[2]} loggedIn={props.loggedIn}/>
                </Link>
            </Col>
            <Col sm={4} className='planeInfo align-items-center'>
                <Row>
                    <Col className="SeatsInfo">Seats: {props.planes[2]["seats"]}</Col>
                    <Col className="SeatsInfo">Available : {props.planes[2]["seats"] - props.planes[2]["occupied_seats"]} </Col>
                </Row>
            </Col>
        </Row>
 
        </>
  );
}

function ButtonsAndBottoms(props) {

    return (
    <Container fluid>
        {props.alreadyReserved ?
            <Container>
            <Row>
                <Col md={12}>
                <Button className='myButton justify-content-center' style={{'display':'flex'}} variant="warning" size="lg" onClick={props.handleDeleteReservation}>
                    Delete Reservation
                </Button>
                </Col>
             </Row>

            </Container>
        :
        <div>
            <Container>
                <Button className='myButton justify-content-center' style={{'display':'flex'}} variant="primary" size="lg" onClick={props.handleClick}>
                    Automatic Seat Selection
                </Button>
                <Form className='formGroup'>
                    <Form.Group controlId="formNumSeats">
                        <Form.Label>Number of Seats</Form.Label>
                        <Form.Control  style={props.autoMissingInput ? {'border-color': 'orange'} : {'border': 'faded'}}type="number" placeholder="Enter number of seats" onChange={(e) => props.setNumSeats(e.target.value)}/>
                    </Form.Group>
                </Form>
                <Container>
                <Row>
                    <Col md={6}>
                        <h5 className="selectedSeats">Selected seats: {props.selectedToString}</h5>
                    </Col>
                    <Col md={3}>
                        <Button className="myButton justify-content-center" style={{'display':'flex'}} variant="secondary" size="lg" onClick={props.handleResetReservation}>
                            Reset Reservation
                        </Button>
                    </Col>
                    <Col md={3}>
                        <Button className="myButton justify-content-center" style={{'display':'flex'}} variant="primary" size="lg" onClick={props.handleAddReservation}>
                            Confirm Reservation
                        </Button>
                    </Col>
                </Row>
                </Container>
            </Container>
        </div>
        }
    </Container>
    );
}


function PlaneLayout(props) {

    const { planeId } = useParams();

    const [selected, setSelected] = useState([]);  
    const [numSeats, setNumSeats] = useState(false);
    const [occupied, setOccupied] = useState([]);
    const [currentReservation, setCurrentReservation] = useState(null);
    const [planeOccupiedSeats, setplaneOccupiedSeats] = useState(props.planes[planeId]["occupied_seats"]);

    const [auto, setAuto] = useState(false);
    const [alreadyReserved, setAlreadyReserved] = useState(false);
    const [autoMissingInput, setAutoMissingInput] = useState(false);


    const rows = props.planes[planeId]["num_rows"];
    const columns = props.planes[planeId]["num_columns"];
    
    const seats_array = genSeatsArray(rows, columns);

    useEffect(() => {
        for(let i=0; i<props.reservations.length; i++) {
            if (props.reservations[i]["plane_id"] == Number(planeId)) {
                setCurrentReservation(props.reservations[i]);
            }
        };
        
    } , [alreadyReserved]);

    useEffect(() => {

        const getPlaneOccupiedSeats = async (planeId) => {
          try {
            const seats = await API.getOccupiedSeats(planeId);
            for (let i = 0; i < seats.length; i++) {
                seats[i] = seats[i]["row"].toString() + seats[i]["column"];
            }

            for (let i = 0; i < props.reservations.length; i++) {
                if (props.reservations[i]["plane_id"] === Number(planeId)) {
                    setAlreadyReserved(true);
                }
            }
            setOccupied(seats);
            props.setLoading(false);
          } catch (err) {
            console.log(err);
          }
        };

        getPlaneOccupiedSeats(planeId);
      }, []);
    

      useEffect(() => {
        const getPlaneOccupiedSeats = async (planeId) => {
            try {
                const plane = await API.readPlane(planeId);
                setplaneOccupiedSeats(plane["occupied_seats"]);
            } catch (err) {
                console.log(err);
            }
        };

        const getOccupiedSeats = async (planeId) => {
            try {
              const seats = await API.getOccupiedSeats(planeId);
                for (let i = 0; i < seats.length; i++) {
                  seats[i] = seats[i]["row"].toString() + seats[i]["column"];
              }
                setOccupied(seats);
                props.setLoading(false);
            } catch (err) {
                console.log(err);
            }
        };
        
        getPlaneOccupiedSeats(planeId);
        getOccupiedSeats(planeId);
        setSelected([]);
        setAuto(false);
        }, [alreadyReserved, props.loggedIn]);

    const handleClick = () => {

        let auto_selected = automaticSeatSelection(occupied, seats_array, numSeats);
        setSelected(auto_selected);
        setAuto(true);
    }

    const handleAddReservation = () => {
        
        let reservation = {
            "user_id": props.user.id,
            "plane_id": Number(planeId),
            "seats": selectedToString(selected)
        }
        
        const verifyAddReservation = async (reservation) => {
            if (!selected.length==0) {
                props.setLoading(true);
                try {
                    const res = await API.addReservation(reservation); 
                    if(!res.hasOwnProperty("error")) {
                        const reservations = await API.getReservationByUser(props.user.id);
                        for(let i=0; i<reservations.length; i++) {
                            if (reservations[i]["plane_id"] == planeId) {
                                
                                props.setShowSuccess(true);
                                props.setReservations([...props.reservations, reservations[i]]);
                                setAlreadyReserved(true);

                            }
                        };

                        setOccupied([...occupied, ...selected]);
                        setSelected([]);                    
                        props.setLoading(false);

                    } else {

                        setSelected([]);
                        props.setLoading(false);
                        props.setShowFailure(true);

                        setAlreadyReserved(false);

                        props.setProblemSeats(res["occupied"]);
                        setTimeout(function() {
                            props.setProblemSeats([])
                            props.setShowFailure(false);
                        }, 5000);

                                
                        }
                    } catch (err) {
                    console.log(err);
                }
            }
        };
        verifyAddReservation(reservation);
    }

    const handleResetReservation = () => {
        setSelected([]);
        setAuto(false);
    }

    const handleDeleteReservation = () => {
        let res_id = currentReservation["id"];
        const deleteReservation = async (res_id, plane_id) => {
            try {
                const res = await API.deleteReservation(res_id);
                props.setReservations(props.reservations.filter(reservation => reservation["id"] != res_id));
                setCurrentReservation(null);
                const plane = await API.readPlane(planeId);
                setplaneOccupiedSeats(plane["occupied_seats"]);
                const seats = await API.getOccupiedSeats(planeId);
                for (let i = 0; i < seats.length; i++) {
                    seats[i] = seats[i]["row"].toString() + seats[i]["column"];
            }
            setOccupied(seats);
            }
            catch (err) {
                console.log(err);
            }
        };

        deleteReservation(res_id, planeId);
        setSelected([]);
        setAuto(false);
        setCurrentReservation(null);
        setAlreadyReserved(false);
        props.setLoading(false);
    }

    function automaticSeatSelection(occupied, seats_array, num_seats) {
        setSelected([]);

        if (num_seats === false) {
            setAutoMissingInput(true);
        } else {
            setAutoMissingInput(false);
        }

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
        <Container>
            <Container className='ImagePlanePage justify-content-center'>
                <img src={plane_images[planeId]} alt="..." className="planeImage"/>
            </Container>
            <Container>
                <h3 className="planePageInfo">Total Seats: {props.planes[planeId]["seats"]}</h3>
                <h3 className="planePageInfo">Occupied: {planeOccupiedSeats}</h3>
                <h3 className="planePageInfo">Available: {props.planes[planeId]["seats"]-planeOccupiedSeats} </h3>
            </Container>
            <Container>
                <AlertSuccess showSuccess={props.showSuccess} setShowSuccess={props.setShowSuccess} />
                <AlertFailure showFailure={props.showFailure} setShowFailure={props.setShowFailure} />
            </Container>
                <SeatVisualization SeatsArray={seats_array} selected={selected} setSelected={setSelected} occupied={occupied} loggedIn={props.loggedIn} auto={auto} setAuto={setAuto} problemSeats={props.problemSeats} alreadyReserved={alreadyReserved}/>
            </Container>
            {props.loggedIn ? 
            <div className="ButtonsBottoms">
                <ButtonsAndBottoms alreadyReserved={alreadyReserved} handleClick={handleClick} handleAddReservation={handleAddReservation} 
             handleResetReservation={handleResetReservation} handleDeleteReservation={handleDeleteReservation} selectedToString={selectedToString(selected)} 
             setNumSeats={setNumSeats} autoMissingInput={autoMissingInput} setAutoMissingInput={setAutoMissingInput}/> 
            </div>
            :
            <div>
                <h4 className='planePageInfo' style={{'margin':'2rem'}}>Please login to select seats.</h4>
            </div>
            }
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

  function AlertSuccess(props) {
    return (
      <>
      {props.showSuccess ?
        <Alert className="justify-content-center" style={{maxWidth:'20rem', margin:'auto', marginBottom:'2rem',  marginTop:'2rem'}} variant="success">
          <Alert.Heading>Reservation Completed</Alert.Heading>
          <p>
           Thanks you for choosing IronAir.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => props.setShowSuccess(false)} variant="success">
              Close
            </Button>
          </div>
        </Alert>
            :
            <>
            </>
      }
      </>
    );
  }

  function AlertFailure(props) {
    return (
      <>
      {props.showFailure ?
        <Alert className="justify-content-center" style={{maxWidth:'20rem', margin:'auto', marginBottom:'2rem', marginTop :'2rem'}} variant="danger">
          <Alert.Heading>Impossible to complete reservation.</Alert.Heading>
          <p>
           The seats you selected are no longer available.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => props.setShowFailure(false)} variant="danger">
              Close
            </Button>
          </div>
        </Alert>
            :
            <>
            </>
      }
      </>
    );
  }

export {HomeLayout, PlaneLayout, LoadingLayout};