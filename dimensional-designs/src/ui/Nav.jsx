import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';  // Import logo

const Nav = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <div className="container-fluid d-flex align-items-center justify-content-between">
      {/* Logo and Brand Name on the Left (side by side) */}
      <Link to="/" className="navbar-brand d-flex align-items-center">
        <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
        Dimensional Designs
      </Link>

      {/* Navbar Links on the Right */}
      <div className="d-flex ms-auto">
        <NavLink 
          to="/" 
          className="nav-link text-white ms-4"
          style={({ isActive }) => ({
            backgroundColor: isActive ? '#0056b3' : 'transparent',
            padding: '10px 15px',
            borderRadius: '5px',
          })}
        >
          Home
        </NavLink>
        <NavLink 
          to="/signup" 
          className="nav-link text-white ms-4"
          style={({ isActive }) => ({
            backgroundColor: isActive ? '#0056b3' : 'transparent',
            padding: '10px 15px',
            borderRadius: '5px',
          })}
        >
          Signup
        </NavLink>
        <NavLink 
          to="/login" 
          className="nav-link text-white ms-4"
          style={({ isActive }) => ({
            backgroundColor: isActive ? '#0056b3' : 'transparent',
            padding: '10px 15px',
            borderRadius: '5px',
          })}
        >
          Login
        </NavLink>
        <NavLink 
          to="/cart" 
          className="nav-link text-white ms-4"
          style={({ isActive }) => ({
            backgroundColor: isActive ? '#0056b3' : 'transparent',
            padding: '10px 15px',
            borderRadius: '5px',
          })}
        >
          Cart
        </NavLink>
        <NavLink 
          to="/logout" 
          className="nav-link text-white ms-4"
          style={({ isActive }) => ({
            backgroundColor: isActive ? '#0056b3' : 'transparent',
            padding: '10px 15px',
            borderRadius: '5px',
          })}
        >
          Logout
        </NavLink>
      </div>
    </div>
  </nav>
);

export default Nav;
