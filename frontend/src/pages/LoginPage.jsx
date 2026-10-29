import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, loading, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const res = await login(email, password);
    if (res.success) {
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setLocalError(res.message);
    }
  };

  return (
    <div className="container py-5" style={{ minHeight: '75vh', maxWidth: '480px' }}>
      <div className="bg-white border rounded-1 p-4 p-md-5 shadow-sm">
        <div className="text-center mb-4">
          <span className="brand-logo d-block mb-1">RETRO</span>
          <span className="brand-sublogo mb-3">MEN'S CLOTHING</span>
          <h1 className="h4 fw-bold font-editorial">SIGN IN TO YOUR ACCOUNT</h1>
          <p className="text-muted small">
            Enter your credentials to manage orders and access archival releases.
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
            <label className="form-label small fw-semibold">EMAIL ADDRESS</label>
            <input
              type="email"
              className="retro-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label small fw-semibold mb-0">PASSWORD</label>
            </div>
            <input
              type="password"
              className="retro-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-retro-dark w-100 py-3 mb-3 fs-6"
            disabled={loading}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div className="text-center pt-3 border-top small text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-dark fw-bold text-decoration-underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
