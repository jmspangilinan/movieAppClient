import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import UpdateProduct from './UpdateProduct';
import DeactivateReactivateProduct from './DeactivateReactivateProduct';

export default function AdminView({ productsData, fetchData }) {

	const [product, setProducts] = useState([]);
	const navigate = useNavigate();

	

	useEffect(() => {
		let productArray = productsData.map(product => (

	        	<tr key={product._id}>
	            	<td className="text-center">{product._id}</td>
	            	<td className="text-center">{product.name}</td>
	            	<td className="text-center">{product.description}</td>
	            	<td className="text-center">{product.price}</td>
	            	<td className="text-center">
	                	<span className={product.isActive ? 'text-success' : 'text-danger'}>
	                	{product.isActive ? 'Available' : 'Unavailable'}
	                	</span>
	            	</td>

	            	<td className="text-center d-flex">
	                	<UpdateProduct product={product} fetchData={fetchData}/>
	                </td>
	                <td className="text-center">
   						<DeactivateReactivateProduct productId={product._id} isActive={product.isActive} fetchData={fetchData} />
	            	</td>
	        	</tr>
	        ))

		setProducts(productArray);

	}, [productsData, fetchData]);

	    return (
        <div>
            <h2 className="text-center my-4">Admin Dashboard</h2>
						<div className="text-center mb-4">
       			 <Button variant="primary" onClick={() => navigate('/add-product')}>Add Movies</Button>
      </div>
            <Table striped bordered hover responsive>
                <thead className="text-center ">
                    <tr>
                        <th>Title</th>
                        <th>Director</th>
                        <th>Year</th>
                        <th>Description</th>
                        <th>Genre</th>
                        <th colSpan={2}>Comments</th>
                    </tr>
                </thead>
                <tbody >
                 	{product}
                </tbody>
            </Table>
        </div>
    );
}

