import React, { useEffect, useState, useRef } from 'react';

export default function ProductSearch() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  // Fetch products once on component mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/search.json');
        if (!res.ok) throw new Error('Failed to fetch products');
        const json = await res.json();
        setProducts(json.data || []);
      } catch (err) {
        console.error(err);
        setError('Error loading products.');
      }
    }
    fetchProducts();
  }, []);

  // Filter products when searchTerm or products change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFiltered([]);
      return;
    }
    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredProducts);
  }, [searchTerm, products]);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchTerm, filtered]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm(''); // Or just clear filtered, but clearing term is safer for UI reset
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filtered.length) {
        window.location.href = filtered[selectedIndex].url;
      } else if (filtered.length > 0) {
        // Default to first result if none selected
        window.location.href = filtered[0].url;
      }
    } else if (e.key === 'Escape') {
      setSearchTerm('');
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="relative w-full max-w-xs" ref={searchRef}>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Search products"
        className="input input-bordered w-full"
      />

      {/* Dropdown Results */}
      {searchTerm && (
        <ul className="absolute z-50 mt-2 w-full bg-base-100 shadow-xl rounded-box overflow-y-auto max-h-96 border border-base-300">
          {error && <li className="p-3 text-error text-sm">{error}</li>}

          {!error && filtered.length === 0 && (
            <li className="p-3 text-base-content/70 text-sm">No products found.</li>
          )}

          {!error && filtered.map((product, index) => (
            <li key={product.url} className={`transition-colors ${index === selectedIndex ? 'bg-base-200' : 'hover:bg-base-200'}`}>
              <a href={product.url} className="flex p-3 items-center space-x-3">
                <img
                  src={product.poster}
                  alt={`Image of ${product.title}`}
                  className="w-10 h-14 object-cover rounded"
                  onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Product'; }}
                />
                <span className="text-sm font-medium line-clamp-2">
                  {product.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
