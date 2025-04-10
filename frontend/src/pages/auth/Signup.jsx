import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/sideimg.png";
import Logo from "../../assets/logo.png";
import GoogleSvg from "../../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../AuthContext";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Inside handleSubmit function in Signup.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Form validation (keep your existing validation)
  
  try {
    // Use the userData object structure that matches your API expectations
    const userData = { username, fullName, email, password };
    
    // Let the AuthContext handle the API call
    await signup(userData);
    
    toast.success("Signup successful! Redirecting...");
    
    // Navigate to social profile after a short delay
    setTimeout(() => {
      navigate("/social-profile");
    }, 1000);
  } catch (err) {
    setError(err.message);
    toast.error(err.message || "Something went wrong!");
  }
};

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="Signup Visual" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={"https://i.ibb.co/CjjXS5q/2095.png"} alt="Logo" />
          </div>
          <div className="login-center">
            <h2>Create an account</h2>
            <p>Please enter your details</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div className="login-center-buttons">
                <button type="submit">Sign Up</button>
                <button type="button">
                  <img src={GoogleSvg} alt="Google Logo" /> Sign Up with Google
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;