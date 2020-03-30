import { extendType, stringArg } from "nexus";

export const mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.string("updateName", {
      args: { name: stringArg({ required: true }) },
      resolve: (_, { name }, ctx) => {
        ctx.services.doSomething();
        return `new name is: ${name}`;
      },
    });
  },
});
