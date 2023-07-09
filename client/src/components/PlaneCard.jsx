import React from 'react';
import { Button, Card, CardImg } from 'react-bootstrap';
import '../App.css';
import plane1 from '../images/ATR72.jpg'; 
import plane2 from '../images/A220-100.jpg';
import plane3 from '../images/Boeing737.jpg';

const plane_images = [plane1, plane2, plane3];

function PlaneCard(props) {
    /*  PlaneCard component 
    it receives the planeId as props and it renders the corresponding plane card
    */
    return (
        <Card className='PlaneCard' style={{'borderRadius' : '25px', }}>
            <CardImg
            style={{'borderTopLeftRadius' : '25px', 
                    'borderTopRightRadius' : '25px', 
                    'borderBottomLeftRadius' : '0px', 
                    'borderBottomRightRadius' : '0px'}} 
                    src={plane_images[props.plane_num]}/>
            <Card.Body>
                <Card.Title>{props.plane["plane_name"]}</Card.Title>
                <Card.Text>
                    <p className='muted'>{props.plane["type"]}</p>
                    <p>{props.plane["description"]}</p>
                </Card.Text>
                {props.loggedIn ? <Button variant="primary">Add/Edit Reservation</Button> : <Button variant="secondary">See Plane Page</Button>}
            </Card.Body>
        </Card>
    )
}

export default PlaneCard;