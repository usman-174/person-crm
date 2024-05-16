import { z } from "zod";

export const editPersonSchema = z.object({
  id: z.string().optional(),
  username: z
    .string({
      message: "Please enter a valid Email",
      required_error: "Email is required",
    })
    .email({
      message: "Please enter a valid email address",
    }),
  fullName: z.string().optional(),
  fname: z
    .string({
      message: "Please enter a valid firstname",
      required_error: "Firstname is required",
    })
    .min(2, {
      message: "Firstname must be at least 2 characters.",
    })
    .max(50, {
      message: "Firstname must not exceed 50 characters.",
    }),
  lname: z
    .string({
      message: "Please enter a valid lastname",
      required_error: "Lastname is required",
    })
    .min(2, {
      message: "Lastname must be at least 2 characters.",
    })
    .max(50, {
      message: "Lastname must not exceed 50 characters.",
    }),
  country: z.string({
    message: "Please enter a valid country",
    required_error: "Country is required",
  }),
  title: z
    .string({
      message: "Please enter a valid title",
      required_error: "Title is required",
    })
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(50, {
      message: "Title must not exceed 50 characters.",
    }),
  // City is optional, so use optional()
  city: z
    .string()
    .optional(),
  state: z.string().optional(),
  notes: z.string().optional(),
  //source enum either "sociamedia" or "perons"
  source: z.enum(["SOCIAL_MEDIA", "PERSON"], {
    message: "Please select a valid source",
    required_error: "Source is required",
    invalid_type_error: "Invalid source type",
  }),
  DOB: z.date({
    required_error: "Select a Date of Birth.",
  }),
  // files: z.object({}).optional(),

  social: z.array(
    z.object({
      id: z.string().optional(),
      account: z.string().optional(),
      platform: z.string().optional(),
      personId: z.string().optional(),
    })
  ),
});
