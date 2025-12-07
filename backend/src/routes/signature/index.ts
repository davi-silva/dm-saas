import { Router } from "express";
import { validateSignature } from "./middleware";

import { verifySignature } from "../../controllers/signature";

const router = Router();

router.post("/verify-signature", validateSignature, verifySignature);

export default router;
