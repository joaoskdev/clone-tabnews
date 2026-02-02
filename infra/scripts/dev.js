const { spawn } = require("child_process");
const { execSync } = require("child_process");

function cleanup() {
  console.log("\nParando serviços...");
  try {
    execSync("npm run services:stop", { stdio: "inherit" });
  } catch (error) {
    console.error("Erro ao parar serviços:", error);
  }
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

async function run() {
  try {
    execSync(
      "npm run services:up && npm run services:wait:database && npm run migrations:up",
      {
        stdio: "inherit",
      },
    );

    const nextDev = spawn("next", ["dev"], { stdio: "inherit" });

    nextDev.on("close", cleanup);
  } catch (error) {
    cleanup();
  }
}

run();
