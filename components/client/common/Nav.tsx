"use client";
import { navLinks } from "@/data/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import MegaMenu from "./MegaMenu";

const Nav = () => {
  const pathname = usePathname();

  return (
    <div className="gap-2 flex items-center text-muted-foreground">
      {navLinks.map((link, index) => (
        <Link
          href={link.link}
          key={index}
          className={
            link.link === pathname
              ? "hover:bg-sky-600 dark:bg-gray-700 bg-sky-600 dark:hover:bg-gray-700 text-white px-2 py-1 transition rounded"
              : "hover:bg-sky-600 dark:hover:bg-gray-700 hover:text-white px-2 py-1 transition rounded"
          }
        >
          {link?.title}
        </Link>
      ))}
      <MegaMenu />
    </div>
  );
};

export default Nav;
