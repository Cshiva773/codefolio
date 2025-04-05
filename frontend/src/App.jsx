import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import SocialProfile from "./pages/SocialProfile";
import { AuthProvider, useAuth } from "./AuthContext";
import GithubDashboard from "./components/GithubDashboard";
import DiscussionForum from "./pages/DiscussionForum";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostNavbar from "./pages/PostNavbar";
import AiInterviewer from "./pages/AiInterviewer";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/social-profile"
          element={
            <ProtectedRoute>
              <SocialProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/github"
          element={
            <ProtectedRoute>
              <GithubDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AiInterviewer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <PostNavbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/community" element={<DiscussionForum />} />
                    <Route path="/community/post/:id" element={<PostDetail />} />
                    <Route path="/community/create-post" element={
                      <ProtectedRoute>
                        <CreatePost />
                      </ProtectedRoute>
                    } />
                    <Route path="/edit-post/:id" element={
                      <ProtectedRoute>
                        <EditPost />
                      </ProtectedRoute>
                    } />

                  </Routes>
                </main>
              </div>
              <div>Community Page</div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;