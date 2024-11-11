"use client"
import GlobalApi from '@/app/_utils/GlobalApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderIcon, eye} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef} from 'react'
import { toast } from 'sonner'

function CreateAccount() {
    const [username,setUsername]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const router=useRouter();
    const [loader,setLoader]=useState();

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
    useEffect(()=>{
        const jwt=sessionStorage.getItem('jwt');
        if(jwt)
        {
            router.push('/')
        }
    },[])
    const onCreateAccount=()=>{
        setLoader(true)
        GlobalApi.registerUser(username,email,password).then(resp=>{
            console.log(resp.data.user)
            console.log(resp.data.jwt)
            sessionStorage.setItem('user',JSON.stringify(resp.data.user));
            sessionStorage.setItem('jwt',resp.data.jwt);
            toast("Account Created Successfully")
            router.push('/');
            setLoader(false)
        },(e)=>{
            setLoader(false)
            toast(e?.response?.data?.error?.message)
        })
    }
  return (
    <div className='flex items-baseline justify-center my-20'>
        <div className='flex flex-col items-center justify-center
        p-10 bg-slate-100 border border-gray-200'>
            <Image src='/4.png' width={200} height={200} alt='logo'/>
            <h2 className='font-bold text-3xl'>Create an Account</h2>
            <h2 className='text-gray-500'>Enter your Email and Password to Create an account</h2>
            <div className='w-full flex flex-col gap-5 mt-7'>
                <Input placeholder='Username' 
                onChange={(e)=>setUsername(e.target.value)}
                />
                <Input placeholder='name@example.com' 
                onChange={(e)=>setEmail(e.target.value)}/>
                <div className='flex'>
                <Input className='h-10 rounded-lg text-gray-950 mr-5'type="password" id="passwordField" placeholder="enter password" onChange={(e) => setPassword(e.target.value)} />
                <Button className='bg-primary rounded-md w-20'ref={showPasswordBtnRef} onClick={togglePasswordVisibility} disabled={!(password)}>Show</Button></div>
                <Button onClick={()=>onCreateAccount()}
                    disabled={!(username||email||password)}
                >
                   {loader?<LoaderIcon className='animate-spin'/>:'Create an Account'} </Button>
                   
                <p>Already have an account  
                    <Link href={'/sign-in'} className='text-green-500'>
                          Click here to Sign In
                    </Link>
                </p>
            </div>
        </div>
    </div>
  )
}

export default CreateAccount