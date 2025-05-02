// frontend/src/components/admin/RestaurantForm.jsx - Form verisi dönüşümleri düzeltildi
import React, { useState } from 'react';
import { logFormData } from '../../api/apiWrapper';

const RestaurantForm = ({ restaurant, onSubmit, buttonText = 'Kaydet' }) => {
  const [name, setName] = useState(restaurant?.name || '');
  const [slug, setSlug] = useState(restaurant?.slug || '');
  const [address, setAddress] = useState(restaurant?.address || '');
  const [phone, setPhone] = useState(restaurant?.phone || '');
  const [description, setDescription] = useState(restaurant?.description || '');
  const [isActive, setIsActive] = useState(restaurant?.isActive !== false);
  const [facilityType, setFacilityType] = useState(restaurant?.facilityType || 'social');
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
    formData.append('slug', slug);
    formData.append('address', address);
    formData.append('phone', phone);
    formData.append('description', description);
    formData.append('isActive', isActive.toString());
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

  // Slug oluşturucu - Türkçe karakterleri değiştirir ve boşlukları tire ile değiştirir
  const generateSlug = () => {
    if (!name) return;
    
    // Türkçe karakterleri değiştir
    let slugText = name.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/Ğ/g, 'G')
      .replace(/Ü/g, 'U')
      .replace(/Ş/g, 'S')
      .replace(/İ/g, 'I')
      .replace(/Ö/g, 'O')
      .replace(/Ç/g, 'C');
    
    // Boşlukları ve özel karakterleri tire ile değiştir
    slugText = slugText.replace(/\s+/g, '-')           // Boşlukları tire ile değiştir
              .replace(/[^\w\-]+/g, '')        // Alfanümerik olmayan karakterleri kaldır
              .replace(/\-\-+/g, '-')          // Birden fazla tireyi tek tire yap
              .replace(/^-+/, '')              // Baştaki tireleri kaldır
              .replace(/-+$/, '');             // Sondaki tireleri kaldır
    
    setSlug(slugText);
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
          onBlur={generateSlug}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="slug" className="form-label">Slug (URL Yolu)</label>
        <div className="input-group">
          <input
            type="text"
            id="slug"
            className="form-control"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Otomatik oluşturulacak, boş bırakabilirsiniz"
          />
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={generateSlug}
          >
            Oluştur
          </button>
        </div>
        <small className="text-muted">Boş bırakılırsa otomatik oluşturulur. Örn: "belediye-yani", "halkali"</small>
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
        <label htmlFor="phone" className="form-label">Telefon Numarası</label>
        <input
          type="text"
          id="phone"
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Örn: 0212 123 45 67"
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

export default RestaurantForm;