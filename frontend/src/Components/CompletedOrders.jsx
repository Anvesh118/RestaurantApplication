import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';

const CompletedOrders = () => {
    const [completedOrders, setCompletedOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const fetchCompletedOrders = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/getAllCompletedOrders`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                });
                const data = await response.json();
                setCompletedOrders(data);
            } catch (e) {
                console.error("Error fetching completed orders:", e.message);
            }
        };
        fetchCompletedOrders();
    }, []);

    const handleShowDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 fw-bold">Completed Orders</h2>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Food Item</th>
                    <th>Amount (₹)</th>
                    <th>Details</th>
                </tr>
                </thead>
                <tbody>
                {completedOrders.length > 0 ? (
                    completedOrders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.orderItems.map(item => item.itemName).join(", ")}</td>
                            <td>{order.totalPrice}</td>
                            <td>
                                <Button variant="primary" size="sm" onClick={() => handleShowDetails(order)}>
                                    View Details
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center text-muted">No completed orders found</td>
                    </tr>
                )}
                </tbody>
            </Table>

            {/* Modal for Order Details */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <Table striped>
                            <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price (₹)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedOrder.orderItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.itemName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price * item.quantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CompletedOrders;
