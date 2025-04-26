// frontend/src/pages/admin/CategoryEdit.jsx - Edit category page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getCategoryById, updateCategory } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryForm from '../../components/admin/CategoryForm';
import Loader from '../../components/common/Loader';

const CategoryEdit = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // If redirected with form data, use it
  const formDataFromRedirect = location.state?.formData;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const { data } = await getCategoryById(id);
        setCategory(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category:', error);
        setError('Kategori yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError('');
      
      await updateCategory(id, formData);
      
      // Redirect to categories list
      navigate('/admin/categories', { 
        state: { successMessage: 'Kategori başarıyla güncellendi' } 
      });
    } catch (error) {
      console.error('Error updating category:', error);
      setError(
        error.response?.data?.message || 
        'Kategori güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout title="Kategori Düzenle">
      {error && <div className="alert alert-danger">{error}</div>}
      
      {category ? (
        <CategoryForm 
          category={category}
          onSubmit={handleSubmit} 
          buttonText={submitting ? 'Kaydediliyor...' : 'Güncelle'}
        />
      ) : (
        <div className="alert alert-danger">Kategori bulunamadı</div>
      )}
    </AdminLayout>
  );
};

export default CategoryEdit;