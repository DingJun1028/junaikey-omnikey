export default function HomePage() {
  const pillars = [
    {
      name: "Simplicity",
      description: "Intuitive Pulse: From complex inputs to minimalist, intuitive workflows.",
    },
    {
      name: "Speed",
      description: "Quantum Resonance: Millisecond processing through predictive optimization.",
    },
    {
      name: "Stability",
      description: "Eternal Resilience: High availability and self-healing for continuous operation.",
    },
    {
      name: "Evolution",
      description: "Singularity Iteration: Continuous learning and self-transcendence to stay at the cutting edge.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-2">Jun.AI OmniKey Console</h1>
        <p className="text-xl text-gray-400">The Four Holy Pillars of the Ultimate Fusion Architecture</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pillars.map((pillar) => (
          <div key={pillar.name} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">{pillar.name}</h2>
            <p className="text-gray-300">{pillar.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}