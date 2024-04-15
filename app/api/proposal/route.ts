import { auth } from "@/auth";
import { getJobById, getUserById } from "@/data/user";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request, id: String) {
  const user = await auth();

  // console.log(req.url);
  // const jobId = await getJobById()
  // console.log(user);

  try {
    if (!user?.user?.email) {
      return NextResponse.json(
        { message: "Log in to continue" },
        { status: 401 }
      );
    }

    const { userName, description, jobId } = await req.json();

    // Check if the user has already sent a proposal for the specified job
    const existingProposal = await db.proposal.findFirst({
      where: {
        AND: [{ userId: user.user.id }, { jobId: jobId }],
      },
    });

    if (existingProposal) {
      return NextResponse.json(
        { message: "You already sent an application for this job!" },
        { status: 400 }
      );
    }

    const newProposal = await db.proposal.create({
      data: {
        userName,
        description,
        jobId,
        userId: user.user.id, // Associate proposal with the authenticated user
      },
    });

    // Check if newJob is successfully created
    if (newProposal) {
      revalidatePath(`/jobs/${jobId}`);
      // Update job's proposal list
      await db.job.update({
        where: { id: jobId },
        data: {
          proposals: {
            connect: { id: newProposal.id },
          },
        },
      });
      return NextResponse.json({ message: "Job created successfully!" });
    } else {
      return NextResponse.json(
        { message: "Failed to create job" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
