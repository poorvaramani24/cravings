import React, { useState, useEffect, useRef, useContext } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
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
import "react-toastify/dist/ReactToastify.min.css";


function PrivateRoute({ component: Component, ...rest }) {
  const { isLoggedIn } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const historyRef = useRef(null);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401 && isLoggedIn) {
          setUser({});
          setIsLoggedIn(false);
          setLoading(false);
          if (historyRef.current) {
            historyRef.current.push("/logout");
          }
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
            <Route path="/" render={({ history }) => { historyRef.current = history; return null; }} />
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/signup" component={Signup} />
            <PrivateRoute exact path="/search" component={Search} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/favorites" component={Favorites} />
            <PrivateRoute exact path="/team" component={Team} />
            <PrivateRoute exact path="/details" component={Details} />
            <PrivateRoute exact path="/newsfeed" component={Newsfeed} />
            <PrivateRoute exact path="/editprofile" component={EditProfile} />
          </Wrapper>
          <Footer />
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
