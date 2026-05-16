import { Router, Request, Response } from 'express';
import { OmniCoreService } from '../services/OmniCoreService';
import type { ApiRequest, ApiResponse } from '../../src/omni/shared/types';

const router = Router();

/**
 * 🌌 OmniCore Process Endpoint
 * Fully Type-Safe via shared types.
 */
router.post('/process', async (
    req: Request<{}, {}, ApiRequest>,
    res: Response<ApiResponse>
) => {
    try {
        const request = req.body;
        const result = await OmniCoreService.processRequest(request);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({
            id: 'err',
            status: 'error' as any,
            content: err.message,
            latency: 0
        });
    }
});

export default router;
