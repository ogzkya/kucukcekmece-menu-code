// frontend/src/pages/admin/Restaurants.jsx - Admin restaurants page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminRestaurants, deleteRestaurant } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import RestaurantForm from '../../components/admin/RestaurantForm';
import Loader from '../../components/common/Loader';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const { data } = await getAdminRestaurants();
      setRestaurants(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Tesisler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAddNew = () => {
    setEditingRestaurant(null);
    setShowForm(true);
  };

  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu tesisi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteRestaurant(id);
        setSuccessMessage('Tesis başarıyla silindi');
        // Refresh restaurants list
        fetchRestaurants();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        setError('Tesis silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingRestaurant(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingRestaurant) {
        // Update existing restaurant
        // Handled in the edit page
      } else {
        // Create new restaurant
        // Handled in the new page
      }
      
      // Redirect to create or edit page
      if (editingRestaurant) {
        navigate(`/admin/restaurants/edit/${editingRestaurant._id}`, { state: { formData } });
      } else {
        navigate('/admin/restaurants/new', { state: { formData } });
      }
    } catch (error) {
      console.error('Error with restaurant form:', error);
      setError('Tesis kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout title="Tesisler">
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p>Toplam: {restaurants.length} tesis</p>
        <Link to="/admin/restaurants/new" className="btn btn-primary">
          Yeni Tesis Ekle
        </Link>
      </div>
      
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Adres</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <tr key={restaurant._id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.address}</td>
                  <td>
                    {restaurant.isActive ? (
                      <span className="badge bg-success">Aktif</span>
                    ) : (
                      <span className="badge bg-danger">Pasif</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/admin/restaurants/edit/${restaurant._id}`} className="btn btn-sm btn-outline">
                        Düzenle
                      </Link>
                      <button 
                        onClick={() => handleDelete(restaurant._id)} 
                        className="btn btn-sm btn-danger"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Henüz tesis bulunmamaktadır.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Restaurants;