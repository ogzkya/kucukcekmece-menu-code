// frontend/src/pages/admin/MenuItemNew.jsx - New menu item page
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createMenuItem } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import MenuItemForm from '../../components/admin/MenuItemForm';

const MenuItemNew = () => {
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
      
      await createMenuItem(formData);
      
      // Redirect to menu items list
      navigate('/admin/menu-items', { 
        state: { successMessage: 'Menü öğesi başarıyla oluşturuldu' } 
      });
    } catch (error) {
      console.error('Error creating menu item:', error);
      setError(
        error.response?.data?.message || 
        'Menü öğesi oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
      );
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Yeni Menü Öğesi Ekle">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <MenuItemForm 
        onSubmit={handleSubmit} 
        buttonText={loading ? 'Kaydediliyor...' : 'Kaydet'}
      />
    </AdminLayout>
  );
};

export default MenuItemNew;