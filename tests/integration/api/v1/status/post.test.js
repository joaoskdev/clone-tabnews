import orquestrador from "tests/orchestrator.js";

beforeAll(async () => {
  await orquestrador.waitForAllServices();
});

describe("POST /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retriving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para esse endpoint",
        action: "Verifique se o método HTTP é válido para esse endpoint",
        status_code: 405,
      });
    });
  });
});
