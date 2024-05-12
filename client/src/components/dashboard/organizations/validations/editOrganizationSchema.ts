import { z } from "zod";

export const editOrganizationSchema = z.object({
  id: z.string(),
  name: z
    .string({
      message: "Please enter a valid Name",
      required_error: "Name is required",
    })
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not exceed 50 characters.",
    }),

    city: z
    .string({
      message: "Please enter a valid City",
      required_error: "City is required",
    })

    .optional(),
  country: z
    .string({
      message: "Please enter a valid City",
      required_error: "City is required",
    })
    .optional(),
  state: z
    .string({
      message: "Please enter a valid City",
      required_error: "City is required",
    })

    .optional(),

  headIds: z.array(z.string()).optional(),

  notes: z
    .string()

    .optional(),
});
