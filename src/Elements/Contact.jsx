import React, { useState } from "react";
import axios from "axios";
// import ReCAPTCHA from "react-google-recaptcha";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  // const [captchaToken, setCaptchaToken] = useState(null);

  // Backend API URL (Update with your deployed API)
  const API_URL = process.env.REACT_APP_API_URL || "https://risp.netlify.app/api/mail";

  // Input Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const { name, email, message } = formData;

    // Basic validation
    if (!name || !email || !message) {
      setStatus("⚠️ All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        to: email,
        subject: "Portfolio Contact",
        text: `Name: ${name}\n\nMessage: ${message}`,
      });

      console.log("✅ Message Sent:", response.data);
      setStatus("✅ Message sent successfully!");
      alert("Message Sent Successfully!");
      setFormData({ name: "", email: "", message: "" });
      // setCaptchaToken(null); // Reset reCAPTCHA if used
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setStatus("❌ Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form">
      <h2>Get in Touch</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={handleChange}
          id="name"
          name="name"
          placeholder="Enter your name"
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={handleChange}
          id="email"
          name="email"
          placeholder="Enter your email"
          required
        />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={formData.message}
          onChange={handleChange}
          name="message"
          placeholder="Enter your message"
          required
        />

        {/* Optional: Invisible reCAPTCHA v3 */}
        {/* <ReCAPTCHA
          sitekey="YOUR_RECAPTCHA_SITE_KEY"
          size="invisible"
          onChange={(token) => setCaptchaToken(token)}
        /> */}

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
}
