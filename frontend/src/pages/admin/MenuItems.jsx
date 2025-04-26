// frontend/src/pages/admin/MenuItems.jsx - Admin menu items page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminMenuItems, deleteMenuItem, getAdminCategories } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import MenuItemForm from '../../components/admin/MenuItemForm';
import Loader from '../../components/common/Loader';

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuItemsRes, categoriesRes] = await Promise.all([
        getAdminMenuItems(),
        getAdminCategories()
      ]);
      
      // Create a map of category ID to name for easy lookup
      const categoryMap = {};
      categoriesRes.data.forEach(category => {
        categoryMap[category._id] = category.name;
      });
      
      setMenuItems(menuItemsRes.data);
      setCategories(categoryMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddNew = () => {
    setEditingMenuItem(null);
    setShowForm(true);
  };

  const handleEdit = (menuItem) => {
    setEditingMenuItem(menuItem);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu menü öğesini silmek istediğinizden emin misiniz?')) {
      try {
        await deleteMenuItem(id);
        setSuccessMessage('Menü öğesi başarıyla silindi');
        // Refresh menu items list
        fetchData();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error deleting menu item:', error);
        setError('Menü öğesi silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingMenuItem(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingMenuItem) {
        // Update existing menu item
        // Handled in the edit page
      } else {
        // Create new menu item
        // Handled in the new page
      }
      
      // Redirect to create or edit page
      if (editingMenuItem) {
        navigate(`/admin/menu-items/edit/${editingMenuItem._id}`, { state: { formData } });
      } else {
        navigate('/admin/menu-items/new', { state: { formData } });
      }
    } catch (error) {
      console.error('Error with menu item form:', error);
      setError('Menü öğesi kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout title="Menü Öğeleri">
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p>Toplam: {menuItems.length} menü öğesi</p>
        <Link to="/admin/menu-items/new" className="btn btn-primary">
          Yeni Menü Öğesi Ekle
        </Link>
      </div>
      
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sıra</th>
              <th>Görsel</th>
              <th>Ad</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.length > 0 ? (
              menuItems.map((menuItem) => (
                <tr key={menuItem._id}>
                  <td>{menuItem.orderIndex}</td>
                  <td>
                    <img 
                      src={menuItem.imageUrl} 
                      alt={menuItem.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                    />
                  </td>
                  <td>{menuItem.name}</td>
                  <td>{categories[menuItem.category] || 'Kategori Bulunamadı'}</td>
                  <td>{menuItem.price > 0 ? `${menuItem.price.toFixed(2)} ₺` : '-'}</td>
                  <td>
                    {menuItem.isActive ? (
                      <span className="badge bg-success">Aktif</span>
                    ) : (
                      <span className="badge bg-danger">Pasif</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/admin/menu-items/edit/${menuItem._id}`} className="btn btn-sm btn-outline">
                        Düzenle
                      </Link>
                      <button 
                        onClick={() => handleDelete(menuItem._id)} 
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
                <td colSpan="7" className="text-center">Henüz menü öğesi bulunmamaktadır.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default MenuItems;
