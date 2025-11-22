import React, { useState } from 'react';

const BillingSystem = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Type-ahead search
  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.length > 2) {
      try {
        const response = await fetch(`/api/products/search?term=${value}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    }
  };

  // Add product to bill
  const addToBill = (product) => {
    setSelectedProducts([...selectedProducts, {
      ...product,
      quantity: 1,
      total: product.purchaseInfo.mrp
    }]);
    setSearchTerm('');
    setSearchResults([]);
  };

  // Print bill
  const printBill = async () => {
    try {
      const response = await fetch('/api/sales/create-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: selectedProducts,
          totalAmount: selectedProducts.reduce((sum, item) => sum + item.total, 0)
        })
      });
      
      const data = await response.json();
      window.print(); // Trigger print dialog
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  return (
    <div className="billing-system">
      <div className="search-section">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products..."
        />
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(product => (
              <div 
                key={product._id} 
                onClick={() => addToBill(product)}
                className="search-result-item"
              >
                {product.name} - MRP: ₹{product.purchaseInfo.mrp}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bill-items">
        {selectedProducts.map((item, index) => (
          <div key={index} className="bill-item">
            <span>{item.name}</span>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => {
                const newProducts = [...selectedProducts];
                newProducts[index].quantity = parseInt(e.target.value);
                newProducts[index].total = newProducts[index].quantity * item.purchaseInfo.mrp;
                setSelectedProducts(newProducts);
              }}
            />
            <span>₹{item.total}</span>
          </div>
        ))}
      </div>

      <div className="bill-total">
        Total: ₹{selectedProducts.reduce((sum, item) => sum + item.total, 0)}
      </div>

      <button onClick={printBill}>Print Bill</button>
    </div>
  );
};