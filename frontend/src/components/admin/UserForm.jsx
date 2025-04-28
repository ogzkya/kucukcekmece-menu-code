// frontend/src/components/admin/UserForm.jsx
import React, { useState } from 'react';

const UserForm = ({ user, onSubmit, buttonText = 'Kaydet' }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setError('İsim ve e-posta alanları gereklidir');
      return;
    }
    
    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçerli bir e-posta adresi girin');
      return;
    }
    
    // Yeni kullanıcı oluşturulurken şifre gerekli
    if (!user && !password) {
      setError('Şifre gereklidir');
      return;
    }
    
    // Şifre güncelleniyorsa doğrulama kontrol et
    if (password && password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    
    const userData = {
      name,
      email,
    };
    
    // Şifre varsa ekle
    if (password) {
      userData.password = password;
    }
    
    onSubmit(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name" className="form-label">İsim</label>
        <input
          type="text"
          id="name"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
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
        <label htmlFor="password" className="form-label">
          {user ? 'Şifre (Değiştirmek istemiyorsanız boş bırakın)' : 'Şifre'}
        </label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!user}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">Şifre Tekrar</label>
        <input
          type="password"
          id="confirmPassword"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required={!user || password !== ''}
        />
      </div>
      
      <button type="submit" className="btn btn-primary">
        {buttonText}
      </button>
    </form>
  );
};

export default UserForm;