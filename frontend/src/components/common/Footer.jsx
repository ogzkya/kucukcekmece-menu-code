// frontend/src/components/common/Footer.jsx - Footer component
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer p-3 text-center">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Küçükçekmece Belediyesi - Tüm Hakları Saklıdır</p>
      </div>
    </footer>
  );
};

export default Footer;