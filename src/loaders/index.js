import expressLoader from "./express.js";
import postgresLoader from "./postgres.js";
// import logger from "./logger.js";

export default async ({ app }) => {
  await postgresLoader();
  // logger.info("PostgreSQL connected");

  await expressLoader({ app });
  // logger.info("Express loaded");
};