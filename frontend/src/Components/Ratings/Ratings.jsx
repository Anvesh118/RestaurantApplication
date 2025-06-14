import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

const Ratings = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const getToken = () => localStorage.getItem("token");

    // Fetch the current average rating when the component mounts
    useEffect(() => {
        const fetchAverageRating = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/rating/getStars`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                const data = await response.json();
                setAverageRating(data);
            } catch (error) {
                console.error('Error fetching average rating:', error);
            }
        };

        fetchAverageRating();
    }, []);

    const handleRatingSubmit = async () => {
        const ratingData = {
            review: comment,
            rating: rating,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/rating/postRating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(ratingData),
            });

            if (response.ok) {
                setComment('');
                setRating(0);

                // Delay the fetch of average rating to avoid visual glitch
                setTimeout(async () => {
                    try {
                        const updatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/rating/getStars`, {
                            headers: {
                                Authorization: `Bearer ${getToken()}`,
                            },
                        });
                        const updatedData = await updatedResponse.json();
                        setAverageRating(updatedData);
                    } catch (fetchError) {
                        console.error('Error re-fetching average rating:', fetchError);
                    }
                }, ); // Delay by 500ms
            } else {
                console.error('Failed to submit rating');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleStarClick = (value) => {
        setRating(value);
    };

    const renderStars = (ratingValue) => {
        const stars = [];
        const starSize = '2rem';
        const fullStars = Math.floor(ratingValue);
        const remainder = ratingValue - fullStars;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <span key={`full-${i}`} style={{ color: 'gold', fontSize: starSize }}>&#9733;</span>
            );
        }

        if (remainder > 0) {
            stars.push(
                <span key="partial" style={{ position: 'relative', display: 'inline-block', fontSize: starSize }}>
                <span style={{ color: 'gray' }}>&#9733;</span>
                <span style={{
                    color: 'gold',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: `${remainder * 100}%`,
                    overflow: 'hidden',
                }}>
                    &#9733;
                </span>
            </span>
            );
        }

        for (let i = fullStars + (remainder > 0 ? 1 : 0); i < 5; i++) {
            stars.push(
                <span key={`empty-${i}`} style={{ color: 'gray', fontSize: starSize }}>&#9733;</span>
            );
        }

        return stars;
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 fw-bold">Submit Your Rating</h2>

            <Card className="mb-4">
                <Card.Body>
                    <h4>Average Rating: {averageRating.toFixed(2)}</h4>
                    <div className="star-rating mb-3">
                        {renderStars(averageRating)}
                    </div>
                </Card.Body>
            </Card>

            <Row>
                <Col md={6}>
                    <Form>
                        <Form.Group controlId="formRating">
                            <Form.Label>Rating (1 to 5)</Form.Label>
                            <div className="star-rating mb-3">
                                {[1, 2, 3, 4, 5].map((starValue) => (
                                    <span
                                        key={starValue}
                                        onClick={() => handleStarClick(starValue)}
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '2rem',
                                            color: starValue <= rating ? 'gold' : 'gray',
                                        }}
                                    >
                                        &#9733;
                                    </span>
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group controlId="formComment" className="mt-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" className="mt-3" onClick={handleRatingSubmit}>
                            Submit Rating
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default Ratings;
