import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, CheckCircle2, User, ArrowLeft } from 'lucide-react';

const ContactPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container-fluid px-lg-5 px-3 py-4">
      <div className="mb-3">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-retro-light btn-sm d-inline-flex align-items-center gap-1 py-1 px-3"
          title="Back to previous page"
        >
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <div className="text-center mb-5" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <span className="font-editorial text-muted-retro small d-block mb-1">
          CLIENT CONCIERGE
        </span>
        <h1 className="display-6 fw-bold mb-2">WE ARE HERE TO ASSIST YOU</h1>
        <p className="text-muted small">
          Questions regarding size measurements, custom styling advice, or order tracking? Reach out to our store concierge team.
        </p>
      </div>

      <div className="row g-4 g-lg-5 mb-5">
        {/* Contact info cards */}
        <div className="col-lg-5">
          <div className="bg-white border rounded-1 p-4 mb-4 shadow-sm">
            <h2 className="h5 fw-bold font-editorial mb-4 pb-2 border-bottom">
              STORE DETAILS
            </h2>

            <div className="d-flex align-items-start gap-3 mb-4">
              <User size={20} className="text-dark mt-1 flex-shrink-0" />
              <div>
                <div className="fw-bold small">Contact Person</div>
                <div className="text-muted small">Sarku</div>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <MapPin size={20} className="text-dark mt-1 flex-shrink-0" />
              <div>
                <div className="fw-bold small">Store & Showroom Address</div>
                <div className="text-muted small">
                  155b, Government Hospital Opposite, Perundurai, Erode, Tamil Nadu, India
                </div>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <Mail size={20} className="text-dark mt-1 flex-shrink-0" />
              <div>
                <div className="fw-bold small">Direct Client Email</div>
                <div className="text-muted small">concierge@retromens.com</div>
                <div className="text-muted small">support@retromens.com</div>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <Phone size={20} className="text-dark mt-1 flex-shrink-0" />
              <div>
                <div className="fw-bold small">Customer Support Helpline</div>
                <div className="text-muted small">+91 (80) 4567 8900 / +91 98765 43210</div>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3">
              <Clock size={20} className="text-dark mt-1 flex-shrink-0" />
              <div>
                <div className="fw-bold small">Operating Hours</div>
                <div className="text-muted small">Monday – Saturday: 10:00 AM – 8:00 PM IST</div>
                <div className="text-muted small">Sunday: 11:00 AM – 6:00 PM IST</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact inquiry form */}
        <div className="col-lg-7">
          <div className="bg-white border rounded-1 p-4 p-md-5 shadow-sm">
            <h2 className="h5 fw-bold font-editorial mb-3 pb-2 border-bottom">
              SEND AN INQUIRY
            </h2>

            {submitted ? (
              <div className="p-4 bg-light border text-center my-4">
                <CheckCircle2 size={36} className="text-success mb-2" />
                <h4 className="fw-bold mb-1">Message Received</h4>
                <p className="text-muted small mb-3">
                  Thank you for reaching out. A menswear specialist will respond to your inquiry within 4 business hours.
                </p>
                <button
                  className="btn btn-retro-outline btn-sm"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">YOUR FULL NAME *</label>
                    <input
                      type="text"
                      className="retro-input"
                      placeholder="e.g. Aarav Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      className="retro-input"
                      placeholder="e.g. aarav@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">SUBJECT / TOPIC *</label>
                  <input
                    type="text"
                    className="retro-input"
                    placeholder="e.g. Question about Denim Sizing or Order Status"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">MESSAGE / INQUIRY DETAILS *</label>
                  <textarea
                    rows={4}
                    className="retro-input"
                    placeholder="Please include order ID if referencing an existing order..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-retro-dark py-3 px-4">
                  TRANSMIT MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
