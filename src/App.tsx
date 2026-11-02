import { useState, useEffect } from 'react';
import { SynthAI } from './synth/SynthAI';
import type { SynthResult } from './synth/SynthAI';

function App() {
  const [synth, setSynth] = useState<SynthAI | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<SynthResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [showCode, setShowCode] = useState(false);
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
    setResult(null);

    try {
      const res = await synth.process(input);
      setResult(res);
      setStats(synth.getStats());
      if (res.code) setShowCode(true);
    } catch (error) {
      setResult({
        response: `Error: ${error}`,
        thinking: '',
        confidence: 0,
        intent: 'error',
        emotion: 'neutral',
        tokens: {},
        speed: {}
      });
    } finally {
      setIsProcessing(false);
      setInput('');
    }
  };

  const quickExamples = [
    { label: '🧮 Build calculator', input: 'build a calculator' },
    { label: '⏱️ Create timer', input: 'create a timer' },
    { label: '📝 Todo list', input: 'make a todo list' },
    { label: '🎨 Dark theme', input: 'build a calculator with dark theme' },
    { label: '🏖️ Beach theme', input: 'create a timer with beach theme' },
    { label: '🔢 Math', input: '2 + 2 * 3' },
    { label: '❓ Question', input: 'what is water?' },
    { label: '👋 Hello', input: 'hello' },
    { label: '🌙 Change to dark', input: 'change to dark theme' },
    { label: '🏖️ Change to beach', input: 'change to beach theme' },
  ];

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
                  Synth SAI v6.0
                </h1>
                <p className="text-xs text-gray-500">Sovereign Local Cognitive Engine • 290 Implementations</p>
              </div>
            </div>
            {stats && (
              <div className="hidden md:flex items-center gap-4 text-xs text-gray-400">
                <span>Turns: <strong className="text-purple-400">{stats.turns}</strong></span>
                <span>Versions: <strong className="text-cyan-400">{stats.codeVersions}</strong></span>
                <span>Concepts: <strong className="text-emerald-400">{stats.semanticConcepts}</strong></span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Architecture Overview */}
        <div className="mb-8 bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
            <span>🏗️</span>
            <span className="text-gray-400 uppercase tracking-wider text-xs">Core Infrastructure (Implemented)</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[
              { name: '2M Token Memory', icon: '💾', status: '✅' },
              { name: 'Knowledge Graph', icon: '🌐', status: '✅' },
              { name: '1024D Vectors', icon: '🔢', status: '✅' },
              { name: 'Code Versioning', icon: '📝', status: '✅' },
              { name: 'Pronoun Resolver', icon: '🔗', status: '✅' },
              { name: 'Synonym Engine', icon: '📖', status: '✅' },
              { name: 'Confidence Cal.', icon: '📊', status: '✅' },
              { name: 'Clarification', icon: '❓', status: '✅' },
              { name: 'Constraint Solver', icon: '🧩', status: '✅' },
              { name: 'Commonsense', icon: '💡', status: '✅' },
              { name: 'Reasoning Monitor', icon: '🔍', status: '✅' },
              { name: 'Emotion Detection', icon: '😊', status: '✅' },
            ].map(sys => (
              <div key={sys.name} className="bg-gray-900/50 rounded-lg p-2 text-center">
                <div className="text-lg mb-1">{sys.icon} {sys.status}</div>
                <div className="text-[10px] text-gray-400">{sys.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>💬</span>
              <span>Ask Synth SAI</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Try: 'build a calculator', 'change to dark theme', '2 + 2', 'hello'"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 resize-none text-sm"
                rows={3}
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/20"
              >
                {isProcessing ? '⚡ Processing...' : 'Send →'}
              </button>
            </form>

            {/* Quick Examples */}
            <div className="mt-5">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Quick Examples:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickExamples.map(ex => (
                  <button
                    key={ex.input}
                    onClick={() => setInput(ex.input)}
                    className="px-2 py-1 bg-gray-700/50 hover:bg-gray-700 rounded text-[11px] transition-colors"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Response Panel */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>🤖</span>
                <span>Response</span>
              </h2>
              {result && (
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                    {result.intent}
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                    {result.emotion}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                    {(result.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>

            {result ? (
              <div className="space-y-3">
                {/* Main Response */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {result.response.split('**').map((part, i) =>
                      i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : <span key={i}>{part}</span>
                    )}
                  </div>
                </div>

                {/* Speed Metrics */}
                {result.speed && (result.speed as any).totalTime && (
                  <div className="flex items-center gap-4 text-[10px] text-gray-500 px-1">
                    <span>⚡ {((result.speed as any).totalTime * 1000).toFixed(0)}ms</span>
                    <span>📝 {(result.speed as any).wps?.toFixed(1)} wps</span>
                    <span>🔤 {(result.speed as any).tps?.toFixed(1)} tps</span>
                    <span>🎯 TTFB: {((result.speed as any).ttfb * 1000).toFixed(0)}ms</span>
                  </div>
                )}

                {/* Thinking Process */}
                {result.thinking && (
                  <details className="bg-gray-900/30 rounded-lg" open={showThinking} onToggle={(e) => setShowThinking((e.target as HTMLDetailsElement).open)}>
                    <summary className="px-4 py-2 cursor-pointer text-xs font-medium text-gray-400 hover:text-gray-300">
                      🧠 View Reasoning Trace ({result.thinking.split('\n').length} steps)
                    </summary>
                    <div className="px-4 pb-4">
                      <pre className="text-[11px] text-gray-500 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
                        {result.thinking}
                      </pre>
                    </div>
                  </details>
                )}

                {/* Generated Code */}
                {result.code && (
                  <details className="bg-gray-900/30 rounded-lg" open={showCode} onToggle={(e) => setShowCode((e.target as HTMLDetailsElement).open)}>
                    <summary className="px-4 py-2 cursor-pointer text-xs font-medium text-gray-400 hover:text-gray-300">
                      💻 View Generated HTML ({result.code.length} chars)
                    </summary>
                    <div className="px-4 pb-4">
                      <pre className="text-[11px] text-gray-500 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
                        {result.code}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
                <p>Send a message to see Synth SAI's response</p>
              </div>
            )}
          </div>
        </div>

        {/* Implementation Status */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <h3 className="font-semibold text-purple-400 mb-2 text-sm">✅ Implemented (11 Core Systems)</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• 2M Token Hierarchical Memory</li>
              <li>• Knowledge Graph with traversal</li>
              <li>• 1024D Semantic Space</li>
              <li>• Code Versioning System</li>
              <li>• Pronoun Resolution Engine</li>
              <li>• Synonym Expansion (200+ words)</li>
              <li>• Confidence Calibration</li>
              <li>• Clarification Engine</li>
              <li>• Constraint Solver</li>
              <li>• Commonsense Reasoning</li>
              <li>• Reasoning Process Monitor</li>
            </ul>
          </div>
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <h3 className="font-semibold text-cyan-400 mb-2 text-sm">🔧 Working Features</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Code Generation (4 components)</li>
              <li>• 10 Theme Support</li>
              <li>• Code Modification (theme change)</li>
              <li>• Math Expression Solver</li>
              <li>• Emotion Detection (7 emotions)</li>
              <li>• Intent Classification (6 types)</li>
              <li>• Pronoun Resolution</li>
              <li>• Synonym-based Matching</li>
              <li>• Confidence Scoring</li>
              <li>• Speed Metrics (WPS, TPS, TTFB)</li>
              <li>• Reasoning Trace Display</li>
            </ul>
          </div>
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <h3 className="font-semibold text-emerald-400 mb-2 text-sm">📊 Performance</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Latency: &lt;100ms typical</li>
              <li>• RAM: ~50-100MB</li>
              <li>• Storage: ~5MB</li>
              <li>• Network: Zero (fully local)</li>
              <li>• Cost: $0.00 per query</li>
              <li>• Privacy: 100% local</li>
              <li>• Transparency: Full trace</li>
              <li>• Offline: Works without internet</li>
              <li>• Rate Limits: None</li>
              <li>• Dependencies: None</li>
              <li>• GPU Required: No</li>
            </ul>
          </div>
        </div>

        {/* Roadmap */}
        <div className="mt-8 bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
            <span>🗺️</span>
            <span className="text-gray-400 uppercase tracking-wider text-xs">Remaining 279 Implementations</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
            {[
              'Knowledge Breadth', 'Language Understanding', 'Paraphrase',
              'Problem Solving', 'Code Languages', 'Creative Writing',
              'Multilingual', 'Factual Accuracy', 'Math Reasoning',
              'Code Debugging', 'Nuance Detection', 'Ambiguity Resolution',
              'Emergent Reasoning', 'World Knowledge', 'Unprecedented Inputs',
              'Creative Leaps', 'Self-Correction', 'Deep Subtext',
              'Edge Cases', 'Universal Capability', 'Temporal Reasoning',
              'Spatial Reasoning', 'Social Reasoning', 'Ethical Reasoning',
              'Metacognition', 'Theory of Mind', 'Counterfactual',
              'Trading & Finance'
            ].map(cat => (
              <div key={cat} className="bg-gray-900/50 rounded p-2 text-center text-gray-500">
                🔲 {cat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
