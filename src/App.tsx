import { useState, useEffect, useRef } from 'react';
import { SynthAI } from './synth/SynthAI';
import type { SynthResult } from './synth/SynthAI';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  confidence?: number;
  intent?: string;
  code?: string;
}

interface LogEntry {
  timestamp: number;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  data?: any;
}

function App() {
  const [synth, setSynth] = useState<SynthAI | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'code' | 'html' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Initialize SynthAI v8.0 with extreme repairs
  useEffect(() => {
    const synthAI = new SynthAI();
    
    // Set up logging callback to integrate with UI
    synthAI.setLogCallback((type, message, data) => {
      addLog(type, message, data);
    });
    
    setSynth(synthAI);
    addLog('success', 'Synth SAI v8.0 initialized with extreme stress test repairs');
    addLog('info', '6 repair systems active: typo correction, paradox resolution, contradiction detection, security scanning, code generation, self-reference handling');
    
    // Add welcome message
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: '🧠 **Synth SAI v8.0 Ready**\n\nI\'m your hybrid neural-inspired cognitive engine with extreme stress test repairs. I can handle:\n\n- Severe typos and grammar errors\n- Logical paradoxes and self-referential questions\n- Security vulnerability detection\n- Complex algorithm generation\n- Contradictory constraints\n- Multi-system integration\n\nTry asking me anything, even with typos!',
      timestamp: Date.now(),
      confidence: 0.98,
      intent: 'greeting'
    }]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (type: LogEntry['type'], message: string, data?: any) => {
    setLogs(prev => [...prev, { timestamp: Date.now(), type, message, data }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!synth || !input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    addLog('info', `User message: "${input.substring(0, 50)}${input.length > 50 ? '...' : ''}"`);
    
    setInput('');
    setIsProcessing(true);

    try {
      const startTime = Date.now();
      const result = await synth.process(input);
      const processingTime = Date.now() - startTime;

      addLog('success', `Processed in ${processingTime}ms | Confidence: ${(result.confidence * 100).toFixed(0)}% | Intent: ${result.intent}`);
      
      if (result.thinking) {
        addLog('info', `Reasoning steps: ${result.thinking.split('\n').length} lines`);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.response,
        timestamp: Date.now(),
        confidence: result.confidence,
        intent: result.intent,
        code: result.code
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If code was generated, show preview
      if (result.code) {
        setPreviewCode(result.code);
        setPreviewType('html');
        addLog('success', `Code generated: ${result.code.length} characters`);
      }

    } catch (error) {
      addLog('error', `Processing error: ${error instanceof Error ? error.message : String(error)}`);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: Date.now(),
        confidence: 0,
        intent: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: '🧠 **Chat Cleared**\n\nReady for new questions!',
      timestamp: Date.now(),
      confidence: 0.98,
      intent: 'system'
    }]);
    setPreviewCode(null);
    setPreviewType(null);
    addLog('info', 'Chat cleared');
  };

  const exportLogs = () => {
    const logText = logs.map(log => {
      const time = new Date(log.timestamp).toISOString();
      const type = log.type.toUpperCase();
      return `[${time}] [${type}] ${log.message}${log.data ? '\n' + JSON.stringify(log.data, null, 2) : ''}`;
    }).join('\n\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synth-sai-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addLog('success', 'Logs exported');
  };

  const quickExamples = [
    { label: '🐛 Fix typos', input: 'if nothng exsists then how can nothing exsist?' },
    { label: '🔒 Security scan', input: 'analyze this code: SELECT * FROM users WHERE id = " + req.query.id' },
    { label: '🧩 Paradox', input: 'this sentence is false, is it true or false?' },
    { label: '⚡ Algorithm', input: 'write a function to find longest common subsequence in O(n*m)' },
    { label: '🎨 Build UI', input: 'build a calculator with dark theme' },
    { label: '🤔 Self-aware', input: 'how do you work? explain your architecture' },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/20">
            🧠
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Synth SAI v8.0
            </h1>
            <p className="text-xs text-gray-500">Extreme Stress Test Repairs • 99%+ Pass Rate</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {showLogs ? '🔍 Hide Logs' : '🔍 Show Logs'}
          </button>
          <button
            onClick={exportLogs}
            className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            📥 Export Logs
          </button>
          <button
            onClick={clearChat}
            className="px-3 py-1.5 text-xs bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors"
          >
            🗑️ Clear
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Chat */}
        <div className="flex-1 flex flex-col border-r border-gray-800/50">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : msg.role === 'system'
                    ? 'bg-gray-800/50 border border-gray-700'
                    : 'bg-gray-800 border border-gray-700'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                  {msg.confidence !== undefined && msg.confidence > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
                      <span>Confidence: {(msg.confidence * 100).toFixed(0)}%</span>
                      {msg.intent && <span>• Intent: {msg.intent}</span>}
                    </div>
                  )}
                  {msg.code && (
                    <button
                      onClick={() => {
                        setPreviewCode(msg.code!);
                        setPreviewType('html');
                      }}
                      className="mt-2 px-3 py-1 text-xs bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
                    >
                      👁️ View Code Preview
                    </button>
                  )}
                  <div className="mt-1 text-xs opacity-50">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-sm text-gray-400 ml-2">Processing with v8.0 extreme repairs...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Examples */}
          <div className="px-6 py-3 border-t border-gray-800/50 bg-gray-900/30">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">Try:</span>
              {quickExamples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example.input)}
                  className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-800/50 bg-gray-900/50">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 resize-none text-sm"
                rows={2}
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/20"
              >
                {isProcessing ? '⏳' : '🚀'} Send
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel: Preview/Logs */}
        <div className="w-[500px] flex flex-col bg-gray-900/30">
          {showLogs ? (
            <>
              {/* Logs Panel */}
              <div className="px-4 py-3 border-b border-gray-800/50 bg-gray-900/50">
                <h2 className="text-sm font-bold text-gray-300">🔍 System Logs</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
                {logs.map((log, i) => (
                  <div key={i} className={`p-2 rounded ${
                    log.type === 'error' ? 'bg-red-900/20 border border-red-900/50' :
                    log.type === 'warning' ? 'bg-yellow-900/20 border border-yellow-900/50' :
                    log.type === 'success' ? 'bg-green-900/20 border border-green-900/50' :
                    'bg-gray-800/50 border border-gray-700/50'
                  }`}>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`font-bold ${
                        log.type === 'error' ? 'text-red-400' :
                        log.type === 'warning' ? 'text-yellow-400' :
                        log.type === 'success' ? 'text-green-400' :
                        'text-blue-400'
                      }`}>
                        [{log.type.toUpperCase()}]
                      </span>
                      <span className="text-gray-300 flex-1">{log.message}</span>
                    </div>
                    {log.data && (
                      <pre className="mt-1 text-gray-500 overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </>
          ) : previewCode ? (
            <>
              {/* Code Preview Panel */}
              <div className="px-4 py-3 border-b border-gray-800/50 bg-gray-900/50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-300">
                  👁️ {previewType === 'html' ? 'HTML Preview' : 'Code Preview'}
                </h2>
                <button
                  onClick={() => {
                    setPreviewCode(null);
                    setPreviewType(null);
                  }}
                  className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  ✕ Close
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                {previewType === 'html' ? (
                  <iframe
                    srcDoc={previewCode}
                    className="w-full h-full border-0"
                    title="Code Preview"
                  />
                ) : (
                  <pre className="p-4 text-xs text-gray-300 overflow-auto">
                    <code>{previewCode}</code>
                  </pre>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Empty State */}
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-lg font-bold mb-2">Preview Panel</h3>
                  <p className="text-sm">
                    Code previews will appear here when generated.<br/>
                    Toggle logs with the "Show Logs" button above.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
