"use client";
import { Button } from '@/components/ui/button';
import { CircleUserRound, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GlobalApi from '../_utils/GlobalApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UpdateCartContext } from '../_context/UpdateCartContext';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import CartItemList from './CartItemList';
import { toast } from 'sonner';

function Header() {
    const [categoryList, setCategoryList] = useState([]);
    const isLogin = sessionStorage.getItem('jwt') ? true : false;
    const user = JSON.parse(sessionStorage.getItem('user'));
    const jwt = sessionStorage.getItem('jwt');
    const [totalCartItem, setTotalCartItem] = useState(0);
    const { updateCart, setUpdateCart } = useContext(UpdateCartContext);
    const [cartItemList, setCartItemList] = useState([]);
    const router = useRouter();
    const [subtotal, setSubTotal] = useState(0);

    useEffect(() => {
        getCategoryList();
        getCartItems();
    }, []);

    useEffect(() => {
   
        getCartItems();
    }, [updateCart]);

    const getCategoryList = () => {
        GlobalApi.getCategory().then(resp => {
            setCategoryList(resp.data.data);
        });
    };

    const getCartItems = async () => {
        if (user) {
            const cartItemList_ = await GlobalApi.getCartItems(user.id, jwt);
            setTotalCartItem(cartItemList_?.length);
            setCartItemList(cartItemList_);
            calculateSubtotal(cartItemList_); 
        } else {
            console.log("User is not logged in.");
        }
    };

    const calculateSubtotal = (items) => {
        const total = items.reduce((acc, item) => acc + item.amount, 0);
        setSubTotal(total.toFixed(2));
    };

    const onSignOut = () => {
        sessionStorage.clear();
        router.push('/sign-in');
    };

    const onDeleteItem = async (id) => {
        await GlobalApi.deleteCartItem(id, jwt);
        toast('Item removed!');
        setUpdateCart(prev => !prev); 
    };

    const onClearCart = async () => {
        const success = await GlobalApi.clearCart(user.id, jwt);
        if (success) {
            toast('Cart cleared!');
            setUpdateCart(prev => !prev); 
        } else {
            toast.error('Failed to clear the cart');
        }
    };

    return (
        <div className='bg-green-500'>
            <div className='shadow-sm flex justify-between container mx-auto px-0'>
                <div className='flex items-center gap-8'>
                    <Link href={'/'}>
                        <Image src='/4.png' alt='logo'
                            width={200}
                            height={150}
                            className='cursor-pointer'
                        />
                    </Link>
                    <h2 className='text-2xl font-bold text-yellow-200'>RHODESIAN ONLINE</h2>
                </div>
                <div className='flex gap-5 items-center'>
                    <Sheet>
                        <SheetTrigger>
                            <h2 className='flex gap-2 items-center text-lg'>
                                <ShoppingCart className='h-10 w-10 text-white' />
                                <span className='bg-white text-primary text-xl px-2 rounded-full'>{totalCartItem}</span>
                            </h2>
                        </SheetTrigger>
                        <SheetContent style={{ width: '1000px', maxWidth: '1000px' }}>
                            <SheetHeader>
                                <SheetTitle className="bg-primary text-white font-bold text-xl p-2">My Cart</SheetTitle>
                                <SheetDescription>
                                    <CartItemList cartItemList={cartItemList} onDeleteItem={onDeleteItem} onClearCart={onClearCart} />
                                </SheetDescription>
                            </SheetHeader>
                            <SheetClose asChild>
                                <div className='absolute w-[96%] bottom-6 flex flex-col'>
                                    <h2 className='text-lg font-bold flex justify-between'>Subtotal
                                        <span>₱{subtotal}</span></h2>
                                    <Button className="text-lg font-bold "
                                        disabled={cartItemList.length === 0}
                                        onClick={() => router.push(jwt ? '/checkout' : '/sign-in')}>
                                        Checkout
                                    </Button>
                                </div>
                            </SheetClose>
                        </SheetContent>
                    </Sheet>

                    {!isLogin ? (
                        <Link href={'/sign-in'}>
                            <Button>Login</Button>
                        </Link>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <CircleUserRound
                                    className="bg-green-100 p-2 mr-3 rounded-full cursor-pointer text-primary h-16 w-16"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href={'/my-profile'}>
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                </Link>
                                <Link href={'/my-order'}>
                                    <DropdownMenuItem>My Order</DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem onClick={onSignOut}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
 