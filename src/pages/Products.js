import { useState, useEffect, useContext, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';

export default function ProductCatalog() {
  const { user } = useContext(UserContext);
  const [productsData, setProductsData] = useState([]);

  const fetchData = useCallback(() => {
    const fetchURL = user.isAdmin
      ? `${process.env.REACT_APP_API_BASE_URL}/products/all`
      : `${process.env.REACT_APP_API_BASE_URL}/products/active`;

    fetch(fetchURL, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setProductsData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [user.isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container>
      {user.isAdmin ? (
        <AdminView productsData={productsData} fetchData={fetchData} />
      ) : (
        <UserView productsData={productsData} />
      )}
    </Container>
  );
}
