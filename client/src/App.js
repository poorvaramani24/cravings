import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Favorites from "./pages/Favorites";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Team from "./pages/Team";
import Details from "./pages/Details";
import Newsfeed from "./pages/Newsfeed";
import EditProfile from "./pages/EditProfile";
import Logout from './pages/Logout';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Wrapper from "./components/Wrapper";
import UserContext from './context/UserContext';
import "react-toastify/ReactToastify.css";


function PrivateRoute({ children }) {
  const { isLoggedIn } = useContext(UserContext);
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401 && isLoggedIn) {
          setUser({});
          setIsLoggedIn(false);
          setLoading(false);
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [isLoggedIn]);


  return (
    <Router>
      <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, loading, setLoading }}>
        <div>
          <Navbar />
          <Wrapper>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
              <Route path="/team" element={<PrivateRoute><Team /></PrivateRoute>} />
              <Route path="/details" element={<PrivateRoute><Details /></PrivateRoute>} />
              <Route path="/newsfeed" element={<PrivateRoute><Newsfeed /></PrivateRoute>} />
              <Route path="/editprofile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            </Routes>
          </Wrapper>
          <Footer />
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
