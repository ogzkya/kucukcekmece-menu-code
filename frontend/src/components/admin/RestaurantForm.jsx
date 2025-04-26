// frontend/src/components/admin/RestaurantForm.jsx
import React, { useState } from 'react';

const RestaurantForm = ({ restaurant, onSubmit, buttonText = 'Kaydet' }) => {
  const [name, setName] = useState(restaurant?.name || '');
  const [slug, setSlug] = useState(restaurant?.slug || '');
  const [address, setAddress] = useState(restaurant?.address || '');
  const [description, setDescription] = useState(restaurant?.description || '');
  const [isActive, setIsActive] = useState(restaurant?.isActive !== false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(restaurant?.imageUrl || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tesis adı gereklidir');
      return;
    }

    if (!address.trim()) {
      setError('Adres gereklidir');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug); // Slug alanını ekledik
    formData.append('address', address);
    formData.append('description', description);
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
        <label htmlFor="name" className="form-label">Tesis Adı</label>
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
        <label htmlFor="slug" className="form-label">Slug (URL Yolu)</label>
        <input
          type="text"
          id="slug"
          className="form-control"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Otomatik oluşturulacak, boş bırakabilirsiniz"
        />
        <small className="text-muted">Boş bırakılırsa otomatik oluşturulur. Örn: "belediye-yani", "halkali"</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="address" className="form-label">Adres</label>
        <input
          type="text"
          id="address"
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description" className="form-label">Açıklama</label>
        <textarea
          id="description"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        ></textarea>
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
        <label htmlFor="image" className="form-label">Tesis Görseli (Opsiyonel)</label>
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

export default RestaurantForm;