"use client";
import {
  CircleUserRound,
  FolderPlus,
  PanelsTopLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideNav = () => {
  const Menu = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      Icon: PanelsTopLeft,
    },
    {
      id: 2,
      name: "Create New",
      path: "/dashboard/create-new",
      Icon: FolderPlus,
    },
    {
      id: 3,
      name: "Upgrade",
      path: "/dashboard/upgrade",
      Icon: Sparkles,
    },
    {
      id: 4,
      name: "Account",
      path: "/dashboard/account",
      Icon: CircleUserRound,
    },
  ];

  const pathName = usePathname();

  return (
    <div className="mt-20 w-64 h-screen shadow-sm p-5">
      <div className="grid gap-3">
        {Menu.map((item) => {
          const { Icon, name, path, id } = item;
          return (
            <Link href={path} key={id}>
              <div
                className={`flex items-center gap-3 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer ${
                  path === pathName ? "bg-primary text-white" : ""
                }`}
              >
                <Icon />
                <h2>{name}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideNav;
