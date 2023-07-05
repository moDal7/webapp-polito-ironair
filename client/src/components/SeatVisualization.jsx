import React from 'react';
import { useState } from 'react';
import seat from '../images/seat.png';
import { Col, Container, Row, Spinner, Button} from 'react-bootstrap';

function Rows(props) {
    function SeatRow(row) {
      const SeatRow = row.map((seat, i) => {
      return (
        <div>
          <Seat code={seat} key={i}/>
        </div>
      )
    });
    return SeatRow;
  }

    return (
      <div>
        {props.SeatsArray.map((row, i) => {
          return (
            <div key={i}>
              {SeatRow(row)}
            </div>
          )}
        )}
      </div>
    )
}

function Seat(props) {

  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

    return (    
        <span className="Seat"
        onClick={handleClick}>
          <img src={seat} alt={props.code} className='SeatImg'/>
          <div>{props.code}</div>
        </span>
    )
}

function SeatVisualization(props) {

  return (  
        <div>
          <Rows SeatsArray={props.SeatsArray}/>
        </div>
    )
}


export default SeatVisualization;