// frontend/src/components/admin/MenuItemForm.jsx - Tesis tipi seçimi ve kategori filtreleme eklendi
import React, { useState, useEffect } from 'react';
import { getAdminCategories } from '../../api';

const MenuItemForm = ({ menuItem, onSubmit, buttonText = 'Kaydet' }) => {
  const [name, setName] = useState(menuItem?.name || '');
  const [description, setDescription] = useState(menuItem?.description || '');
  const [price, setPrice] = useState(menuItem?.price || 0);
  const [weight, setWeight] = useState(menuItem?.weight || '');
  const [category, setCategory] = useState(menuItem?.category || '');
  const [allergens, setAllergens] = useState(menuItem?.allergens?.join(', ') || '');
  const [orderIndex, setOrderIndex] = useState(menuItem?.orderIndex || 0);
  const [isActive, setIsActive] = useState(menuItem?.isActive !== false);
  const [facilityType, setFacilityType] = useState(menuItem?.facilityType || 'social');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(menuItem?.imageUrl || '');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data } = await getAdminCategories();
        setCategories(data);
        
        // İlk yüklemede tesis tipine göre kategorileri filtrele
        filterCategoriesByFacilityType(data, facilityType);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Kategoriler yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    fetchCategories();
  }, [facilityType]);
  
  // Tesis tipi değiştiğinde kategorileri filtrele
  const filterCategoriesByFacilityType = (categoriesData, type) => {
    const filtered = categoriesData.filter(cat => cat.facilityType === type);
    setFilteredCategories(filtered);
    
    // Eğer seçili kategori varsa ve yeni tesis tipine uygun değilse kategoriyi sıfırla
    if (category) {
      const isCategoryValid = filtered.some(cat => cat._id === category);
      if (!isCategoryValid) {
        setCategory('');
      }
    }
  };
  
  // Tesis tipi değiştiğinde
  const handleFacilityTypeChange = (e) => {
    const newType = e.target.value;
    setFacilityType(newType);
    filterCategoriesByFacilityType(categories, newType);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Menü öğesi adı gereklidir');
      return;
    }

    if (!category) {
      setError('Lütfen bir kategori seçin');
      return;
    }

    if (!menuItem?.imageUrl && !image) {
      setError('Lütfen bir görsel seçin');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('weight', weight);
    formData.append('category', category);
    formData.append('allergens', allergens);
    formData.append('orderIndex', orderIndex);
    formData.append('isActive', isActive);
    formData.append('facilityType', facilityType);
    
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
        <label htmlFor="name" className="form-label">Ürün Adı</label>
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
        <label htmlFor="price" className="form-label">Fiyat (₺)</label>
        <input
          type="number"
          id="price"
          className="form-control"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          step="0.01"
          min="0"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="weight" className="form-label">Miktar/Ağırlık (ör: 250g, 300ml)</label>
        <input
          type="text"
          id="weight"
          className="form-control"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="facilityType" className="form-label">Tesis Türü</label>
        <select
          id="facilityType"
          className="form-control"
          value={facilityType}
          onChange={handleFacilityTypeChange}
        >
          <option value="social">Sosyal Tesis</option>
          <option value="retirement">Emekliler Kafeteryası</option>
        </select>
        <small className="text-muted">Menü öğesinin ait olduğu tesis türü</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="category" className="form-label">Kategori</label>
        <select
          id="category"
          className="form-control"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          disabled={loading || filteredCategories.length === 0}
        >
          <option value="">Kategori Seçin</option>
          {filteredCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {filteredCategories.length === 0 && (
          <small className="text-danger">
            Bu tesis türü için kategori bulunmamaktadır. Önce kategori eklemelisiniz.
          </small>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="allergens" className="form-label">Alerjenler (virgülle ayırın)</label>
        <input
          type="text"
          id="allergens"
          className="form-control"
          value={allergens}
          onChange={(e) => setAllergens(e.target.value)}
          placeholder="Gluten, Süt, Yumurta, vb."
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
        <small className="text-muted">Menü öğelerinin sıralanma önceliği (Küçük değer daha üstte gösterilir)</small>
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
        <label htmlFor="image" className="form-label">Ürün Görseli</label>
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

export default MenuItemForm;