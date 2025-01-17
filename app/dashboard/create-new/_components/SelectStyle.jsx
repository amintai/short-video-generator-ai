import Image from "next/image";
import React, { useState } from "react";

const SelectStyle = ({ onHandleInputChange = () => {} }) => {
  const styleOptions = [
    {
      name: "Realistic",
      image: "/realistic.jpeg",
    },
    {
      name: "Cartoon",
      image: "/cartoon.jpg",
    },
    {
      name: "Comic",
      image: "/comic.jpeg",
    },
    {
      name: "WaterColor",
      image: "/fantasy.jpg",
    },
    {
      name: "GTA",
      image: "/gta.jpg",
    },
  ];

  const [selectedOption, setSelectedOption] = useState();

  return (
    <div className="mt-7">
      <h2 className="font-bold text-xl text-primary">Style</h2>
      <p className="text-gray-500">Select you video style</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-3">
        {styleOptions.map((item, index) => {
          return (
            <div
              className={`relative hover:scale-105 transition-all cursor-pointer rounded-xl ${
                selectedOption === item.name ? "border-4 border-primary" : ""
              }`}
              key={index}
              onClick={() => {
                setSelectedOption(item.name);
                onHandleInputChange("imageStyle", item.name);
              }}
            >
              <Image
                src={item.image}
                width={100}
                alt={item.name}
                height={100}
                className="h-40 object-cover rounded-lg w-full"
              />
              <h2 className="absolute p-1 bg-black bottom-0 w-full text-white text-center rounded-b-lg">
                {item.name}
              </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectStyle;
