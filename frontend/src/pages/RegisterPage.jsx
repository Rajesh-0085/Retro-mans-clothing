import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, loading, authError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match. Please verify.');
      return;
    }

    const res = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    if (res.success) {
      navigate('/shop');
    } else {
      setLocalError(res.message);
    }
  };

  return (
    <div className="container py-5" style={{ minHeight: '75vh', maxWidth: '520px' }}>
      <div className="bg-white border rounded-1 p-4 p-md-5 shadow-sm">
        <div className="text-center mb-4">
          <span className="brand-logo d-block mb-1">RETRO</span>
          <span className="brand-sublogo mb-3">MEN'S CLOTHING</span>
          <h1 className="h4 fw-bold font-editorial">CREATE CLIENT ACCOUNT</h1>
          <p className="text-muted small">
            Join the RETRO archive for expedited checkout, order tracking, and private capsule previews.
          </p>
        </div>

        {(localError || authError) && (
          <div className="alert alert-danger small d-flex align-items-center gap-2 mb-4" role="alert">
            <AlertCircle size={16} />
            <span>{localError || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">FULL NAME *</label>
            <input
              type="text"
              name="name"
              className="retro-input"
              placeholder="e.g. Aarav Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">EMAIL ADDRESS *</label>
            <input
              type="email"
              name="email"
              className="retro-input"
              placeholder="aarav@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">PHONE NUMBER (FOR ORDER UPDATES)</label>
            <input
              type="tel"
              name="phone"
              className="retro-input"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">PASSWORD (MIN 6 CHARACTERS) *</label>
            <input
              type="password"
              name="password"
              className="retro-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">CONFIRM PASSWORD *</label>
            <input
              type="password"
              name="confirmPassword"
              className="retro-input"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-retro-dark w-100 py-3 mb-3 fs-6"
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'REGISTER ACCOUNT'}
          </button>
        </form>

        <div className="text-center pt-3 border-top small text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-dark fw-bold text-decoration-underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
