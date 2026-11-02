import { useState, useEffect } from 'react';
import { SynthAI } from './synth/SynthAI';
import type { BenchmarkSuite } from './synth/SynthAI';

function App() {
  const [synth, setSynth] = useState<SynthAI | null>(null);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [thinking, setThinking] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkSuite | null>(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const synthAI = new SynthAI();
    setSynth(synthAI);
    setStats(synthAI.getStats());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!synth || !input.trim()) return;

    setIsProcessing(true);
    setResponse('');
    setThinking('');

    try {
      const result = await synth.process(input);
      setResponse(result.response);
      setThinking(result.thinking);
      setStats(synth.getStats());
    } catch (error) {
      setResponse(`Error: ${error}`);
    } finally {
      setIsProcessing(false);
      setInput('');
    }
  };

  const runBenchmarks = async () => {
    if (!synth) return;

    setIsBenchmarking(true);
    setBenchmarkResults(null);

    try {
      const results = await synth.runBenchmarks();
      setBenchmarkResults(results);
      setStats(synth.getStats());
    } catch (error) {
      console.error('Benchmark error:', error);
    } finally {
      setIsBenchmarking(false);
    }
  };

  const clearHistory = () => {
    if (synth) {
      synth.log.clear();
      setStats(synth.getStats());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20">
                🧠
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Synth-AI v6.0
                </h1>
                <p className="text-xs text-gray-500">Sovereign Local Cognitive Engine • Benchmark & Demo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={runBenchmarks}
                disabled={isBenchmarking || !synth}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-semibold transition-all shadow-lg shadow-purple-500/20"
              >
                {isBenchmarking ? 'Running...' : 'Run Benchmarks'}
              </button>
              <button
                onClick={clearHistory}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Turns</p>
              <p className="text-2xl font-bold text-purple-400">{stats.turns}</p>
            </div>
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">KB Entries</p>
              <p className="text-2xl font-bold text-cyan-400">{stats.kbEntries}</p>
            </div>
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Tokens</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.tokenStats.total.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Est. Cost</p>
              <p className="text-2xl font-bold text-amber-400">${synth?.log.getEstimatedCost().toFixed(4) || '0.00'}</p>
            </div>
          </div>
        )}

        {/* Benchmark Results */}
        {benchmarkResults && (
          <div className="mb-8 bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📊</span>
              Benchmark Results
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Time</p>
                <p className="text-xl font-bold text-purple-400">{(benchmarkResults.totalTime / 1000).toFixed(2)}s</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Average Score</p>
                <p className="text-xl font-bold text-cyan-400">{benchmarkResults.averageScore.toFixed(1)}%</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pass Rate</p>
                <p className="text-xl font-bold text-emerald-400">{benchmarkResults.passRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="space-y-2">
              {benchmarkResults.results.map((result, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.passed
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{result.passed ? '✓' : '✗'}</span>
                    <div>
                      <p className="font-semibold text-sm">{result.test}</p>
                      <p className="text-xs text-gray-500">{result.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold">{result.score.toFixed(0)}%</p>
                      <p className="text-xs text-gray-500">{result.time}ms</p>
                    </div>
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          result.score >= 80 ? 'bg-emerald-500' : result.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Interface */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>💬</span>
              Interactive Demo
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Ask Synth-AI anything:
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Try: 'build a calculator', 'what is water purification?', '2 + 2', 'hello'"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                  rows={4}
                  disabled={isProcessing}
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/20"
              >
                {isProcessing ? 'Processing...' : 'Send'}
              </button>
            </form>

            {/* Quick Examples */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Quick Examples:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'build a calculator',
                  'what is water purification?',
                  'hello',
                  '2 + 2',
                  'create a todo list',
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setInput(example)}
                    className="px-3 py-1 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-xs transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Response Panel */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🤖</span>
              Response
            </h2>
            {response ? (
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{response}</p>
                </div>
                {thinking && (
                  <details className="bg-gray-900/30 rounded-lg">
                    <summary className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-400 hover:text-gray-300">
                      View Thinking Process
                    </summary>
                    <div className="px-4 pb-4">
                      <pre className="text-xs text-gray-500 whitespace-pre-wrap overflow-x-auto">
                        {thinking}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-600">
                <p>Send a message to see Synth-AI's response</p>
              </div>
            )}
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="mt-8 bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🏗️</span>
            Architecture Overview
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-400 mb-2">Cognitive Systems</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Multi-Agent Deliberation (5 agents)</li>
                <li>• Chain-of-Thought Engine (7 steps)</li>
                <li>• Semantic Space (128D vectors)</li>
              </ul>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-cyan-400 mb-2">Memory & Knowledge</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Knowledge Base (4 categories)</li>
                <li>• Log System (localStorage)</li>
                <li>• Conversation History</li>
              </ul>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-400 mb-2">Output Capabilities</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Code Generation (12+ components)</li>
                <li>• Math Solving</li>
                <li>• Q&A with KB Integration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
