// frontend/src/components/admin/CategoryForm.jsx
import React, { useState } from 'react';

const CategoryForm = ({ category, onSubmit, buttonText = 'Kaydet' }) => {
  const [name, setName] = useState(category?.name || '');
  const [orderIndex, setOrderIndex] = useState(category?.orderIndex || 0);
  const [isActive, setIsActive] = useState(category?.isActive !== false);
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
    formData.append('orderIndex', orderIndex);
    formData.append('isActive', isActive);
    
    if (image) {
      formData.append('image', image);
    }

    onSubmit(formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
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
        <label htmlFor="orderIndex" className="form-label">Sıralama</label>
        <input
          type="number"
          id="orderIndex"
          className="form-control"
          value={orderIndex}
          onChange={(e) => setOrderIndex(parseInt(e.target.value))}
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
          accept="image/*"
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