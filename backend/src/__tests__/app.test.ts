import request from 'supertest';
import app from '../app';
import { ethers } from 'ethers';

describe('POST /verify-signature', () => {
    let wallet: ethers.HDNodeWallet;
    let message: string;
    let signature: string;

    beforeAll(async () => {
        wallet = ethers.Wallet.createRandom() as ethers.HDNodeWallet;
        message = 'Hello, Web3!';
        signature = await wallet.signMessage(message);
    });

    it('should return isValid: true for a valid signature', async () => {
        const response = await request(app)
            .post('/verify-signature')
            .send({ message, signature });

        expect(response.status).toBe(200);
        expect(response.body.isValid).toBe(true);
        expect(response.body.signer).toBe(wallet.address);
        expect(response.body.originalMessage).toBe(message);
    });

    it('should return isValid: false for an invalid signature', async () => {
        const response = await request(app)
            .post('/verify-signature')
            .send({ message, signature: 'invalid-signature' });

        expect(response.status).toBe(400);
        expect(response.body.isValid).toBe(false);
        expect(response.body.error).toBe('Invalid signature');
    });

    it('should return 400 if message is missing', async () => {
        const response = await request(app)
            .post('/verify-signature')
            .send({ signature });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Message and signature are required');
    });

    it('should return 400 if signature is missing', async () => {
        const response = await request(app)
            .post('/verify-signature')
            .send({ message });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Message and signature are required');
    });
});
