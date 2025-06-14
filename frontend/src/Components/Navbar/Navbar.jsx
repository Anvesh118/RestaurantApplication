import React, { useEffect, useState, useRef } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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

const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Track route changes
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const [decodedJWT, setDecodedJWT] = useState(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decoded = decodeJWT(token);
        setRole(decoded?.role || null);
        setEmail(decoded?.email || decoded?.userEmail || decoded?.username || "");
        setDecodedJWT(decoded);
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        }
        if (showProfile) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showProfile]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Restaurant Management</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {role ? (
                            <>
                                {role === "ADMIN" && (
                                    <>
                                        <Nav.Link as={Link} to="/dashboard">Items</Nav.Link>
                                        <Nav.Link as={Link} to="/menu">Menu</Nav.Link>
                                        <Nav.Link as={Link} to="/completed-orders">Completed Orders</Nav.Link>
                                        <Nav.Link as={Link} to="/live-orders">Live Orders</Nav.Link>
                                        <Nav.Link as={Link} to="/reviews">Reviews</Nav.Link>
                                    </>
                                )}
                                {role === "KITCHEN" && (
                                    <Nav.Link as={Link} to="/live-orders">Live Orders</Nav.Link>
                                )}
                                {role === "CUSTOMER" && (
                                    <>
                                        <Nav.Link as={Link} to="/dashboard">Items</Nav.Link>
                                        <Nav.Link as={Link} to="/completed-orders">Completed Orders</Nav.Link>
                                        <Nav.Link as={Link} to="/live-orders">Live Orders</Nav.Link>
                                        <Nav.Link as={Link} to="/ratings">Ratings</Nav.Link>
                                        <Nav.Link as={Link} to="/reviews">Reviews</Nav.Link>
                                    </>
                                )}
                                {/* Profile Avatar Dropdown */}
                                <div ref={profileRef} style={{ position: 'relative' }}>
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${role}`}
                                        alt="Profile"
                                        style={{ width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', marginLeft: 16 }}
                                        onClick={() => setShowProfile((prev) => !prev)}
                                    />
                                    {showProfile && (
                                        <div style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: 40,
                                            background: '#fff',
                                            border: '1px solid #ddd',
                                            borderRadius: 8,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            minWidth: 200,
                                            zIndex: 1000,
                                            padding: 16
                                        }}>
                                            <div style={{ marginBottom: 8, wordBreak: 'break-all', color: '#333', fontSize: 14 }}>
                                                <strong>Role:</strong> {decodedJWT?.role || '-'}
                                            </div>
                                            <div style={{ marginBottom: 8, wordBreak: 'break-all', color: '#333', fontSize: 14 }}>
                                                <strong>Email:</strong> {decodedJWT?.sub || '-'}
                                            </div>
                                            {email && (
                                                <div style={{ marginBottom: 12, wordBreak: 'break-all', color: '#333', fontSize: 14 }}>{email}</div>
                                            )}
                                            <button className="btn btn-danger btn-sm w-100" onClick={handleLogout}>Logout</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
