import React from 'react';
import { Card, CardImg } from 'react-bootstrap';
import '../App.css';
import plane1 from '../images/ATR72.jpg'; 
import plane2 from '../images/A220-100.jpg';
import plane3 from '../images/Boeing737.jpg';
import { Link } from 'react-router-dom';


const plane_images = [plane1, plane2, plane3];
const plane_names = ['ATR72', 'A220-100', 'Boeing737'];

function PlaneCard(props) {
    return (
        <Card className='PlaneCard'>
                <CardImg width="100%" src={plane_images[props.plane_num]} />
            <Card.Body>
                <Card.Title>{plane_names[props.plane_num]}</Card.Title>
                <Card.Text>
                    Some quick example text to build on the card title and make up the {props.planeName} of the card's
                    content.
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default PlaneCard;