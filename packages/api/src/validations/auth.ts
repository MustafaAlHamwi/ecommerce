import { z } from "zod";

export const authValidation = z.object({
  email: z.string().toLowerCase().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(4, "Password must be at least 4 characters"),
  firstName: z.string().min(1, "First name cannot be empty"),
  lastName: z.string().min(1, "Last name cannot be empty"),
  contactNumber: z
    .string()
    .max(15, "Invalid phone number")
    .optional()
    .refine(
      (data) =>
        !data ||
        /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/.test(data),
      "Invalid phone number",
    ),
  dateOfBirth: z.date().optional(),
  address: z.string().optional(),
  roleId: z.string({
    required_error: "Role is required",
  }),
  createdBy: z.string().optional(),
});

export const updateUserValidation = z.object({
  contactNumber: authValidation.shape.contactNumber.optional(),
  email: authValidation.shape.email.optional(),
  address: authValidation.shape.address.optional(),
});

export const registerUserValidation = authValidation
  .pick({
    email: true,
    firstName: true,
    lastName: true,
    password: true,
    createdBy: true,
  })
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const loginUserValidation = authValidation.pick({
  email: true,
  password: true,
});
// add validation  for page VerificationEmail
export const VerificationEmailValidation = authValidation.pick({
  email: true,
});
export const checkEmailValidation = z.object({
  email: authValidation.shape.email,
});

export const sendEmailValidation = z.object({ to: z.string().email() });

export const resetEmailValidation = z.object({
  email: z.string().toLowerCase().email(),
});

export const NewPasswordValidation = z
  .object({
    newPassword: z.string().min(6, "Pssword must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine(
    (schema) => {
      return schema.newPassword === schema.confirmPassword;
    },
    {
      message: "Passwords must match",
      path: ["confirmPassword"],
    },
  );

export const userPrivateMetadataValidation = z.object({
  roleId: z.string(),
  stripePriceId: z.string().optional().nullable(),
  stripeSubscriptionId: z.string().optional().nullable(),
  stripeCustomerId: z.string().optional().nullable(),
  stripeCurrentPeriodEnd: z.string().optional().nullable(),
});
