import React, { useEffect, useState } from 'react';

export default function ProductSearch() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

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

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search products"
        className="input input-bordered w-full"
      />

      {/* Dropdown Results */}
      {searchTerm && (
        <ul className="absolute z-50 mt-2 w-full bg-base-100 shadow-xl rounded-box overflow-hidden border border-base-300">
          {error && <li className="p-3 text-error text-sm">{error}</li>}

          {!error && filtered.length === 0 && (
            <li className="p-3 text-base-content/70 text-sm">No products found.</li>
          )}

          {!error && filtered.map((product) => (
            <li key={product.url} className="hover:bg-base-200 transition-colors">
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
