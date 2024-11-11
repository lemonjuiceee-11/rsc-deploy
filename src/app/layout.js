"use client"
import { Fredoka,Lato,Poppins,PT_Sans,Kanit} from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import { UpdateCartContext } from "./_context/UpdateCartContext";
import { useState } from "react";

const outfit = Kanit({ subsets: ["latin"], weight: ['400', '700'] });

export default function RootLayout({ children }) {
  const params=usePathname();
  const [updateCart,setUpdateCart]=useState(false);
  const showHeader=params=='/sign-in'||params=='/create-account'?false:true;
  return (
    <html lang="en">
      <body className={outfit.className}>
      <UpdateCartContext.Provider value={{updateCart,setUpdateCart}}>
        {showHeader&&<Header/>}
        {children}
        <Toaster />
        </UpdateCartContext.Provider>
        </body>
    </html>
  );
}
