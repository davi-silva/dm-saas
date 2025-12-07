import express, { Request, Response, NextFunction } from "express";

import routes from "./routes";
import middleware from "./middleware";

const app = express();

middleware(app);

routes(app);

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
