import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const [signUp, setSignUp] = useState(false); // Default is login
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [passwordIssues, setPasswordIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (pwd) => {
        const issues = [];
        if (pwd.length < 8) issues.push("At least 8 characters");
        if (!/[A-Z]/.test(pwd)) issues.push("At least one uppercase letter");
        if (!/[a-z]/.test(pwd)) issues.push("At least one lowercase letter");
        if (!/[0-9]/.test(pwd)) issues.push("At least one number");
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd))
            issues.push("At least one special character");
        return issues;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (signUp) {
            const issues = validatePassword(password);
            setPasswordIssues(issues);
            if (issues.length > 0) {
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/signup`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email.trim(), password }),
                }
            );

            if (response.status === 201) {
                // Auto switch to login form after successful signup
                setSignUp(false);
                setPasswordIssues([]);
            } else {
                const errText = await response.text();
                setError(errText);
            }

            setLoading(false);
            return;
        }

        // Login flow
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            setError(errText);
            setLoading(false);
            return;
        }

        const data = await response.json();
        if (data.accessToken) {
            localStorage.setItem("token", data.accessToken);
            navigate("/"); // redirect to home or dashboard
        } else {
            setError("Login failed: token not received");
        }

        setLoading(false);
    };

    return (
        <div>
            <form className="form" onSubmit={handleSubmit}>
                <p className="title">{signUp ? "Register" : "Hey there"}</p>
                <p className="message">
                    {signUp
                        ? "Signup now and get full access to our app."
                        : "Login to continue"}
                </p>

                <label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        required
                        className="input"
                    />
                    <span>Email</span>
                </label>

                <label style={{ position: "relative" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                            const val = e.target.value;
                            setPassword(val);
                            setError("");
                            if (signUp) {
                                setPasswordIssues(validatePassword(val));
                            }
                        }}
                        required
                        className="input"
                    />
                    <span>Password</span>
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        {showPassword ? "Hide" : "View"}
                    </button>
                </label>

                {/* Password issues on signup */}
                {signUp && passwordIssues.length > 0 && (
                    <ul style={{ color: "red", fontSize: "14px", paddingLeft: "20px" }}>
                        {passwordIssues.map((issue, idx) => (
                            <li key={idx}>{issue}</li>
                        ))}
                    </ul>
                )}

                {/* Error message */}
                {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

                <button className="submit" disabled={loading}>
                    {loading ? "Please wait..." : signUp ? "Sign Up" : "Login"}
                </button>

                <p className="signin">
                    {signUp ? "Already have an account?" : "New User?"}{" "}
                    <button
                        type="button"
                        className="link-button"
                        onClick={(e) => {
                            e.preventDefault();
                            setSignUp(!signUp);
                            setError("");
                            setPasswordIssues([]);
                        }}
                    >
                        {signUp ? "Login" : "Sign Up"}
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;
