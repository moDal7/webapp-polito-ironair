import React from 'react';
import { useState } from 'react';
import seat from '../images/seat.png';
import seat_full from '../images/seat_full.png';
import { Col, Container, Row, Spinner, Button} from 'react-bootstrap';

function Rows(props) { 
    function SeatRow(row) {
      const SeatRow = row.map((seat, i) => {
      return (
        <div>
          {props.occupied.includes(seat) ? 
          <Seat code={seat} key={seat} selected={props.selected} setSelected={props.setSelected} occupied={false}/>
          :
          <Seat code={seat} key={seat} selected={props.selected} setSelected={props.setSelected} occupied={true}/>
          }
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
      if (isSelected) {
        setIsSelected(false);
        props.setSelected(props.selected.filter(seat => seat !== props.code));
      } else {
        setIsSelected(true);
        props.setSelected(props.selected.concat(props.code));
      }
    }

    return (   
      <span className="Seat" onClick={handleClick}>
      {
        isSelected ? 
          <img src={seat_full} alt={props.code} className={props.occupied ? 'SeatImg' : 'SeatImgOccupied'}/>
          :
          <img src={seat} alt={props.code} className={props.occupied ? 'SeatImg' : 'SeatImgOccupied'}/>
      }
          <div>{props.code}</div>
        </span> 
    )
}

function SeatVisualization(props) {

  return (  
        <div>
          <Rows SeatsArray={props.SeatsArray} occupied={props.occupied} selected={props.selected} setSelected={props.setSelected}/>
        </div>
    )
}


export default SeatVisualization;