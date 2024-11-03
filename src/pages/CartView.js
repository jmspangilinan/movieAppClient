import { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function CartView() {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const notyf = useMemo(() => new Notyf(), []);
  
  const navigate = useNavigate(); 

  const fetchCartItems = useCallback(async () => {
    if (!user.id) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      
      if (data.cart && data.cart.cartItems) {
        const itemsWithDetails = await Promise.all(
          data.cart.cartItems.map(async (item) => {
            try {
              const productResponse = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/products/${item.productId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                }
              );
              
              if (!productResponse.ok) {
                throw new Error('Failed to fetch product details');
              }

              const productData = await productResponse.json();
              
              return {
                ...item,
                name: productData.name,
                description: productData.description,
                price: Number(productData.price),
                quantity: Number(item.quantity),
                subtotal: Number(item.quantity) * Number(productData.price)
              };
            } catch (error) {
              console.error('Error fetching product details:', error);
              return {
                ...item,
                name: 'Product Not Found',
                description: 'Unable to load product details',
                price: 0,
                quantity: Number(item.quantity),
                subtotal: 0
              };
            }
          })
        );

        setCartItems(itemsWithDetails);
        const total = itemsWithDetails.reduce((sum, item) => sum + item.subtotal, 0);
        setTotalPrice(total);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      notyf.error('Failed to fetch cart items');
    } finally {
      setIsLoading(false);
    }
  }, [user.id, notyf]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1 || isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      const currentItem = cartItems.find(item => item.productId === productId);
      if (!currentItem) {
        throw new Error('Item not found');
      }

      const newSubtotal = currentItem.price * newQuantity;

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: productId,
          quantity: newQuantity,
          subtotal: newSubtotal
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      await fetchCartItems();
      notyf.success('Quantity updated successfully');
      
    } catch (error) {
      console.error('Error in updateQuantity:', error);
      notyf.error('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      await fetchCartItems();
      notyf.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      notyf.error(error.message);
    }
  };


  const clearCart = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      setCartItems([]); 
      setTotalPrice(0);  
      notyf.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      notyf.error('Failed to clear cart');
    }
  };


  const handleCheckout = () => {
    notyf.success('Checkout successful!');
    navigate('/'); 
  };

  if (isLoading) {
    return (
      <Container className="mt-5">
        <div className="text-center">Updating cart...</div>
      </Container>
    );
  }

  return (

    <>
    <Container className="mt-5">
      <h1 className="text-center mb-4">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm">
          <Table striped bordered hover responsive className="mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.productId}>
                  <td className='text-primary'>{item.name}</td>
                  <td>₱{item.price}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="dark"
                        className="text-white"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        size="sm"
                        disabled={isUpdating || item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="mx-3">{item.quantity}</span>
                      <Button
                        variant="dark"
                        className="text-white"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        size="sm"
                        disabled={isUpdating}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>₱{item.subtotal}</td>
                  <td>
                    <Button 
                      variant="danger" 
                      onClick={() => removeFromCart(item.productId)}
                      size="sm"
                      disabled={isUpdating}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
           <tfoot>
              <tr>
              <td colSpan="0" className=" border-0">
                  <Button 
                    className="mt-2 mb-2 ms-2" 
                    variant="success" 
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                 </td>

                <td colSpan="3" className="text-end border-0"><strong>Total:</strong></td>
                <td colSpan="2" className="border-0">
                  ₱{totalPrice}
                  
                </td>
              </tr>
          </tfoot>
          </Table>  
        </div>
      )}
    </Container>  

    {cartItems.length > 0 && (
      <Button 
        className="mt-3 ms-3 " 
        variant="danger" 
        onClick={clearCart}
      >
        Clear Cart
      </Button>
    )}

    </>
  );
}
