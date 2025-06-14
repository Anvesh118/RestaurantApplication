import React, { useEffect, useState, useRef } from "react";
import Liveorders from "./Liveorders";
import { Col, Container, Row, Card, Button, Table, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("BREAKFAST");
    const [showLiveOrders] = useState(true);
    const [fetchLiveOrdersTrigger, setFetchLiveOrdersTrigger] = useState(0);
    const [lastUpdatedId, setLastUpdatedId] = useState(null);
    const timeoutRef = useRef();

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        fetchItems(selectedCategory);
    }, [selectedCategory]);

    const fetchItems = async (category) => {
        try {
            const response = await fetch(

                `${process.env.REACT_APP_API_URL}/api/items/getItemsAvailableByCategory/${category}`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );
            const data = await response.json();
            setItems(data);
        } catch (e) {
            console.error("Error fetching items:", e.message);
        }
    };

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === item.id);
            if (existingItem) {
                setLastUpdatedId(item.id);
                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => setLastUpdatedId(null), 400);
                return prevCart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                setLastUpdatedId(item.id);
                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => setLastUpdatedId(null), 400);
                return [...prevCart, { itemName: item.item, price: item.price, quantity: 1, id: item.id }];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => {
            setLastUpdatedId(itemId);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setLastUpdatedId(null), 400);
            return prevCart
                .map((item) =>
                    item.id === itemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0);
        });
    };

    const finalizeOrder = async () => {
        const orderPayload = {
            orderItems: cart.map(item => ({
                id: item.id,
                itemName: item.itemName,
                quantity: item.quantity,
                price: item.price
            })),
            isFinalized: true,
            isCompleted: false
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/postNewOrder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(orderPayload),
            });

            if (response.ok) {
                setCart([]);
                setFetchLiveOrdersTrigger(prev => prev + 1);
            } else {
                alert("Failed to finalize order");
            }
        } catch (error) {
            console.error("Error finalizing order:", error);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="BREAKFAST">Breakfast</option>
                        <option value="LUNCH">Lunch</option>
                        <option value="DINNER">Dinner</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                <Col md={8}>
                    <h2 className="text-center mb-4 fw-bold">Items</h2>
                    <Row className="justify-content-center">
                        {items.map((item) => (
                            <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                                <Card className="shadow-sm text-center p-3">
                                    <Card.Body>
                                        <Card.Title className="fw-bold">{item.item}</Card.Title>
                                        <Card.Text className="text-primary fs-5">
                                            ₹{item.price}
                                        </Card.Text>
                                        <Button variant="primary" className="w-100" onClick={() => addToCart(item)}>
                                            Add
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm p-3">
                        <Card.Body>
                            <h4 className="fw-bold">Current Order</h4>
                            {cart.length > 0 ? (
                                <>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr style={{ height: "60px" }}>
                                                <th style={{ verticalAlign: "middle", fontSize: "1.2rem" }}>Item</th>
                                                <th style={{ verticalAlign: "middle", fontSize: "1.2rem" }}>Quantity</th>
                                                <th style={{ verticalAlign: "middle", fontSize: "1.2rem" }}>Price</th>
                                                <th style={{ verticalAlign: "middle", fontSize: "1.2rem" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cart.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    style={{
                                                        height: "60px",
                                                        background: lastUpdatedId === item.id ? "#ffeeba" : "inherit", // yellow highlight
                                                        transition: "background 0.3s"
                                                    }}
                                                >
                                                    <td style={{ verticalAlign: "middle", fontSize: "1.1rem" }}>{item.itemName}</td>
                                                    <td style={{ verticalAlign: "middle" }}>
                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            <Button
                                                                variant="link"
                                                                size="sm"
                                                                className="me-2 p-0"
                                                                style={{
                                                                    minWidth: "28px",
                                                                    height: "28px",
                                                                    fontSize: "1.3rem",
                                                                    lineHeight: "1",
                                                                    boxShadow: "none",
                                                                    textDecoration: "none" // <-- Add this line to remove underline
                                                                }}
                                                                onClick={() => removeFromCart(item.id)}
                                                                title="Decrease"
                                                            >
                                                                –
                                                            </Button>
                                                            <span style={{ fontSize: "1.2rem", minWidth: "24px", textAlign: "center" }}>
                                                                {item.quantity}
                                                            </span>
                                                            <Button
                                                                variant="link"
                                                                size="sm"
                                                                className="ms-2 p-0"
                                                                style={{
                                                                    minWidth: "28px",
                                                                    height: "28px",
                                                                    fontSize: "1.3rem",
                                                                    lineHeight: "1",
                                                                    boxShadow: "none",
                                                                    textDecoration: "none" // <-- Add this line to remove underline
                                                                }}
                                                                onClick={() => addToCart({ ...item, id: item.id, item: item.itemName, price: item.price })}
                                                                title="Increase"
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                    </td>
                                                    <td style={{ verticalAlign: "middle", fontSize: "1.1rem" }}>₹{item.price * item.quantity}</td>
                                                    <td style={{ verticalAlign: "middle" }}>
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            style={{
                                                                minWidth: "32px",
                                                                height: "32px",
                                                                fontSize: "1.6rem", // Increased size
                                                                color: "#dc3545",
                                                                background: "none",
                                                                boxShadow: "none",
                                                                padding: 0,
                                                                textDecoration: "none"
                                                            }}
                                                            className="p-0"
                                                            onClick={() =>
                                                                setCart((prevCart) => prevCart.filter((i) => i.id !== item.id))
                                                            }
                                                            title="Remove Item"
                                                        >
                                                            ×
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <h5 className="fw-bold">
                                        Total: ₹{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
                                    </h5>
                                    <Button variant="success" className="w-100 mb-2" onClick={finalizeOrder}>
                                        Finalize Order
                                    </Button>
                                    <Button variant="secondary" className="w-100">Print</Button>
                                </>
                            ) : (
                                <p className="text-muted">No items in the cart</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* {showLiveOrders && (
                <>
                    <h2 className="text-center mb-4 fw-bold">Live Orders</h2>
                    <Liveorders fetchLiveOrdersTrigger={fetchLiveOrdersTrigger} />
                </>
            )} */}
        </Container>
    );
};

export default Dashboard;
