import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt isLoading={isLoading} data={data} />
      <MaxConnections isLoading={isLoading} data={data} />
      <OpenedConnections isLoading={isLoading} data={data} />
      <DatabaseVersion isLoading={isLoading} data={data} />
    </>
  );
}

function UpdatedAt({ isLoading, data }) {
  let updatedAtText = "Carregando...";
  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return <div>Última atualização: {updatedAtText}</div>;
}

function MaxConnections({ isLoading, data }) {
  let maxConnections = "Carregando123";
  if (!isLoading && data) {
    maxConnections = data.dependencies.database.max_connections;
  }
  return <div>Conexões máximas: {maxConnections}</div>;
}

function OpenedConnections({ isLoading, data }) {
  let openedConnections = "Carregando...";
  if (!isLoading && data) {
    openedConnections = data.dependencies.database.opened_connections;
  }
  return <div>Conexões abertas: {openedConnections}</div>;
}

function DatabaseVersion({ isLoading, data }) {
  let databaseVersion = "Carregando...";
  if (!isLoading && data) {
    databaseVersion = data.dependencies.database.version;
  }
  return <div>Versão do banco de dados: {databaseVersion}</div>;
}
