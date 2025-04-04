import { UserButton } from "@clerk/nextjs";
import React from "react";
import { useSelector } from "react-redux";
import { Coins } from "lucide-react";

const Header = () => {

  const coins = useSelector((state) => state.user.details.coins);

  return (
    <div className="p-3 px-5 fixed top-0 left-0 bg-white z-50 flex items-center justify-between shadow-sm w-full ">
      <a
        className="flex items-center no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
        href="/dashboard"
      >
        <svg
          className="h-8 fill-current text-indigo-600 pr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.6-4.29a9.95 9.95 0 0 1 11.2 0 8 8 0 1 0-11.2 0zm6.12-7.64l3.02-3.02 1.41 1.41-3.02 3.02a2 2 0 1 1-1.41-1.41z" />
        </svg>
        AI Video
      </a>

      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-2 text-primary font-semibold px-4 py-2">
          <Coins className="w-5 h-5" />
          <span>{coins}</span>
        </div>
          <UserButton />
      </div>
    </div>
  );
};

export default Header;
