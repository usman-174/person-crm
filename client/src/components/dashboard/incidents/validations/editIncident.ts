import { z } from "zod";

export const editIncidentSchema = z.object({
  id: z.string(),

  title: z
    .string({
      message: "Please enter a valid Name",
      required_error: "Name is required",
    })
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(50, {
      message: "Title must not exceed 50 characters.",
    }),
  city: z.string().optional(),
  state: z.string().optional(),
  location: z.string(),
  country: z.string().optional(),

  type: z
    .string({
      message: "Please enter a valid Type",
      required_error: "Type is required",
    })

    .optional(),
  date: z.date(),
  time: z.string().optional(),
  targeted: z
    .string({
      message: "Please enter a valid Targeted",
      required_error: "Targeted is required",
    })
    .min(2, {
      message: "Targeted must be at least 2 characters.",
    })
    .max(50, {
      message: "Targeted must not exceed 50 characters.",
    }),
  source: z.enum(["SOCIAL_MEDIA", "PERSON"], {
    message: "Please select a valid source",
    required_error: "Source is required",
    invalid_type_error: "Invalid source type",
  }),
  personIds: z.array(z.string()).optional(),
  organizationId: z.string().optional(),
  schoolIds: z.array(z.string()).optional(),

  notes: z
    .string()

    .optional(),
});
