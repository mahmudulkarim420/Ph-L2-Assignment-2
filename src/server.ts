import app from "./app";
import config from "./config";
import { connectDB } from "./db/db";


const main = () => {
    connectDB();
  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
};

main();