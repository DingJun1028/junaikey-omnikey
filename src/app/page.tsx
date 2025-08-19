'use client';

import { useState, useEffect } from 'react';
import { OmniCodex, MysteryEssenceExtraction } from '../index';

export default function HomePage() {
  const [sdkResult, setSdkResult] = useState('');

  useEffect(() => {
    // Instantiate the SDK
    // Note: In a real app, the API key should come from a secure source, not be hardcoded.
    const codex = new OmniCodex({ apiKey: 'YOUR_API_KEY' });

    // Define the input for the SDK method
    const coreIdea = '優化我的個人知識管理工作流，實現跨平台同步。';

    // Invoke a mystery from the SDK
    const purifiedEssence = codex.invokeMystery(
      MysteryEssenceExtraction,
      coreIdea
    );

    // Update the state with the result from the SDK
    setSdkResult(purifiedEssence);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Jun.Ai.Key SDK Demo</h1>
        <p className="mb-8">
          This page demonstrates the integration of the Jun.Ai.Key Apotheosis SDK
          within a Next.js application.
        </p>
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold mb-2">SDK Output</h2>
          <p className="text-lg text-green-400 font-mono break-all">
            {sdkResult || 'Running SDK...'}
          </p>
        </div>
      </div>
    </main>
  );
}