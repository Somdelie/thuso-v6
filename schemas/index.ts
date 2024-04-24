import * as z from "zod";
import validator from "validator";

// Login Schema for validating login input
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()), // Optional field for two-factor authentication code
});

// Settings Schema for Updating user info
export const SettingsSchema = z
  .object({
    name: z.string().optional(),
    about: z.string().optional(),
    jobType: z.string().optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    phone: z.optional(
      z.string().refine(validator.isMobilePhone, {
        message: "Invalid phone number",
      })
    ),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
    userType: z.enum(["NORMAL", "FREELANCER"]).optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data: any) => {
      // If newPassword is provided, password must also be provided
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required when changing password",
      path: ["newPassword"],
    }
  );

// Reset Schema for validating email during password reset
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

// New Password Schema for validating new password during password reset
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

// Register Schema for validating user registration input
export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters or more",
    })
    .max(50, {
      message: "Name must be less than 50 characters",
    }),
  address: z.string().optional(),
  role: z.enum(["USER", "FREELANCER"]),
  phone: z.string().refine(validator.isMobilePhone, {
    message: "Invalid phone number",
  }),
});

// Register Schema for validating user registration input
export const FreelancerSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters or more",
    })
    .max(50, {
      message: "Name must be less than 50 characters",
    }),
  image: z
    .string()
    .min(3, {
      message: "Profile picture is missing!",
    })
    .optional(),
  about: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(1000, {
      message: "Description must be 1000 characters or less",
    }),
  category: z.string().min(2, {
    message: "Please select a category.",
  }),
  jobType: z
    .string()
    .min(10, {
      message: "You must tell us what you do!.",
    })
    .max(1000, {
      message: "Can't this much!",
    }),
  documentPhoto: z.string(),
  address: z.string(),
  role: z.enum(["USER", "FREELANCER"]),
  phone: z.optional(
    z.string().refine(validator.isMobilePhone, {
      message: "Invalid phone number",
    })
  ),
});

export const JobSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(60, {
      message: "Title must be 60 characters or less",
    }),
  type: z.string().min(2, {
    message: "Type must be at least 2 characters.",
  }),
  locationType: z.string().min(2, {
    message: "Location type must be at least 2 characters.",
  }),
  location: z.string().optional(),
  country: z
    .string()
    .min(2, {
      message: "Country must be at least 2 characters.",
    })
    .max(60, {
      message: "Country must be 60 characters or less",
    }),
  state: z
    .string()
    .min(2, {
      message: "State must be at least 2 characters.",
    })
    .max(60, {
      message: "State must be 60 characters or less",
    }),
  city: z
    .string()
    .min(2, {
      message: "City must be at least 2 characters.",
    })
    .max(60, {
      message: "City must be 60 characters or less",
    }),
  image: z.string().optional(),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(1000, {
      message: "Description must be 1000 characters or less",
    }),
});

export const ProposalSchema = z.object({
  userName: z
    .string()
    .min(3, {
      message: "Username must be at least 10 characters.",
    })
    .max(50, {
      message: "Description must be 1000 characters or less",
    }),
  description: z
    .string()
    .min(3, {
      message: "Username must be at least 10 characters.",
    })
    .max(50, {
      message: "Description must be 1000 characters or less",
    })
    .optional(),
});
