// frontend/src/pages/admin/UserNew.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdminUser } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import UserForm from '../../components/admin/UserForm';

const UserNew = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (userData) => {
    try {
      setLoading(true);
      setError('');
      
      await createAdminUser(userData);
      
      // Redirect to users list
      navigate('/admin/users', { 
        state: { successMessage: 'Admin kullanıcı başarıyla oluşturuldu' } 
      });
    } catch (error) {
      console.error('Error creating user:', error);
      setError(
        error.response?.data?.message || 
        'Kullanıcı oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
      );
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Yeni Admin Kullanıcı Ekle">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <UserForm 
        onSubmit={handleSubmit} 
        buttonText={loading ? 'Kaydediliyor...' : 'Kaydet'}
      />
    </AdminLayout>
  );
};

export default UserNew;