import React from 'react';
import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function DeactivateReactivateProduct({ productId, isActive, fetchData }) {
    const notyf = new Notyf();

    const archiveToggle = () => {
        const action = isActive ? 'archive' : 'activate';
        
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/${action}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                notyf.success(`Product successfully ${action}d!`);
                fetchData();  
            } else {
                notyf.error('Action failed. Please try again.');
            }
        });
    };

    return (
        <Button variant={isActive ? 'danger' : 'success'} size='sm' onClick={archiveToggle}>
            {isActive ? 'Archive' : 'Activate'}
        </Button>
    );
}
