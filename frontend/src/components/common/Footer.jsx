// frontend/src/components/common/Footer.jsx - Optimize edilmiş
import React, { memo } from 'react';

// Footer nadiren render edildiğinden memo gereksiz olabilir,
// ancak tutarlılık için ekliyoruz
const Footer = memo(() => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer p-3 text-center">
      <div className="container">
        <p>&copy; {currentYear} Küçükçekmece Belediyesi - Tüm Hakları Saklıdır</p>
      </div>
    </footer>
  );
});

// DisplayName debugging için
Footer.displayName = 'Footer';

export default Footer