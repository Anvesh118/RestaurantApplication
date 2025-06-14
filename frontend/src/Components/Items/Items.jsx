import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa'; // Import icons

const Items = () => {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState("BREAKFAST");
    const [itemCounts, setItemCounts] = useState({}); // Track item quantities

    const getToken = () => localStorage.getItem("token");

    const fetchItemsByCategory = async (selectedCategory) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/items/getItemsAvailableByCategory/${selectedCategory}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const data = await response.json();
            setItems(data);
            // Reset counts for new category
            const counts = {};
            data.forEach(item => { counts[item.id] = 0; });
            setItemCounts(counts);
        } catch (e) {
            console.error("Error fetching items:", e.message);
        }
    };

    useEffect(() => {
        fetchItemsByCategory(category);
    }, [category]);

    // Add item quantity
    const handleAdd = (id) => {
        setItemCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    // Remove one from item quantity
    const handleRemove = (id) => {
        setItemCounts(prev => ({ ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) }));
    };

    // Remove the item completely
    const handleRemoveItem = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
        setItemCounts(prev => {
            const newCounts = { ...prev };
            delete newCounts[id];
            return newCounts;
        });
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center fw-bold mb-4">Available Items</h2>
            <Row className="mb-3">
                <Col md={4} className="mx-auto">
                    <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="BREAKFAST">Breakfast</option>
                        <option value="LUNCH">Lunch</option>
                        <option value="DINNER">Dinner</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                {items.length > 0 ? (
                    items.map((item) => (
                        <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <Card className="text-center p-3 shadow-sm position-relative">
                                {/* Cross icon for removing the item */}
                                <FaTimes
                                    style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        cursor: 'pointer',
                                        color: '#dc3545'
                                    }}
                                    title="Remove item"
                                    onClick={() => handleRemoveItem(item.id)}
                                />
                                <Card.Body>
                                    <Card.Title className="fw-bold">{item.item}</Card.Title>
                                    <Card.Text className="text-success fs-5">₹{item.price}</Card.Text>
                                    <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                                        {/* Minus icon */}
                                        <FaMinus
                                            style={{
                                                cursor: itemCounts[item.id] > 0 ? 'pointer' : 'not-allowed',
                                                color: itemCounts[item.id] > 0 ? '#0d6efd' : '#adb5bd',
                                                pointerEvents: itemCounts[item.id] > 0 ? 'auto' : 'none'
                                            }}
                                            title="Decrease"
                                            onClick={() => handleRemove(item.id)}
                                        />
                                        <span className="mx-2">{itemCounts[item.id] || 0}</span>
                                        {/* Plus icon */}
                                        <FaPlus
                                            style={{ cursor: 'pointer', color: '#0d6efd' }}
                                            title="Increase"
                                            onClick={() => handleAdd(item.id)}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center text-muted w-100">
                        No items available for {category}
                    </p>
                )}
            </Row>
        </Container>
    );
};

export default Items;
