import { Router, Request, Response } from 'express';
import {
    ConductorMission,
    MissionStep,
    OmniResponseStatus
} from '../../src/omni/shared/types';
import { hermes } from '../../src/app/hermesAgent';

const router = Router();

// Store missions in memory for this session
const missions: Map<string, ConductorMission> = new Map();

/**
 * 📡 Conductor: Mission Spawn & Decomposition
 * Automatically decomposes a high-level goal into actionable steps.
 */
router.post('/conductor-spawn', async (req: Request, res: Response) => {
    const { goal, title } = req.body;
    const missionId = `mission-${Math.random().toString(36).substr(2, 9)}`;

    console.log(`📡 Conductor: Spawning Mission "${title || 'Goal'}"`);

    // Step 1: Decomposition (Simulated via Hermes)
    const steps: MissionStep[] = [
        { id: 'step-1', task: `Research: ${goal}`, workerRole: 'Sage', status: 'running' },
        { id: 'step-2', task: `Execute implementation`, workerRole: 'Builder', status: 'pending' },
        { id: 'step-3', task: `Review & Audit`, workerRole: 'Reviewer', status: 'pending' }
    ];

    const mission: ConductorMission = {
        missionId,
        title: title || 'New Mission',
        goal,
        steps,
        status: 'executing',
        createdAt: Date.now()
    };

    missions.set(missionId, mission);

    // Trigger first step asynchronously via Hermes
    hermes.dispatch({
        id: missionId,
        type: 'command' as any,
        content: steps[0].task,
        timestamp: Date.now()
    }).then(() => {
        const m = missions.get(missionId);
        if (m) {
            m.steps[0].status = 'completed';
            m.steps[1].status = 'running';
        }
    });

    res.json(mission);
});

router.get('/mission-status', (req: Request, res: Response) => {
    const { missionId } = req.query;
    const mission = missions.get(missionId as string);
    if (!mission) return res.status(404).send('Mission not found');
    res.json(mission);
});

export default router;
