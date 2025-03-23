import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/image.png";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
    }
    if(username.length < 4) {
        toast.error("Username must be at least 4 characters long.");
        return;
    }
    
    if (!username || !fullName || !email || !password) {
      setError("All fields are required.");
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fullName, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }
      
      // Use the signup function from context 
      const userData = { ...data.user, username, fullName, email };
      signup(userData);
      
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
            <img src={Logo} alt="Logo" />
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