"use client";
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ProductItem from './ProductItem';

function ProductList({ productList }) {
  const [sortOption, setSortOption] = useState('name-asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  const sortedProducts = productList?.slice().sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.attributes.name?.localeCompare(b.attributes.name || '') || 0;
      case 'name-desc':
        return b.attributes.name?.localeCompare(a.attributes.name || '') || 0;
      case 'price-asc':
        return (a.attributes.price || 0) - (b.attributes.price || 0);
      case 'price-desc':
        return (b.attributes.price || 0) - (a.attributes.price || 0);
      default:
        return 0;
    }
  });


  const filteredProducts = sortedProducts?.filter(product =>
    product.attributes.slug && product.attributes.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const inStockProducts = filteredProducts?.filter(product => product.attributes.stock > 0) || [];
  const outOfStockProducts = filteredProducts?.filter(product => product.attributes.stock === 0) || [];
  
  const combinedProducts = [...inStockProducts, ...outOfStockProducts];


  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = combinedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const nextPage = () => {
    if (currentProducts.length === productsPerPage) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  console.log('Current Sort Option:', sortOption);
  console.log('Search Query:', searchQuery);
  console.log('Filtered Products:', filteredProducts);
  console.log('Current Page:', currentPage);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-green-600 font-bold text-2xl">All Products</h2>

      <div className="mt-4 flex items-center border border-gray-200 rounded">
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products"
          className="flex-grow px-2 py-1 rounded-l focus:outline-none"
        />
        <Search className='h-8 w-8 text-primary p-1 rounded-r cursor-pointer' />
      </div>

      <div className="mt-4">
        <label htmlFor="sortOptions" className="mr-2">Sort by:</label>
        <select id="sortOptions" value={sortOption} onChange={handleSortChange}>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      {currentProducts?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
          {currentProducts.map((product, index) => (
            <div key={index} className={product.attributes.stock > 0 ? '' : 'opacity-50 cursor-not-allowed'}>
              <ProductItem 
                product={product}
                disabled={product.attributes.stock <= 0} 
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-6 text-primary">No products found.</p>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          disabled={currentProducts.length < productsPerPage}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductList;
