import React from 'react';
import seat from '../images/seat.png';
import { Col, Container, Row, Spinner, Button} from 'react-bootstrap';

function createRows(seats_array) {
  
  function Rows(seats_array) {
   for (row of seats_array) {
    row.map((seat) => {
      return (
      <Seat code={seat}/>
    )
  }
  

  const seats_row = Rows(seats_array)
  return seats_row;
}

function Seat(props) {

  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

    return (    
        <div className={`toggle-component ${isSelected ? 'selected' : 'non-selected'}`}
        onClick={handleClick}>
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