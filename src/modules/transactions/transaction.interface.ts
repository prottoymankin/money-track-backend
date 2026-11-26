export interface Transaction {
  id: number;
  user_id: number;
  type: "income" | "expense";
  amount: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
};