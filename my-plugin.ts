import { Types, PluginFunction } from "@graphql-codegen/plugin-helpers";
import { GraphQLSchema } from "graphql";
import { RawClientSideBasePluginConfig } from "@graphql-codegen/visitor-plugin-common";

export const plugin: PluginFunction<RawClientSideBasePluginConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: RawClientSideBasePluginConfig,
) => {
  console.log(`File: my-plugin.ts,`, `Line: 10 => `);

  return `
  const a = 12;
  const b = 15;
  `;
};
