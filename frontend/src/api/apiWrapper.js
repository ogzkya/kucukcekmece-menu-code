// frontend/src/api/apiWrapper.js - API isteklerini güvenli şekilde yapmak için yardımcı fonksiyonlar

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
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      
      return { 
        data: null, 
        error: {
          message: errorMessage,
          status: error.response?.status,
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
      setError(error.message);
      return;
    }
    
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess(data);
    }
  };
  
  export default { safeApiCall, loadData };