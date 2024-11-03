// Register.js
import { useState, useContext, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Register() {
    
    const { user } = useContext(UserContext);
    const notyf = new Notyf();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if((email !== "" && password !== "" && confirmPassword !== "") 
         && (password === confirmPassword)) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password, confirmPassword]);

    function registerUser(e) {
        e.preventDefault();

        // Prepare the user data to send
        const userData = {
            email: email,
            password: password
        };

        // Simulate sending data to a backend API
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success notification
                notyf.success("User registered successfully!");
            } else {
                // Show error notification with message from server
                notyf.error(data.message || "Registration failed");
            }
        })
        .catch(error => {
            // Show error notification
            notyf.error("Error during registration");
            console.error("Error during registration:", error);
        });
    }

    if (user.id !== null) {
        return <Navigate to="/workouts" />;
    }

    return (
        <Form onSubmit={(e) => registerUser(e)}>
            <h1 className="my-5 text-center">Register</h1>

            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" placeholder="Enter Email" required value={email} onChange={e => {setEmail(e.target.value)}}/>
            </Form.Group>
            
            <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" required value={password} onChange={e => {setPassword(e.target.value)}}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={e => {setConfirmPassword(e.target.value)}}/>
            </Form.Group>
        
            {   
                isActive ? 
                    <Button variant="primary" type="submit" id="submitBtn">Submit</Button>
                :
                    <Button variant="danger" type="submit" id="submitBtn" disabled>Submit</Button>
            }
        </Form>
    );
}
