import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navigation.css';

// استيراد الأيقونات من react-icons
import { FaHome, FaCalendarAlt, FaChartBar, FaUser, FaPlus, FaSignOutAlt, FaSignInAlt, FaBars } from 'react-icons/fa';

const Navigation = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };

  const getMenuItems = () => {
    const items = [
      { text: 'Home', icon: <FaHome />, path: '/', roles: ['visitor', 'subscriber', 'organizer', 'admin'] },
      { text: 'Events', icon: <FaCalendarAlt />, path: '/events', roles: ['visitor', 'subscriber', 'organizer', 'admin'] }
    ];

    if (user) {
      items.push(
        { text: 'Dashboard', icon: <FaChartBar />, path: '/dashboard', roles: ['subscriber', 'organizer', 'admin'] },
        { text: 'Profile', icon: <FaUser />, path: '/profile', roles: ['subscriber', 'organizer', 'admin'] }
      );

      if (user.role === 'organizer' || user.role === 'admin') {
        items.push(
          { text: 'Create Event', icon: <FaPlus />, path: '/events/create', roles: ['organizer', 'admin'] }
        );
      }
    }

    return items.filter(item =>
      !user ? item.roles.includes('visitor') : item.roles.includes(user.role)
    );
  };

  const menuItems = getMenuItems();

  const drawer = (
    <div className="drawer-container" role="presentation">
      <ul className="drawer-list">
        {menuItems.map((item) => (
          <li
            key={item.text}
            className={`drawer-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <Link to={item.path} onClick={() => setMobileOpen(false)}>
              <span className="item-icon">{item.icon}</span>
              <span className="item-text">{item.text}</span>
            </Link>
          </li>
        ))}
        {!user && (
          <li className="drawer-item">
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <span className="item-icon"><FaSignInAlt /></span>
              <span className="item-text">Login</span>
            </Link>
          </li>
        )}
        {user && (
          <li className="drawer-item" onClick={handleLogout}>
            <span className="item-icon"><FaSignOutAlt /></span>
            <span className="item-text">Logout</span>
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <>
      <header className="app-bar">
        <div className="toolbar">
          <button
            className="mobile-menu-button"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <FaBars />
          </button>

          <h1 className="app-title">
            <Link to="/">EventPro</Link>
          </h1>

          <div className="desktop-menu">
            {menuItems.map((item) => (
              <Link
                key={item.text}
                to={item.path}
                className={`desktop-menu-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="item-icon">{item.icon}</span>
                {item.text}
              </Link>
            ))}
          </div>

          <div className="user-section">
            {user ? (
              <>
                <button
                  className="user-avatar-button"
                  aria-label="account of current user"
                  onClick={handleProfileMenuOpen}
                >
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>
                {anchorEl && (
                  <div className="profile-menu">
                    <div className="menu-item" onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                      <span className="menu-icon"><FaUser /></span> Profile
                    </div>
                    <div className="menu-item" onClick={handleLogout}>
                      <span className="menu-icon"><FaSignOutAlt /></span> Logout
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="login-button">
                <span className="item-icon"><FaSignInAlt /></span> Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="drawer-backdrop" onClick={handleDrawerToggle}></div>
        {drawer}
      </div>
    </>
  );
};

export default Navigation;