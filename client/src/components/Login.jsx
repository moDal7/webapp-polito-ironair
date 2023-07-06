import { Col, Button, Row, Form, Spinner } from 'react-bootstrap';
import API from '../API';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


function Login(props){

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [greet, setGreet] = useState(false);
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
            const userInfo = await API.getUserInfo();
            setLoading(false);
            props.setLoggedIn(true);
            props.setUser(userInfo);

            setGreet(true);
            setTimeout(() => {navigate('/');}, 2000);

        }catch(err) {
            console.log(err);
            setLoading(false);
        }
    };

    return <>
        {loading === true 
        ? <><br/><br/><br/><div className='d-flex justify-content-center'><Spinner animation='border' size='xl' className='mr-2'/> </div></>
        :
        <>
        <br/>
        <br/>
        <br/>
        <br/>
        <Row>
            <Col xs={5}></Col>
            {greet ? <Col xs={6}><h2>Ciao, {props.user["name"]}</h2></Col> : <Col xs={6}><h2>Login</h2></Col>}
        </Row>
        <br/>
            <Col xs={11} className='d-flex justify-content-center'>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId='username'>
                        <Form.Label>email</Form.Label>
                        <Form.Control type='email' value={username} placeholder='Enter the email' onChange={ev => setUsername(ev.target.value)} required={true} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' value={password} placeholder ='Insert the password' onChange={ev => setPassword(ev.target.value)} required={true} />
                    </Form.Group>
                    <br/>
                    <Row>
                        <Col xs={4}></Col>
                        <Col>
                            <Button type="submit">Submit</Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
        
        </>
    }
    </>
}
export default Login;