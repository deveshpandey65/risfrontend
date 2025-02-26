import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPanel() {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirmedBookings, setConfirmedBookings] = useState([]);
    const [meetLink, setMeetLink] = useState("");

    useEffect(() => {
        fetchBookings();
        fetchConfirmedBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('https://risp.netlify.app/api/bookings');
            setBookings(response.data);
            
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const fetchConfirmedBookings = async () => {
        try {
            const response = await axios.get('https://risp.netlify.app/api/bookings/confirmed/');
            setConfirmedBookings(response.data.bookings);
            console.log(response)
        } catch (error) {
            console.error('Error fetching confirmed bookings:', error);
        }
    };

    const handleConfirmPayment = async (bookingId) => {
        setLoading(true);
        try {
            await axios.post(`https://risp.netlify.app/api/bookings/confirm/${bookingId}`);
            alert('Payment confirmed and email sent!');
            fetchBookings();
            fetchConfirmedBookings();
        } catch (error) {
            console.error('Error confirming payment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMeetLink = async () => {
        if (!meetLink) {
            alert("Please enter a valid meet link.");
            return;
        }

        setLoading(true);
        try {
            await axios.post('https://risp.netlify.app/api/meetlink', {
                bookingId: selectedBooking._id,
                meetLink
            });
            alert('Meet link sent successfully!');
            setMeetLink("");
            setSelectedBooking(null);
        } catch (error) {
            console.error('Error sending meet link:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <h2>Admin Panel - Booked Slots</h2>

            {/* Pending Bookings */}
            <div className="pending-bookings">
                <h3>Pending Bookings</h3>
                <div className="bookings-list">
                    {bookings.filter(b => b.status === "Pending").map((booking) => (
                        <div key={booking._id} className="booking-card" onClick={() => setSelectedBooking(booking)}>
                            <h4>{booking.name}</h4>
                            <p>{booking.email}</p>
                            <p>Session: {booking.selectedSession.title}</p>
                            <p>Date & Time: {new Date(booking.selectedDate).toLocaleString()}</p>
                            <p>💳 Payment Status: ❌ Pending</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Confirmed Bookings */}
            {
                confirmedBookings ? <div className="confirmed-bookings">
                    <h3>Confirmed Slots</h3>
                    <div className="bookings-list">
                        {confirmedBookings.map((booking) => (
                            <div key={booking._id} className="booking-card confirmed" onClick={() => setSelectedBooking(booking)}>
                                <h4>{booking.name}</h4>
                                <p>{booking.email}</p>
                                <p>Session: {booking.selectedSession.title}</p>
                                <p>Date & Time: {new Date(booking.selectedDate).toLocaleString()}</p>
                                <p>💳 Payment Status: ✅ Confirmed</p>
                            </div>
                        ))}
                    </div>
                </div>: null
            }

            {/* Booking Details & Meet Link Form */}
            {selectedBooking && (
                <div className="booking-details">
                    <h3>Booking Details</h3>
                    <p><strong>Name:</strong> {selectedBooking.name}</p>
                    <p><strong>Email:</strong> {selectedBooking.email}</p>
                    <p><strong>Session:</strong> {selectedBooking.selectedSession.title}</p>
                    <p><strong>Date & Time:</strong> {new Date(selectedBooking.selectedDate).toLocaleString()}</p>
                    <p><strong>Payment ID:</strong> {selectedBooking.paymentId}</p>

                    {selectedBooking.status === "Pending" ? (
                        <button onClick={() => handleConfirmPayment(selectedBooking._id)} disabled={loading}>
                            {loading ? 'Processing...' : 'Confirm Payment'}
                        </button>
                    ) : (
                        <div className="meet-link-form">
                            <h4>Send Meet Link</h4>
                            <input
                                type="text"
                                placeholder="Enter meet link"
                                value={meetLink}
                                onChange={(e) => setMeetLink(e.target.value)}
                            />
                            <button onClick={handleSendMeetLink} disabled={loading}>
                                {loading ? 'Sending...' : 'Send Meet Link'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
