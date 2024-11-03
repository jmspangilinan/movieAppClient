import { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function AddProduct() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const notyf = new Notyf();

  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    if (user.id === null || !user.isAdmin) {
      navigate('/products');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (title && director && year && description && genre) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [title, director, year, description, genre]);

  function addMovie(event) {
    event.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        title,
        director,
        year, 
        description,
        genre
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          notyf.success('Product Added Successfully!');

          setTitle('');
          setDirector('');
          setYear('');
          setDescription('');
          setGenre('');
          navigate('/products');
        } else {
          if (data.message === "Product already exists") {
            notyf.error("Product Already Exists");
            setTitle('');
            setDirector('');
            setYear('');
            setDescription('');
            setGenre('');
          } else if (data.message === "Failed to save the course") {
            notyf.error("Unsuccessful Product Creation");
            setTitle('');
            setDirector('');  
            setYear('');
            setDescription('');
            setGenre('');
          } else {
            notyf.error("Unsuccessful Product Creation");
          }
        }
      })
  }

  return (
    <Row>
      <Col lg={{ span: 8, offset: 2 }}>
        <h1 className="text-center">Add New Movies</h1>
        <Form onSubmit={addMovie}>
          <Form.Group controlId="formMovieName">
            <Form.Label>Movies Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter movies name"
              required
            />
          </Form.Group>
          <Form.Group controlId="formMovieDirector">
            <Form.Label>Director</Form.Label>
            <Form.Control
              type="text"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              placeholder="Enter director name"
              required
            />
          </Form.Group>
          <Form.Group controlId="formMovieYear">
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter Year"
              required
            />
          </Form.Group>
          <Form.Group controlId="formProductDescription">
            <Form.Label className='mt-3'>Movies Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter movies description"
              required
            />
          </Form.Group>
          <Form.Group controlId="formMovieGenre">
            <Form.Label className='mt-3'>Genre</Form.Label>
            <Form.Control
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Enter Genre"
              required className='mb-3'
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={submitDisabled}
          >
            Add Movies
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
