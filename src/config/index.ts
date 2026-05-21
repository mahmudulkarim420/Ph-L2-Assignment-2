import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

// Application configuration from environment variables

const config = {
  connection_string: process.env.CONNECTION_STRING as string,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET as string,
};

export default config;
