# graphql-demo

A simple GraphQL proof-of-concept with an Express backend and React frontend, demonstrating the full request flow from a React app through a Vite proxy to a GraphQL server.

## Architecture

```
┌─────────────────────────────────────────┐
│  Browser at http://localhost:3000       │
│  React app calls fetch('/graphql')      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Vite dev server (port 3000)            │
│  - Serves React with hot reload         │
│  - Proxies /graphql → port 4000         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Express + GraphQL (port 4000)          │
│  - Hello world query                    │
│  - GraphiQL IDE at /                    │
└─────────────────────────────────────────┘
```

The Vite proxy means the browser only ever talks to one origin (`localhost:3000`), avoiding CORS issues during development.

## Tech stack

**Backend**
- Node.js (ES modules)
- Express 5
- graphql-js v16
- graphql-http (HTTP handler)
- ruru (GraphiQL IDE)

**Frontend**
- React 18
- Vite (dev server + build tool)

## Project structure

```
graphql-demo/
├── server.js           # Express + GraphQL server
├── package.json        # Backend dependencies
├── client/             # React app
│   ├── src/
│   │   └── App.jsx     # Fetches and displays GraphQL data
│   ├── vite.config.js  # Vite config with /graphql proxy
│   └── package.json    # Frontend dependencies
└── README.md
```

## Prerequisites

- Node.js 20 or higher
- npm

## Setup

Clone the repo and install dependencies for both backend and frontend:

```bash
git clone https://github.com/adriseyounis/graphql-demo.git
cd graphql-demo

# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

## Running locally

You'll need two terminal windows.

**Terminal 1 — Backend:**

```bash
node server.js
```

Server runs on `http://localhost:4000`.

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

React app runs on `http://localhost:3000`.

Open `http://localhost:3000` in your browser. You'll see the GraphQL response rendered by the React app.

## Endpoints

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | React frontend |
| `http://localhost:4000` | GraphiQL IDE (browser-based query explorer) |
| `http://localhost:4000/graphql` | GraphQL API endpoint |

## Schema

A minimal schema with a single query:

```graphql
type Query {
  hello: String
}
```

## Example queries

**Using the React app:** automatic on page load.

**Using GraphiQL:** open `http://localhost:4000` and run:

```graphql
{
  hello
}
```

**Using curl:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ hello }"}' \
  http://localhost:4000/graphql
```

**Using browser console (from `http://localhost:3000`):**

```javascript
fetch('/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: '{ hello }' }),
})
  .then((r) => r.json())
  .then(console.log);
```

All three return:

```json
{
  "data": {
    "hello": "Hello world"
  }
}
```

## How the proxy works

In `client/vite.config.js`:

```javascript
server: {
  port: 3000,
  proxy: {
    '/graphql': {
      target: 'http://localhost:4000',
      changeOrigin: true,
    },
  },
}
```

When the React app calls `fetch('/graphql')`, the browser sends the request to `localhost:3000`. Vite intercepts any request matching `/graphql` and forwards it to the Express server on port 4000. The browser never knows there are two servers — same-origin from its perspective.

## Next steps

This PoC covers the basics. Logical next features:

- Add more types and queries (e.g. a list of items with arguments)
- Add mutations to demonstrate writes
- Swap raw `fetch` for Apollo Client for caching and loading states
- Add TypeScript with GraphQL Code Generator for type-safe queries
- Production build: serve the React build directly from Express to collapse to a single server

## References

- [GraphQL.js docs](https://www.graphql-js.org/docs/)
- [graphql-http](https://github.com/graphql/graphql-http)
- [Vite docs](https://vitejs.dev/)
