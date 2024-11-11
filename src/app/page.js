import { Button } from "@/components/ui/button";
import Image from "next/image";
import Slider from "./_components/Slider";
import Footer from "./_components/Footer";
import GlobalApi from "./_utils/GlobalApi";
import BrandList from "./_components/BrandList";
import ProductList from "./_components/ProductList";
import PopularList from "./_components/PopularList";

export default async function Home() {
  

  const sliderList = await GlobalApi.getSliders();

  const brandList = await GlobalApi.getBrandList();

  const productList=await GlobalApi.getAllProducts();

  return (
    <div className="container mx-auto px-4">
   
     <BrandList brandList={brandList}/>
     
     <Slider sliderList={sliderList}/>
     
     

     <PopularList popularList={productList} />

     <Image src='/Footer.png' width={2000} height={300} alt="banner" className="mt-10 w-full h-[300px]"/>
    <Footer/>
    </div> 
  );
}
