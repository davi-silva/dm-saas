import { NextFunction, Request, Response } from "express";
import { VerifySignature } from "./zod";

export const validateSignature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  const validated = VerifySignature.safeParse(body);

  if (validated.error) {
    return res
      .status(400)
      .json({ error: "Message and signature are required" });
  }

  next();
};
