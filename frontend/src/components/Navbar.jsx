// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { navigation } from '../constants';
import '../styles/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo"><a href={navigation[0].url}><FontAwesomeIcon icon={faHotel} style={{ color: 'white',fontSize: '28px',marginRight:'10px' }} />
        HostelMS</a></div>
      <ul>
        <li><a href={navigation[0].url}>{navigation[0].title}</a></li>
        <li><a href={navigation[1].url}>{navigation[1].title}</a></li>
        <li><a href={navigation[2].url}>{navigation[2].title}</a></li>
        <li>
          <Link to="/login" className="nav-btn">
            {navigation[3].title}
          </Link>
        </li>
        <li>
          <Link to="/signup" className="nav-btn">
            {navigation[4].title}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
