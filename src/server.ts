import app from "./app.js";
import config from "./config/index.js";
import { connectDB } from "./db/db.js";

// Server initialization and startup
const main = () => {
  connectDB();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

main();
