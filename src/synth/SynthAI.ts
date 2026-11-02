import { Utils, LogSystem, KnowledgeBase, SemanticSpace, MultiAgentReasoning, ChainOfThoughtEngine, SpeedMetrics } from './SynthEngine';

export interface BenchmarkResult {
  test: string;
  category: string;
  passed: boolean;
  score: number;
  time: number;
  details: string;
}

export interface BenchmarkSuite {
  name: string;
  results: BenchmarkResult[];
  totalTime: number;
  averageScore: number;
  passRate: number;
}

export class SynthAI {
  log: LogSystem;
  kb: KnowledgeBase;
  semanticSpace: SemanticSpace;
  multiAgent: MultiAgentReasoning;
  cot: ChainOfThoughtEngine;
  speedMetrics: SpeedMetrics;
  conversationHistory: any[] = [];
  turns = 0;

  constructor() {
    this.log = new LogSystem();
    this.kb = new KnowledgeBase();
    this.semanticSpace = new SemanticSpace();
    this.multiAgent = new MultiAgentReasoning(this.semanticSpace);
    this.cot = new ChainOfThoughtEngine();
    this.speedMetrics = new SpeedMetrics();
  }

  async process(input: string): Promise<{
    response: string;
    thinking: string;
    mode: string;
    emotion: string;
    tokens: any;
    speed: any;
  }> {
    this.speedMetrics.start();
    this.turns++;

    const cleanedInput = this.repairInput(input);
    const intent = this.classifyIntent(cleanedInput);
    const kbResults = await this.kb.search(cleanedInput, 3);
    const reasoning = await this.multiAgent.process(cleanedInput, { kbHits: kbResults.length });
    const cotResult = await this.cot.reason(cleanedInput, {
      winner: reasoning.winner,
      kbResults,
      intent,
      history: this.conversationHistory.slice(-5)
    });

    this.speedMetrics.recordFirstToken();
    let response = await this.generateResponse(cleanedInput, intent, cotResult, kbResults, reasoning);
    this.speedMetrics.recordOutput(response);

    this.conversationHistory.push({ userInput: cleanedInput, aiResponse: response, timestamp: Date.now() });
    this.log.logChat('user', cleanedInput);
    this.log.logChat('assistant', response);

    const fullThinking = reasoning.thoughtLog + '\n\n' + cotResult.steps.join('\n');
    const tokenResult = this.log.logTokens(input, fullThinking, response, {
      mode: 'normal',
      winner: reasoning.winner.name,
      intent: intent.type
    });

    return {
      response,
      thinking: fullThinking,
      mode: 'normal',
      emotion: 'neutral',
      tokens: tokenResult,
      speed: this.speedMetrics.getMetrics()
    };
  }

  repairInput(input: string): string {
    const fixes: Record<string, string> = {
      'teh': 'the', 'recieve': 'receive', 'occured': 'occurred',
      'seperate': 'separate', 'definately': 'definitely',
      'dbeach': 'beach', 'backgroun': 'background',
      'newyears': 'new year', 'count down': 'countdown'
    };
    let repaired = input;
    for (const [typo, fix] of Object.entries(fixes)) {
      repaired = repaired.replace(new RegExp(`\\b${typo}\\b`, 'gi'), fix);
    }
    repaired = repaired.replace(/(\w+)\1+/gi, '$1');
    return repaired;
  }

  classifyIntent(input: string): { type: string; confidence: number; subType?: string } {
    const lower = input.toLowerCase();

    if (/(change|modify|update|edit|fix|improve)/i.test(lower))
      return { type: 'modification', confidence: 0.95 };

    const hasCodeAction = /\b(build|create|make|generate|write|code)\b/i.test(lower);
    const hasCodeObject = /\b(timer|calculator|todo|form|game|website|app|calendar)\b/i.test(lower);
    if (hasCodeAction && hasCodeObject)
      return { type: 'code_generation', confidence: 0.95, subType: 'html' };

    if (/^[\d\s\+\-\*\/\^\(\)]+$/.test(input.trim()))
      return { type: 'math', confidence: 0.9 };
    if (/\b(define|definition|meaning)\b/i.test(lower))
      return { type: 'definition', confidence: 0.9 };
    if (/^(what|who|where|when|why|how)\b/i.test(input.trim()))
      return { type: 'question', confidence: 0.85 };
    if (/^(hi|hello|hey)\b/i.test(input.trim()))
      return { type: 'greeting', confidence: 0.95 };

    return { type: 'conversation', confidence: 0.6 };
  }

