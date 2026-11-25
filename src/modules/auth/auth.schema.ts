import z from "zod";

export const registerSchema = z.object({
  name: z.
    string()
    .trim()
    .min(3, "Name must be at least 3 characters long"),

  email: z.email("Invalid email").trim(),
  
  password: z.
    string().
    min(8, "Password must be at least 8 characters long")
});

export const loginSchema = z.object({
  email: z.email("Invalid email").trim(),
  
  password: z.
    string().
    min(8, "Password must be at least 8 characters long")
})

export type RegisterCredentials = z.infer<typeof registerSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;