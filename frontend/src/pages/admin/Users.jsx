// frontend/src/pages/admin/Users.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAdminUsers, deleteUser } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // 3 saniye sonra başarı mesajını temizle
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  }, [location.state]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await getAdminUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Kullanıcılar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    // Kullanıcının kendisini silmesini engelle
    if (id === currentUser._id) {
      setError('Kendi hesabınızı silemezsiniz.');
      // 3 saniye sonra hata mesajını temizle
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }

    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteUser(id);
        setSuccessMessage('Kullanıcı başarıyla silindi');
        // Kullanıcı listesini güncelle
        fetchUsers();
        
        // 3 saniye sonra başarı mesajını temizle
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Kullanıcı silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        // 3 saniye sonra hata mesajını temizle
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout title="Admin Kullanıcıları">
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p>Toplam: {users.length} kullanıcı</p>
        <Link to="/admin/users/new" className="btn btn-primary">
          Yeni Admin Ekle
        </Link>
      </div>
      
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>İsim</th>
              <th>E-posta</th>
              <th>Admin</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.isAdmin ? (
                      <span className="badge bg-success">Evet</span>
                    ) : (
                      <span className="badge bg-danger">Hayır</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/admin/users/edit/${user._id}`} className="btn btn-sm btn-outline">
                        Düzenle
                      </Link>
                      <button 
                        onClick={() => handleDelete(user._id)} 
                        className="btn btn-sm btn-danger"
                        disabled={user._id === currentUser._id}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">Henüz admin kullanıcısı bulunmamaktadır.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Users;