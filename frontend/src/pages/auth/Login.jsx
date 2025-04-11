import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/sideimg.png";
import Logo from "../../assets/logo.png";
import GoogleSvg from "../../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    
    if (!email || !password) {
      setError("All fields are required.");
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await fetch("https://codefolio-4.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      // Map the response data to what your AuthContext expects
      const loginSuccessful = login({
        ...data.user,
        token: data.accessToken  // This is the key change - mapping accessToken to token
      });
      
      if (loginSuccessful) {
        toast.success("Login successful! Redirecting...");
        
        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error("Login failed: Authentication issue");
      }
      // Pass both user and tokens to the login function
      login({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });
      toast.success("Login successful! Redirecting...");
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Something went wrong!");
    }
  };
  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="Login Visual" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={"https://i.ibb.co/CjjXS5q/2095.png"} alt="Logo" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
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

              <div className="login-center-options">
                <a href="#" className="forgot-pass-link">
                  Forgot password?
                </a>
              </div>
              <div className="login-center-buttons">
                <button type="submit">Log In</button>
                <button type="button">
                  <img src={GoogleSvg} alt="Google Logo" />
                  Log In with Google
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;