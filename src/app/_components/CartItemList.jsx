import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from 'react';

function CartItemList({ cartItemList, onDeleteItem, onClearCart }) {
    return (
        <div>
            <div className='overflow-auto'>
                {cartItemList.map((cart, index) => (
                    <div className='flex justify-between items-center p-2 mb-5' key={index}>
                        <div className='flex gap-6 items-center'>
                            <Image
                                src={cart.image}
                                width={90}
                                height={90}
                                alt={cart.name}
                                className='border p-2'
                            />
                            <div>
                                <h2 className='font-bold'>{cart.name}</h2>
                                <h2 className='font-bold'>{cart.variation}</h2>
                                <h2>Quantity: {cart.quantity}</h2>
                                <h2 className='text-lg font-bold'>₱{cart.amount}</h2>
                            </div>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Trash2Icon className='cursor-pointer text-red-600' />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className='text-2xl'>
                                        Do you want to remove this item?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className='text-xl'>
                                        <h2>{cart.name} ({cart.variation})</h2>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogAction className='cursor-pointer' onClick={() => onDeleteItem(cart.id)}>Yes</AlertDialogAction>
                                    <AlertDialogCancel>No</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}
                <div className='flex justify-end mt-5'>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button disabled={cartItemList.length === 0}
                                className='text-red-600 bg-slate-50 hover:bg-red-600 hover:text-white'>Clear Cart</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className='text-2xl'>Do you want to clear your cart?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction className='cursor-pointer' onClick={onClearCart}>Yes</AlertDialogAction>
                                <AlertDialogCancel>No</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
}

export default CartItemList;
