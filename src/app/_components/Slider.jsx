"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from 'next/image';

function Slider({ sliderList, autoSlideDelay = 3000, canPause = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const transitionRef = useRef(false);

  useEffect(() => {
    const handleAutoSlide = () => {
      if (!transitionRef.current) { 
        transitionRef.current = true; 

        const nextIndex = (currentIndex + 1) % sliderList.length;
        setCurrentIndex(nextIndex);

        setTimeout(() => {
          transitionRef.current = false;
        }, 500);
      }
    };

    if (autoSlideDelay) {
      const intervalId = setInterval(handleAutoSlide, autoSlideDelay);

     
      return () => clearInterval(intervalId);
    }
  
  }, [currentIndex, sliderList.length, autoSlideDelay]);

  const handlePrevious = () => {
    const nextIndex = currentIndex === 0 ? sliderList.length - 1 : currentIndex - 1;
    setCurrentIndex(nextIndex);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % sliderList.length;
    setCurrentIndex(nextIndex);
  };

  return (
    <Carousel className='mt-5'>
      <CarouselContent style={{ transition: `transform ${transitionRef.current ? '0.5s ease-in-out' : 'none'}` }}>
        {sliderList.map((slider, index) => (
          <CarouselItem
            key={index}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: `transform ${transitionRef.current ? '0.5s ease-in-out' : 'none'}`,
            }}
          >
            <Image
              src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + slider.attributes.image.data[0].attributes.url}
              width={800}
              height={400}
              alt="slider-image"
              className="w-full h-[200px] md:h-[400px] object-fit rounded-2xl"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {canPause && (
        <>
          <CarouselPrevious onClick={handlePrevious} />
          <CarouselNext onClick={handleNext} />
        </>
      )}
    </Carousel>
  );
}

export default Slider;