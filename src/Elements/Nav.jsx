import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assests/img/Untitled design.PNG';
import './index.css';

export default function Nav() {
  return (
    <div className="nav">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/booking"> Book 1/1 Session</Link>
        <Link to="/roadmap">Roadmap</Link>
        <Link to="/admin">Admin</Link>
        <Link to ="/codingprofiles">Social Profiles</Link>
      </div>
    </div>
  );
}
