import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ProductItemDetail from './ProductItemDetail'


function ProductItem({product}) {
  return (
    <div className='p-2 md:p-6
    flex flex-col items-center 
    justify-center gap-3 border rounded-lg
    hover:scale-105 hover:shadow-lg
    transition-all ease-in-out cursor-pointer bg-green-50'>
      <Dialog>
      <DialogTrigger>  
        <Image src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL+
        product.attributes.image.data[0].attributes.url}
        width={600}
        height={600}
        alt={product.attributes.brand}
        className='h-[300px] w-[300px] rounded-lg'/>
        </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <ProductItemDetail product={product}/>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
        <h2 className='font-bold text-lg'>{product.attributes.name}</h2> 
        <h3 className='text-lg'>{product.attributes.variation}</h3> 
        <div className='flex gap-3'>
            {product.attributes.price&&
            <h2 className='font-bold text-2xl text-green-700'>₱{product.attributes.price}</h2>}
        </div>
      <Dialog>
      <DialogTrigger>  
        <Button variant="outline"
        className="text-primary hover:text-white hover:bg-primary font-semibold"
        >Add to Cart</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <ProductItemDetail product={product}/>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

    </div>
  )
}

export default ProductItem