import { auth } from "@/auth";
import CreateJobForm from "@/components/client/jobs/CreateJobForm";
import { JobDetailsModal } from "@/components/client/jobs/singleJob";
import { getJobById } from "@/data/user";
import { db } from "@/lib/prisma";
import { City, Country, State } from "country-state-city";
import { formatDistanceToNow, formatRelative } from "date-fns";
import Image from "next/image";
import React from "react";

interface JobProps {
  params: {
    jobId: string;
  };
}

const SingleJob = async ({ params }: JobProps) => {
  const job = await getJobById(params.jobId);

  // Function to get country name from ISO code
  const getCountryName = (isoCode: string): string => {
    const country = Country.getCountryByCode(isoCode);
    return country ? country.name : isoCode;
  };

  // Function to get state name from state code and country code
  const getStateName = (stateCode: string, countryCode: string): string => {
    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    return state ? state.name : stateCode;
  };

  const createdAtFormatted = job
    ? formatRelative(new Date(job.createdAt), new Date())
    : "";

  const session = await auth();

  if (!session?.user.id) return <div>Not authenticated...</div>;

  if (
    (job && job.authorEmail !== session.user.email) ||
    session.user.isAdim !== true
  )
    // console.log(job);

    return (
      <div className="max-w-[90%] mx-auto">
        <div className="space-y-3 mb-2 mt-6">
          <h1 className="text-2xl dark:text-gray-300 font-semibold sm:text-4xl">
            Read More About this Job
          </h1>
          <p className="text-gray-400 ">
            It only take few minutes to apply for this job you can just hit the
            apply now button!
          </p>
          <div className="border-t py-6 grid sm:grid-cols-2">
            <div className="">
              {job?.image ? (
                <div className="">
                  <Image
                    src={job.image}
                    alt={""}
                    width={300}
                    height={300}
                    className="rounded"
                  />
                </div>
              ) : (
                <Image
                  src="/placeholder.jpeg"
                  alt={""}
                  width={300}
                  height={300}
                  className="rounded"
                />
              )}
              <div className="mt-3 text-muted-foreground">
                <p>
                  Posted By:{" "}
                  <span className="font-semibold">{job?.author?.name}</span>
                </p>
                <p className="text-sm">{createdAtFormatted}</p>
              </div>
            </div>
            <div className="">
              <div>
                <h2>{job?.title}</h2>
              </div>
              <p>{job?.type}</p>
              <p>{job?.description}</p>
              <p>{job?.locationType}</p>
              <p>{job ? getCountryName(job.country) : ""}</p>
              <p>{job ? getStateName(job.state, job.country) : ""}</p>
              <p>{job?.city}</p>
              <p>{job?.location}</p>
              <div className="mt-6">
                <JobDetailsModal job={job as any} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default SingleJob;
