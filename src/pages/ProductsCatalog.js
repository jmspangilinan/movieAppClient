import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import ProductCard from '../components/ProductCard';

export default function ProductCatalog() {
  const { user } = useContext(UserContext);
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    const fetchURL = user.isAdmin
      ? `${process.env.REACT_APP_API_BASE_URL}/products/all`
      : `${process.env.REACT_APP_API_BASE_URL}/products/active`;

    fetch(fetchURL, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setProductsData(data);
      });
  }, [user]);

return (
  <Container>
    <h2 className='mb-3 mt-3 text-center'>Our Products</h2>
    <Row xs={1} md={2} lg={3} className="g-4">
      {productsData.map(product => (
        <Col key={product._id}>
          <ProductCard productProp={product} />
        </Col>
      ))}
    </Row>
  </Container>
);
}
