import React, { useEffect, useState, useCallback } from 'react';
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from "axios";

const MenuPage = ({ onNewItemAdded }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({ item: '', price: '', category: 'BREAKFAST' });
    const [selectedCategory, setSelectedCategory] = useState('BREAKFAST');

    const getToken = () => localStorage.getItem("token");

    const fetchMenuItems = useCallback(async (category) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/items/getAllItemsByCategory/${category}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const data = await response.json();
            setMenuItems(data);
        } catch (e) {
            console.error("Error fetching menu items:", e.message);
        }
    }, []);

    useEffect(() => {
        fetchMenuItems(selectedCategory);
    }, [selectedCategory, fetchMenuItems]);

    const toggleAvailability = async (itemId) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/items/toggleAvailability/${itemId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            setMenuItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
                )
            );
        } catch (e) {
            console.error("Error toggling availability:", e.message);
        }
    };

    const addNewItem = async () => {
        if (!newItem.item || !newItem.price) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/items/postItem`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    ...newItem,
                    category: newItem.category.toUpperCase(),
                    isAvailable: true
                }),
            });
            setNewItem({ item: '', price: '', category: 'BREAKFAST' });
            fetchMenuItems(selectedCategory);

            if (onNewItemAdded) onNewItemAdded(); // Trigger live orders reload
        } catch (e) {
            console.error("Error adding new item:", e.message);
        }
    };

    const deleteMenuItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/items/deleteItem/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (e) {
            console.error("Error deleting item:", e.message);
            alert("Failed to delete item.");
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4 fw-bold">Menu</h2>
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
                    <Row>
                        {menuItems.length > 0 ? (
                            menuItems.map((item) => (
                                <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                                    <Card className="p-3 text-center">
                                        <Card.Body>
                                            <Card.Title className="fw-bold">{item.item}</Card.Title>
                                            <Card.Text className="fs-5 text-success">₹{item.price}</Card.Text>
                                            <Form.Check
                                                type="switch"
                                                id={`availability-switch-${item.id}`}
                                                label={item.isAvailable ? "Available" : "Unavailable"}
                                                checked={item.isAvailable}
                                                onChange={() => toggleAvailability(item.id)}
                                            />
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => deleteMenuItem(item.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p className="text-center w-100">No items were added for {selectedCategory}</p>
                        )}
                    </Row>
                </Col>

                {/* Add New Item */}
                <Col md={4}>
                    <Card className="p-4">
                        <h4 className="text-center fw-bold">Add New Item</h4>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter item name"
                                    value={newItem.item}
                                    onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Price (₹)</Form.Label>
                                <Form.Control
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder="Enter price"
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || '' })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                >
                                    <option value="BREAKFAST">Breakfast</option>
                                    <option value="LUNCH">Lunch</option>
                                    <option value="DINNER">Dinner</option>
                                </Form.Select>
                            </Form.Group>
                            <Button variant="success" className="w-100" onClick={addNewItem}>
                                Add Item
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MenuPage;
