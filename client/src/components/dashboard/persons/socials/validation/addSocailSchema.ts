import { z } from "zod";
const SocialPlatformEnum = z.enum(["LINKEDIN", "FB", "TWITTER", "IG"]);

export const addSocialSchema = z.object({
  //   id: z.string().optional(),
  platform: SocialPlatformEnum,
  account: z
    .string({
      invalid_type_error: "Account name must be a string",
      required_error: "Account name is required",
      message: "Account name is required",
    })
    .min(5, {
      message: "Account name must be at least 3 characters long",
    })
    .max(200, {
      message: "Account name must be at most 200 characters long",
    }),
  //   person: z.object({ id: z.string() }).optional(),
  personId: z.string().optional(),
});
