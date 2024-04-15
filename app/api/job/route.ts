import { auth } from "@/auth";
import { getUserById } from "@/data/user";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await auth();
  // console.log(user);

  try {
    if (!user?.user?.email) {
      return NextResponse.json(
        { message: "Log in to continue" },
        { status: 401 }
      );
    }

    const {
      title,
      type,
      locationType,
      location,
      country,
      state,
      city,
      image,
      description,
    } = await req.json();

    const newJob = await db.job.create({
      data: {
        title,
        type,
        locationType,
        location,
        country,
        state,
        city,
        image,
        description,
        authorEmail: user.user.email,
      },
    });

    // Check if newJob is successfully created
    if (newJob) {
      revalidatePath("/dashboard");
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
