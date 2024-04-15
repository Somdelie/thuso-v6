import { auth } from "@/auth";
import CreateJobForm from "@/components/client/jobs/CreateJobForm";
import { getJobById } from "@/data/user";
import { db } from "@/lib/prisma";
import React from "react";

interface JobProps {
  params: {
    jobId: string;
  };
}

const SingleJob = async ({ params }: JobProps) => {
  const job = await getJobById(params.jobId);

  const jobs = await db.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  // console.log(jobs);

  const session = await auth();

  if (!session?.user.id) return <div>Not authenticated...</div>;

  if (
    (job && job.authorEmail !== session.user.email) ||
    session.user.isAdim !== true
  )
    // console.log(session);

    return (
      <div>
        <div className="space-y-5 text-center mt-6">
          <h1 className="text-2xl dark:text-gray-300 font-semibold sm:text-4xl">
            Find your perfect candidate
          </h1>
          <p className="text-gray-400 ">
            Get your job posting seen by thousands of job seekers
          </p>
        </div>

        <CreateJobForm job={job} />
      </div>
    );
};

export default SingleJob;
