import React, { useEffect } from 'react';
import { useState } from 'react';
import seat from '../images/seat.png';
import seat_full from '../images/seat_full.png';
import { Col, Container, Row, Spinner, Button} from 'react-bootstrap';

function Rows(props) { 
    function SeatRow(row) {

      const SeatRow = row.toReversed().map((seat, i) => {
      return (
        <>
          {props.occupied.includes(seat) ? 
          <Seat code={seat} key={seat} selected={props.selected} setSelected={props.setSelected} occupied={false} loggedIn={props.loggedIn} auto={props.auto}/>
          :
          <Seat code={seat} key={seat} selected={props.selected} setSelected={props.setSelected} occupied={true} loggedIn={props.loggedIn} auto={props.auto}/>
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
            <Col key={i}>
              {SeatRow(row)}
            </Col>
          )}
        )}
      </Col>
    )
}

function Seat(props) {

    const [isSelected, setIsSelected] = useState(false);
    const [selectable, setSelectable] = useState(false);
  
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
      if (props.loggedIn && !props.alreadyReserved) {
        setSelectable(true);
      } else if (props.loggedIn && props.alreadyReserved) {
        setSelectable(false);
      } else if (!props.loggedIn) {
        setSelectable(false);
      }
    }, [props.loggedIn, props.alreadyReserved] );
      

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


    return (   
      <>
      {selectable ?
        <Col className="Seat" onClick={handleClick}>
        {
          isSelected ? 
            <img src={seat_full} alt={props.code} className={props.occupied ? 'SeatImg' : 'SeatImgOccupied'}/>
            :
            <img src={props.occupied ? seat : seat_full} alt={props.code} className={props.occupied ? 'SeatImg' : 'SeatImgOccupied'}/>
        }
            <div style={{'text-align': 'center'}}>{props.code}</div>
        </Col> 
        :
        <Col className="Seat" >
          {
            isSelected ? 
              <img src={seat_full} alt={props.code} className={props.occupied ? 'SeatImg' : 'SeatImgOccupied'}/>
              :
              <img src={props.occupied ? seat : seat_full} className={props.occupied ? 'SeatImg' : 'SeatImgOccupied'}/>
          }
              <div>{props.code}</div>
        </Col> 
      }
      </>
    )
}

function SeatVisualization(props) {
  return (  
        <Row md={8} className='SeatViz'>
          <Col>
          <Rows SeatsArray={props.SeatsArray} occupied={props.occupied} selected={props.selected} setSelected={props.setSelected} 
          loggedIn={props.loggedIn} auto={props.auto} alreadyReserved={props.alreadyReserved}/>
          </Col>
        </Row>
    )
}


export default SeatVisualization;