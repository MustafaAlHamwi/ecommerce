import { z } from "zod";

export const productValidation = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.number().min(1, { message: "Price is required" }),
  image: z.string().min(1, { message: "Image is required" }),
});
