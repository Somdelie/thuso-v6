import NextAuth, { Session } from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";

// Define or import the User type

type User = {
  id: string;
  emailVerified?: Date | null; // Updated to match the type from getUserById
  role?: string;
  phone?: string;
  status?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  isTwoFactorEnabled?: boolean;
  // ... other properties
};

// Destructure the necessary components from the NextAuth object
export const {
  handlers: { GET, POST }, // HTTP method handlers
  auth, // Authentication options
  signIn, // Function for signing in
  signOut, // Function for signing out
} = NextAuth({
  pages: {
    signIn: "/auth/login", // Custom sign-in page
    error: "/auth/error", // Custom error page
  },
  events: {
    async linkAccount({ user }) {
      // Linking accounts event, update emailVerified status
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  
  adapter: PrismaAdapter(db), // Prisma adapter for NextAuth
  session: { strategy: "jwt" }, // Session strategy using JWT
  ...authConfig, // Additional authentication configurations
});

export type { Session }; // Exporting the Session type for use in other modules