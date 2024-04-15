"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MegaMenu = () => {
  const pathname = usePathname();
  return (
    <Popover>
    <PopoverTrigger className={
          pathname === "/freelancers" || pathname === "/jobs"
          ? "hover:bg-sky-600 dark:bg-gray-700 bg-sky-600 dark:hover:gray-700 text-white px-2 py-1 transition rounded"
          : "hover:bg-sky-600 dark:hover:bg-gray-700 hover:text-white px-2 py-1 transition rounded"
        }>Browse</PopoverTrigger>
    <PopoverContent className="w-40 grid">
    <Link href="/freelancers" className="hover:bg-sky-600 dark:hover:bg-muted transition px-2 py-1 rounded hover:text-white">
      Freelancers
    </Link>
     <Link href="/jobs" className="hover:bg-sky-600 dark:hover:bg-muted transition px-2 py-1 rounded hover:text-white">
       Jobs
     </Link>
    </PopoverContent>
  </Popover>
  
  );
};

export default MegaMenu;
