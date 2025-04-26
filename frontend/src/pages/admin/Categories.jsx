// frontend/src/pages/admin/Categories.jsx - Admin categories page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminCategories, deleteCategory } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryForm from '../../components/admin/CategoryForm';
import Loader from '../../components/common/Loader';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await getAdminCategories();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Kategoriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddNew = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteCategory(id);
        setSuccessMessage('Kategori başarıyla silindi');
        // Refresh categories list
        fetchCategories();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error deleting category:', error);
        setError('Kategori silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCategory) {
        // Update existing category
        // Handled in the edit page
      } else {
        // Create new category
        // Handled in the new page
      }
      
      // Redirect to create or edit page
      if (editingCategory) {
        navigate(`/admin/categories/edit/${editingCategory._id}`, { state: { formData } });
      } else {
        navigate('/admin/categories/new', { state: { formData } });
      }
    } catch (error) {
      console.error('Error with category form:', error);
      setError('Kategori kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout title="Kategoriler">
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p>Toplam: {categories.length} kategori</p>
        <Link to="/admin/categories/new" className="btn btn-primary">
          Yeni Kategori Ekle
        </Link>
      </div>
      
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sıra</th>
              <th>Görsel</th>
              <th>Ad</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.orderIndex}</td>
                  <td>
                    <img 
                      src={category.imageUrl} 
                      alt={category.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                    />
                  </td>
                  <td>{category.name}</td>
                  <td>
                    {category.isActive ? (
                      <span className="badge bg-success">Aktif</span>
                    ) : (
                      <span className="badge bg-danger">Pasif</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/admin/categories/edit/${category._id}`} className="btn btn-sm btn-outline">
                        Düzenle
                      </Link>
                      <button 
                        onClick={() => handleDelete(category._id)} 
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
                <td colSpan="5" className="text-center">Henüz kategori bulunmamaktadır.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Categories;