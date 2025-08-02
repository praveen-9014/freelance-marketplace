import React, { useState } from 'react';
import { User, Mail, Lock, Briefcase, UserCheck } from 'lucide-react';

function AuthForm({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CLIENT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await onLogin(formData.email, formData.password);
      } else {
        await onRegister(formData);
      }
    } catch (error) {
      setError(error.message);
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        {/* Header */}
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <h1 className="h2 mb-0 gradient-text fw-bold">
              WorkBridge
            </h1>
          </div>
        </div>

        {/* Form */}
        <div className="card shadow">
          <div className="card-body p-4">
            <div className="mb-4">
              <h2 className="h4 fw-bold text-dark mb-2">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <User style={{ width: '1.25rem', height: '1.25rem' }} />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-control"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-medium">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Mail style={{ width: '1.25rem', height: '1.25rem' }} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Lock style={{ width: '1.25rem', height: '1.25rem' }} />
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    choose Role
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="radio"
                        name="role"
                        value="CLIENT"
                        checked={formData.role === 'CLIENT'}
                        onChange={handleChange}
                        className="btn-check"
                        id="role-client"
                      />
                      <label className="btn btn-outline-primary w-100" htmlFor="role-client">
                        <span className="fw-medium">Client</span>
                      </label>
                    </div>
                    <div className="col-6">
                      <input
                        type="radio"
                        name="role"
                        value="FREELANCER"
                        checked={formData.role === 'FREELANCER'}
                        onChange={handleChange}
                        className="btn-check"
                        id="role-freelancer"
                      />
                      <label className="btn btn-outline-primary w-100" htmlFor="role-freelancer">
                        <span className="fw-medium">Freelancer</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn gradient-bg text-white w-100 fw-semibold"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="text-muted mb-0">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="btn btn-link p-0 ms-1 text-decoration-none"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthForm;