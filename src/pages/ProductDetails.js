import { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function ProductDetail() {
  const { productId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const notyf = useMemo(() => new Notyf(), []);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        notyf.error('Failed to load product details');
      });
  }, [productId, notyf]);

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
  };

  const addToCart = async () => {
    if (!user.id) {
      notyf.error("You need to log in to add items to the cart.");
      return;
    }

    setIsLoading(true);
    const subtotal = price * quantity;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          productId, 
          quantity, 
          subtotal 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      await response.json();
      notyf.success("Added to Cart Successfully");
      navigate('/products');
    } catch (error) {
      console.error('Error adding to cart:', error);
      notyf.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col lg={12} md={8} sm={10}>
          <Card>
            <Card.Header className="bg-dark text-light text-center">
              <h4 className='mt-2'>{name}</h4>
            </Card.Header>
            <Card.Body>
              <Card.Text>{description}</Card.Text>
              <Card.Text>
                <span>Price: </span>
                <span className="text-warning">₱{price}</span>
              </Card.Text>
              <div className="d-flex align-items-center mb-3">
                <div className="me-3">Quantity:</div>
                <Button
                  variant="outline-secondary"
                  onClick={() => handleQuantityChange(-1)}
                  size="sm"
                  className='bg-dark text-light'
                  disabled={quantity <= 1 || isLoading}
                >
                  -
                </Button>
                <span className="mx-3">{quantity}</span>
                <Button
                  variant="outline-secondary"
                  onClick={() => handleQuantityChange(1)}
                  size="sm"
                  className='bg-dark text-light'
                  disabled={isLoading}
                >
                  +
                </Button>
              </div>
              <div className="text-start">
                {user.id !== null ? (
                  <Button 
                    variant="primary" 
                    onClick={addToCart} 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding to Cart...' : 'Add To Cart'}
                  </Button>
                ) : (
                  <Link className="btn btn-danger" to="/login">
                    Login to Purchase
                  </Link>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
