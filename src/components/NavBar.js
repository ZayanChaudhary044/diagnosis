import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../NavBar.css';
import HomePage from '../pages/HomePage';
import News from '../pages/MediNews';
import Stats from '../pages/Stats';
import Schecker from '../pages/SymptomCheck';
import AssessMedi from '../pages/AssessMedi';


function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-brand">
          
          <img
            src="/askmedilogo.png"
            alt="AskMedi logo"
            className="logo-image"
          />
          
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`mobile-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>


        {/* Navigation Links */}
        <ul className={`navbar-menu ${isMenuOpen ? 'mobile-active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" element={<HomePage />} className="navbar-link">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span>Home</span>
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="news" element={<News />} className="navbar-link">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
              </svg>
              <span>Medical News</span>
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="symp-check" element={<Schecker />} className="navbar-link">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M11.5,22C11.64,22 11.77,22 11.9,21.96C12.55,21.82 13.09,21.38 13.34,20.78C13.44,20.54 13.5,20.27 13.5,20H9.5A2,2 0 0,0 11.5,22M18,10.5C18,7.43 15.86,4.86 13,4.18V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V4.18C7.13,4.86 5,7.43 5,10.5V16L3,18V19H20V18L18,16M19.97,10H21.97C21.82,6.79 20.24,3.97 17.85,2.15L16.42,3.58C18.46,5 19.82,7.35 19.97,10M6.58,3.58L5.15,2.15C2.76,3.97 1.18,6.79 1,10H3C3.18,7.35 4.54,5 6.58,3.58Z" />
              </svg>
              <span>AI Check</span>
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="stats" element={<Stats />} className="navbar-link">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
              </svg>
              <span>Health Stats</span>
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="assess-center" element={<AssessMedi />} className="navbar-link">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M9,12L11,14L15,10M20,6H16V4A2,2 0 0,0 14,2H10A2,2 0 0,0 8,4V6H4A2,2 0 0,0 2,8V19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19V8A2,2 0 0,0 20,6M10,4H14V6H10V4Z" />
              </svg>
              <span>Assessment Center</span>
            </Link>
          </li>
        </ul>


        {/* Login Button */}
        <div className="navbar-auth">
          <Link to="/auth" className="login-button" onClick={closeMenu}>
            <svg className="login-icon" viewBox="0 0 24 24">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
            <span>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
