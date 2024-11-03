import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ProductCard({ productProp }) {
  const { name, description, price, _id } = productProp;

  return (
    <Card className="h-100 mb-4">
      <Card.Body>
      <Card.Title className="text-primary text-center">
      {name}
        </Card.Title>
        <Card.Text>{description}</Card.Text>
        <Card.Text className="text-warning">
          ₱{price}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Link to={`/products/${_id}`}>
          <Button variant="primary" to={`products/${productProp._id}`} className='w-100' >Details</Button>
        </Link>
      </Card.Footer>
    </Card>
  )
}


ProductCard.propTypes = {
  productProp: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
  }).isRequired,
};
