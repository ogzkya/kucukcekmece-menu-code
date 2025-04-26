// frontend/src/pages/admin/RestaurantEdit.jsx - Edit restaurant page
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getRestaurantById, updateRestaurant } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import RestaurantForm from '../../components/admin/RestaurantForm';
import Loader from '../../components/common/Loader';

const RestaurantEdit = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // If redirected with form data, use it
  const formDataFromRedirect = location.state?.formData;

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const { data } = await getRestaurantById(id);
        setRestaurant(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        setError('Tesis yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError('');
      
      await updateRestaurant(id, formData);
      
      // Redirect to restaurants list
      navigate('/admin/restaurants', { 
        state: { successMessage: 'Tesis başarıyla güncellendi' } 
      });
    } catch (error) {
      console.error('Error updating restaurant:', error);
      setError(
        error.response?.data?.message || 
        'Tesis güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout title="Tesis Düzenle">
      {error && <div className="alert alert-danger">{error}</div>}
      
      {restaurant ? (
        <RestaurantForm 
          restaurant={restaurant}
          onSubmit={handleSubmit} 
          buttonText={submitting ? 'Kaydediliyor...' : 'Güncelle'}
        />
      ) : (
        <div className="alert alert-danger">Tesis bulunamadı</div>
      )}
    </AdminLayout>
  );
};

export default RestaurantEdit;