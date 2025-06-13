import { Context } from "hono";
import { Scalar } from "@scalar/hono-api-reference";

export const scalarDocs = Scalar({
  url: "/static/openapi.yaml",
  theme: "deepSpace",
  pageTitle: "Workout Database API",
});
