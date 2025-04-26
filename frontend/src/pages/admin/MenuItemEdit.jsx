// frontend/src/pages/admin/MenuItemEdit.jsx - Edit menu item page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getMenuItemById, updateMenuItem } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import MenuItemForm from '../../components/admin/MenuItemForm';
import Loader from '../../components/common/Loader';

const MenuItemEdit = () => {
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // If redirected with form data, use it
  const formDataFromRedirect = location.state?.formData;

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        const { data } = await getMenuItemById(id);
        setMenuItem(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu item:', error);
        setError('Menü öğesi yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError('');
      
      await updateMenuItem(id, formData);
      
      // Redirect to menu items list
      navigate('/admin/menu-items', { 
        state: { successMessage: 'Menü öğesi başarıyla güncellendi' } 
      });
    } catch (error) {
      console.error('Error updating menu item:', error);
      setError(
        error.response?.data?.message || 
        'Menü öğesi güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout title="Menü Öğesi Düzenle">
      {error && <div className="alert alert-danger">{error}</div>}
      
      {menuItem ? (
        <MenuItemForm 
          menuItem={menuItem}
          onSubmit={handleSubmit} 
          buttonText={submitting ? 'Kaydediliyor...' : 'Güncelle'}
        />
      ) : (
        <div className="alert alert-danger">Menü öğesi bulunamadı</div>
      )}
    </AdminLayout>
  );
};

export default MenuItemEdit;
