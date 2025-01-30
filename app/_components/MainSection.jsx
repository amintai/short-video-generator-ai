import Image from "next/image";
import React from "react";

const MainSection = () => {
  return (
    <section className="container mx-auto mt-40 px-6 md:px-12 lg:px-20">
      <div className="flex flex-col md:flex-row items-center">
        {/* Left Content Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-3xl md:text-5xl text-indigo-400 font-bold leading-tight">
            AI-Powered Short Video Generator:{" "}
            <span className="text-gray-500">
              Create Stunning Clips Instantly!
            </span>
          </h1>
          <p className="mt-4 text-base md:text-xl text-gray-700">
            Turn your ideas into engaging short videos with AI—fast, easy, and
            effortless!
          </p>

          {/* Download Section */}
          <p className="mt-6 text-indigo-400 font-semibold">
            Download our app:
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <Image
              height={100}
              width={120}
              src="/apple-store.svg"
              alt="Apple Store"
            />
            <Image
              height={100}
              width={120}
              src="/google-play.svg"
              alt="Google Play Store"
            />
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
          <Image
            src="/hero-image.jpg"
            width={500}
            height={500}
            alt="AI Video Generator"
            className="max-w-full h-auto rounded-lg "
          />
        </div>
      </div>
    </section>
  );
};

export default MainSection;
