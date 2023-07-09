import { Col, Button, Row, Form, Spinner, Alert} from 'react-bootstrap';
import API from '../API';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


function Login(props){

    // states to handle the presentation of the page
    const [loading, setLoading] = useState(false);
    const [greet, setGreet] = useState(false);
    const [show, setShow] = useState(false);

    // states to handle the credentials
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    

    const navigate = useNavigate();
    
    // function to handle the submit of the login form
    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };
        setUsername(username);
        setPassword(password);
        handleLogin(credentials);
    };
    
    // function to handle the login
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

    // function to handle the popup alert, in case of failed login
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
    
    /* Login page */
    /* If the user is already logged in, it will be redirected to the home page after a timeout */
    /* If the user is not logged in, it will be presented the login form */
    /* If the user is not logged in and the login fails, it will be presented an alert */
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
            {greet ? <Col xs={12} className="justify-content-center"><h2 className="planePageInfo" style={{color:'green'}}>Ciao {props.user["name"]}!</h2></Col> : 
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-airplane-fill" viewBox="0 0 16 16" style={{margin:'1rem'}}>
                            <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z"/>
                            </svg>
                        </Col>
                    </Row>
                </Form>
            </Col>
        
        </>
    }
    </>
}
export default Login;