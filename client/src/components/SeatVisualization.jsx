import React from 'react';
import seat from '../images/seat.png';
import { Col, Container, Row, Spinner, Button} from 'react-bootstrap';

function createRows(seats_array) {
  let seats_row = seats_array.map((row) => {
     (<ul>{row.map((seat) => {
         <Seat code={seat}/>
    })}
    </ul>)
  })
  return seats_row;
}

function Seat(props) {
    return (    
        <div>
          <img src={seat} alt={props.code}/>
          <div>{props.code}</div>
        </div>
    )

}

function SeatVisualization(props) {
    return (    
        <div>
          {() => createRows(props.SeatsArray)}
        </div>
    )

}

export default SeatVisualization;