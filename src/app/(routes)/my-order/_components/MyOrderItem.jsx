import Image from 'next/image'
import React from 'react'

function MyOrderItem({orderItem}) {
  return (
    <div className='m-3 bg-slate-200 rounded-lg'>
    <div className='grid grid-cols-5  mt-3 items-center'>
                  <Image src={orderItem.product.data.attributes.image} 
                    width={90} height={90} 
                    alt={orderItem.product.data.attributes.name}
                    className='border p-2 rounded-sm'
                    />  
        <div className='col-span-2'>
            <h2 className='font-bold'>{orderItem.product.data.attributes.name}</h2>
            <h2 className=''>Variation:{orderItem.variation}</h2>
        </div>
        
        <h2>Item Price: {orderItem.price}</h2>
        <h2 className=''>Quantity:{orderItem.quantity}</h2>
        
    </div>
    <hr className='mt-3'></hr>
    </div>
  )
}

export default MyOrderItem