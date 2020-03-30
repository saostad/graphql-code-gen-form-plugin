import { objectType, enumType } from "nexus";
import { GraphQLUpload } from "graphql-upload";
import { GraphQLDate } from "graphql-iso-date";

export const DateTime = GraphQLDate;
export const Upload = GraphQLUpload;

export const GenderEnum = enumType({
  name: "GenderEnum",
  members: ["male", "female", "bi"],
});

export const Person = objectType({
  name: "Person",
  definition(t) {
    t.string("name");
    t.boolean("isActive");
    t.field("gender", { type: GenderEnum });
  },
});

export const UploadedFile = objectType({
  name: "UploadedFile",
  definition(t) {
    t.string("fileName", { nullable: false });
    t.boolean("isValid", { nullable: false });
  },
});
