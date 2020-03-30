import { makeSchema } from "nexus";
import { GraphQLServer } from "graphql-yoga";
import { ContextCallback } from "graphql-yoga/dist/types";
import * as types from "./schema";
import * as services from "../services";
import path from "path";
import { IReqWithExtras } from "../security/azure-token-checker";

const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(process.cwd(), "src", "generated", "schema.graphql"),
    typegen: path.join(process.cwd(), "src", "generated", "typings.ts"),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(process.cwd(), "src", "typings", "types.ts"),
        alias: "t",
      },
    ],
    contextType: "t.Context",
  },
});

const context: ContextCallback = ({ request }: { request: IReqWithExtras }) => {
  if (request.Email) {
    return {
      services,
      userEmail: request.Email.toLowerCase(),
    };
  } else {
    return {};
  }
};

export const server = new GraphQLServer({
  schema,
  context,
});
