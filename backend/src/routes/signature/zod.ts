import z from "zod";

export const VerifySignature = z.object({
  message: z.string().min(1),
  signature: z.string().min(1),
});
