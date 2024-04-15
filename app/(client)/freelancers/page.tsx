import UserCard from "@/components/client/user/UserCard";
import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "freelancers",
};

const Freelancers = async () => {
  const users = await db.user.findMany({
    where: { role: "FREELANCER" },
  });

  // console.log(users);

  return (
    <div className="max-w-[90%] mx-auto">
      {users.length > 0 ? (
        <div className="mx-auto mt-4 gap-4 grid sm:grid-cols-3 max-w-[90%] ">
          {users?.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Image src="/nousers.png" width={400} height={400} alt="No Users" />
          <h1 className="text-2xl text-red-600 dark:text-gray-300 font-semibold sm:text-3xl">
            Freelancers are not available at the moment please try again in few
            days!
          </h1>
        </div>
      )}
    </div>
  );
};

export default Freelancers;
