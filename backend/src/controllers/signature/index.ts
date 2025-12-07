import { Request, Response } from "express";
import { ethers } from "ethers";

export const verifySignature = (req: Request, res: Response) => {
  const { message, signature } = req.body;

  try {
    const signerAddress = ethers.verifyMessage(message, signature);
    res.json({
      isValid: true,
      signer: signerAddress,
      originalMessage: message,
    });
  } catch (error: any) {
    res.status(400).json({
      isValid: false,
      error: "Invalid signature",
      details: error.message,
    });
  }
};
