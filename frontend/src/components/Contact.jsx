import React from 'react';
import '../styles/contact.css';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <section className="contact-section">
      <div className="contact-wrapper">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>We’re here to assist you with any questions or concerns you may have.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-left">
            <div className="info-block">
              <h3>📍 Address</h3>
              <p>
                MSR Nagar<br />
                Mattikere Bangalore<br />
                Karnataka
              </p>
            </div>

            <div className="info-block">
              <h3>📞 Phone</h3>
              <p>
                +91 9099019121<br />
                +91 9876543251
              </p>
            </div>

            <div className="info-block">
              <h3>📧 Email</h3>
              <p>
                hostelinfo@msrit.edu<br />
                hostelsupport@msrit.edu
              </p>
            </div>

            <div className="info-block">
              <h3>🕒 Office Hours</h3>
              <p>
                Mon - Fri: 9 AM - 6 PM<br />
                Sat: 10 AM - 4 PM<br />
                Sun: Closed
              </p>
            </div>
          </div>

          <div className="contact-right">
            <form className="form" onSubmit={handleSubmit}>
              <h2>Send a Message</h2>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <input type="text" placeholder="Subject" required />
              <textarea rows="5" placeholder="Your Message" required />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
