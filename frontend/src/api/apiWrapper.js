// frontend/src/api/apiWrapper.js - Geliştirilmiş hata yakalama
/**
 * API isteklerini güvenli şekilde yapmak için hata yakalama ile birlikte kullanılacak yardımcı fonksiyon
 * @param {Function} apiFunc - Çağrılacak API fonksiyonu
 * @param {any} args - API fonksiyonuna geçirilecek parametreler
 * @returns {Promise<{data: any, error: Error}>} - İşlem sonucu
 */
export const safeApiCall = async (apiFunc, ...args) => {
  try {
    const response = await apiFunc(...args);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('API çağrısı sırasında hata:', error);
    
    // Hata mesajını belirle
    let errorMessage = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    let statusCode = error.response?.status || 500;
    
    // Form veri gönderiminde multipart/form-data sorunlarını kontrol et
    if (error.request && !error.response) {
      errorMessage = 'Sunucu yanıt vermiyor. Ağ bağlantınızı kontrol edin.';
    } else if (error.response?.data) {
      // Backend'den gelen hata mesajını kullan
      errorMessage = error.response.data.message || errorMessage;
      // Eğer detaylı hata bilgisi varsa bunu da ekle
      if (error.response.data.details) {
        errorMessage += ': ' + error.response.data.details.join(', ');
      }
    }
    
    return { 
      data: null, 
      error: {
        message: errorMessage,
        status: statusCode,
        originalError: error
      }
    };
  }
};

/**
 * API isteklerini güvenli şekilde yapmak ve otomatik yükleme durumunu yönetmek için yardımcı fonksiyon
 * @param {Function} apiFunc - Çağrılacak API fonksiyonu
 * @param {Function} setLoading - Yükleme durumunu güncelleyecek state fonksiyonu
 * @param {Function} setError - Hata durumunu güncelleyecek state fonksiyonu
 * @param {Function} onSuccess - Başarılı olursa çalıştırılacak callback fonksiyon
 * @param {any} args - API fonksiyonuna geçirilecek parametreler
 */
export const loadData = async (apiFunc, setLoading, setError, onSuccess, ...args) => {
  setLoading(true);
  setError(null);
  
  const { data, error } = await safeApiCall(apiFunc, ...args);
  
  setLoading(false);
  
  if (error) {
    console.error('API çağrısı hatası:', error);
    setError(error.message);
    return;
  }
  
  if (onSuccess && typeof onSuccess === 'function') {
    onSuccess(data);
  }
};

// Multipart form verisi debug helper
export const logFormData = (formData) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('FormData içeriği:');
    for (let [key, value] of formData.entries()) {
      // Eğer değer File ise adını ve tipini yazdır
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
  }
};

export default { safeApiCall, loadData, logFormData };