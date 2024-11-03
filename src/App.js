import './App.css';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import AppNavbar from './components/AppNavBar';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Logout from './pages/Logout';
import Error from './pages/Error';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';


import CartView from './pages/CartView'; //CartView

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user]);

  useEffect(() => {
    if(localStorage.getItem("token") !== null) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then(res => res.json())
      .then(data => {
        setUser({
          id: data.user._id,
          isAdmin: data.user.isAdmin
        });
      })
    } else {
      setUser({
        id: null,
        isAdmin: null
      });
    }
  }, []);

  return (
    <UserProvider value={{user, setUser, unsetUser}}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/" element={<Products />} />
            <Route path="/products/:productId" element={<ProductDetails />} />

            <Route path="/cart" element={<CartView />} /> {/* Cart Route */}
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;