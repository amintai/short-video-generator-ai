import { UserButton } from "@clerk/nextjs";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="p-3 px-5 fixed flex flex-no-wrap items-center justify-between shadow-md w-full ">
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
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
