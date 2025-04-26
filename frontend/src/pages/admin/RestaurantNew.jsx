// frontend/src/pages/admin/RestaurantNew.jsx - New restaurant page
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createRestaurant } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import RestaurantForm from '../../components/admin/RestaurantForm';

const RestaurantNew = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // If redirected with form data, use it
  const formDataFromRedirect = location.state?.formData;

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      await createRestaurant(formData);
      
      // Redirect to restaurants list
      navigate('/admin/restaurants', { 
        state: { successMessage: 'Tesis başarıyla oluşturuldu' } 
      });
    } catch (error) {
      console.error('Error creating restaurant:', error);
      setError(
        error.response?.data?.message || 
        'Tesis oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
      );
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Yeni Tesis Ekle">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <RestaurantForm 
        onSubmit={handleSubmit} 
        buttonText={loading ? 'Kaydediliyor...' : 'Kaydet'}
      />
    </AdminLayout>
  );
};

export default RestaurantNew;