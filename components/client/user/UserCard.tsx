"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LocationCity } from "@mui/icons-material";
import { Divider, Rating } from "@mui/material";
import { User } from "@prisma/client";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const variants = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1 } },
};

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-100px" });
  return (
    <motion.div
      initial="hidden"
      variants={variants}
      whileInView="visible"
      animate={isInView && "animation"}
      className=" bg-white dark:bg-gray-700 rounded shadow card p-4 w-full dark:text-gray-400"
    >
      <div className="flex gap-2 w-full">
        <div>
          {user.image ? (
            <Image
              src={user.image}
              alt="Precedent logo"
              width="100"
              height="100"
              className=" rounded-sm"
            ></Image>
          ) : (
            <Avatar>
              <AvatarImage
                src={user?.image || user?.name?.charAt(0)}
                alt="@somdelie"
              />
              <AvatarFallback className="text-white font-semibold bg-sky-600">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <Link href={`/freelancers/${user.id}`} className="w-full">
          <div className="flex items-center justify-between w-full ">
            <h1>{user?.name}</h1>
            <span className="dark:text-gray-100 font-semibold capitalize">
              {user?.jobType}
            </span>
          </div>
          <span className="text-xs text-gray-500 flex gap-1 items-start mt-2">
            <LocationCity />
          </span>
          {/* <p className="text-[14px]">{user?.desc.slice(0, 65)}...</p> */}
        </Link>
      </div>
      <Divider sx={{ borderColor: "gray", marginY: 2 }} />
      <div className="flex items-center justify-between">
        <Rating value={4} readOnly />
        <button className="bg-roseRed2 dark:bg-gray-900 hover:bg-transparent transition hover:text-roseRed2 hover:border-roseRed2 border border-gray-800 text-gray-100 px-2 py-1 rounded">
          Request Quote
        </button>
      </div>
    </motion.div>
  );
};

export default UserCard;
