// frontend/src/pages/admin/Users.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAdminUsers, deleteUser } from '../../api'; // API fonksiyonları
import AdminLayout from '../../components/admin/AdminLayout'; // Admin layout
import Loader from '../../components/common/Loader'; // Yükleme göstergesi
import { useAuth } from '../../context/AuthContext'; // Yetkilendirme context'i

const Users = () => {
  // State tanımlamaları
  const [users, setUsers] = useState([]); // Başlangıçta boş dizi - ÖNEMLİ!
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [error, setError] = useState(null); // Hata mesajı
  const [successMessage, setSuccessMessage] = useState(''); // Başarı mesajı
  const navigate = useNavigate(); // Yönlendirme için
  const location = useLocation(); // Konum bilgisi (başarı mesajı için)
  const { user: currentUser } = useAuth(); // Mevcut giriş yapmış kullanıcı

  // Başarı mesajını gösterme (sayfa yönlendirmesi sonrası)
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // 3 saniye sonra başarı mesajını temizle
      const timer = setTimeout(() => {
        setSuccessMessage('');
        // State'i temizle ki sayfa yenilenince tekrar görünmesin
        navigate(location.pathname, { replace: true, state: {} });
      }, 3000);
      return () => clearTimeout(timer); // Component unmount olursa timer'ı temizle
    }
  }, [location.state, location.pathname, navigate]);

  // Kullanıcıları backend'den çeken fonksiyon
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null); // Önceki hataları temizle
      const { data } = await getAdminUsers(); // API çağrısı

      // --- HATA AYIKLAMA İÇİN EKLENDİ ---
      console.log("API Response for /api/users/admins:", data);
      // ---------------------------------

      // --- GÜVENLİK KONTROLÜ EKLENDİ ---
      // Gelen verinin bir dizi olduğundan emin ol
      if (Array.isArray(data)) {
        setUsers(data); // Veri bir diziyse state'i güncelle
      } else {
        // Eğer dizi değilse, hatayı logla ve kullanıcıya bildir
        console.error("API did not return an array for users:", data);
        setError('Kullanıcı verileri alınamadı (geçersiz format).');
        setUsers([]); // Hata durumunda state'i boş dizi yap ki .map patlamasın
      }
      // ---------------------------------

    } catch (err) { // Hata yakalama (error yerine err kullandık, yukarıdakiyle karışmasın)
      console.error('Error fetching users:', err);
      setError(
        err.response?.data?.message || // Backend'den gelen hata mesajı
        'Kullanıcılar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      );
      setUsers([]); // Hata durumunda state'i boş dizi yap
    } finally {
      setLoading(false); // Yükleme durumunu kapat
    }
  };

  // Component ilk yüklendiğinde kullanıcıları çek
  useEffect(() => {
    fetchUsers();
  }, []); // Boş dependency array, sadece bir kere çalışmasını sağlar

  // Kullanıcı silme fonksiyonu
  const handleDelete = async (id) => {
    // Kullanıcının kendisini silmesini engelle
    if (id === currentUser?._id) { // currentUser null olabilir diye kontrol eklendi
      setError('Kendi hesabınızı silemezsiniz.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        setError(null); // Önceki hataları temizle
        await deleteUser(id);
        setSuccessMessage('Kullanıcı başarıyla silindi');
        fetchUsers(); // Listeyi güncelle

        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting user:', err);
        setError(
           err.response?.data?.message ||
          'Kullanıcı silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
        );
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // Yükleniyorsa Loader göster
  if (loading) return <Loader />;

  // JSX Render
  return (
    <AdminLayout title="Admin Kullanıcıları">
      {/* Hata ve başarı mesajlarını göster */}
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0">Toplam: {users.length} kullanıcı</p>
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
            {/* users state'inin dizi olduğundan ve elemanı olduğundan emin ol */}
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => ( // map fonksiyonu burada çağrılıyor
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
                        disabled={user._id === currentUser?._id} // Kendini silme butonu pasif
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
