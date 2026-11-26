import z from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"], "Invalid type. Type must be either income or expense"),
  amount: z.number("Must be a number").positive("Amount must be a positive number"),
  description: z.string().optional()
});

export type CreateTransaction = z.infer<typeof transactionSchema>;