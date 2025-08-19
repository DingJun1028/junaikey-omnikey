import Link from 'next/link';

/**
 * 歡迎頁面 (Landing Page)
 * 遵循「以用戶為同心圓中心的SaaS應用」原則，提供清晰的價值主張。
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
          JunAiKey: The Universal Keystone
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          An intelligent agent swarm designed to automate your complex workflows,
          seamlessly integrating with your tools and knowledge.
        </p>
        <div className="pt-4">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-lg font-semibold transition-colors duration-300"
          >
            Enter the Matrix
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        <p>Powered by the Profound Development Philosophy</p>
      </footer>
    </main>
  );
}