import { extendType, stringArg } from "nexus";
import { Person } from "./types";

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.field("getPerson", {
      type: Person,
      args: { name: stringArg({ nullable: false }) },
      resolve: (parent, { name }, ctx) => {
        return { gender: "male", isActive: true, name };
      },
    });
  },
});