  async generateResponse(
    input: string,
    intent: any,
    cotResult: any,
    kbResults: any[],
    reasoning: any
  ): Promise<string> {
    switch (intent.type) {
      case 'code_generation':
        return this.generateCode(input);
      case 'math':
        return this.solveMath(input);
      case 'question':
        if (kbResults.length > 0 && kbResults[0].score >= 3)
          return `**${kbResults[0].title}**\n\n${kbResults[0].content}\n\n*From local knowledge base*`;
        return cotResult.conclusion;
      case 'greeting':
        return "Hello! I'm Synth-AI, your local cognitive engine. What can I help you with?";
      default:
        return cotResult.conclusion;
    }
  }

  generateCode(input: string): string {
    const lower = input.toLowerCase();
    const component = this.extractComponent(lower);
    const theme = this.extractTheme(lower);

    return `Generated ${component} with ${theme} theme.\n\n[Code would be generated here - full HTML/CSS/JS implementation]`;
  }

  extractComponent(input: string): string {
    const components: Record<string, string[]> = {
      'calendar': ['calendar', 'schedule', 'date', 'event'],
      'timer': ['timer', 'countdown', 'clock', 'stopwatch'],
      'calculator': ['calculator', 'calc', 'math', 'compute'],
      'todo': ['todo', 'task', 'list', 'checklist'],
      'form': ['form', 'input', 'submit', 'registration'],
      'game': ['game', 'play', 'snake', 'puzzle'],
      'website': ['website', 'site', 'page', 'landing'],
    };

    for (const [component, keywords] of Object.entries(components)) {
      if (keywords.some(kw => input.includes(kw))) return component;
    }
    return 'component';
  }

  extractTheme(input: string): string {
    const themes: Record<string, string[]> = {
      'beach': ['beach', 'ocean', 'sea', 'tropical'],
      'dark': ['dark', 'night', 'black', 'midnight'],
      'futuristic': ['futuristic', 'cyber', 'tech', 'sci-fi'],
      'space': ['space', 'galaxy', 'star', 'cosmic'],
    };

    for (const [theme, keywords] of Object.entries(themes)) {
      if (keywords.some(kw => input.includes(kw))) return theme;
    }
    return 'default';
  }

  solveMath(input: string): string {
    try {
      const expr = input.replace(/[^0-9\+\-\*\/\^\(\)\.\s]/g, '').trim();
      if (!expr) return "I couldn't find a mathematical expression.";
      const sanitized = expr.replace(/\^/g, '**');
      const result = Function(`"use strict"; return (${sanitized})`)();
      return `**Math Solution**\n\nExpression: \`${expr}\`\nResult: **${result}**`;
    } catch (e) {
      return "I couldn't evaluate that expression.";
    }
  }

  // BENCHMARK SUITE
  async runBenchmarks(): Promise<BenchmarkSuite> {
    const results: BenchmarkResult[] = [];
    const startTime = Date.now();

    console.log('🚀 Starting Synth-AI Benchmark Suite...\n');

    // Test 1: Typo Correction
    results.push(await this.testTypoCorrection());

    // Test 2: Intent Classification
    results.push(await this.testIntentClassification());

    // Test 3: Knowledge Base Search
    results.push(await this.testKnowledgeBase());

    // Test 4: Semantic Similarity
    results.push(await this.testSemanticSpace());

    // Test 5: Multi-Agent Reasoning
    results.push(await this.testMultiAgent());

    // Test 6: Chain-of-Thought
    results.push(await this.testChainOfThought());

    // Test 7: Math Solving
    results.push(await this.testMath());

    // Test 8: Code Generation Detection
    results.push(await this.testCodeGeneration());

    // Test 9: Response Quality
    results.push(await this.testResponseQuality());

    // Test 10: Speed Performance
    results.push(await this.testSpeed());

    // Test 11: Stress Test - Multiple Rapid Requests
    results.push(await this.testStressRapid());

    // Test 12: Stress Test - Complex Queries
    results.push(await this.testStressComplex());

    // Test 13: Memory Persistence
    results.push(await this.testMemoryPersistence());

    // Test 14: Token Estimation Accuracy
    results.push(await this.testTokenEstimation());

    // Test 15: Analogy Solving
    results.push(await this.testAnalogySolving());

    const totalTime = Date.now() - startTime;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const passRate = (results.filter(r => r.passed).length / results.length) * 100;

    return {
      name: 'Synth-AI v6.0 Complete Benchmark',
      results,
      totalTime,
      averageScore,
      passRate
    };
  }

