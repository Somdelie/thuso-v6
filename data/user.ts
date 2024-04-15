import { db } from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  } catch {
    return null;
  }
};

export const getJobById = async (id: string) => {
  // console.log(id);
  try {
    const job = await db.job.findUnique({
      where: { id },
      include: { author: true },
    });
    return job;
  } catch {
    return null;
  }
};

export const getJobs = async (id: string) => {
  // console.log(id);
  try {
    const jobs = await db.job.findMany({
      where: { id },
      include: { author: true, proposals: true },
    });
    return jobs;
  } catch {
    return null;
  }
};
export const getJobsByUser = async (id: string) => {
  // console.log(id);
  try {
    const userId = await getUserById(id);

    const jobs = await db.job.findMany({
      where: { author: userId },
      include: { proposals: true },
    });
    return jobs;
  } catch {
    return null;
  }
};
