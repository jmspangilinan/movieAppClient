import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';

export default function UserView({ productsData }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(productsData || []);
  }, [productsData]);

  return (
    <>
      <h2 className='mb-3 mt-3 text-center'>Our Products</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {products.map(product => (
          <Col key={product._id} className="mb-4">
          
            <ProductCard productProp={product} />
          </Col>
        ))}
      </Row>
    </>
  );
}
