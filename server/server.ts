import express from 'express';
import cors from 'cors';
import aitableRoutes from './routes/aitableSync';
import omniCoreRoutes from './routes/omniCore';
import swarmRoutes from './routes/swarm';
import conductorRoutes from './routes/conductor';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 🌌 OmniCore & Integration Routes
app.use('/api/aitable', aitableRoutes);
app.use('/api/omnicore', omniCoreRoutes);
app.use('/api/swarm', swarmRoutes);
app.use('/api/swarm-dispatch', swarmRoutes);
app.use('/api/conductor', conductorRoutes);
 // Alias for Quickstart compatibility

app.get('/api/health', (req, res) => {
    res.json({ status: 'active', system: 'OmniCore v4.0', timestamp: Date.now() });
});

app.listen(port, () => {
    console.log(`🌌 Celestial Server running at http://localhost:${port}`);
    console.log(`🔄 OmniCore Double-Ended TS Architecture Active`);
});
