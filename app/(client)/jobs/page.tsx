import { getJobById } from "@/data/user";
import { db } from "@/lib/prisma";
import Link from "next/link";
import React from "react";

interface JobProps {
  params: {
    jobId: string;
  };
}

const JobsPage = async ({ params }: JobProps) => {
  const job = await getJobById(params.jobId);

  const jobs = await db.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });
  return (
    <div className="max-[90%] p-6">
      {jobs ? (
        <div className="grid gap-4 grid-cols-4 ">
          {jobs?.map((job) => (
            <Link
              href={`/jobs/${job?.id}`}
              key={job?.id}
              className="p-5 rounded shadow"
            >
              {job?.title}
            </Link>
          ))}
        </div>
      ) : (
        <div>No jobs available at the moment!</div>
      )}
    </div>
  );
};

export default JobsPage;
