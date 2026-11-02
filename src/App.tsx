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
        mode: 'error',
        emotion: 'neutral',
        tokens: {},
        speed: {},
        intent: 'error'
      });
    } finally {
      setIsProcessing(false);
      setInput('');
    }
  };

  const quickExamples = [
    { label: '🧮 Build calculator', input: 'build a calculator' },
    { label: '📅 Create calendar', input: 'create a calendar' },
    { label: '📝 Todo list', input: 'make a todo list' },
    { label: '🐍 Snake game', input: 'build a snake game' },
    { label: '🎨 Dark theme', input: 'build a website with dark theme' },
    { label: '🏖️ Beach timer', input: 'create a beach timer' },
    { label: '🎆 New Year', input: 'build a new year countdown' },
    { label: '🔢 Math', input: '2 + 2 * 3' },
    { label: '📖 Define AI', input: 'define artificial intelligence' },
    { label: '❓ Question', input: 'what is water purification?' },
    { label: '👋 Hello', input: 'hello' },
    { label: '🤖 Who are you', input: 'who are you' },
  ];

  const modifyExamples = [
    { label: '🌴 Add beach', input: 'add beach elements' },
    { label: '🌙 Dark mode', input: 'make it dark mode' },
    { label: '🎨 Blue color', input: 'change color to blue' },
    { label: '📏 Bigger', input: 'make it bigger' },
    { label: '✨ Animations', input: 'add animations' },
    { label: '🏖️ Beach theme', input: 'change theme to beach' },
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
                  Synth-AI v6.0
                </h1>
                <p className="text-xs text-gray-500">Sovereign Local Cognitive Engine • 80+ Tools</p>
              </div>
            </div>
            {stats && (
              <div className="hidden md:flex items-center gap-4 text-xs text-gray-400">
                <span>Turns: <strong className="text-purple-400">{stats.turns}</strong></span>
                <span>KB: <strong className="text-cyan-400">{stats.kbEntries}</strong></span>
                <span>Vectors: <strong className="text-emerald-400">{stats.semanticConcepts}</strong></span>
                <span>Tokens: <strong className="text-amber-400">{stats.tokenStats.total.toLocaleString()}</strong></span>
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
            <span className="text-gray-400 uppercase tracking-wider text-xs">Cognitive Architecture</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { name: 'Semantic Space', icon: '🌐', color: 'purple' },
              { name: 'Multi-Agent', icon: '🗣️', color: 'cyan' },
              { name: 'Chain-of-Thought', icon: '🔗', color: 'emerald' },
              { name: 'Knowledge Base', icon: '📚', color: 'amber' },
              { name: 'Code Generator', icon: '🔧', color: 'rose' },
              { name: 'Code Modifier', icon: '✏️', color: 'blue' },
              { name: 'Log System', icon: '💾', color: 'indigo' },
            ].map(sys => (
              <div key={sys.name} className="bg-gray-900/50 rounded-lg p-2 text-center">
                <div className="text-lg mb-1">{sys.icon}</div>
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
              <span>Ask Synth-AI</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Try: 'build a calculator', 'what is water purification?', '2 + 2', 'hello'"
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
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Generation:</p>
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

            {stats?.hasGeneratedCode && (
              <div className="mt-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Modify Last Code:</p>
                <div className="flex flex-wrap gap-1.5">
                  {modifyExamples.map(ex => (
                    <button
                      key={ex.input}
                      onClick={() => setInput(ex.input)}
                      className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded text-[11px] transition-colors border border-blue-500/30"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                  {result.winner && (
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                      {result.winner}
                    </span>
                  )}
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
                    <span>⚡ {(result.speed as any).totalTime.toFixed(3)}s</span>
                    <span>📝 {(result.speed as any).wps?.toFixed(1)} wps</span>
                    <span>🔤 {(result.speed as any).tps?.toFixed(1)} tps</span>
                    <span>🎯 TTFB: {((result.speed as any).ttfb * 1000).toFixed(0)}ms</span>
                  </div>
                )}

                {/* Thinking Process */}
                {result.thinking && (
                  <details className="bg-gray-900/30 rounded-lg" open={showThinking} onToggle={(e) => setShowThinking((e.target as HTMLDetailsElement).open)}>
                    <summary className="px-4 py-2 cursor-pointer text-xs font-medium text-gray-400 hover:text-gray-300">
                      🧠 View Thinking Process ({result.thinking.split('\n').length} lines)
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
                <p>Send a message to see Synth-AI's response</p>
              </div>
            )}
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <h3 className="font-semibold text-purple-400 mb-2 text-sm">🧠 Cognitive Systems</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• 128D Semantic Vector Space</li>
              <li>• 5-Agent Multi-Reasoning</li>
              <li>• 7-Step Chain-of-Thought</li>
              <li>• Self-Critique & Revision</li>
              <li>• Analogy Solving (A:B::C:?)</li>
              <li>• Emotion Detection</li>
            </ul>
          </div>
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <h3 className="font-semibold text-cyan-400 mb-2 text-sm">🔧 Code Generation (13 types)</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Calendar, Timer, Calculator</li>
              <li>• Todo List, Form, Game</li>
              <li>• Website, Dashboard, Chart</li>
              <li>• Media Player, Editor, Gallery</li>
              <li>• OS Simulation</li>
              <li>• 10 Themes × 13 Features</li>
            </ul>
          </div>
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <h3 className="font-semibold text-emerald-400 mb-2 text-sm">🌐 External Integrations</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Wikipedia API (live search)</li>
              <li>• Dictionary API (definitions)</li>
              <li>• localStorage Persistence</li>
              <li>• Math Expression Solver</li>
              <li>• Code Modification System</li>
              <li>• 50+ Typo Corrections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
