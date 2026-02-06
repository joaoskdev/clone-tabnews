import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const databaseVersionResult = await database.query("SHOW server_version;");
    const databaseVersionValue = databaseVersionResult.rows[0].server_version;

    const databaseMaxConnectionsResult = await database.query(
      "SHOW max_connections;",
    );
    const databaseMaxConnectionsValue = parseInt(
      databaseMaxConnectionsResult.rows[0].max_connections,
    );

    const databaseName = process.env.POSTGRES_DB;
    const databaseOpenedConnectionsResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });

    const databaseOpenedConnectionsValue = parseInt(
      databaseOpenedConnectionsResult.rows[0].count,
    );

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          max_connections: databaseMaxConnectionsValue,
          opened_connections: databaseOpenedConnectionsValue,
          version: databaseVersionValue,
        },
      },
    });
  } catch (error) {
    const publicErrorObjetct = new InternalServerError({
      cause: error,
    });

    console.log("\n Erro dento do catch do controller:");
    console.error(publicErrorObjetct);

    response.status(500).json(publicErrorObjetct);
  }
}

export default status;
