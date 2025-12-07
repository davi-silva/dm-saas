import express, { Application } from "express";
import cors from "cors";

export default (app: Application): void => {
  app.use(cors());
  app.use(express.json());
};
