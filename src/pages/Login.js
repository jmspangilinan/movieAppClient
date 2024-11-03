import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [isActive, setIsActive] = useState(true);
    const navigate = useNavigate();
    const notyf = new Notyf();

    async function retrieveUserDetails(accessToken) {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
                headers: { 
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            
            const userData = data.user || data;
            
            setUser({
                id: userData._id,
                isAdmin: userData.isAdmin
            });

            navigate('/products');
            
        } catch (error) {
            console.error('Error retrieving user details:', error);
            notyf.error('Error retrieving user details');
        }
    }

    useEffect(() => {
        if (loginEmail !== "" && loginPassword !== "") {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [loginEmail, loginPassword]);

    async function authenticate(e) {
        e.preventDefault();
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: loginEmail, 
                    password: loginPassword 
                })
            });
            
            const data = await response.json();
            
            if (data.access !== undefined) {
                localStorage.setItem('token', data.access);
                await retrieveUserDetails(data.access);
                notyf.success('Thank you for logging in.');
                
                setLoginEmail('');
                setLoginPassword('');
            } else if (data.message === "Incorrect email or password") {
                notyf.error("Incorrect email or password");
            } else if (data.message === "No email found") {
                notyf.error("Email does not exist");
            } else {
                notyf.error("Something went wrong");
            }
        } catch (error) {
            console.error('Login error:', error);
            notyf.error("An error occurred during login");
        }
    }

    if (user.id !== null) {
        return <Navigate to="/products" />;
    }

    return (
        <Form onSubmit={authenticate}>
            <h1 className="my-5 text-center">Login</h1>
            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control 
                    type="email" 
                    placeholder="Enter Email" 
                    required 
                    value={loginEmail} 
                    onChange={e => setLoginEmail(e.target.value)} 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Enter Password" 
                    required 
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)} 
                />
            </Form.Group>
            <Button 
                variant={isActive ? "primary" : "danger"} 
                type="submit" 
                id="loginBtn" 
                disabled={!isActive}
            >
                Login
            </Button>
        </Form>
    );
}