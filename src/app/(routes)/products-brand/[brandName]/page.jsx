"use client"
import GlobalApi from '@/app/_utils/GlobalApi';
import React, { useState, useEffect } from 'react';
import TopBrandList from '../_components/TopBrandList';
import ProductList from '@/app/_components/ProductList';

function ProductBrand({ params }) {
    const brandName = decodeURIComponent(params.brandName);
    const [selectedBrand, setSelectedBrand] = useState(brandName);
    const [productList, setProductList] = useState([]);
    const [brandList, setBrandList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await GlobalApi.getProductsByBrand(selectedBrand);
                const brands = await GlobalApi.getBrandList();
                setProductList(products);
                setBrandList(brands);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        
        fetchData();
    }, [selectedBrand]);

    return (
        <div>
            <h2 className='p-4 bg-primary text-white font-bold text-3xl text-center mb-5'>{selectedBrand}</h2>
            <TopBrandList 
                brandList={brandList}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand} 
            />
            <div className='p-5 md:p-10'>
                <ProductList productList={productList} />
            </div>
        </div>
    );
}

export default ProductBrand;
