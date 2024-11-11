import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function TopBrandList({ brandList, selectedBrand, setSelectedBrand }) {
  return (
    <div className='flex gap-7 mt-2 overflow-auto md:mx-20 justify-center'>
      {brandList.map((brand, index) => (
        <Link 
          key={index}
          href={`/products-brand/${encodeURIComponent(brand.attributes.name)}`} 
          onClick={() => setSelectedBrand(brand.attributes.name)} 
          className={`flex flex-col items-center bg-green-50 gap-2 pt-5 pl-5 pr-5 rounded-lg group cursor-pointer hover:bg-green-600 min-w-[100px] ${selectedBrand === brand.attributes.name && 'bg-green-600 text-white'}`}
        >
          <Image 
            src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${brand.attributes.logo.data[0].attributes.url}`}
            width={120}
            height={120}
            alt='icon'
            className='group-hover:scale-125 rounded-md'
          />
          <h2 className={`mt-2 mb-3 mr-2 ml-2 text-green-800 group-hover:text-white ${selectedBrand === brand.attributes.name && 'text-white'}`}>
            {brand.attributes.name}
          </h2>
        </Link>
      ))}
    </div>
  );
}

export default TopBrandList;
