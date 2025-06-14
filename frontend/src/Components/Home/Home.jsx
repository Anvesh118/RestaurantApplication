import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Welcome to Restaurant Management</h1>
                <p>Manage your restaurant operations seamlessly.</p>

                <h2>Try it out with the following credentials:</h2>
                <ul>
                    <li><strong>Admin:</strong> admin@gmail.com, Password: 1234, Role: ADMIN</li>
                    <li><strong>Kitchen:</strong> kitchen@gmail.com, Password: 1234, Role: KITCHEN</li>
                    <li><strong>User:</strong> user1@gmail.com, Password: 1234, Role: USER1</li>
                </ul>

                <p>Feel free to <strong>sign up</strong> and play with the application to explore its features!</p>
            </div>
        </div>
    );
};

export default Home;