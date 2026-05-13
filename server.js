import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import express from "express";
import { ruruHTML } from "ruru/server";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello() {
    return "Hello world";
  },
};

const app = express();

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  }),
);

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(4000);
console.log("Running a graghql api server at localhost:40000/graghql");
