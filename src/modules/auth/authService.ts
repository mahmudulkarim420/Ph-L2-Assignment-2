// modules/auth/authService.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../db/db";
import config from "../../config";


export const authService = {
  // ১. Signup Logic
  async signupUser(name: string, email: string, password: string, role: string) {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = role === "maintainer" ? "maintainer" : "contributor";

    const insertQuery = `
      INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, name, email, role, created_at, updated_at;
    `;

    const result = await pool.query(insertQuery, [name, email, hashedPassword, userRole]);
    return result.rows[0];
  },

  // ২. Login Logic
  async loginUser(email: string, password: string) {
    const findUserQuery = `SELECT * FROM users WHERE email = $1;`;
    const result = await pool.query(findUserQuery, [email]);

    if (result.rows.length === 0) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt_secret, { expiresIn: "1d" });

    delete user.password;

    return { token, user };
  },
};
