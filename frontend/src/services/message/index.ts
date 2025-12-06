import axios from "axios";
import { VerificationResult } from "./types";

export const verifySignature = async (
  message: string,
  signature: string
): Promise<VerificationResult> => {
  try {
    const response = await axios.post(
      "http://localhost:5000/verify-signature",
      {
        message,
        signature,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return { isValid: false, error: "Verification failed" };
  }
};
