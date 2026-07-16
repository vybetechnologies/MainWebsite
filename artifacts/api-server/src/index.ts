import app from "./app";
import { logger } from "./lib/logger";
import { startPageViewCleanupJob } from "./jobs/pageViewCleanup";
import { validateSquareCredentials } from "./lib/square-client";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  startPageViewCleanupJob();

  // Validate Square credentials in the background so the server is ready
  // immediately. Square routes return 503 until this resolves successfully.
  validateSquareCredentials().catch((err) => {
    logger.error({ err }, "Unexpected error during Square credential validation");
  });
});
