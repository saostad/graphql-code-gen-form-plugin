import jwt from "jsonwebtoken";
import axios from "axios";

// import { logger } from "../helpers/";
import { NextFunction, Request, Response } from "express";
import { appId } from "../helpers/variables";

/** place holder for last fetch time from microsoft pages */
let lastFetchUrlsTime: number;

/** place holder for url of microsoft public keys */
let keysUrl: string;

export interface KeysData {
  keys: {
    kty: "RSA";
    use: "sig";
    kid: string;
    x5t: string;
    n: string;
    e: string;
    x5c: string[];
  }[];
}

/** placeholder for microsoft public keys */
let publicKeys: KeysData;

// check if in initial server or after 24h from last fetch, returns true
const isFetchTime = () => {
  const nextTime = lastFetchUrlsTime + 24 * 60 * 60 * 1000;
  if (lastFetchUrlsTime === undefined || nextTime < Date.now()) {
    return true;
  }
  return false;
};

// get url of public keys from microsoft server
const getKeyUrl = async (): Promise<string> => {
  if (isFetchTime()) {
    const url =
      "https://login.microsoftonline.com/common/.well-known/openid-configuration";
    const response = await axios.get(url);
    const { data } = response;
    keysUrl = data.jwks_uri;
  }
  return keysUrl;
};

/** get all public keys from microsoft page */
const getAllKeys = async (keyUrls: string) => {
  if (isFetchTime()) {
    const response = await axios.get(keyUrls);
    publicKeys = response.data;
    lastFetchUrlsTime = Date.now();
    return publicKeys;
  } else {
    return publicKeys;
  }
};

/** find key id from token */
const getRequestedKeyID = (token: string) => {
  const NotVerifiedToken = jwt.decode(token, { complete: true });

  if (NotVerifiedToken && typeof NotVerifiedToken === "object") {
    const headerToken = NotVerifiedToken.header;
    const { kid } = headerToken;
    return kid;
  }
};

/** find public key for current token */
const getPublicKey = (allKeys: KeysData, keyID: string): string | undefined => {
  let publicKey: string | undefined;
  allKeys.keys.forEach((element) => {
    if (keyID === element.kid) {
      publicKey = `-----BEGIN CERTIFICATE-----
      ${element.x5c[0]}
-----END CERTIFICATE-----
      `;
      return publicKey;
    }
  });
  return publicKey;
};

// options for jwt.verify()
const options: jwt.VerifyOptions = {
  algorithms: ["RS256"],
  audience: [appId],
  issuer: ["https://sts.windows.net/74983c08-72ee-43e0-a972-49076fefbfe3/"],
  ignoreExpiration: false,
  ignoreNotBefore: false,
};

const tokenChecker = async (
  token: string,
): Promise<string | object | false> => {
  try {
    const keyUrls = await getKeyUrl();
    const allKeys = await getAllKeys(keyUrls);
    const keyID = getRequestedKeyID(token);
    const publicKey = getPublicKey(allKeys, keyID);
    if (publicKey) {
      const decoded = jwt.verify(token, publicKey, options);
      return decoded;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export interface IReqWithExtras extends Request {
  EmpID?: string;
  Email?: string;
  verifiedToken?: string;
  token?: string;
}

export const verifyAzureToken = async (
  req: IReqWithExtras,
  res: Response,
  next: NextFunction,
) => {
  let verifiedToken;

  if (req.token) {
    // check if token is correct return decoded token
    // if invalid return false
    verifiedToken = await tokenChecker(req.token);

    if (!verifiedToken) {
      // if token is not correct
      res.status(404).send("Invalid Token or Not found");
    } else if (verifiedToken) {
      // token exists and is correct
      // @ts-ignore
      // eslint-disable-next-line require-atomic-updates
      req.verifiedToken = verifiedToken; // inject verified token to request.
      next();
    }
  } else {
    // token not exist in request
    console.error(`wrong token!`);
    res.status(404).send("Invalid Token or Not found");
  }
};