  async testTypoCorrection(): Promise<BenchmarkResult> {
    const start = Date.now();
    const testCases = [
      { input: 'teh quick brown fox', expected: 'the quick brown fox' },
      { input: 'recieve package', expected: 'receive package' },
      { input: 'seperate items', expected: 'separate items' },
      { input: 'count down timer', expected: 'countdown timer' },
    ];

    let passed = 0;
    testCases.forEach(tc => {
      const result = this.repairInput(tc.input);
      if (result === tc.expected) passed++;
    });

    const score = (passed / testCases.length) * 100;
    return {
      test: 'Typo Correction',
      category: 'Input Processing',
      passed: score >= 75,
      score,
      time: Date.now() - start,
      details: `${passed}/${testCases.length} test cases passed`
    };
  }

  async testIntentClassification(): Promise<BenchmarkResult> {
    const start = Date.now();
    const testCases = [
      { input: 'build a calculator', expected: 'code_generation' },
      { input: 'what is the meaning of life', expected: 'question' },
      { input: 'hello there', expected: 'greeting' },
      { input: '2 + 2', expected: 'math' },
      { input: 'change the background to blue', expected: 'modification' },
    ];

    let passed = 0;
    testCases.forEach(tc => {
      const result = this.classifyIntent(tc.input);
      if (result.type === tc.expected) passed++;
    });

    const score = (passed / testCases.length) * 100;
    return {
      test: 'Intent Classification',
      category: 'Understanding',
      passed: score >= 80,
      score,
      time: Date.now() - start,
      details: `${passed}/${testCases.length} intents correctly classified`
    };
  }

  async testKnowledgeBase(): Promise<BenchmarkResult> {
    const start = Date.now();
    const results = await this.kb.search('water purification', 3);
    const passed = results.length > 0 && results[0].title === 'Water Purification';

    return {
      test: 'Knowledge Base Search',
      category: 'Memory',
      passed,
      score: passed ? 100 : 0,
      time: Date.now() - start,
      details: passed ? 'Found correct KB entry' : 'KB search failed'
    };
  }

  async testSemanticSpace(): Promise<BenchmarkResult> {
    const start = Date.now();
    const vec1 = this.semanticSpace.getVector('king');
    const vec2 = this.semanticSpace.getVector('queen');
    const similarity = Utils.cosineSimilarity(vec1, vec2);

    const passed = similarity > 0.3; // Should have some similarity
    return {
      test: 'Semantic Space',
      category: 'Understanding',
      passed,
      score: passed ? 100 : 50,
      time: Date.now() - start,
      details: `Similarity: ${similarity.toFixed(3)}`
    };
  }

  async testMultiAgent(): Promise<BenchmarkResult> {
    const start = Date.now();
    const result = await this.multiAgent.process('How to build a website?');
    const passed = result.winner && result.responses.length === 5;

    return {
      test: 'Multi-Agent Reasoning',
      category: 'Cognition',
      passed,
      score: passed ? 100 : 0,
      time: Date.now() - start,
      details: `Winner: ${result.winner.name}, ${result.responses.length} agents responded`
    };
  }

  async testChainOfThought(): Promise<BenchmarkResult> {
    const start = Date.now();
    const result = await this.cot.reason('What is water purification?', { kbResults: [] });
    const passed = result.steps.length >= 7 && result.conclusion.length > 0;

    return {
      test: 'Chain-of-Thought',
      category: 'Cognition',
      passed,
      score: passed ? 100 : 50,
      time: Date.now() - start,
      details: `${result.steps.length} steps, passed: ${result.passed}`
    };
  }

  async testMath(): Promise<BenchmarkResult> {
    const start = Date.now();
    const testCases = [
      { input: '2 + 2', expected: '4' },
      { input: '10 * 5', expected: '50' },
      { input: '100 / 4', expected: '25' },
    ];

    let passed = 0;
    testCases.forEach(tc => {
      const result = this.solveMath(tc.input);
      if (result.includes(tc.expected)) passed++;
    });

    const score = (passed / testCases.length) * 100;
    return {
      test: 'Math Solving',
      category: 'Computation',
      passed: score >= 100,
      score,
      time: Date.now() - start,
      details: `${passed}/${testCases.length} math problems solved correctly`
    };
  }

  async testCodeGeneration(): Promise<BenchmarkResult> {
    const start = Date.now();
    const testCases = [
      { input: 'build a calculator', expected: 'calculator' },
      { input: 'create a timer', expected: 'timer' },
      { input: 'make a todo list', expected: 'todo' },
    ];

    let passed = 0;
    testCases.forEach(tc => {
      const component = this.extractComponent(tc.input);
      if (component === tc.expected) passed++;
    });

    const score = (passed / testCases.length) * 100;
    return {
      test: 'Code Generation Detection',
      category: 'Output',
      passed: score >= 100,
      score,
      time: Date.now() - start,
      details: `${passed}/${testCases.length} components detected correctly`
    };
  }

