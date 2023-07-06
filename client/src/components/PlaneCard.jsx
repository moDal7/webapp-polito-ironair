import React from 'react';
import { useState } from 'react';
import { Button, Card, CardImg } from 'react-bootstrap';
import '../App.css';
import plane1 from '../images/ATR72.jpg'; 
import plane2 from '../images/A220-100.jpg';
import plane3 from '../images/Boeing737.jpg';

const plane_images = [plane1, plane2, plane3];

function PlaneCard(props) {
    
    const [logged, setLogged] = useState(false);
    const [reserved, setReserved] = useState(false);

    return (
        <Card className='PlaneCard'>
                <CardImg width="100%" src={plane_images[props.plane_num]} />
            <Card.Body>
                <Card.Title>{props.plane["plane_name"]}</Card.Title>
                <Card.Text>
                    <p className='muted'>{props.plane["type"]}</p>
                    <p>{props.plane["description"]}</p>
                </Card.Text>
                <Button variant={logged ? "primary" : "secondary"} opacity={logged ? "100%" : "70%"}>Add Reservation</Button>
            </Card.Body>
        </Card>
    )
}

export default PlaneCard;