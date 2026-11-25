import bcrypt from "bcryptjs";
import { pool } from "../../db/database";
import { AppError } from "../../utils/AppError";
import { User } from "../users/user.interface";
import { LoginCredentials, RegisterCredentials } from "./auth.schema";
import jwt from "jsonwebtoken";

const register = async (payload: RegisterCredentials) => {
  const { name, email, password } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const queryResult = await pool.query<User>(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [name, email, hashPassword]);

  const user = queryResult.rows[0];

  if (!user) {
    throw new AppError (500, "Failed to create user");
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "10d" }
  );

  const { password: _, ...safeUser } = user;

  return { accessToken, refreshToken, safeUser };
};

const login = async (payload: LoginCredentials) => {
  const { email, password } = payload;

  const queryResult = await pool.query<User>(`
    SELECT * FROM users
    WHERE email = $1
  `, [email]);

  const user = queryResult.rows[0];

  if (!user) {
    throw new AppError (401, "Invalid email or password");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError (401, "Invalid email or password");
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "10d" }
  );

  const { password: _, ...safeUser } = user;

  return { accessToken, refreshToken, safeUser };
};

export const authService = {
  register,
  login
};