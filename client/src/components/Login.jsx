import { Col, Button, Row, Form, Spinner, Alert} from 'react-bootstrap';
import API from '../API';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";



function Login(props){

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [greet, setGreet] = useState(false);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };
        setUsername(username);
        setPassword(password);
        handleLogin(credentials);
    };
    
    const handleLogin = async (credentials) => {
        try {
            setLoading(true);
            const user = await API.logIn(credentials);
            if(!user.hasOwnProperty('name')) {
                setShow(true);
                setLoading(false);
            } else {
                const userInfo = await API.getUserInfo();
                setLoading(false);
                props.setLoggedIn(true);
                props.setUser(userInfo);

                const reservations = await API.getReservationByUser();
                props.setReservations(reservations);

                setGreet(true);
                setTimeout(() => {navigate('/');}, 2000);
            }

        }catch(err) {
            console.log(err);
            setLoading(false);
        }
    };

    function AlertDismissible() {

        return (
          <>
          {show ?
            <Alert show={show} className="justify-content-center" style={{maxWidth:'20rem', 'margin':'auto', 'margin-bottom':'2rem'}} variant="danger">
              <Alert.Heading>Failed Login</Alert.Heading>
              <p>
               Check your credentials and try again.
              </p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button onClick={() => setShow(false)} variant="danger">
                  Close
                </Button>
              </div>
            </Alert>
                :
                <>
                </>
          }
          </>
        );
      }

    return <>
        {loading === true 
        ? <><br/><br/><br/><div className='d-flex justify-content-center'><Spinner animation='border' size='xl' className='mr-2'/> </div></>
        :
        <>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <Row >
            {greet ? <Col xs={12} className="justify-content-center"><h2 className="planePageInfo">Ciao, {props.user["name"]}</h2></Col> : 
            <Col xs={12} className="justify-content-center"><h2 className="planePageInfo">Login</h2></Col>}
        </Row>
        <br/>
        <>
            <AlertDismissible/>
        </>
            <Col xs={12} className='d-flex justify-content-center'>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId='username'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' value={username} placeholder='Enter the Email' onChange={ev => setUsername(ev.target.value)} required={true} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' value={password} placeholder ='Insert the Password' onChange={ev => setPassword(ev.target.value)} required={true} />
                    </Form.Group>
                    <br/>
                    <Row>
                    <br/>
                    <br/>
                    <br/>
                        <Col xs={12} className="planePageInfo">
                            <Button type="submit">Submit</Button>
                            <i className="bi bi-airplane-fill" style={{'margin':'1rem'}}/>
                        </Col>
                    </Row>
                </Form>
            </Col>
        
        </>
    }
    </>
}
export default Login;