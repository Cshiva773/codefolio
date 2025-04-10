import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import DashBoard from '../assets/DashBoard.png';
import s2 from '../assets/2.png';
import s3 from '../assets/3.png';
import s4 from '../assets/4.png';
import s5 from "../assets/5.png";
import arrow from '../assets/arrow.png';

const Home = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const isLoggedIn = !!user; // Check if user is logged in
  // State for FAQ items
  const [faqItems, setFaqItems] = useState([
    {
      question: "How can I change my profile name?",
      answer: "You can change your profile name from the settings page in your account.",
      isOpen: false
    },
    {
      question: "Why am I seeing a yellow warning and unable to fetch my profile handle?",
      answer: "This warning appears when there is an issue with profile verification.",
      isOpen: false
    },
    {
      question: "Which coding platforms are supported?",
      answer: "We support CodeForces, LeetCode, CodeChef, AtCoder, and more.",
      isOpen: false
    },
    {
      question: "How do I connect my coding profiles from different platforms?",
      answer: "Go to settings and link your profiles by providing your username.",
      isOpen: false
    },
    {
      question: "What should I do if I encounter an error connecting my LeetCode profile?",
      answer: "Ensure that your LeetCode profile is set to public and try again.",
      isOpen: false
    }
  ]);

  // Toggle FAQ answer visibility
  const toggleFaq = (index) => {
    setFaqItems(faqItems.map((item, i) => 
      i === index ? { ...item, isOpen: !item.isOpen } : item
    ));
  };

  // Effect for adding fontawesome CDN for social icons
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const navigate = useNavigate();

  // scroller

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  

  return (
    <div className="codefolio">
      {/* Fixed Header - Added proper spacing for content below */}
      <header className="header">
        <div className="container">
          {/* Logo */}
          <a href="/" className="logo">
            <img src="https://i.ibb.co/CjjXS5q/2095.png" alt="CodeFolio Logo" />
            <span>CodeFolio</span>
          </a>

          {/* Navigation */}
          <nav className="flex gap-x-6">
            <a href="#faq" className="text-sm font-medium hover:underline">
              FAQ
            </a>
            <a
              href="#"
              onClick={() => navigate("/problems")}
              className="text-sm font-medium hover:underline"
            >
              Question Tracker
            </a>
            <a
              href="#"
              onClick={() => navigate("/github")}
              className="text-sm font-medium hover:underline"
            >
              Event Tracker
            </a>
            <a
              href="#"
              onClick={() => navigate("/dashboard")}
              className="text-sm font-medium hover:underline"
            >
              Profile Tracker
            </a>
          </nav>

          {/* Login Button */}

          {isLoggedIn ? (
            <a
              href="#"
              className="btn btn-filled"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </a>
          ) : (
            <a
              href="#"
              className="btn btn-filled"
              onClick={() => navigate("/login")}
            >
              Login
            </a>
          )}
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="header-spacer"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Track, analyze & <span className="highlight-orange">share</span>
          </h1>
          <p>
            <span className="highlight-blue">Cod</span>
            <span className="highlight-orange">olio</span> helps you navigate
            and track your coding journey to success
          </p>
          <div className="buttons">
            <a
              href="#"
              className="btn btn-outline"
              onClick={() => navigate("/problems")}
            >
              Question Tracker
            </a>
            <a
              href="#"
              className="btn btn-filled"
              onClick={() => navigate("/dashboard")}
            >
              Profile Tracker →
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img src={DashBoard} alt="Dashboard Analytics" />
        </div>
      </section>

      {/* Platforms Section */}
      <section className="platforms">
        <div className="platforms-text">
          <h2>Your Favourite Coding Platforms</h2>
          <p>
            Streamlined in <span className="highlight-blue">Codo</span>
            <span className="highlight-orange">lio</span>
            to simplify your coding journey
          </p>
        </div>
        <div className="flex justify-center items-center">
          <div className="platforms-image max-w-xs md:max-w-md lg:max-w-lg mx-auto flex justify-center items-center">
            <img src={s2} alt="Coding Platforms" />
          </div>
        </div>
      </section>

      {/* Prep Section */}
      <section className="prep-section">
        <div className="prep-content">
          <h2>
            Simplify Your <span className="highlight-orange">Prep</span>
          </h2>
          <p>
            Say goodbye to last-minute stress.
            <span className="highlight-blue">
              Track all your questions and notes
            </span>{" "}
            in one place for easy review and revision.
          </p>
          <a
            href="#"
            className="question-tracker"
            onClick={() => navigate("/problems")}
          >
            Try Question Tracker →
          </a>

          <div className="features">
            <div className="feature">
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="My Workspace"
              />
              <h4>My Workspace</h4>
              <p>Tag & filter questions for easy organization</p>
            </div>
            <div className="feature">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1087/1087815.png"
                alt="Sheet Tracker"
              />
              <h4>Sheet Tracker</h4>
              <p>Track all coding sheets in one place</p>
            </div>
            <div className="feature">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2203/2203124.png"
                alt="Enhanced Notes"
              />
              <h4>Enhanced Notes</h4>
              <p>Add detailed notes to questions easily.</p>
            </div>
          </div>
        </div>
        <div className="prep-image">
          <img src={s3} alt="Dashboard and Analytics" />
        </div>
      </section>

      {/* Analytics Section */}
      <section className="analytics-section">
        <div className="analytics-content">
          <h2>
            Your <span className="highlight-orange">Analytics</span>{" "}
            <span>Dashboard</span>
          </h2>
          <p>
            Get deep insights into your coding journey with interactive charts
            and performance tracking. Visualize your progress, track solved
            problems, and enhance your preparation effectively.
          </p>
        </div>
        <div className="analytics-image">
          <img src={s4} alt="Dashboard-and-bar-analytics" />
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="dashboard-section">
        <div className="analytics-content">
          <h2 className="">
            Your <span className="highlight-orange">Comprehensive</span>{" "}
            <span className="highlight-blue">Analytics</span>
          </h2>
          <p>
            Gain detailed insights into your performance with real-time data
            visualization. Track progress, analyze trends, and optimize your
            workflow.
          </p>
        </div>
        <div className="dashboard-image">
          <img
            src={s5}
            alt="Dashboard-and-bar-analytics"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <h2>Frequently asked questions</h2>
        <div className="faq-container">
          {faqItems.map((item, index) => (
            <div className="faq-item" key={index}>
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{item.question}</span>
                <span className="icon">{item.isOpen ? "−" : "+"}</span>
              </div>
              <div
                className="faq-answer"
                style={{ display: item.isOpen ? "block" : "none" }}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
        <a href="#" className="more-link">
          more
        </a>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>
          Ready to <span className="highlight">unlock</span> your Coding
          Portfolio?
        </h2>
        <p className="subtext">Unlock your codolio profile now</p>
        {isLoggedIn ? (
          <a
            href="#"
            className="cta-button"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard →
          </a>
        ) : (
          <a href="#" className="cta-button" onClick={() => navigate("/login")}>
            Login / Signup →
          </a>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">FAQ</a>
          <a href="#">Support</a>
          <a href="#">Privacy</a>
          <a href="#">Timeline</a>
          <a href="#">Terms</a>
        </div>
        <div className="social-icons">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <p className="copyright">© 2024 Codolio, Inc. All rights reserved.</p>
      </footer>

      <style jsx>{`
        /* Global styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .codefolio {
          width: 100%;
          overflow-x: hidden;
          background-color: #000000; /* Base background - black */
          color: #ffffff;
        }

        /* Header spacer to prevent content from going under fixed header */
        .header-spacer {
          height: 60px; /* Match header height */
        }

        /* Header styles - Fixed positioning */
        .header {
          background-color: #070f2b;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 10px 0;
          height: 60px;
        }

        /* Container */
        .container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          height: 100%;
        }

        /* Logo */
        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .logo img {
          height: 40px;
          margin-right: 8px;
        }

        .logo span {
          font-size: 20px;
          font-weight: bold;
          color: #ff9149;
        }

        /* Navigation Links - FIXED STYLES */
        .nav-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          flex: 1;
          padding: 0 20px;
        }

        .nav-links a {
          text-decoration: none;
          color: black;
          font-size: 16px;
          padding: 5px 0;
          transition: color 0.3s, border-bottom 0.3s;
          white-space: nowrap;
        }

        .nav-links a:hover {
          color: #ff9149;
          border-bottom: 2px solid #ff9149;
        }

        /* Login Button */
        .login-btn {
          background-color: blue;
          color: white;
          padding: 8px 16px;
          border-radius: 5px;
          text-decoration: none;
          font-size: 16px;
          transition: background 0.3s;
          white-space: nowrap;
        }

        .login-btn:hover {
          background-color: darkblue;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 0 10px;
          }

          .nav-links {
            position: absolute;
            top: 60px;
            left: 0;
            width: 100%;
            background-color: #afddff;
            flex-direction: column;
            padding: 10px 0;
            gap: 10px;
            display: none; /* Hidden by default on mobile */
          }

          /* Add a mobile menu toggle button here if needed */
        }

        .nav-links a {
          text-decoration: none;
          color: black;
          font-size: 16px;
          transition: color 0.3s;
        }

        .nav-links a:hover {
          color: #ff9149;
        }

        /* Login Button */
        .login-btn {
          background-color: blue;
          color: white;
          padding: 8px 16px;
          border-radius: 5px;
          text-decoration: none;
          font-size: 16px;
          transition: background 0.3s;
        }

        .login-btn:hover {
          background-color: darkblue;
        }

        /* Hero Section */
        .hero {
          text-align: center;
          padding: 80px 10% 40px;
          background: linear-gradient(
            135deg,
            #070f2b 0%,
            #52057b 100%
          ); /* Gradient from black to deep purple */
        }

        /* Text Content */
        .hero-text {
          max-width: 700px;
          margin: 0 auto;
        }

        .hero h1 {
          font-size: 48px;
          font-weight: bold;
          color: #ffffff;
          line-height: 1.2;
          margin: 0;
        }

        .highlight-orange {
          color: #bc6ff1; /* Light purple */
        }

        .highlight-blue {
          color: #892cdc; /* Medium purple */
          font-weight: bold;
        }

        .highlight {
          color: #bc6ff1; /* Light purple */
          font-weight: bold;
        }

        /* Subtitle */
        .hero p {
          font-size: 20px;
          color: #ffffff;
          margin-top: 10px;
        }

        /* Buttons */
        .buttons {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .btn {
          display: inline-block;
          padding: 12px 20px;
          font-size: 16px;
          border-radius: 8px;
          font-weight: bold;
          text-decoration: none;
        }

        .btn-outline {
          border: 2px solid #bc6ff1;
          color: #bc6ff1;
          background: rgba(0, 0, 0, 0.3);
        }

        .btn-outline:hover {
          background: rgba(188, 111, 241, 0.1);
        }

        .btn-filled {
          background: #892cdc;
          color: white;
        }

        .btn-filled:hover {
          background: #7424b3;
        }

        /* Hero Image */
        .hero-image {
          margin-top: 40px;
          display: flex;
          justify-content: center;
        }

        .hero-image img {
          width: 100%;
          max-width: 800px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(137, 44, 220, 0.3);
        }

        /* Platforms Section */
        .platforms {
          text-align: center;
          padding: 60px 10%;
          background: #52057b; /* Deep purple */
        }

        /* Text Content */
        .platforms-text {
          max-width: 700px;
          margin: 0 auto;
        }

        .platforms h2 {
          font-size: 36px;
          font-weight: bold;
          color: #ffffff;
          margin: 0;
        }

        .platforms p {
          font-size: 20px;
          color: #ffffff;
          margin-top: 10px;
        }

        /* Image */
        .platforms-image {
          margin-top: 40px;
          display: flex;
          justify-content: center;
        }

        .platforms-image img {
          width: 100%;
          max-width: 900px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        /* Prep Section */
        .prep-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 60px 10%;
          background: linear-gradient(
            135deg,
            #070f2b 0%,
            #892cdc 100%
          ); /* Gradient from deep to medium purple */
        }

        /* Text Content */
        .prep-content {
          max-width: 600px;
        }

        .prep-content h2 {
          font-size: 36px;
          font-weight: bold;
          color: #ffffff;
          margin: 0;
        }

        .prep-content p {
          font-size: 18px;
          color: #ffffff;
          margin-top: 10px;
        }

        /* Question Tracker Link */
        .question-tracker {
          display: inline-block;
          margin-top: 15px;
          font-size: 16px;
          color: #bc6ff1; /* Light purple */
          text-decoration: none;
          font-weight: bold;
        }

        .question-tracker:hover {
          color: #d4a4f8;
        }

        /* Features */
        .features {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 30px;
          flex-wrap: wrap;
        }

        .feature {
          text-align: center;
          max-width: 150px;
          background: rgba(0, 0, 0, 0.3);
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
        }

        .feature:hover {
          transform: translateY(-5px);
        }

        .feature img {
          width: 40px;
          height: 40px;
          filter: invert(1);
        }

        .feature h4 {
          font-size: 16px;
          font-weight: bold;
          margin-top: 10px;
          margin-bottom: 5px;
          color: #bc6ff1; /* Light purple */
        }

        .feature p {
          font-size: 14px;
          color: #ffffff;
          margin: 0;
        }

        /* Image (Placed Below Content) */
        .prep-image {
          margin-top: 40px;
          display: flex;
          justify-content: center;
        }

        .prep-image img {
          width: 100%;
          max-width: 600px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        /* Analytics Section */
        .analytics-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 60px 20px;
          background-color: #892cdc; /* Medium purple */
        }

        .analytics-content {
          max-width: 700px;
          margin-bottom: 20px;
        }

        .analytics-content h2 {
          font-size: 2rem;
          font-weight: bold;
          margin: 0 0 10px 0;
          color: #ffffff;
        }

        .analytics-content p {
          font-size: 1.1rem;
          color: #ffffff;
          margin: 0;
        }

        .analytics-image {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .analytics-image img {
          width: 100%;
          max-width: 700px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        /* Dashboard Section */
        .dashboard-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 60px 20px;
          background: linear-gradient(
            135deg,
            #070f2b 0%,
            #bc6ff1 100%
          ); /* Gradient from medium to light purple */
        }

        .dashboard-content {
          max-width: 700px;
          margin-bottom: 20px;
        }

        .dashboard-content h2 {
          font-size: 2rem;
          font-weight: bold;
          margin: 0 0 10px 0;
          color: #ffffff;
        }

        .dashboard-content p {
          font-size: 1.1rem;
          color: #ffffff;
          margin: 0;
        }

        .dashboard-image {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .dashboard-image img {
          width: 100%;
          max-width: 800px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        /* FAQ Section */
        .faq-section {
          text-align: center;
          padding: 60px 20px;
          background-color: #bc6ff1; /* Light purple */
        }

        .faq-section h2 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 20px;
          color: #000000;
        }

        .faq-container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .faq-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 15px 0;
          cursor: pointer;
          text-align: left;
        }

        .faq-question {
          font-size: 1.1rem;
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffffff;
        }

        .icon {
          font-size: 1.5rem;
          font-weight: bold;
          transition: transform 0.3s ease;
        }

        .faq-answer {
          padding-top: 10px;
          color: #ffa500;
        }

        .more-link {
          display: block;
          margin-top: 20px;
          text-decoration: none;
          color: #000000;
          font-weight: bold;
        }

        .more-link:hover {
          text-decoration: underline;
        }

        /* CTA Section */
        .cta-section {
          text-align: center;
          padding: 60px 20px;
          background: linear-gradient(
            135deg,
            #bc6ff1 0%,
            #52057b 100%
          ); /* Gradient from light to deep purple */
        }

        .cta-section h2 {
          font-size: 2rem;
          font-weight: bold;
          color: #ffffff;
          margin: 0;
        }

        .subtext {
          color: #ffffff;
          font-size: 1rem;
          margin: 10px 0 20px;
        }

        .cta-button {
          display: inline-block;
          padding: 12px 20px;
          background-color: #892cdc;
          color: white;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease-in-out;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .cta-button:hover {
          background-color: #bc6ff1;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 30px 20px;
          background-color: #000000;
          border-top: 1px solid #52057b;
        }

        .footer-links {
          margin-bottom: 15px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .footer-links a {
          color: #bc6ff1;
          text-decoration: none;
          margin: 0 15px;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #d4a4f8;
        }

        .social-icons {
          margin-bottom: 15px;
        }

        .social-icons a {
          color: #bc6ff1;
          font-size: 24px;
          margin: 0 10px;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .social-icons a:hover {
          color: #d4a4f8;
          transform: scale(1.2);
        }

        .copyright {
          font-size: 12px;
          color: #892cdc;
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .hero h1 {
            font-size: 36px;
          }

          .hero p {
            font-size: 18px;
          }

          .buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            margin: 5px 0;
          }

          .features {
            flex-direction: column;
            align-items: center;
          }

          .feature {
            margin-bottom: 20px;
          }
        }
      `}</style>

      {/* scroll */}

      {/* Dummy content for scroll */}

      {showButton && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
            width: "50px",
            height: "50px",
            fontSize: "20px",
            // backgroundColor: "#007BFF",

            color: "#fff",
            border: "4px solid",
            borderRadius: "30%",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <img src={arrow} alt="" />
        </button>
      )}
    </div>
  );
};

export default Home;