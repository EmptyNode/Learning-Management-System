import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";

const Hero: React.FC = () => {
  return (
    <div className="w-[95%] 800px:w-[92%] m-auto py-10 dark:text-white text-black">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center text-center md:text-left px-8">
        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
            Improve Your Online Learning Experience Better Instantly
          </h1>
          <p className="text-base md:text-lg mb-10">
            Explore thousands of courses taught by industry experts. Find your desired course
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 w-[100%] md:space-y-0 md:space-x-2">
            <div className="flex w-[100%]">
              <input
                type="text"
                placeholder="Search courses..."
                className="py-2 px-4 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 bg-white text-black border border-gray-300 transition duration-300"
              />
              <button className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-r-full font-semibold text-base shadow-lg transition duration-300">
                <BiSearch />
              </button>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0">
          <div className="rounded-full overflow-hidden h-full">
            <Image
              src={require("../../public/assests/illustration.avif")}
              alt=""
              width={200}
              height={200}
              layout="responsive"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
