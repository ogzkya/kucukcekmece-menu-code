// frontend/src/pages/admin/UserEdit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import UserForm from '../../components/admin/UserForm';
import Loader from '../../components/common/Loader';

const UserEdit = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await getUserById(id);
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Kullanıcı bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (userData) => {
    try {
      setSubmitting(true);
      setError('');
      
      await updateUser(id, userData);
      
      // Redirect to users list
      navigate('/admin/users', { 
        state: { successMessage: 'Kullanıcı başarıyla güncellendi' } 
      });
    } catch (error) {
      console.error('Error updating user:', error);
      setError(
        error.response?.data?.message || 
        'Kullanıcı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout title="Admin Kullanıcı Düzenle">
      {error && <div className="alert alert-danger">{error}</div>}
      
      {user ? (
        <UserForm 
          user={user}
          onSubmit={handleSubmit} 
          buttonText={submitting ? 'Kaydediliyor...' : 'Güncelle'}
        />
      ) : (
        <div className="alert alert-danger">Kullanıcı bulunamadı</div>
      )}
    </AdminLayout>
  );
};

export default UserEdit;