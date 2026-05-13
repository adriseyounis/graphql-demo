import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: "{ hello }",
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>GraphQL Demo</h1>
      <p>Response from GraphQL server:</p>
      <pre
        style={{ background: "#f4f4f4", padding: "1rem", borderRadius: "4px" }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default App;
