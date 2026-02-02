const { spawn } = require("child_process");
const { execSync } = require("child_process");

let nextDev = null;
let isCleaningUp = false;

function cleanup() {
  if (isCleaningUp) return;
  isCleaningUp = true;

  console.log("\nParando serviços...");

  if (nextDev && !nextDev.killed) {
    // Define listener ANTES de matar
    const timeout = setTimeout(() => {
      if (!nextDev.killed) {
        console.log("Forçando encerramento...");
        nextDev.kill("SIGKILL");
      }
    }, 5000);

    nextDev.once("exit", () => {
      clearTimeout(timeout);
      stopServices();
    });

    nextDev.kill("SIGTERM");
  } else {
    stopServices();
  }
}

function stopServices() {
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
      { stdio: "inherit" },
    );

    nextDev = spawn("next", ["dev"], { stdio: "inherit" });

    nextDev.on("close", cleanup);
  } catch (error) {
    console.error("Erro ao iniciar:", error);
    cleanup();
  }
}

run();
