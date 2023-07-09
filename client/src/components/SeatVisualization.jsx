import React, { useEffect } from 'react';
import { useState } from 'react';
import seat from '../images/seat.png';
import seat_full from '../images/seat_full.png';
import { Col } from 'react-bootstrap';

function Rows(props) { 
    function SeatRow(row) {

      const SeatRow = row.toReversed().map((seat, i) => {
      return (
        <>
          {props.occupied.includes(seat) ? 
          <Seat code={seat} key={seat} selected={props.selected} setSelected={props.setSelected} occupied={false} loggedIn={props.loggedIn} auto={props.auto} alreadyReserved={props.alreadyReserved} problemSeats={props.problemSeats}/>
          :
          <Seat code={seat} key={seat} selected={props.selected} setSelected={props.setSelected} occupied={true} loggedIn={props.loggedIn} auto={props.auto} alreadyReserved={props.alreadyReserved} problemSeats={props.problemSeats}/>
          }
        </>
      )
    });
    return SeatRow;
  }

    return (
      <Col>
        {props.SeatsArray.map((row, i) => {
          return (
            <Col key={i++}>
              {SeatRow(row)}
            </Col>
          ) 
        }
        )}
      </Col>
    )
}

function Seat(props) {

    const [isSelected, setIsSelected] = useState(false);
    const [selectable, setSelectable] = useState(false);
    const [computedClass, setComputedClass] = useState('SeatImg');

    const handleClick = () => {
      if(props.occupied) {
        if (isSelected) {
          setIsSelected(false);
          props.setSelected(props.selected.filter(seat => seat !== props.code));
        } else {
          setIsSelected(true);
          props.setSelected(props.selected.concat(props.code));
        }
      }
    }

    useEffect(() => {
       if (props.loggedIn) {
        if(!props.alreadyReserved) {
        setSelectable(true);
      } else if (!props.loggedIn) {
        setSelectable(false);
      }
      } else {
        setSelectable(false);
   

    }
    }, [props.loggedIn, props.alreadyReserved]);
      

    useEffect(() => {
      if (props.auto) {
        setIsSelected(false);
      }
    }, [props.auto]);
    
    useEffect(() => {
      if (props.auto && props.selected.includes(props.code)){
        setIsSelected(true);
      } else if (props.auto && !props.selected.includes(props.code)){
        setIsSelected(false);
      } else if (!props.auto && !props.selected.includes(props.code)){
        setIsSelected(false);
      }
    }, [props.selected]);
    
    useEffect(() => {
      if (props.problemSeats.includes(props.code)) {
        setComputedClass('SeatProblem');
      } else if (props.occupied) {
        setComputedClass('SeatImg');
      } else {
        setComputedClass('SeatImgOccupied');
      }
    }, [props.problemSeats, props.occupied]);

    return (   
      <>
      {selectable ?
        <Col className="Seat" onClick={handleClick}>
        {
          isSelected ? 
            <img src={seat_full} alt={props.code} className={computedClass}/>
            :
            <img src={props.occupied ? seat : seat_full} alt={props.code} className={computedClass}/>
        }
            <div style={{'text-align': 'center'}}>{props.code}</div>
        </Col> 
        :
        <Col className="Seat" >
          {
            isSelected ? 
              <img src={seat_full} alt={props.code} className={computedClass}/>
              :
              <img src={props.occupied ? seat : seat_full} className={computedClass}/>
          }
              <div style={{'text-align': 'center'}}>{props.code}</div>
        </Col> 
      }
      </>
    )
}

function SeatVisualization(props) {
  return (  
        <Col  className='SeatViz justify-content-center'>
          <Rows SeatsArray={props.SeatsArray} occupied={props.occupied} selected={props.selected} setSelected={props.setSelected} 
          loggedIn={props.loggedIn} auto={props.auto} alreadyReserved={props.alreadyReserved} problemSeats={props.problemSeats}/>
        </Col>
    )
}

export default SeatVisualization;