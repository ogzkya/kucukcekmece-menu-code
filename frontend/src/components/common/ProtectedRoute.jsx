// frontend/src/components/common/ProtectedRoute.jsx - Optimize edilmiş
import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = memo(({ children }) => {
  const { user, loading } = useAuth();

  // Yükleniyor durumunda Loader göster
  if (loading) {
    return <Loader text="Kimlik doğrulanıyor..." />;
  }

  // Kullanıcı yoksa veya admin değilse login sayfasına yönlendir
  if (!user || !user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Yetkilendirme başarılı, children'ı render et
  return children;
});

// DisplayName debugging için
ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;