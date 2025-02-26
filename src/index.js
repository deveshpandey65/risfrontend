import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import About from './Elements/About';
import Projects from './Elements/Projects';
import ProjectDesc from './Elements/ProjectDesc';
import Contact from './Elements/Contact';
import Nav from './Elements/Nav'; 
import Coding from './Elements/Coding';
import Booking from './Elements/Booking';
import RoadMap from './Elements/RoadMap';
import AdminPanel from './Admin/Admin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Nav />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/roadmap" element={<RoadMap />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projectdesc/:projectName" element={<ProjectDesc />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/codingprofiles' element={<Coding />} />
        <Route path='/admin' element={<AdminPanel/>}/>
      </Routes>
    </BrowserRouter>
);
