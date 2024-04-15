import { UserRole, UserStatus, UserType } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession[""] & {
  role: UserRole;
  isAdmin: boolean
  userType: UserType;
  userStatus: UserStatus;
  about: string | null;
  jobType: string | null;
  phone: string | null;
  status?: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  isTwoFactorEnabled?: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}