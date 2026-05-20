import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";

// Load environment variables
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

// Application configuration from environment variables

const config = {
  connection_string: process.env.CONNECTION_STRING as string,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex"),
};

export default config;
