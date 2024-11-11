import React from 'react';
import ProductItem from './ProductItem';

function PopularList({ popularList }) {
  const sortedPopularList = popularList?.slice().sort((a, b) => a.id - b.id);

  return (
    <div className="mt-5">
      <h2 className="text-green-600 font-bold text-2xl">Our Popular Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
        {sortedPopularList?.slice(0, 8).map((product) => (
          <ProductItem product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export default PopularList;
