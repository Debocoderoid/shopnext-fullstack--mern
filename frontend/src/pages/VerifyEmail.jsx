import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const VerifyEmail = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Email verified successfully!");
                navigate("/login");
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Verify Email</h2>

                <p
                    style={{
                        color: "#a1a1aa",
                        textAlign: "center",
                        marginBottom: "20px",
                        fontSize: "14px",
                    }}
                >
                    Enter the OTP sent to your email address.
                </p>

                <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="6-digit OTP"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <button
                    type="submit"
                    className="btn"
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </button>

                <p>
                    Didn't receive the OTP?{" "}
                    <Link to="/register">Register Again</Link>
                </p>
            </form>
        </div>
    );
};

export default VerifyEmail;