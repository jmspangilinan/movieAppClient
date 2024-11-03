import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function UpdateProduct({ product, fetchData }) {
	const notyf = new Notyf();

	const [name, setName] = useState(product.name);
	const [description, setDescription] = useState(product.description);
	const [price, setPrice] = useState(product.price);
	const [showUpdate, setShowUpdate] = useState(false);

	const openUpdate = () => setShowUpdate(true);
	const closeUpdate = () => {
		setShowUpdate(false);
		setName(product.name);
		setDescription(product.description);
		setPrice(product.price);
	};

	const updateProduct = (e) => {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${product._id}/update`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				name,
				description,
				price
			})
		})
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				notyf.success('Product successfully updated');
				closeUpdate();
				fetchData();
			} else {
				notyf.error('Failed to update product');
				closeUpdate();
				fetchData();
			}
		})
		.catch(err => {
			notyf.error('Error updating product');
			closeUpdate();
			console.error(err);
		});
	};

	return (
		<>
			<Button variant="primary" size="sm" onClick={openUpdate}>Update</Button>

			<Modal show={showUpdate} onHide={closeUpdate}>
				<Form onSubmit={updateProduct}>
					<Modal.Header closeButton>
						<Modal.Title>Update Product</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Form.Group controlId="productName">
							<Form.Label>Name</Form.Label>
							<Form.Control type="text" required value={name} onChange={e => setName(e.target.value)} />
						</Form.Group>
						<Form.Group controlId="productDesc">
							<Form.Label>Description</Form.Label>
							<Form.Control type="text" required value={description} onChange={e => setDescription(e.target.value)} />
						</Form.Group>
						<Form.Group controlId="productPrice">
							<Form.Label>Price</Form.Label>
							<Form.Control type="number" required value={price} onChange={e => setPrice(e.target.value)} />
						</Form.Group>
					</Modal.Body>

					<Modal.Footer>
						<Button variant="secondary" onClick={closeUpdate}>Cancel</Button>
						<Button variant="success" type="submit">Update</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}
