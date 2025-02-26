import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Booking() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState(false);
  const [paymentCross, setPaymentCross] = useState(false);

  const sessions = [
    { id: 1, title: "Cybersecurity Career Guidance & Roadmap", duration: "30 mins", price: 1599 },
    { id: 2, title: "1:1 Mentorship for Beginners", duration: "20 mins", price: 999 },
    { id: 3, title: "Ethical Hacking & Red Teaming Basics", duration: "35 mins", price: 1799 },
    { id: 4, title: "Resume & LinkedIn Profile Review", duration: "25 mins", price: 1099 },
    { id: 5, title: "Advanced Cybersecurity Mentorship", duration: "60 mins", price: 2999 },
  ];

  const minDate = new Date();
  minDate.setHours(minDate.getHours() + 24);

  const filterTime = (time) => {
    const selectedDay = selectedDate ? selectedDate.getDay() : new Date().getDay();
    const selectedHour = time.getHours();
    return (selectedDay >= 1 && selectedDay <= 5 && selectedHour >= 21 && selectedHour < 23) ||
      (selectedDay === 6 || selectedDay === 0 && selectedHour >= 13 && selectedHour < 17);
  };

  const handleSelectSession = (session) => {
    setSelectedSession(session);
    setFormVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      setStatus('Please select a valid date and time.');
      return;
    }

    setLoading(true);
    setStatus('');
    const selectedDateUTC = new Date(selectedDate).toISOString();

    try {
      
      const response = await axios.post('https://risp.netlify.app/api/bookings', {
        name,
        email,
        selectedSession: selectedSession.title,
        duration: selectedSession.duration,
        price: selectedSession.price,
        selectedDate: selectedDateUTC,
        paymentId,
      });

      setStatus('Booking confirmed! Check your email for confirmation.');
      alert('Booking confirmed!');
      setName('');
      setEmail('');
      setSelectedDate(null);
      setSelectedSession(null);
      setFormVisible(false);
      setPaymentCross(true);
    } catch (error) {
      setStatus('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <h2>Select a 1-on-1 Cybersecurity Session</h2>

      <div className="session-list">
        {sessions.map((session) => (
          <div key={session.id} className="session-box" onClick={() => handleSelectSession(session)}>
            <h3>{session.title}</h3>
            <p><strong>Duration:</strong> {session.duration}</p>
            <p><strong>Price:</strong> ₹{session.price}</p>
          </div>
        ))}
      </div>

      {formVisible && selectedSession && (
        <div className="booking-form slide-down">
          <button className="close-btn" onClick={() => setFormVisible(false)}>✖</button>
          <h3>You Selected: {selectedSession.title}</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            setPayment(true);
          }}>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Select Date & Time:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showTimeSelect
              filterTime={filterTime}
              minDate={minDate}
              dateFormat="MMMM d, yyyy h:mm aa"
              required
            />
            <button type="submit">Proceed to Payment</button>
          </form>
        </div>
      )}

      {payment && (
        <div className="booking-form slide-down">
          {paymentCross && <button className="close-btn" onClick={() => setPayment(false)}>✖</button>}
          <h1>Scan the QR-Code to Pay</h1>
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" />
          <form onSubmit={handleSubmit}>
            <label>Payment ID:</label>
            <input type="text" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} required />
            <button type="submit">Confirm Payment</button>
          </form>
          {status && <p className="status-message">{status}</p>}
        </div>
      )}
    </div>
  );
}
