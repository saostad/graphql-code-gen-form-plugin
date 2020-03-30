import dotenv from "dotenv";
dotenv.config();

import { Options } from "graphql-yoga";
import bearerToken from "express-bearer-token";
import { verifyAzureToken } from "./security/azure-token-checker";
import cors from "cors";
import { server } from "./graphql/create-server";
import helmet from "helmet";
import { createLogger, writeLog } from "./helpers/logger";

// HTTP security middleware
server.express.use(helmet());

// Enable CORS Requests
const whitelist = [
  /** Client URL on development */ "http://localhost:3000",
  /** Playground */ "http://localhost:4000",
  /** Client URL on Production */ "https://DOMAIN_NAME_HERE",
];
const corsOptions: cors.CorsOptions = {
  origin: function(origin, callback) {
    if (origin === undefined) {
      callback(null, true);
    } else if (origin && whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS for ${origin}`));
    }
  },
  methods: "POST",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
server.express.use(cors(corsOptions));

// server.express.use(bearerToken());
// server.express.use(verifyAzureToken);

const appVersion = require("../package.json").version;

const options: Options = {
  port: 4000,
  endpoint: "/graphql",
  playground: "/" /** to disable put false */,
  getEndpoint: false,
};
server.start(options, async options => {
  try {
    createLogger();
    writeLog(`server v${appVersion} started with config: `, options);
  } catch (error) {
    console.error(error);
  }
});
