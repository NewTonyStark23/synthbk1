import { useState } from 'react';

// Code sections organized from the README
const sections = [
  {
    id: 'dynamic-code-generator',
    title: 'DynamicCodeGenerator',
    subtitle: 'Generates code on-the-fly for ANY request',
    description: 'The DynamicCodeGenerator class is the core code generation engine. It parses user input to extract component type, theme, and features, then dynamically generates complete HTML/CSS/JS code.',
    keywords: ['calendar', 'timer', 'calculator', 'todo', 'form', 'game', 'website', 'dashboard', 'chart', 'player', 'editor', 'gallery'],
    themes: ['beach', 'dark', 'light', 'colorful', 'minimal', 'modern', 'retro', 'futuristic', 'nature', 'space'],
    code: `export interface GeneratedCode {
  code: string;
  description: string;
  component: string;
  theme: string;
  features: string[];
}

export class DynamicCodeGenerator {
  static generate(input: string): GeneratedCode {
    const lower = input.toLowerCase();

    // Extract requirements
    const component = this.extractComponent(lower);
    const theme = this.extractTheme(lower);
    const features = this.extractFeatures(lower);

    // Generate code dynamically
    const code = this.buildCode(component, theme, features);
    const description = this.buildDescription(component, theme, features);

    return { code, description, component, theme, features };
  }

  private static extractComponent(input: string): string {
    const components: Record<string, string[]> = {
      'calendar': ['calendar', 'schedule', 'date', 'event'],
      'timer': ['timer', 'countdown', 'clock', 'stopwatch'],
      'calculator': ['calculator', 'calc', 'math', 'compute'],
      'todo': ['todo', 'task', 'list', 'checklist'],
      'form': ['form', 'input', 'submit', 'registration'],
      'game': ['game', 'play', 'snake', 'puzzle'],
      'website': ['website', 'site', 'page', 'landing'],
      'dashboard': ['dashboard', 'panel', 'admin', 'control'],
      'chart': ['chart', 'graph', 'plot', 'visualization'],
      'player': ['player', 'audio', 'video', 'music'],
      'editor': ['editor', 'text', 'code', 'write'],
      'gallery': ['gallery', 'image', 'photo', 'portfolio']
    };

    for (const [component, keywords] of Object.entries(components)) {
      if (keywords.some(kw => input.includes(kw))) {
        return component;
      }
    }
    return 'component';
  }

  private static extractTheme(input: string): string {
    const themes: Record<string, string[]> = {
      'beach': ['beach', 'ocean', 'sea', 'tropical', 'sand', 'wave'],
      'dark': ['dark', 'night', 'black', 'midnight'],
      'light': ['light', 'bright', 'white', 'clean'],
      'colorful': ['colorful', 'vibrant', 'rainbow', 'neon'],
      'minimal': ['minimal', 'simple', 'clean', 'basic'],
      'modern': ['modern', 'contemporary', 'sleek', 'stylish'],
      'retro': ['retro', 'vintage', 'classic', 'old'],
      'futuristic': ['futuristic', 'cyber', 'tech', 'sci-fi'],
      'nature': ['nature', 'forest', 'green', 'earth', 'organic'],
      'space': ['space', 'galaxy', 'star', 'cosmic', 'universe']
    };

    for (const [theme, keywords] of Object.entries(themes)) {
      if (keywords.some(kw => input.includes(kw))) {
        return theme;
      }
    }
    return 'default';
  }

  private static extractFeatures(input: string): string[] {
    const features: string[] = [];
    if (input.includes('interactive')) features.push('interactive');
    if (input.includes('animated') || input.includes('animation')) features.push('animated');
    if (input.includes('responsive')) features.push('responsive');
    if (input.includes('real-time') || input.includes('realtime')) features.push('realtime');
    if (input.includes('countdown')) features.push('countdown');
    if (input.includes('new year') || input.includes('newyear')) features.push('newyear');
    if (input.includes('drag') || input.includes('drop')) features.push('dragdrop');
    if (input.includes('search')) features.push('search');
    if (input.includes('filter')) features.push('filter');
    if (input.includes('sort')) features.push('sort');
    return features;
  }

  private static getThemeColors(theme: string): { bg: string; card: string; accent: string; text: string } {
    const themes: Record<string, { bg: string; card: string; accent: string; text: string }> = {
      'beach': {
        bg: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #F4A460 100%)',
        card: 'rgba(255, 255, 255, 0.9)', accent: '#4682B4', text: '#333'
      },
      'dark': {
        bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        card: 'rgba(255, 255, 255, 0.1)', accent: '#667eea', text: '#fff'
      },
      'futuristic': {
        bg: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
        card: 'rgba(0, 255, 255, 0.1)', accent: '#00ffff', text: '#fff'
      },
      // ... more themes
    };
    return themes[theme] || themes['default'];
  }
}`
  },
  {
    id: 'utilities',
    title: 'UTILITIES',
    subtitle: 'Core utility functions for the engine',
    description: 'The Utils class provides fundamental mathematical and text processing operations including token estimation, cosine similarity, vector operations, Levenshtein distance, Soundex phonetic matching, and keyword extraction.',
    methods: ['estimateTokens', 'cosineSimilarity', 'vectorAdd', 'vectorSubtract', 'normalize', 'softmax', 'levenshtein', 'soundex', 'extractKeywords'],
    code: `export class Utils {
  static estimateTokens(text: string): number {
    if (!text) return 0;
    const words = text.trim().split(/\\s+/).length;
    const chars = text.length;
    return Math.max(1, Math.round(Math.max(words * 1.3, chars / 4)));
  }

  static cosineSimilarity(v1: number[], v2: number[]): number {
    let dot = 0, mag1 = 0, mag2 = 0;
    const len = Math.min(v1.length, v2.length);
    for (let i = 0; i < len; i++) {
      dot += v1[i] * v2[i];
      mag1 += v1[i] * v1[i];
      mag2 += v2[i] * v2[i];
    }
    const denom = Math.sqrt(mag1) * Math.sqrt(mag2);
    return denom === 0 ? 0 : dot / denom;
  }

  static vectorAdd(v1: number[], v2: number[]): number[] {
    return v1.map((v, i) => v + (v2[i] || 0));
  }

  static vectorSubtract(v1: number[], v2: number[]): number[] {
    return v1.map((v, i) => v - (v2[i] || 0));
  }

  static normalize(v: number[]): number[] {
    const mag = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    return mag === 0 ? v : v.map(x => x / mag);
  }

  static softmax(scores: number[], temperature: number = 1.0): number[] {
    const max = Math.max(...scores);
    const exps = scores.map(s => Math.exp((s - max) / temperature));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
  }

  static levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i-1] === b[j-1]
          ? dp[i-1][j-1]
          : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
    return dp[m][n];
  }

  static soundex(word: string): string {
    if (!word) return '';
    const map: Record<string, number> = {
      B:1,F:1,P:1,V:1,C:2,G:2,J:2,K:2,Q:2,S:2,X:2,Z:2,
      D:3,T:3,L:4,M:5,N:5,R:6
    };
    word = word.toUpperCase().replace(/[^A-Z]/g, '');
    if (!word) return '';
    let result = word[0];
    let lastCode = map[word[0]] || 0;
    for (let i = 1; i < word.length && result.length < 4; i++) {
      const code = map[word[i]] || 0;
      if (code && code !== lastCode) { result += code; lastCode = code; }
      else if (!code) lastCode = 0;
    }
    while (result.length < 4) result += '0';
    return result;
  }

  static extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the','a','an','and','or','but','in','on','at','to','for',
      'of','with','by','is','are','was','were','be','been',
      'i','you','he','she','it','we','they'
    ]);
    const words = text.toLowerCase().split(/\\W+/)
      .filter(w => w.length > 3 && !stopWords.has(w));
    const freq: Record<string, number> = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    return Object.entries(freq)
      .sort((a,b) => b[1]-a[1])
      .slice(0, 10).map(([w]) => w);
  }
}`
  },
  {
    id: 'log-system',
    title: 'LOG SYSTEM',
    subtitle: 'Persistent logging with token tracking',
    description: 'The LogSystem class provides comprehensive logging with localStorage persistence, token usage tracking, cost estimation (Claude Opus pricing), and formatted chat log export.',
    features: ['localStorage persistence', 'Token estimation', 'Cost tracking ($0.00 Synth cost)', 'Chat log formatting', '2000 log limit'],
    code: `export class LogSystem {
  logs: Array<{ ts: number; type: string; message: string; data?: any }> = [];
  tokenStats = {
    input: 0, thinking: 0, output: 0,
    total: 0, interactions: 0,
    perInteraction: [] as any[]
  };

  constructor() { this.load(); }

  load() {
    try {
      const logs = localStorage.getItem('synth_logs');
      const tokens = localStorage.getItem('synth_tokens');
      if (logs) this.logs = JSON.parse(logs);
      if (tokens) this.tokenStats = JSON.parse(tokens);
    } catch (e) { /* fresh start */ }
  }

  save() {
    try {
      localStorage.setItem('synth_logs', JSON.stringify(this.logs.slice(-2000)));
      localStorage.setItem('synth_tokens', JSON.stringify(this.tokenStats));
    } catch (e) { /* storage full */ }
  }

  add(type: string, message: string, data: any = null) {
    this.logs.push({ ts: Date.now(), type, message, data });
    if (this.logs.length > 2000) this.logs = this.logs.slice(-2000);
    this.save();
  }

  info(msg: string, data?: any) { this.add('INFO', msg, data); }
  warn(msg: string, data?: any) { this.add('WARN', msg, data); }
  error(msg: string, data?: any) { this.add('ERROR', msg, data); }
  debug(msg: string, data?: any) { this.add('DEBUG', msg, data); }

  logChat(role: string, content: string) {
    this.add('CHAT', \`\${role}: \${content.substring(0, 200)}\`, { role, content });
  }

  logTokens(input: string, thinking: string, output: string, metadata: any = {}) {
    const inTok = Utils.estimateTokens(input);
    const thinkTok = Utils.estimateTokens(thinking);
    const outTok = Utils.estimateTokens(output);
    const total = inTok + thinkTok + outTok;

    this.tokenStats.input += inTok;
    this.tokenStats.thinking += thinkTok;
    this.tokenStats.output += outTok;
    this.tokenStats.total += total;
    this.tokenStats.interactions++;
    this.tokenStats.perInteraction.push({
      ts: Date.now(), input: inTok, thinking: thinkTok,
      output: outTok, total, ...metadata
    });
    if (this.tokenStats.perInteraction.length > 200) {
      this.tokenStats.perInteraction = this.tokenStats.perInteraction.slice(-200);
    }
    this.save();
    return { input: inTok, thinking: thinkTok, output: outTok, total };
  }

  getEstimatedCost(): number {
    return ((this.tokenStats.input / 1e6) * 15) +
           (((this.tokenStats.thinking + this.tokenStats.output) / 1e6) * 75);
  }

  formatWithChat(): string {
    // Formats complete conversation + system logs + token stats
    // Returns formatted string with conversation, system log, and token stats
  }

  clear() { this.logs = []; this.save(); }
}`
  },
  {
    id: 'knowledge-base',
    title: 'KNOWLEDGE BASE',
    subtitle: 'Local knowledge retrieval with keyword scoring',
    description: 'The KnowledgeBase class provides local knowledge storage and retrieval with seeded entries covering survival, tech, and trading topics. Uses keyword matching with scoring for relevance ranking.',
    categories: ['survival', 'tech', 'trading'],
    code: `export class KnowledgeBase {
  entries: any[] = [];
  stats = { total: 0, categories: {} as Record<string, number> };

  constructor() { this.seed(); }

  seed() {
    this.entries = [
      {
        category: 'survival',
        title: 'Water Purification',
        content: 'Boil 1 min (3 min above 6500ft). Or 8 drops bleach per gallon, wait 30 min. Or SODIS: clear bottle in sun 6 hours.',
        keywords: ['water', 'purification', 'boil', 'bleach']
      },
      {
        category: 'survival',
        title: 'Edible Plants',
        content: 'SAFE: Dandelion (all parts), Cattail (shoots/roots), Clover (flowers/leaves), Pine needles (vitamin C). DEADLY: Poison hemlock, Water hemlock, Nightshade berries.',
        keywords: ['plants', 'edible', 'dandelion', 'poison']
      },
      {
        category: 'tech',
        title: 'HTTP Status Codes',
        content: '2xx Success (200 OK, 201 Created). 4xx Client Error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found). 5xx Server Error (500, 502, 503).',
        keywords: ['http', 'status', 'error', '404']
      },
      {
        category: 'trading',
        title: 'Position Sizing',
        content: 'Shares = (Account × Risk%) ÷ Stop Distance. Example: $2000 account, 2% risk, $0.30 stop → 133 shares. Never risk >2% per trade.',
        keywords: ['position', 'sizing', 'risk', 'shares']
      },
    ];
    this.stats.total = this.entries.length;
    this.entries.forEach(e => {
      this.stats.categories[e.category] = (this.stats.categories[e.category] || 0) + 1;
    });
  }

  async search(query: string, limit: number = 5): Promise<any[]> {
    const keywords = query.toLowerCase().split(/\\W+/).filter(w => w.length > 2);
    const scored = this.entries.map(entry => {
      let score = 0;
      const text = (entry.title + ' ' + entry.content + ' ' + entry.keywords.join(' ')).toLowerCase();
      keywords.forEach(kw => {
        if (text.includes(kw)) score += 1;
        if (entry.keywords.some((ek: string) => ek.includes(kw) || kw.includes(ek))) score += 2;
      });
      return { ...entry, score };
    }).filter(e => e.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
    return scored;
  }
}`
  },
  {
    id: 'semantic-space',
    title: 'SEMANTIC SPACE (128D)',
    subtitle: 'Vector-based semantic understanding',
    description: 'The SemanticSpace class creates a 128-dimensional vector space for semantic understanding. It uses hash-based vector generation for concepts and cosine similarity for finding related concepts. Supports analogy solving (A:B::C:?).',
    dimensions: 128,
    coreConcepts: 60,
    code: `export class SemanticSpace {
  dimensions = 128;
  concepts = new Map<string, number[]>();

  constructor() { this.seed(); }

  seed() {
    const coreConcepts = [
      'hi', 'hello', 'hey', 'analyze', 'why', 'how', 'what', 'when', 'where', 'who',
      'create', 'imagine', 'design', 'build', 'make', 'generate',
      'trade', 'buy', 'sell', 'stock', 'crypto', 'market',
      'code', 'program', 'debug', 'function', 'api', 'javascript', 'python',
      'fix', 'repair', 'solve', 'error', 'bug',
      'logo', 'graph', 'chart', 'ui', 'hud', 'mockup',
      'business', 'startup', 'company', 'revenue', 'profit',
      'recipe', 'cook', 'ingredient', 'meal', 'food',
      'legal', 'law', 'court', 'lawsuit', 'contract', 'attorney',
      'survival', 'plant', 'water', 'danger', 'safe', 'edible', 'poison',
      'switch', 'mode', 'role', 'rename',
      'stupid', 'hate', 'wrong', 'messed', 'fail',
      'key', 'api key', 'token', 'secret',
      'remind', 'goal', 'task', 'schedule',
      'default'
    ];
    coreConcepts.forEach(concept => {
      const vec = new Array(this.dimensions).fill(0);
      let hash = 0;
      for (let i = 0; i < concept.length; i++) {
        hash = ((hash << 5) - hash) + concept.charCodeAt(i);
        hash = hash & hash;
      }
      for (let i = 0; i < this.dimensions; i++) {
        vec[i] = Math.sin(hash + i * 1000) * 0.5 + 0.5;
      }
      this.concepts.set(concept, Utils.normalize(vec));
    });
  }

  getVector(text: string): number[] {
    const words = text.toLowerCase().split(/\\W+/).filter(w => w.length > 0);
    const vec = new Array(this.dimensions).fill(0);
    let count = 0;
    words.forEach(w => {
      let conceptVec = this.concepts.get(w);
      if (!conceptVec) {
        conceptVec = this.generateVector(w);
        this.concepts.set(w, conceptVec);
      }
      for (let i = 0; i < this.dimensions; i++) vec[i] += conceptVec[i];
      count++;
    });
    if (count === 0) return this.concepts.get('default') || new Array(this.dimensions).fill(0.5);
    return Utils.normalize(vec.map(v => v / count));
  }

  findClosest(targetVec: number[], topN: number = 5): Array<{ concept: string; similarity: number }> {
    const scored: Array<{ concept: string; similarity: number }> = [];
    this.concepts.forEach((vec, concept) => {
      const sim = Utils.cosineSimilarity(targetVec, vec);
      scored.push({ concept, similarity: sim });
    });
    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, topN);
  }

  solveAnalogy(A: string, B: string, C: string): { answer: string; confidence: number } {
    const vecA = this.getVector(A);
    const vecB = this.getVector(B);
    const vecC = this.getVector(C);
    const relation = Utils.vectorSubtract(vecB, vecA);
    const target = Utils.vectorAdd(vecC, relation);
    const closest = this.findClosest(target, 1);
    return { answer: closest[0]?.concept || 'unknown', confidence: closest[0]?.similarity || 0 };
  }
}`
  },
  {
    id: 'multi-agent',
    title: 'MULTI-AGENT REASONING',
    subtitle: '5-agent deliberation with voting',
    description: 'The MultiAgentReasoning class implements a 5-agent system where each agent has a different strategy (deductive, combinatorial, statistical, contextual, adversarial). Agents generate responses, vote on each other\'s outputs, and the highest-scoring response wins.',
    agents: [
      { name: 'LOGIC', strategy: 'deductive' },
      { name: 'CREATE', strategy: 'combinatorial' },
      { name: 'ANALYZE', strategy: 'statistical' },
      { name: 'EMPATHY', strategy: 'contextual' },
      { name: 'CRITIC', strategy: 'adversarial' }
    ],
    code: `export class MultiAgentReasoning {
  semanticSpace: SemanticSpace;
  agents: Array<{ name: string; strategy: string; generateResponse: (input: string, context: any) => string }>;

  constructor(semanticSpace: SemanticSpace) {
    this.semanticSpace = semanticSpace;
    this.agents = [
      {
        name: 'LOGIC',
        strategy: 'deductive',
        generateResponse: (input: string, context: any) => {
          const keywords = Utils.extractKeywords(input);
          const premises = keywords.slice(0, 3).map(k => \`• \${k} is a key factor\`);
          return \`**Logical Analysis:**\\n\\nPremises:\\n\${premises.join('\\n')}\\n\\nConclusion: Based on deductive reasoning, the answer involves \${keywords.slice(0, 2).join(' and')}.\`;
        }
      },
      {
        name: 'CREATE',
        strategy: 'combinatorial',
        generateResponse: (input: string, context: any) => {
          const keywords = Utils.extractKeywords(input);
          return \`**Creative Exploration:**\\n\\nWhat if we approach \${keywords[0]} from a completely different angle?\\n\\nCombining \${keywords[0]} with \${keywords[1]} creates new possibilities.\`;
        }
      },
      {
        name: 'ANALYZE',
        strategy: 'statistical',
        generateResponse: (input: string, context: any) => {
          const keywords = Utils.extractKeywords(input);
          return \`**Analytical Breakdown:**\\n\\nKey factors: \${keywords.join(', ')}\\n\\nPattern analysis suggests focusing on \${keywords[0]} as the primary variable.\`;
        }
      },
      {
        name: 'EMPATHY',
        strategy: 'contextual',
        generateResponse: (input: string, context: any) => {
          const isFrustrated = /stupid|wrong|fail/i.test(input);
          let response = \`**Human Context:**\\n\\n\`;
          if (isFrustrated) response += \`I sense frustration. Let me address your concern directly.\`;
          else response += \`Let me consider what would be most helpful.\`;
          return response;
        }
      },
      {
        name: 'CRITIC',
        strategy: 'adversarial',
        generateResponse: (input: string, context: any) => {
          const keywords = Utils.extractKeywords(input);
          return \`**Critical Assessment:**\\n\\nPotential issue: \${keywords[0]} might have edge cases.\\n\\nWe should verify these assumptions before proceeding.\`;
        }
      }
    ];
  }

  async process(input: string, context: any = {}): Promise<{ winner: any; analyses: any[]; responses: string[]; thoughtLog: string }> {
    const thoughtLog: string[] = [];
    thoughtLog.push('═══ MULTI-AGENT DELIBERATION ═══');

    const responses = this.agents.map(agent => {
      const response = agent.generateResponse(input, context);
      thoughtLog.push(\`\\n[\${agent.name}] Strategy: \${agent.strategy}\`);
      return { agent: agent.name, response, strategy: agent.strategy };
    });

    // Voting: each agent scores all responses
    const votes = this.agents.map(agent => {
      const scores = responses.map(r => {
        if (agent.strategy === 'deductive' && r.response.includes('Logical')) return 0.9;
        if (agent.strategy === 'combinatorial' && r.response.includes('Creative')) return 0.9;
        if (agent.strategy === 'statistical' && r.response.includes('Analytical')) return 0.9;
        if (agent.strategy === 'contextual' && r.response.includes('Human')) return 0.9;
        if (agent.strategy === 'adversarial' && r.response.includes('Critical')) return 0.9;
        return 0.3 + Math.random() * 0.3;
      });
      return { agent: agent.name, votes: scores };
    });

    const totalScores = responses.map((_, i) =>
      votes.reduce((sum, v) => sum + v.votes[i], 0)
    );

    const winnerIndex = totalScores.indexOf(Math.max(...totalScores));
    const winner = responses[winnerIndex];

    return {
      winner: { name: winner.agent, strategy: winner.strategy },
      analyses: responses.map((r, i) => ({ name: r.agent, score: totalScores[i] })),
      responses: responses.map(r => r.response),
      thoughtLog: thoughtLog.join('\\n')
    };
  }
}`
  },
  {
    id: 'chain-of-thought',
    title: 'CHAIN-OF-THOUGHT ENGINE',
    subtitle: '7-step reasoning with self-critique',
    description: 'The ChainOfThoughtEngine implements a structured 7-step reasoning process: Decompose → Retrieve → Hypothesize → Verify → Synthesize → Critique → Revise. Each step is logged and the engine can self-correct if the critique fails.',
    steps: ['DECOMPOSE', 'RETRIEVE', 'HYPOTHESIZE', 'VERIFY', 'SYNTHESIZE', 'CRITIQUE', 'REVISE'],
    code: `export class ChainOfThoughtEngine {
  async reason(input: string, context: any): Promise<{
    steps: string[]; conclusion: string; passed: boolean; revision?: string
  }> {
    const steps: string[] = [];
    let passed = true;
    let revision: string | undefined;

    // STEP 1: DECOMPOSE - Parse input into subject, action, context, type
    steps.push('═══ STEP 1: DECOMPOSE ═══');
    const parsed = this.decomposeInput(input);
    steps.push(\`Subject: \${parsed.subject}\`);
    steps.push(\`Action: \${parsed.action}\`);
    steps.push(\`Question type: \${parsed.type}\`);

    // STEP 2: RETRIEVE - Search knowledge base + Wikipedia
    steps.push('\\n═══ STEP 2: RETRIEVE ═══');
    const retrieved = await this.retrieveKnowledge(input, context);

    // STEP 3: HYPOTHESIZE - Generate candidate responses
    steps.push('\\n═══ STEP 3: HYPOTHESIZE ═══');
    const hypotheses = this.generateHypotheses(input, parsed, retrieved, context);

    // STEP 4: VERIFY - Score each hypothesis
    steps.push('\\n═══ STEP 4: VERIFY ═══');
    const verified = this.verifyHypotheses(hypotheses, retrieved);

    // STEP 5: SYNTHESIZE - Select best hypothesis
    steps.push('\\n═══ STEP 5: SYNTHESIZE ═══');
    let bestIndex = 0;
    let bestConfidence = 0;
    verified.forEach((v, i) => {
      if (v.confidence > bestConfidence) {
        bestConfidence = v.confidence;
        bestIndex = i;
      }
    });

    // STEP 6: CRITIQUE - Check completeness, accuracy, clarity, relevance
    steps.push('\\n═══ STEP 6: CRITIQUE ═══');
    const critique = this.critiqueResponse(hypotheses[bestIndex], input, parsed, retrieved);

    // STEP 7: REVISE or PASS
    const allPassed = critique.completeness && critique.accuracy && critique.clarity && critique.relevance;
    if (!allPassed) {
      steps.push('\\n═══ STEP 7: REVISE ═══');
      revision = this.reviseResponse(hypotheses[bestIndex], critique);
      passed = false;
    } else {
      steps.push('\\n═══ STEP 7: PASSED ═══');
    }

    return { steps, conclusion: revision || hypotheses[bestIndex], passed, revision };
  }

  decomposeInput(input: string): { subject: string; action: string; context: string[]; type: string } {
    const keywords = Utils.extractKeywords(input);
    let type = 'statement';
    if (/^(what|who|where|when|why|how)\\b/i.test(input)) type = 'factual';
    else if (/^(can|could|will|would|should|is|are)\\b/i.test(input)) type = 'yes/no';
    else if (/\\b(build|create|make|generate)\\b/i.test(input.toLowerCase())) type = 'creation';
    else if (/\\b(define|explain|describe)\\b/i.test(input.toLowerCase())) type = 'definition';

    return {
      subject: keywords[0] || 'unknown',
      action: input.match(/\\b(build|create|make|generate|define|explain)\\b/i)?.[1] || 'discuss',
      context: keywords.slice(1, 4),
      type
    };
  }

  async retrieveKnowledge(input: string, context: any): Promise<{ kb: any[]; web: string | null }> {
    const kb = context.kbResults || [];
    let web: string | null = null;
    // Fetches from Wikipedia API for questions
    return { kb, web };
  }

  critiqueResponse(response: string, input: string, parsed: any, retrieved: any) {
    const keywords = Utils.extractKeywords(input);
    const missing = keywords.filter(kw => !response.toLowerCase().includes(kw));
    const completeness = missing.length === 0 || missing.length <= 1;
    // Also checks: accuracy, clarity, relevance
    return { completeness, missing, accuracy: true, inaccuracies: [], clarity: true, unclear: [], relevance: true, offTopic: [] };
  }
}`
  },
  {
    id: 'speed-metrics',
    title: 'SPEED METRICS',
    subtitle: 'Performance measurement system',
    description: 'The SpeedMetrics class tracks generation performance including words-per-second, tokens-per-second, time-to-first-byte, and total generation time.',
    metrics: ['WPS (Words Per Second)', 'TPS (Tokens Per Second)', 'TTFB (Time to First Byte)', 'Total Time'],
    code: `export class SpeedMetrics {
  startTime = 0;
  firstTokenTime = 0;
  tokensGenerated = 0;
  wordsGenerated = 0;

  start() {
    this.startTime = Date.now();
    this.firstTokenTime = 0;
    this.tokensGenerated = 0;
    this.wordsGenerated = 0;
  }

  recordFirstToken() {
    if (this.firstTokenTime === 0) this.firstTokenTime = Date.now();
  }

  recordOutput(text: string) {
    this.tokensGenerated += Utils.estimateTokens(text);
    this.wordsGenerated += text.trim().split(/\\s+/).length;
  }

  getMetrics(): { wps: number; tps: number; ttfb: number; totalTime: number } {
    const totalTime = (Date.now() - this.startTime) / 1000;
    const ttfb = this.firstTokenTime > 0
      ? (this.firstTokenTime - this.startTime) / 1000 : 0;
    return {
      wps: totalTime > 0 ? this.wordsGenerated / totalTime : 0,
      tps: totalTime > 0 ? this.tokensGenerated / totalTime : 0,
      ttfb,
      totalTime
    };
  }
}`
  },
  {
    id: 'synth-orchestrator',
    title: 'MAIN SYNTHAI ORCHESTRATOR',
    subtitle: 'Central coordination of all subsystems',
    description: 'The SynthAI class is the main orchestrator that coordinates all 7 subsystems. It handles the full processing pipeline: typo repair → intent classification → KB query → multi-agent reasoning → chain-of-thought → response generation → logging.',
    subsystems: ['LogSystem', 'KnowledgeBase', 'SemanticSpace', 'MultiAgentReasoning', 'ChainOfThoughtEngine', 'CodeGenerator', 'SpeedMetrics'],
    intentTypes: ['code_generation', 'modification', 'math', 'definition', 'question', 'greeting', 'identity', 'conversation'],
    code: `export class SynthAI {
  log: LogSystem;
  kb: KnowledgeBase;
  semanticSpace: SemanticSpace;
  multiAgent: MultiAgentReasoning;
  cot: ChainOfThoughtEngine;
  codeGenerator: CodeGenerator;
  speedMetrics: SpeedMetrics;
  conversationHistory: any[] = [];
  turns = 0;

  private lastGeneratedCode: string = '';
  private lastCodeDescription: string = '';

  constructor() {
    this.log = new LogSystem();
    this.kb = new KnowledgeBase();
    this.semanticSpace = new SemanticSpace();
    this.multiAgent = new MultiAgentReasoning(this.semanticSpace);
    this.cot = new ChainOfThoughtEngine();
    this.codeGenerator = new CodeGenerator();
    this.speedMetrics = new SpeedMetrics();
  }

  async process(input: string): Promise<{
    response: string; thinking: string; mode: string; emotion: string; tokens: any; speed: any
  }> {
    this.speedMetrics.start();
    this.turns++;

    // 1. Typo repair
    const cleanedInput = this.repairInput(input);

    // 2. Intent classification
    const intent = this.classifyIntent(cleanedInput);

    // 3. Knowledge base query
    const kbResults = await this.kb.search(cleanedInput, 3);

    // 4. Multi-agent reasoning
    const reasoning = await this.multiAgent.process(cleanedInput, { kbHits: kbResults.length });

    // 5. Chain-of-thought
    const cotResult = await this.cot.reason(cleanedInput, {
      winner: reasoning.winner, kbResults, intent,
      history: this.conversationHistory.slice(-5)
    });

    // 6. Generate response based on intent
    this.speedMetrics.recordFirstToken();
    let response = await this.generateResponse(cleanedInput, intent, cotResult, kbResults, reasoning);
    this.speedMetrics.recordOutput(response);

    // 7. Store history and log
    this.conversationHistory.push({ userInput: cleanedInput, aiResponse: response, timestamp: Date.now() });
    this.log.logChat('user', cleanedInput);
    this.log.logChat('assistant', response);

    // 8. Log tokens
    const fullThinking = reasoning.thoughtLog + '\\n\\n' + cotResult.steps.join('\\n');
    const tokenResult = this.log.logTokens(input, fullThinking, response, {
      mode: 'normal', winner: reasoning.winner.name, intent: intent.type
    });

    return {
      response, thinking: fullThinking, mode: 'normal',
      emotion: 'neutral', tokens: tokenResult, speed: this.speedMetrics.getMetrics()
    };
  }

  classifyIntent(input: string): { type: string; confidence: number; subType?: string } {
    const lower = input.toLowerCase();

    // Modification detection (HIGHEST priority)
    if (/(change|modify|update|edit|fix|improve)/i.test(lower))
      return { type: 'modification', confidence: 0.95 };

    // Code generation detection
    const hasCodeAction = /\\b(build|create|make|generate|write|code)\\b/i.test(lower);
    const hasCodeObject = /\\b(timer|calculator|todo|form|game|website|app|calendar)\\b/i.test(lower);
    if (hasCodeAction && hasCodeObject)
      return { type: 'code_generation', confidence: 0.95, subType: 'html' };

    if (/^[\\d\\s\\+\\-\\*\\/\\^\\(\\)]+$/.test(input.trim()))
      return { type: 'math', confidence: 0.9 };
    if (/\\b(define|definition|meaning)\\b/i.test(lower))
      return { type: 'definition', confidence: 0.9 };
    if (/^(what|who|where|when|why|how)\\b/i.test(input.trim()))
      return { type: 'question', confidence: 0.85 };
    if (/^(hi|hello|hey)\\b/i.test(input.trim()))
      return { type: 'greeting', confidence: 0.95 };

    return { type: 'conversation', confidence: 0.6 };
  }

  repairInput(input: string): string {
    const fixes: Record<string, string> = {
      'teh': 'the', 'recieve': 'receive', 'occured': 'occurred',
      'seperate': 'separate', 'definately': 'definitely',
      'dbeach': 'beach', 'backgroun': 'background',
      'newyears': 'new year', 'count down': 'countdown'
    };
    let repaired = input;
    for (const [typo, fix] of Object.entries(fixes))
      repaired = repaired.replace(new RegExp(\`\\\\b\${typo}\\\\b\`, 'gi'), fix);
    repaired = repaired.replace(/(\\w+)\\1+/gi, '$1');
    return repaired;
  }
}`
  },
  {
    id: 'production-engine',
    title: 'SynthAI v6.0 - Production Engine',
    subtitle: 'Complete production-ready implementation',
    description: 'The final production version of SynthAI includes all subsystems with enhanced code generation supporting 13+ component types (calendar, timer, calculator, todo, form, game, website, dashboard, chart, player, editor, gallery, OS), 10 themes, and extensive typo correction.',
    components: ['calendar', 'timer', 'calculator', 'todo', 'form', 'game', 'website', 'dashboard', 'chart', 'player', 'editor', 'gallery', 'os'],
    code: `// Synth-AI v6.0 - Complete Production Engine
// All functionality is real, working, and production-ready

export class SynthAI {
  private conversationHistory: Array<{role: string, content: string, timestamp: number}> = [];
  private lastGeneratedCode: string = '';
  private lastComponentType: string = '';
  private lastTheme: string = '';
  private turnCount: number = 0;

  constructor() {
    console.log('[SynthAI] v6.0 Production Engine initialized');
  }

  async process(input: string): Promise<{response: string, thinking: string, code?: string}> {
    this.turnCount++;
    const startTime = Date.now();

    // 1. Typo correction
    const corrected = this.correctTypos(input);

    // 2. Intent classification
    const intent = this.classifyIntent(corrected);

    // 3. Generate response
    let response = '', thinking = '', code = '';

    switch (intent.type) {
      case 'code_generation':
        const result = this.generateCode(corrected);
        response = result.response;
        thinking = result.thinking;
        code = result.code;
        break;
      case 'modification':
        const modResult = this.modifyCode(corrected);
        response = modResult.response;
        code = modResult.code;
        break;
      case 'question':
        response = this.answerQuestion(corrected);
        break;
      default:
        response = this.handleConversation(corrected);
    }

    // 4. Store in history
    this.conversationHistory.push({ role: 'user', content: corrected, timestamp: Date.now() });
    this.conversationHistory.push({ role: 'assistant', content: response, timestamp: Date.now() });

    return { response, thinking, code };
  }

  private correctTypos(input: string): string {
    const corrections: Record<string, string> = {
      'dbeach': 'beach', 'backgroun': 'background', 'cnew': 'new',
      'count down': 'countdown', 'newyears': 'new year',
      'teh': 'the', 'adn': 'and', 'taht': 'that', 'wiht': 'with',
      'recieve': 'receive', 'occured': 'occurred', 'seperate': 'separate',
      'definately': 'definitely', 'accomodate': 'accommodate',
      'neccessary': 'necessary', 'wierd': 'weird', 'untill': 'until',
      'becuase': 'because', 'alot': 'a lot',
      'goverment': 'government', 'enviroment': 'environment'
    };
    let corrected = input;
    for (const [typo, fix] of Object.entries(corrections)) {
      corrected = corrected.replace(new RegExp(\`\\\\b\${typo}\\\\b\`, 'gi'), fix);
    }
    corrected = corrected.replace(/count\\s+down/gi, 'countdown');
    corrected = corrected.replace(/back\\s+ground/gi, 'background');
    corrected = corrected.replace(/(\\w+)\\s+\\1/gi, '$1'); // Remove duplicate words
    return corrected;
  }

  private extractComponent(input: string): string {
    const components: Record<string, string[]> = {
      'calendar': ['calendar', 'schedule', 'date', 'event', 'month', 'year'],
      'timer': ['timer', 'countdown', 'clock', 'stopwatch', 'time'],
      'calculator': ['calculator', 'calc', 'math', 'compute', 'arithmetic'],
      'todo': ['todo', 'task', 'list', 'checklist', 'tasks'],
      'form': ['form', 'input', 'submit', 'registration', 'contact'],
      'game': ['game', 'play', 'snake', 'puzzle', 'arcade'],
      'website': ['website', 'site', 'page', 'landing', 'web'],
      'dashboard': ['dashboard', 'panel', 'admin', 'control', 'monitor'],
      'chart': ['chart', 'graph', 'plot', 'visualization', 'data'],
      'player': ['player', 'audio', 'video', 'music', 'media'],
      'editor': ['editor', 'text', 'code', 'write', 'document'],
      'gallery': ['gallery', 'image', 'photo', 'portfolio', 'pictures'],
      'os': ['os', 'system', 'linux', 'raspberry', 'pi', 'ubuntu', 'debian', 'kernel']
    };
    for (const [component, keywords] of Object.entries(components)) {
      if (keywords.some(kw => input.includes(kw))) return component;
    }
    return 'component';
  }

  private getThemeColors(theme: string): {bg: string, card: string, accent: string, text: string} {
    const themes: Record<string, {bg: string, card: string, accent: string, text: string}> = {
      'beach': { bg: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #F4A460 100%)', card: 'rgba(255,255,255,0.9)', accent: '#4682B4', text: '#333' },
      'dark': { bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', card: 'rgba(255,255,255,0.1)', accent: '#667eea', text: '#fff' },
      'futuristic': { bg: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)', card: 'rgba(0,255,255,0.1)', accent: '#00ffff', text: '#fff' },
      'space': { bg: 'linear-gradient(135deg, #000428 0%, #004e92 100%)', card: 'rgba(255,255,255,0.1)', accent: '#ffd700', text: '#fff' },
      'nature': { bg: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)', card: 'rgba(255,255,255,0.9)', accent: '#2d5016', text: '#333' },
      'default': { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', card: '#fff', accent: '#667eea', text: '#333' }
    };
    return themes[theme] || themes['default'];
  }
}`
  }
];