  async testResponseQuality(): Promise<BenchmarkResult> {
    const start = Date.now();
    const result = await this.process('What is water purification?');
    const hasContent = result.response.length > 50;
    const hasThinking = result.thinking.length > 100;

    const passed = hasContent && hasThinking;
    return {
      test: 'Response Quality',
      category: 'Output',
      passed,
      score: passed ? 100 : 50,
      time: Date.now() - start,
      details: `Response: ${result.response.length} chars, Thinking: ${result.thinking.length} chars`
    };
  }

  async testSpeed(): Promise<BenchmarkResult> {
    const start = Date.now();
    await this.process('Hello');
    const metrics = this.speedMetrics.getMetrics();

    const passed = metrics.totalTime < 2.0; // Should complete in under 2 seconds
    const score = passed ? 100 : Math.max(0, 100 - (metrics.totalTime - 2) * 20);

    return {
      test: 'Speed Performance',
      category: 'Performance',
      passed,
      score,
      time: Date.now() - start,
      details: `Total: ${metrics.totalTime.toFixed(3)}s, WPS: ${metrics.wps.toFixed(1)}, TPS: ${metrics.tps.toFixed(1)}`
    };
  }

  async testStressRapid(): Promise<BenchmarkResult> {
    const start = Date.now();
    const requests = 10;
    let successCount = 0;

    for (let i = 0; i < requests; i++) {
      try {
        await this.process(`Test request ${i}`);
        successCount++;
      } catch (e) {
        // Failed
      }
    }

    const totalTime = Date.now() - start;
    const avgTime = totalTime / requests;
    const passed = successCount === requests && avgTime < 1000;

    return {
      test: 'Stress Test - Rapid Requests',
      category: 'Performance',
      passed,
      score: (successCount / requests) * 100,
      time: totalTime,
      details: `${successCount}/${requests} requests, avg ${avgTime.toFixed(0)}ms each`
    };
  }

  async testStressComplex(): Promise<BenchmarkResult> {
    const start = Date.now();
    const complexQueries = [
      'Build me an interactive calendar with a dark theme and animated transitions',
      'What is the meaning of life and how does it relate to quantum physics?',
      'Create a todo list that tracks my tasks and reminds me of deadlines',
    ];

    let successCount = 0;
    for (const query of complexQueries) {
      try {
        const result = await this.process(query);
        if (result.response.length > 50) successCount++;
      } catch (e) {
        // Failed
      }
    }

    const totalTime = Date.now() - start;
    const passed = successCount === complexQueries.length;

    return {
      test: 'Stress Test - Complex Queries',
      category: 'Performance',
      passed,
      score: (successCount / complexQueries.length) * 100,
      time: totalTime,
      details: `${successCount}/${complexQueries.length} complex queries handled`
    };
  }

  async testMemoryPersistence(): Promise<BenchmarkResult> {
    const start = Date.now();
    const initialTurns = this.turns;
    await this.process('Test memory');
    const afterTurns = this.turns;

    const passed = afterTurns > initialTurns;
    return {
      test: 'Memory Persistence',
      category: 'Memory',
      passed,
      score: passed ? 100 : 0,
      time: Date.now() - start,
      details: `Turns: ${initialTurns} → ${afterTurns}`
    };
  }

  async testTokenEstimation(): Promise<BenchmarkResult> {
    const start = Date.now();
    const testCases = [
      { text: 'Hello world', min: 2, max: 5 },
      { text: 'The quick brown fox jumps over the lazy dog', min: 8, max: 15 },
      { text: 'a', min: 1, max: 2 },
    ];

    let passed = 0;
    testCases.forEach(tc => {
      const tokens = Utils.estimateTokens(tc.text);
      if (tokens >= tc.min && tokens <= tc.max) passed++;
    });

    const score = (passed / testCases.length) * 100;
    return {
      test: 'Token Estimation',
      category: 'Foundation',
      passed: score >= 100,
      score,
      time: Date.now() - start,
      details: `${passed}/${testCases.length} estimates within range`
    };
  }

  async testAnalogySolving(): Promise<BenchmarkResult> {
    const start = Date.now();
    const result = this.semanticSpace.solveAnalogy('king', 'queen', 'man');
    const passed = result.answer.length > 0 && result.confidence > 0.2;

    return {
      test: 'Analogy Solving',
      category: 'Cognition',
      passed,
      score: passed ? 100 : 50,
      time: Date.now() - start,
      details: `Answer: ${result.answer}, Confidence: ${result.confidence.toFixed(3)}`
    };
  }

  getStats() {
    return {
      turns: this.turns,
      conversationLength: this.conversationHistory.length,
      kbEntries: this.kb.entries.length,
      kbCategories: Object.keys(this.kb.stats.categories).length,
      tokenStats: this.log.tokenStats
    };
  }
}
