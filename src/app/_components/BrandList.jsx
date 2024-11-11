import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function BrandList({ brandList }) {
  return (
    <div className='mt-10'>
      <h2 className='text-green-600 font-bold text-2xl'>Shop by Brand</h2>
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-5 mt-2'>
        {brandList.slice(0, 7).map((brand, index) => (
          <Link
            href={`/products-brand/${brand.attributes.name}`}
            key={brand.id || index}
            className='flex flex-col items-center bg-gray-100 gap-2 p-3 rounded-lg group cursor-pointer hover:bg-green-600 transition-all ease-in-out'
          >
            <Image 
              src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${brand.attributes.logo.data[0].attributes.url}`}
              width={100}
              height={100}
              alt='brand-logo'
              className='group-hover:scale-125 rounded-md mt-3' 
            />
            <h2 className='mt-2 text-green-800 group-hover:text-white'>{brand.attributes.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BrandList;
