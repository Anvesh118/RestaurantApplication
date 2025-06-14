import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = auth || localStorage.getItem("token"); // Use AuthContext or localStorage
                if (!token) {
                    setError("No token found. Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // Send token in Auth header
                        "Content-Type": "application/json"
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Profile data:", data); 

                setUser(data.user || data);
            } catch (err) {
                setError(err.message || "Failed to fetch user details.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [auth]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    // Center the profile details
    return (
        <div className="max-w-lg mx-auto bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 shadow-md rounded-lg p-8 flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Profile</h1>
            {user ? (
                <div className="flex flex-col items-center w-full">
                    <span className="text-center text-lg font-semibold mb-4">
                        Email: <span className="font-normal">{user.email || "-"}</span>
                    </span>
            

                    <button type="button" className="btn btn-outline-danger p-2" onClick={() => {
                            logout();
                            navigate("/login");
                        }}> 
                        Logout
                        
                    </button>
                </div>
            ) : (
                <p className="text-center">No user data found.</p>
            )}
        </div>
    );
};

export default Profile;