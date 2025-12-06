export type VerificationResult = {
  isValid: boolean;
  signer?: string;
  originalMessage?: string;
  error?: string;
};
