import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    const getToken = () => localStorage.getItem("token");

    // Fetch reviews and ratings from backend with Authorization header
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/rating/getAllRatings`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                });
                const data = await response.json();
                setReviews(data); // Set the reviews data
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    // Function to render stars based on rating value
    const renderStars = (ratingValue) => {
        const stars = [];
        const fullStars = Math.floor(ratingValue);
        const remainder = ratingValue - fullStars;

        const starSize = '1.5rem'; // Adjusted size for stars

        // Render full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <span key={i} style={{ color: 'gold', fontSize: starSize }}>&#9733;</span>
            );
        }

        // Render partial star
        if (remainder > 0) {
            stars.push(
                <span key={fullStars} style={{ color: 'gold', fontSize: starSize }}>&#9733;</span>
            );
        }

        // Render empty stars
        for (let i = fullStars + (remainder > 0 ? 1 : 0); i < 5; i++) {
            stars.push(
                <span key={i} style={{ color: 'gray', fontSize: starSize }}>&#9733;</span>
            );
        }

        return stars;
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 fw-bold" style={{ fontSize: '2rem' }}>Customer Reviews</h2>
            <Row className="justify-content-center">
                {reviews.map((review, index) => (
                    <Col md={4} sm={12} key={review.id} className="mb-4 d-flex">
                        <Card className="text-center w-100 d-flex" style={{ minHeight: '250px' }}>
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <Card.Text style={{ fontSize: '1.1rem' }}>
                                    {review.review || "No review available"}
                                </Card.Text>
                                <div>{renderStars(review.rating)}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Reviews;