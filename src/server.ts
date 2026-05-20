import app from "./app.js";
import config from "./config/index.js";
import { connectDB } from "./db/db.js";


const main = () => {
    connectDB();
  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
};

main();