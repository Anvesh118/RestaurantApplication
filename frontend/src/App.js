import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './Components/Navbar/Navbar.jsx';
import Footer from './Components/Footer/Footer';
import Dashboard from './Components/Dashboard';
import CompletedOrders from './Components/CompletedOrders';
import MenuPage from './Components/MenuPage';
import LiveOrdersPage from './Components/LiveOrdersPage';
import Ratings from './Components/Ratings/Ratings';
import Reviews from './Components/Ratings/Reviews';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import ProtectedRoute from './Utils/ProtectedRoute.jsx';
import Profile from './Components/pages/Profile'; // Adjust the path as needed
import { AuthProvider } from "./Components/context/AuthContext";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="d-flex flex-column min-vh-100">
                    <NavigationBar />
                    <div className="flex-fill">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/menu"
                                element={
                                    <ProtectedRoute>
                                        <MenuPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/completed-orders"
                                element={
                                    <ProtectedRoute>
                                        <CompletedOrders />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/live-orders"
                                element={
                                    <ProtectedRoute>
                                        <LiveOrdersPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/ratings"
                                element={
                                    <ProtectedRoute>
                                        <Ratings />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/reviews"
                                element={
                                    <ProtectedRoute>
                                        <Reviews />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
