import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ethers } from 'ethers';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/verify-signature', (req: Request, res: Response) => {
    const { message, signature } = req.body;

    if (!message || !signature) {
        return res.status(400).json({ error: 'Message and signature are required' });
    }

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
            error: 'Invalid signature',
            details: error.message,
        });
    }
});

// Generic error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
