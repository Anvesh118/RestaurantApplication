import React, { useEffect, useState, useCallback } from 'react';
import { Button, Card, Col, Row } from "react-bootstrap";

// Helper to decode JWT
const decodeJWT = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error("JWT Decode Error:", err);
        return null;
    }
};

const Liveorders = ({ fetchLiveOrdersTrigger }) => {
    const [liveOrders, setLiveOrders] = useState([]);
    const [role, setRole] = useState(undefined);

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const token = getToken();
        const decoded = decodeJWT(token);
        setRole(decoded?.role ?? null);
    }, []);

    const fetchLiveOrders = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/getAllFinalizedOrders`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const data = await response.json();
            setLiveOrders(data);
        } catch (e) {
            console.error("Error fetching live orders:", e.message);
        }
    }, []);

    useEffect(() => {
        if (role !== undefined) {
            fetchLiveOrders();
        }
    }, [fetchLiveOrders, fetchLiveOrdersTrigger, role]);

    const completeOrder = async (orderId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/orderCompleted/${orderId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            if (response.ok) {
                fetchLiveOrders(); // Refresh the list
            } else {
                alert(`Failed to complete order #${orderId}`);
            }
        } catch (error) {
            console.error("Error completing order:", error);
        }
    };

    if (role === undefined) {
        return <p className="text-center mt-3">Loading...</p>;
    }

    return (
        <Row className="justify-content-center">
            {liveOrders.length > 0 ? (
                liveOrders.map((liveOrder) => (
                    <Col key={liveOrder.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <Card className="shadow-sm text-center p-3">
                            <Card.Body>
                                <Card.Title className="fw-bold">Order #{liveOrder.id}</Card.Title>
                                {liveOrder.orderItems.map((orderItem, index) => (
                                    <Card.Text key={index}>
                                        {orderItem.itemName} : {orderItem.quantity}
                                    </Card.Text>
                                ))}
                                <Card.Text className="text-primary fs-5">
                                    ₹{liveOrder.totalPrice}
                                </Card.Text>

                                {/* Show Complete Order only if not CUSTOMER */}
                                {role !== "CUSTOMER" && (
                                    <Button
                                        variant="success"
                                        className="w-100"
                                        onClick={() => completeOrder(liveOrder.id)}
                                    >
                                        Complete Order
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            ) : (
                <p className="text-muted text-center mt-3">No live orders available</p>
            )}
        </Row>
    );
};

export default Liveorders;
