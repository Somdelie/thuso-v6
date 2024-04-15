/* eslint-disable react/no-unescaped-entities */
import { getJobsByUser } from "@/data/user";
import { db } from "@/lib/prisma";
import React from "react";
import { JobsTable } from "../jobs/jobsTable";
import { User } from "@prisma/client";

interface DbUser {
  dbUser: User;
  id: string;
}

const ProjectsData = async ({ dbUser }: { dbUser: DbUser }) => {
  const getUserById = async () => {
    try {
      const user = await db.user.findUnique({
        where: { id: dbUser.id },
        include: {
          jobs: {
            include: {
              proposals: true,
            },
          },
        },
      });

      return user;
    } catch (error) {
      console.error("Error fetching user by id:", error);
      return null;
    }
  };

  const currentUser = await getUserById();

  // console.log(currentUser);

  const jobs = currentUser?.jobs;

  // console.log(jobs);

  return (
    <div className="">
      {jobs ? (
        <div>
          <JobsTable jobs={jobs} />
        </div>
      ) : (
        <span>
          You don't have a job yet! you can post a job by pressing post a job
          button on the navbar
        </span>
      )}
    </div>
  );
};

export default ProjectsData;
