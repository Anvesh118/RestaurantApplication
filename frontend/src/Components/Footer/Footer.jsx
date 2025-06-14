import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-3 mt-5">
            <Container>
                <Row>
                    <Col className="text-center">
                        <p>&copy; 2025 Restaurant Management, All Rights Reserved</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;