import React, { useEffect, useState } from 'react';

const ExpiryNotification = () => {
  const [expiringProducts, setExpiringProducts] = useState([]);

  useEffect(() => {
    // Check for expiring products on component mount
    checkExpiringProducts();
  }, []);

  const checkExpiringProducts = async () => {
    try {
      const response = await fetch('/api/products/expiring');
      const data = await response.json();
      setExpiringProducts(data);
      
      if (data.length > 0) {
        // Show notification
        alert(`${data.length} products will expire in the next 30 days!`);
      }
    } catch (error) {
      console.error('Error checking expiring products:', error);
    }
  };

  return (
    <div className="expiry-notification">
      {expiringProducts.length > 0 && (
        <div className="alert alert-warning">
          <h4>Products Expiring Soon</h4>
          <ul>
            {expiringProducts.map(product => (
              <li key={product._id}>
                {product.name} - Expires: {new Date(product.purchaseInfo.expiryDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};