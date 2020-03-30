export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * A date string, such as 2007-12-03, compliant with the `full-date` format
   * outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for
   * representation of dates and times using the Gregorian calendar.
   */
  Date: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export enum GenderEnum {
  Bi = 'bi',
  Female = 'female',
  Male = 'male'
}

export type Mutation = {
   __typename?: 'Mutation';
  updateName: Scalars['String'];
};


export type MutationUpdateNameArgs = {
  name: Scalars['String'];
};

export type Person = {
   __typename?: 'Person';
  gender: GenderEnum;
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  getPerson: Person;
};


export type QueryGetPersonArgs = {
  name: Scalars['String'];
};


export type UploadedFile = {
   __typename?: 'UploadedFile';
  fileName: Scalars['String'];
  isValid: Scalars['Boolean'];
};
