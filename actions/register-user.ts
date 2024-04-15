"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { FreelancerSchema, RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, name, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const mapRoleToEnum = (role: string): UserRole => {
    return role === "USER" ? UserRole.User : UserRole.FREELANCER;
  };

  await db.user.create({
    data: {
      name,
      email,
      role: mapRoleToEnum(role),
      password: hashedPassword,
    },
  });

  //   const verificationToken = await generateVerificationToken(email);

  //   await sendVerificationEmail(verificationToken.email, verificationToken.token);
  console.log("user created!");
  return { success: "Confirmation email sent!" };
  // redirect('/auth/login')
};
export const registerFreelancer = async (
  values: z.infer<typeof FreelancerSchema>
) => {
  const validatedFields = FreelancerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const {
    email,
    password,
    name,
    about,
    jobType,
    documentPhoto,
    address,
    role,
    phone,
  } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const mapRoleToEnum = (role: string): UserRole => {
    return role === "USER" ? UserRole.User : UserRole.FREELANCER;
  };

  await db.user.create({
    data: {
      name,
      email,
      about,
      jobType,
      documentPhoto,
      address,
      phone,
      role: mapRoleToEnum(role),
      password: hashedPassword,
    },
  });

  //   const verificationToken = await generateVerificationToken(email);

  //   await sendVerificationEmail(verificationToken.email, verificationToken.token);
  console.log("user created!");
  return { success: "Confirmation email sent!" };
  // redirect('/auth/login')
};
