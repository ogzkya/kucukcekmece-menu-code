// frontend/src/pages/admin/CategoryNew.jsx - New category page
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createCategory } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryForm from '../../components/admin/CategoryForm';

const CategoryNew = () => {
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
      
      await createCategory(formData);
      
      // Redirect to categories list
      navigate('/admin/categories', { 
        state: { successMessage: 'Kategori başarıyla oluşturuldu' } 
      });
    } catch (error) {
      console.error('Error creating category:', error);
      setError(
        error.response?.data?.message || 
        'Kategori oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
      );
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Yeni Kategori Ekle">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <CategoryForm 
        onSubmit={handleSubmit} 
        buttonText={loading ? 'Kaydediliyor...' : 'Kaydet'}
      />
    </AdminLayout>
  );
};

export default CategoryNew;
