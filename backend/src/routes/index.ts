import { Application } from "express";

import signature from "./signature";

export default (app: Application): void => {
  app.use("", signature);
};
