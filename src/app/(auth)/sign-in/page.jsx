"use client"
import GlobalApi from '@/app/_utils/GlobalApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'

function SignIn() {
    const [password, setPassword] = useState('');
    const [identifier, setIdentifier] = useState(''); // Changed to a single identifier state
    const router = useRouter();
    const [loader, setLoader] = useState(false); // Initialize loader as false
    const showPasswordBtnRef = useRef(null);

    const togglePasswordVisibility = () => {
        const passwordField = document.getElementById("passwordField");
        const showPasswordBtn = showPasswordBtnRef.current;

        if (showPasswordBtn && passwordField.type === "password") {
            passwordField.type = "text";
            showPasswordBtn.textContent = "Hide";
        } else {
            passwordField.type = "password";
            showPasswordBtn.textContent = "Show";
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const jwt = sessionStorage.getItem('jwt');
            if (jwt) {
                router.push('/');
            }
        }
    }, []);
    

    const onSignIn = () => {
        setLoader(true);
        GlobalApi.SignIn(identifier, password).then(resp => {
            sessionStorage.setItem('user', JSON.stringify(resp.data.user));
            sessionStorage.setItem('jwt', resp.data.jwt);
            toast("Login Successfully");
            router.push('/');
            setLoader(false);
        }, (e) => {
            console.log(e);
            toast(e?.response?.data?.error?.message);
            setLoader(false);
        });
    }

    return (
        <div className='flex items-baseline justify-center my-20'>
            <div className='flex flex-col items-center justify-center p-10 bg-slate-100 border border-gray-200'>
                <Image src='/4.png' width={200} height={200} alt='logo' />
                <h2 className='font-bold text-3xl'>Sign In to Account</h2>
                <h2 className='text-gray-500'>Enter your account details to Sign In</h2>
                <div className='w-full flex flex-col gap-5 mt-7'>
                    <Input 
                        placeholder='enter email or username' 
                        onChange={(e) => setIdentifier(e.target.value)} 
                    />
                    <div className='flex'>
                        <Input 
                            className='h-10 rounded-lg text-gray-950 mr-5' 
                            type="password" 
                            id="passwordField" 
                            placeholder="enter password" 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <Button 
                            className='bg-primary rounded-md w-20' 
                            ref={showPasswordBtnRef} 
                            onClick={togglePasswordVisibility} 
                            disabled={!password}
                        >
                            Show
                        </Button>
                    </div>
                    <Button 
                        onClick={onSignIn}
                        disabled={!(identifier && password)} // Update condition to check both fields
                    >
                        {loader ? <LoaderIcon className='animate-spin' /> : 'Sign In'}
                    </Button>
                    <p>Don&apos;t have an account?
                        <Link href={'/create-account'} className='text-green-500'>
                            Click here to create a new account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignIn;
