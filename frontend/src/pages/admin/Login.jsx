// frontend/src/pages/admin/Login.jsx - Admin login page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const { data } = await login({ email, password });
      
      // Check if user is admin
      if (!data.isAdmin) {
        setError('Bu işlem için yetkiniz bulunmamaktadır.');
        setLoading(false);
        return;
      }
      
      // Store user data and token in context
      authLogin(data, data.token);
      
      // Redirect to admin dashboard
      navigate('/admin');
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <img 
        src="/assets/logo.png" 
        alt="Küçükçekmece Belediyesi Logo" 
        className="admin-login-logo" 
      />
      <h1 className="text-center mb-4">Yönetim Paneli</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">E-posta</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Şifre</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-100" 
          disabled={loading}
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
};

export default Login;