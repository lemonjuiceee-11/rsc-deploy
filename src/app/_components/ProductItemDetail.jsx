"use client";
import { Button } from '@/components/ui/button';
import { LoaderCircle, ShoppingBasket } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import GlobalApi from '../_utils/GlobalApi';
import { toast } from 'sonner';
import { UpdateCartContext } from '../_context/UpdateCartContext';

function ProductItemDetail({ product }) {
  const jwt = sessionStorage.getItem('jwt');
  const user = JSON.parse(sessionStorage.getItem('user'));
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);
  const [productTotalPrice, setProductTotalPrice] = useState(product.attributes.price);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const stock = product.attributes.stock; 
  const [stockWarning, setStockWarning] = useState('');

  const addToCart = () => {
    setLoading(true);
    if (!jwt) {
      router.push('/sign-in');
      setLoading(false);
      return;
    }

    const data = {
      data: {
        quantity: quantity,
        amount: (quantity * productTotalPrice).toFixed(2),
        products: product.id,
        users_permissions_users: user.id,
        userId: user.id,
      },
    };

    GlobalApi.addToCart(data, jwt)
      .then((resp) => {
        toast('Added to Cart');
        setUpdateCart(!updateCart);
        setLoading(false);
      })
      .catch((e) => {
        toast('Error while adding into Cart');
        setLoading(false);
      });
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;

    if (value === '') {
      setQuantity('');
      setStockWarning(''); 
    } else {
      const newQuantity = Math.max(1, parseInt(value) || 1);
      if (newQuantity > stock) {
        setStockWarning(`Only ${stock} items available in stock.`);
        setQuantity(stock);
      } else {
        setQuantity(newQuantity);
        setStockWarning(''); 
      }
    }
  };

  const handleIncrement = () => {
    if (quantity < stock) {
      setQuantity((prev) => {
        const newQuantity = prev + 1;
      
        if (newQuantity > stock) {
          setStockWarning(`Only ${stock} items available in stock.`);
          return stock; 
        }
        setStockWarning('');
        return newQuantity;
      });
    } else {
      setStockWarning(`Only ${stock} items available in stock.`);
    }
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
    setStockWarning(''); 
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-7 bg-white text-black">
      <Image
        src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + product.attributes.image.data[0].attributes.url}
        alt="image"
        width={500}
        height={500}
        className="bg-primary p-5 h-[320px] w-[300px] object-contain rounded-lg"
      />
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">{product.attributes.name}</h2>
        <h2 className="text-sm text-gray-500">{product.attributes.description}</h2>
        <div className="flex gap-3">
          {product.attributes.price && (
            <h2 className="font-bold text-3xl text-green-700">₱{product.attributes.price}</h2>
          )}
        </div>
        <h2 className="font-medium text-lg">Variation: {product.attributes.variation}</h2>

        <h2 className="font-medium text-lg">Quantity: </h2>

        {productTotalPrice && (
          <div className="flex flex-col items-baseline gap-3">
            <div className="flex gap-3 items-center">
              <div className="p-2 border flex gap-3 items-center px-5">
                <button
                  disabled={quantity <= 1}
                  onClick={handleDecrement}
                >
                  -
                </button>
                
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center border p-1"
                  min="1"
                  max={stock} 
                />
                <button onClick={handleIncrement}>+</button>
              </div>
              <h2 className="text-2xl font-bold">
                = ₱{(quantity * productTotalPrice).toFixed(2)}
              </h2>
            </div>
          
            {stockWarning && (
              <h2 className="text-red-500 text-sm">{stockWarning}</h2>
            )}
          </div>
        )}

        {stock <= 0 ? (
          <div>
            <h2 className="font-bold text-red-500">This product is currently out of stock.</h2>
            <Button className="flex gap-3" disabled>
              <ShoppingBasket />
              Add To Cart
            </Button>
          </div>
        ) : (
          <Button className="flex gap-3" onClick={addToCart} disabled={loading}>
            <ShoppingBasket />
            {loading ? <LoaderCircle className="animate-spin" /> : 'Add To Cart'}
          </Button>
        )}

        <h2>
          <span className='font-bold'>Brand:</span> {product.attributes.brands.data[0].attributes.name}
        </h2>
        <h2 className={stock < 11 ? 'font-normal text-red-500' : 'font-normal'}>
          <span className='font-bold text-black'>Stock:</span> {product.attributes.stock}
        </h2>
      </div>
    </div>
  );
}

export default ProductItemDetail;
