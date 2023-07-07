import React, { useEffect } from 'react';
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
          <Seat code={seat} key={seat} selected={props.selected} setSelected={props.setSelected} occupied={false} loggedIn={props.loggedIn} auto={props.auto}/>
          :
          <Seat code={seat} key={seat} selected={props.selected} setSelected={props.setSelected} occupied={true} loggedIn={props.loggedIn} auto={props.auto}/>
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

    useEffect(() => {
      if (props.auto) {
        setIsSelected(false);
      }
    }, [props.auto]);
    
    useEffect(() => {
      if (props.auto && props.selected.includes(props.code)){
        setIsSelected(true);
      }
    }, [props.selected]);


    return (   
      <>
      {props.loggedIn ?
        <span className="Seat" onClick={handleClick}>
        {
          isSelected ? 
            <img src={seat_full} alt={props.code} className={props.occupied ? 'SeatImg' : 'SeatImgOccupied'}/>
            :
            <img src={props.occupied ? seat : seat_full} alt={props.code} className={props.occupied ? 'SeatImg' : 'SeatImgOccupied'}/>
        }
            <div>{props.code}</div>
        </span> 
        :
        <span className="Seat" >
          {
            isSelected ? 
              <img src={seat_full} alt={props.code} className={props.occupied ? 'SeatImg' : 'SeatImgOccupied'}/>
              :
              <img src={props.occupied ? seat : seat_full} className={props.occupied ? 'SeatImg' : 'SeatImgOccupied'}/>
          }
              <div>{props.code}</div>
        </span> 
      }
      </>
    )
}

function SeatVisualization(props) {
  return (  
        <div>
          <Rows SeatsArray={props.SeatsArray} occupied={props.occupied} selected={props.selected} setSelected={props.setSelected} loggedIn={props.loggedIn} auto={props.auto}/>
        </div>
    )
}


export default SeatVisualization;