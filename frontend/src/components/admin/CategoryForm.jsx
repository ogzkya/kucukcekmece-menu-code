// frontend/src/components/admin/CategoryForm.jsx - Form veri dönüşümleri düzeltildi
import React, { useState } from 'react';
import { logFormData } from '../../api/apiWrapper';

const CategoryForm = ({ category, onSubmit, buttonText = 'Kaydet' }) => {
  const [name, setName] = useState(category?.name || '');
  const [orderIndex, setOrderIndex] = useState(category?.orderIndex || 0);
  const [isActive, setIsActive] = useState(category?.isActive !== false);
  const [facilityType, setFacilityType] = useState(category?.facilityType || 'social');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(category?.imageUrl || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Kategori adı gereklidir');
      return;
    }

    if (!category?.imageUrl && !image) {
      setError('Lütfen bir görsel seçin');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('orderIndex', orderIndex.toString()); // Sayıları string'e çevir
    formData.append('isActive', isActive.toString()); // Boolean'ları string'e çevir
    formData.append('facilityType', facilityType);
    
    if (image) {
      formData.append('image', image);
    }

    // Debug için form verilerini logla
    logFormData(formData);

    onSubmit(formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Dosya türünü kontrol et
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        setError('Lütfen geçerli bir görsel formatı seçin (JPEG, PNG, WEBP)');
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(''); // Hata varsa temizle
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name" className="form-label">Kategori Adı</label>
        <input
          type="text"
          id="name"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="facilityType" className="form-label">Tesis Türü</label>
        <select
          id="facilityType"
          className="form-control"
          value={facilityType}
          onChange={(e) => setFacilityType(e.target.value)}
        >
          <option value="social">Sosyal Tesis</option>
          <option value="retirement">Emekliler Kafeteryası</option>
        </select>
        <small className="text-muted">Bu kategori hangi tesis tipinde görüntülenecek</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="orderIndex" className="form-label">Sıralama</label>
        <input
          type="number"
          id="orderIndex"
          className="form-control"
          value={orderIndex}
          onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
        />
        <small className="text-muted">Kategorilerin sıralanma önceliği (Küçük değer daha üstte gösterilir)</small>
      </div>
      
      <div className="form-group">
        <div className="form-check">
          <input
            type="checkbox"
            id="isActive"
            className="form-check-input"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label htmlFor="isActive" className="form-check-label">Aktif</label>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="image" className="form-label">Kategori Görseli</label>
        <input
          type="file"
          id="image"
          className="form-control"
          onChange={handleImageChange}
          accept="image/jpeg,image/png,image/webp"
        />
        {imagePreview && (
          <div className="mt-2">
            <img 
              src={imagePreview} 
              alt="Önizleme" 
              style={{ maxWidth: '200px', maxHeight: '200px' }} 
            />
          </div>
        )}
      </div>
      
      <button type="submit" className="btn btn-primary">
        {buttonText}
      </button>
    </form>
  );
};

export default CategoryForm;