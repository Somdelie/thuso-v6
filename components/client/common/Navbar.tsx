import React from "react";
import MobileNav from "./MobileNav";
import Nav from "./Nav";
import Link from "next/link";
import { UserButton } from "@/components/auth/UserButton";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { auth } from "@/auth";
import Image from "next/image";

const Navbar = async () => {
  const session = await auth();

  // console.log(session)

  return (
    <div className="flex items-center justify-between px-6 h-[60px] sticky top-0 left-0 bg-gray-100 dark:bg-muted border-b">
      <div className="sm:hidden">
        <MobileNav />
      </div>
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Image src="/favicon.png" alt="T" width={40} height={40} />
        <span className="">Thuso.com</span>
      </Link>
      <div className="hidden sm:flex items-center justify-between">
        <Nav />
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        {session ? (
          <div className="flex items-center gap-8">
            <Link
              href="/jobs/create"
              className="bg-sky-500 px-2 py-1 rounded text-white hover:bg-sky-600 transition"
            >
              Post a Job
            </Link>
            <div>
              <UserButton />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="border-2 px-2 py-1 rounded border-sky-600 hover:bg-sky-600 text-sky-600 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="border-2 px-2 py-1 rounded bg-sky-600 hover:bg-transparent hover:border-sky-600 text-white hover:text-sky-600 "
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