function App() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-gray-900 border-r border-gray-800 overflow-y-auto z-10">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Synth
          </h1>
          <p className="text-xs text-gray-400 mt-1">Sovereign Local Cognitive Engine</p>
          <p className="text-xs text-gray-500 mt-2">Code Review & Documentation</p>
        </div>

        {/* Architecture Overview */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Architecture</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              7 Subsystems
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              128D Semantic Space
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              5 AI Agents
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              10 Themes
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              12+ Components
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sections</h3>
          <ul className="space-y-1">
            {sections.map((section, index) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeSection === section.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                >
                  <span className="text-gray-600 mr-2">{String(index + 1).padStart(2, '0')}</span>
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Stats */}
        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-2">Code Stats</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-purple-400">{sections.length}</p>
                <p className="text-xs text-gray-500">Sections</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-cyan-400">~3k</p>
                <p className="text-xs text-gray-500">Lines</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30">
              TypeScript
            </span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/30">
              AI Engine
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/30">
              Local-First
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Synth — Code Review
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl">
            A sovereign local cognitive engine organized into modular sections. 
            Each section below represents a titled component from the original README, 
            reviewed and organized for clarity.
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-8"
            >
              {/* Section Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-gray-700 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-400">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  <p className="text-gray-400 text-sm mt-1">{section.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <div className="ml-14 mb-4">
                <p className="text-gray-300 leading-relaxed">{section.description}</p>
              </div>

              {/* Tags / Metadata */}
              <div className="ml-14 mb-4 flex flex-wrap gap-2">
                {'keywords' in section && (
                  <>
                    <span className="text-xs text-gray-500 mr-1">Components:</span>
                    {(section as any).keywords.map((kw: string) => (
                      <span key={kw} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-md border border-gray-700">
                        {kw}
                      </span>
                    ))}
                  </>
                )}
                {'themes' in section && (
                  <>
                    <span className="text-xs text-gray-500 mr-1 ml-2">Themes:</span>
                    {(section as any).themes.map((t: string) => (
                      <span key={t} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs rounded-md border border-cyan-500/20">
                        {t}
                      </span>
                    ))}
                  </>
                )}
                {'methods' in section && (
                  <>
                    <span className="text-xs text-gray-500 mr-1">Methods:</span>
                    {(section as any).methods.map((m: string) => (
                      <span key={m} className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-md border border-green-500/20 font-mono">
                        {m}
                      </span>
                    ))}
                  </>
                )}
                {'features' in section && (
                  <>
                    {(section as any).features.map((f: string) => (
                      <span key={f} className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs rounded-md border border-yellow-500/20">
                        {f}
                      </span>
                    ))}
                  </>
                )}
                {'categories' in section && (
                  <>
                    <span className="text-xs text-gray-500 mr-1">Categories:</span>
                    {(section as any).categories.map((c: string) => (
                      <span key={c} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-md border border-purple-500/20">
                        {c}
                      </span>
                    ))}
                  </>
                )}
                {'agents' in section && (
                  <>
                    {(section as any).agents.map((a: {name: string, strategy: string}) => (
                      <span key={a.name} className="px-2 py-0.5 bg-pink-500/10 text-pink-400 text-xs rounded-md border border-pink-500/20">
                        {a.name} ({a.strategy})
                      </span>
                    ))}
                  </>
                )}
                {'steps' in section && (
                  <>
                    {(section as any).steps.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-xs rounded-md border border-orange-500/20">
                        {s}
                      </span>
                    ))}
                  </>
                )}
                {'metrics' in section && (
                  <>
                    {(section as any).metrics.map((m: string) => (
                      <span key={m} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-md border border-blue-500/20">
                        {m}
                      </span>
                    ))}
                  </>
                )}
                {'subsystems' in section && (
                  <>
                    <span className="text-xs text-gray-500 mr-1">Subsystems:</span>
                    {(section as any).subsystems.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs rounded-md border border-indigo-500/20 font-mono">
                        {s}
                      </span>
                    ))}
                  </>
                )}
                {'intentTypes' in section && (
                  <>
                    <span className="text-xs text-gray-500 mr-1 ml-2">Intents:</span>
                    {(section as any).intentTypes.map((i: string) => (
                      <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-md border border-emerald-500/20">
                        {i}
                      </span>
                    ))}
                  </>
                )}
                {'components' in section && (
                  <>
                    <span className="text-xs text-gray-500 mr-1">Components:</span>
                    {(section as any).components.map((c: string) => (
                      <span key={c} className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-xs rounded-md border border-rose-500/20">
                        {c}
                      </span>
                    ))}
                  </>
                )}
                {'dimensions' in section && (
                  <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-xs rounded-md border border-violet-500/20">
                    {section.dimensions}D vectors
                  </span>
                )}
              </div>

              {/* Code Block */}
              <div className="ml-14">
                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                  {/* Code Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 font-mono">
                        {section.title.toLowerCase().replace(/\s+/g, '-')}.ts
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleExpand(section.id)}
                        className="px-3 py-1 text-xs text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        {expandedSections.has(section.id) ? 'Collapse' : 'Expand'}
                      </button>
                      <button
                        onClick={() => copyCode(section.id, section.code)}
                        className="px-3 py-1 text-xs text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        {copiedSection === section.id ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Code Content */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    expandedSections.has(section.id) ? 'max-h-[5000px]' : 'max-h-96'
                  }`}>
                    <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                      <code className="text-gray-300 font-mono whitespace-pre">
                        {section.code}
                      </code>
                    </pre>
                  </div>

                  {/* Gradient fade when collapsed */}
                  {!expandedSections.has(section.id) && section.code.length > 2000 && (
                    <div className="h-16 bg-gradient-to-t from-gray-900 to-transparent absolute bottom-0 left-0 right-0 pointer-events-none"></div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              Synth — Sovereign Local Cognitive Engine • Code Review Documentation
            </p>
            <a
              href="https://github.com/NewTonyStark23/Synth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
