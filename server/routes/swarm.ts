import { Router, Request, Response } from 'express';
import { 
    SwarmDispatchRequest, 
    Mission, 
    SwarmResult, 
    OmniResponseStatus 
} from '../../src/omni/shared/types';
import { hermes } from '../../src/app/hermesAgent';

const router = Router();

/**
 * 🐝 Swarm Dispatch API
 * Orchestrates tasks to multiple workers (backed by tmux/profiles).
 */
router.post('/swarm-dispatch', async (
    req: Request<{}, {}, SwarmDispatchRequest>,
    res: Response
) => {
    const { workerIds, prompt, missionTitle, assignments } = req.body;
    console.log(`🐝 Swarm Dispatching Mission: ${missionTitle || 'Unnamed Mission'}`);

    const missionId = `mission-${Math.random().toString(36).substr(2, 9)}`;
    const results: SwarmResult[] = [];

    // Simulate dispatch to workers
    const targets = assignments || (workerIds || []).map(id => ({ workerId: id, task: prompt || '' }));

    for (const target of targets) {
        console.log(`   -> Dispatching to ${target.workerId}: ${target.task}`);
        
        // In the "Ultimate Swarm" version, this would trigger tmux spawn or profile execution
        // Here we use Hermes Agent as the primary bridge
        try {
            const hermesResponse = await hermes.dispatch({
                id: missionId,
                type: 'command' as any,
                content: target.task,
                timestamp: Date.now()
            });

            results.push({
                workerId: target.workerId,
                ok: hermesResponse.status === OmniResponseStatus.SUCCESS,
                delivery: 'tmux',
                checkpointStatus: 'checkpointed',
                summary: hermesResponse.content
            });
        } catch (err) {
            results.push({
                workerId: target.workerId,
                ok: false,
                delivery: 'api',
                checkpointStatus: 'failed'
            });
        }
    }

    const mission: Mission = {
        missionId,
        title: missionTitle || 'Manual Dispatch',
        status: results.every(r => r.ok) ? 'completed' : 'blocked',
        startTime: Date.now(),
        assignments: targets as any,
        results
    };

    res.json(mission);
});

export default router;
