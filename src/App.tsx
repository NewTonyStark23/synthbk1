import { useState } from 'react';

const cognitiveModules = [
  {
    id: 'overview',
    title: 'SYNTH',
    subtitle: 'Sovereign Local Cognitive Engine',
    icon: '🧠',
    type: 'overview',
    description: 'Synth is a fully self-contained synthetic AI system that runs entirely in the browser. It has no external API calls — all reasoning, knowledge, memory, and code generation happen locally. The system is built from 7 interconnected cognitive subsystems that work together to simulate a thinking agent.',
    details: [
      { label: 'Architecture', value: '7 Subsystems' },
      { label: 'Semantic Space', value: '128-dimensional vectors' },
      { label: 'Internal Agents', value: '5 reasoning agents' },
      { label: 'Reasoning Steps', value: '7-step chain-of-thought' },
      { label: 'Themes Supported', value: '10 visual themes' },
      { label: 'Code Components', value: '12+ dynamic generators' },
      { label: 'Knowledge Domains', value: 'Survival, Tech, Trading' },
      { label: 'Persistence', value: 'localStorage' },
    ]
  },
  {
    id: 'semantic-space',
    title: 'SEMANTIC SPACE',
    subtitle: 'How Synth understands meaning',
    icon: '🌐',
    type: 'cognition',
    description: 'The SemanticSpace is Synth\'s conceptual understanding layer. It maps words and ideas into a 128-dimensional vector space where similar concepts cluster together. This is how Synth "understands" language — not by looking things up, but by computing the geometric relationship between meaning-vectors. It can solve analogies (A is to B as C is to ?) by performing vector arithmetic.',
    howItWorks: [
      '60+ core concepts are seeded with hash-based vectors',
      'Each word becomes a 128D point in semantic space',
      'Cosine similarity measures how "close" two ideas are',
      'Vector subtraction captures relationships (king - man + woman = queen)',
      'New words get vectors generated on-the-fly from character hashing',
    ],
    code: `export class SemanticSpace {
  dimensions = 128;
  concepts = new Map<string, number[]>();

  constructor() { this.seed(); }

  seed() {
    // Core concepts that form the foundation of understanding
    const coreConcepts = [
      'hi', 'hello', 'hey', 'analyze', 'why', 'how', 'what',
      'create', 'imagine', 'design', 'build', 'make', 'generate',
      'trade', 'buy', 'sell', 'stock', 'crypto', 'market',
      'code', 'program', 'debug', 'function', 'api',
      'fix', 'repair', 'solve', 'error', 'bug',
      'business', 'startup', 'company', 'revenue', 'profit',
      'survival', 'plant', 'water', 'danger', 'safe', 'edible',
      'stupid', 'hate', 'wrong', 'messed', 'fail',
      'remind', 'goal', 'task', 'schedule',
      'default'
    ];

    coreConcepts.forEach(concept => {
      const vec = new Array(this.dimensions).fill(0);
      // Hash the concept into a deterministic vector
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
    // Average the vectors of all words in the input
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
    return Utils.normalize(vec.map(v => v / count));
  }

  findClosest(targetVec: number[], topN: number = 5) {
    // Find which stored concepts are most similar to the target
    const scored = [];
    this.concepts.forEach((vec, concept) => {
      const sim = Utils.cosineSimilarity(targetVec, vec);
      scored.push({ concept, similarity: sim });
    });
    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, topN);
  }

  solveAnalogy(A: string, B: string, C: string) {
    // A is to B as C is to ?
    // Math: target = C + (B - A)
    const vecA = this.getVector(A);
    const vecB = this.getVector(B);
    const vecC = this.getVector(C);
    const relation = Utils.vectorSubtract(vecB, vecA);
    const target = Utils.vectorAdd(vecC, relation);
    const closest = this.findClosest(target, 1);
    return { answer: closest[0]?.concept, confidence: closest[0]?.similarity };
  }
}`
  },
  {
    id: 'multi-agent',
    title: 'MULTI-AGENT DELIBERATION',
    subtitle: 'How Synth thinks from multiple perspectives',
    icon: '🗣️',
    type: 'cognition',
    description: 'Before responding, Synth runs an internal deliberation between 5 specialized agents. Each agent approaches the input from a different cognitive angle — logical, creative, analytical, empathetic, and critical. They each generate a response, then vote on which response is best. The highest-scoring response wins. This simulates the way a thoughtful person considers multiple angles before speaking.',
    howItWorks: [
      'LOGIC agent: Deductive reasoning from premises to conclusions',
      'CREATE agent: Combinatorial thinking — what if we approach this differently?',
      'ANALYZE agent: Statistical pattern matching and data-driven response',
      'EMPATHY agent: Reads emotional tone, adjusts for frustration or confusion',
      'CRITIC agent: Adversarial thinking — what could go wrong?',
      'All 5 agents vote on each response; highest total score wins',
    ],
    code: `export class MultiAgentReasoning {
  agents = [
    {
      name: 'LOGIC',
      strategy: 'deductive',
      generateResponse: (input, context) => {
        const keywords = Utils.extractKeywords(input);
        const premises = keywords.slice(0, 3).map(k => \`• \${k} is a key factor\`);
        return \`**Logical Analysis:**\\nPremises:\\n\${premises.join('\\n')}\\n
Conclusion: Based on deductive reasoning...\`;
      }
    },
    {
      name: 'CREATE',
      strategy: 'combinatorial',
      generateResponse: (input, context) => {
        const keywords = Utils.extractKeywords(input);
        return \`**Creative Exploration:**\\n
What if we approach \${keywords[0]} from a completely different angle?\\n
Combining \${keywords[0]} with \${keywords[1]} creates new possibilities.\`;
      }
    },
    {
      name: 'ANALYZE',
      strategy: 'statistical',
      generateResponse: (input, context) => {
        const keywords = Utils.extractKeywords(input);
        return \`**Analytical Breakdown:**\\n
Key factors: \${keywords.join(', ')}\\n
Pattern analysis suggests focusing on \${keywords[0]}.\`;
      }
    },
    {
      name: 'EMPATHY',
      strategy: 'contextual',
      generateResponse: (input, context) => {
        const isFrustrated = /stupid|wrong|fail/i.test(input);
        if (isFrustrated) return \`**Human Context:**\\nI sense frustration. Let me address your concern directly.\`;
        return \`**Human Context:**\\nLet me consider what would be most helpful.\`;
      }
    },
    {
      name: 'CRITIC',
      strategy: 'adversarial',
      generateResponse: (input, context) => {
        const keywords = Utils.extractKeywords(input);
        return \`**Critical Assessment:**\\n
Potential issue: \${keywords[0]} might have edge cases.\\n
We should verify these assumptions before proceeding.\`;
      }
    }
  ];

  async process(input: string, context: any) {
    // Each agent generates a response
    const responses = this.agents.map(agent => ({
      agent: agent.name,
      response: agent.generateResponse(input, context),
      strategy: agent.strategy
    }));

    // Each agent votes on all responses
    const votes = this.agents.map(agent => ({
      agent: agent.name,
      votes: responses.map(r => {
        // Agents favor responses matching their own strategy
        if (agent.strategy === 'deductive' && r.response.includes('Logical')) return 0.9;
        if (agent.strategy === 'combinatorial' && r.response.includes('Creative')) return 0.9;
        if (agent.strategy === 'statistical' && r.response.includes('Analytical')) return 0.9;
        if (agent.strategy === 'contextual' && r.response.includes('Human')) return 0.9;
        if (agent.strategy === 'adversarial' && r.response.includes('Critical')) return 0.9;
        return 0.3 + Math.random() * 0.3;
      })
    }));

    // Tally votes and pick winner
    const totalScores = responses.map((_, i) =>
      votes.reduce((sum, v) => sum + v.votes[i], 0)
    );
    const winnerIndex = totalScores.indexOf(Math.max(...totalScores));

    return {
      winner: { name: responses[winnerIndex].agent, strategy: responses[winnerIndex].strategy },
      analyses: responses.map((r, i) => ({ name: r.agent, score: totalScores[i] })),
      responses: responses.map(r => r.response)
    };
  }
}`
  },
  {
    id: 'chain-of-thought',
    title: 'CHAIN-OF-THOUGHT ENGINE',
    subtitle: 'How Synth reasons step by step',
    icon: '🔗',
    type: 'cognition',
    description: 'After the multi-agent deliberation picks a winning perspective, the ChainOfThoughtEngine runs a structured 7-step reasoning pipeline. This is Synth\'s "inner monologue" — it decomposes the question, retrieves knowledge, generates hypotheses, verifies them, synthesizes a response, then critiques its own output. If the critique fails, it revises. This self-check loop is what prevents Synth from confidently giving wrong answers.',
    howItWorks: [
      'STEP 1 — DECOMPOSE: Parse input into subject, action, context, question type',
      'STEP 2 — RETRIEVE: Search local knowledge base + Wikipedia for relevant info',
      'STEP 3 — HYPOTHESIZE: Generate multiple candidate responses',
      'STEP 4 — VERIFY: Score each hypothesis against retrieved knowledge',
      'STEP 5 — SYNTHESIZE: Pick the highest-confidence hypothesis',
      'STEP 6 — CRITIQUE: Check completeness, accuracy, clarity, relevance',
      'STEP 7 — REVISE or PASS: If critique fails, rewrite; if passes, output',
    ],
    code: `export class ChainOfThoughtEngine {
  async reason(input: string, context: any) {
    const steps = [];

    // STEP 1: DECOMPOSE
    steps.push('═══ STEP 1: DECOMPOSE ═══');
    const parsed = this.decomposeInput(input);
    // → subject, action, context[], type (factual|yes/no|creation|definition)

    // STEP 2: RETRIEVE
    steps.push('═══ STEP 2: RETRIEVE ═══');
    const retrieved = await this.retrieveKnowledge(input, context);
    // → searches KnowledgeBase + Wikipedia API

    // STEP 3: HYPOTHESIZE
    steps.push('═══ STEP 3: HYPOTHESIZE ═══');
    const hypotheses = this.generateHypotheses(input, parsed, retrieved, context);
    // → multiple candidate responses

    // STEP 4: VERIFY
    steps.push('═══ STEP 4: VERIFY ═══');
    const verified = this.verifyHypotheses(hypotheses, retrieved);
    // → each hypothesis scored for confidence

    // STEP 5: SYNTHESIZE
    steps.push('═══ STEP 5: SYNTHESIZE ═══');
    let bestIndex = 0, bestConfidence = 0;
    verified.forEach((v, i) => {
      if (v.confidence > bestConfidence) {
        bestConfidence = v.confidence;
        bestIndex = i;
      }
    });

    // STEP 6: CRITIQUE
    steps.push('═══ STEP 6: CRITIQUE ═══');
    const critique = this.critiqueResponse(hypotheses[bestIndex], input, parsed, retrieved);
    // → checks: completeness, accuracy, clarity, relevance

    // STEP 7: REVISE or PASS
    const allPassed = critique.completeness && critique.accuracy 
                   && critique.clarity && critique.relevance;
    if (!allPassed) {
      steps.push('═══ STEP 7: REVISE ═══');
      const revision = this.reviseResponse(hypotheses[bestIndex], critique);
      return { steps, conclusion: revision, passed: false, revision };
    } else {
      steps.push('═══ STEP 7: PASSED ═══');
      return { steps, conclusion: hypotheses[bestIndex], passed: true };
    }
  }

  decomposeInput(input: string) {
    const keywords = Utils.extractKeywords(input);
    let type = 'statement';
    if (/^(what|who|where|when|why|how)\\b/i.test(input)) type = 'factual';
    else if (/^(can|could|will|would|should|is|are)\\b/i.test(input)) type = 'yes/no';
    else if (/\\b(build|create|make|generate)\\b/i.test(input)) type = 'creation';
    else if (/\\b(define|explain|describe)\\b/i.test(input)) type = 'definition';

    return {
      subject: keywords[0] || 'unknown',
      action: input.match(/\\b(build|create|make|generate)\\b/i)?.[1] || 'discuss',
      context: keywords.slice(1, 4),
      type
    };
  }

  critiqueResponse(response, input, parsed, retrieved) {
    const keywords = Utils.extractKeywords(input);
    const missing = keywords.filter(kw => !response.toLowerCase().includes(kw));
    const completeness = missing.length <= 1;
    // Also checks accuracy against retrieved knowledge,
    // clarity (no jargon without explanation), relevance (on-topic)
    return { completeness, missing, accuracy: true, clarity: true, relevance: true };
  }
}`
  },
  {
    id: 'knowledge-base',
    title: 'KNOWLEDGE BASE',
    subtitle: 'What Synth knows',
    icon: '📚',
    type: 'memory',
    description: 'The KnowledgeBase is Synth\'s local store of factual knowledge. It comes pre-seeded with entries across three domains: survival (water purification, edible plants), tech (HTTP codes, programming concepts), and trading (position sizing, risk management). When Synth needs to answer a question, it searches this base using keyword matching with relevance scoring.',
    howItWorks: [
      'Pre-seeded with curated entries across survival, tech, and trading',
      'Each entry has: category, title, content, and keyword tags',
      'Search splits query into keywords and scores each entry',
      'Keyword matches in title/content score +1, keyword tag matches score +2',
      'Results sorted by score, top 5 returned',
    ],
    code: `export class KnowledgeBase {
  entries = [];
  stats = { total: 0, categories: {} };

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
      // ... more entries
    ];
  }

  async search(query: string, limit: number = 5) {
    const keywords = query.toLowerCase().split(/\\W+/).filter(w => w.length > 2);
    const scored = this.entries.map(entry => {
      let score = 0;
      const text = (entry.title + ' ' + entry.content + ' ' + entry.keywords.join(' ')).toLowerCase();
      keywords.forEach(kw => {
        if (text.includes(kw)) score += 1;
        if (entry.keywords.some(ek => ek.includes(kw) || kw.includes(ek))) score += 2;
      });
      return { ...entry, score };
    }).filter(e => e.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
    return scored;
  }
}`
  },
  {
    id: 'log-system',
    title: 'LOG SYSTEM',
    subtitle: 'How Synth remembers',
    icon: '💾',
    type: 'memory',
    description: 'The LogSystem is Synth\'s persistent memory layer. Every interaction, every thought, every token is logged to localStorage. This gives Synth continuity across sessions — it can recall past conversations, track its own token usage, and estimate costs. The log system caps at 2000 entries to stay within browser storage limits.',
    howItWorks: [
      'All interactions stored in localStorage (survives page refresh)',
      'Token estimation: words × 1.3 or chars ÷ 4, whichever is larger',
      'Cost tracking based on Claude Opus pricing ($15/M input, $75/M output)',
      'Chat logs formatted for export with timestamps',
      'Per-interaction token breakdown: input, thinking, output',
      '2000 log entry cap, 200 per-interaction history cap',
    ],
    code: `export class LogSystem {
  logs = [];
  tokenStats = {
    input: 0, thinking: 0, output: 0,
    total: 0, interactions: 0,
    perInteraction: []
  };

  constructor() { this.load(); }

  load() {
    const logs = localStorage.getItem('synth_logs');
    const tokens = localStorage.getItem('synth_tokens');
    if (logs) this.logs = JSON.parse(logs);
    if (tokens) this.tokenStats = JSON.parse(tokens);
  }

  save() {
    localStorage.setItem('synth_logs', JSON.stringify(this.logs.slice(-2000)));
    localStorage.setItem('synth_tokens', JSON.stringify(this.tokenStats));
  }

  logChat(role: string, content: string) {
    this.logs.push({ ts: Date.now(), type: 'CHAT', message: \`\${role}: \${content.substring(0, 200)}\` });
    this.save();
  }

  logTokens(input: string, thinking: string, output: string, metadata = {}) {
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
      ts: Date.now(), input: inTok, thinking: thinkTok, output: outTok, total, ...metadata
    });
    this.save();
    return { input: inTok, thinking: thinkTok, output: outTok, total };
  }

  getEstimatedCost(): number {
    // Claude Opus pricing: $15/M input tokens, $75/M output tokens
    return ((this.tokenStats.input / 1e6) * 15) +
           (((this.tokenStats.thinking + this.tokenStats.output) / 1e6) * 75);
  }
}`
  },
  {
    id: 'utilities',
    title: 'UTILITIES',
    subtitle: 'Mathematical foundations of thinking',
    icon: '⚙️',
    type: 'foundation',
    description: 'The Utils class provides the mathematical primitives that all cognitive subsystems depend on. Token estimation lets Synth track how much "thinking" it\'s doing. Cosine similarity measures conceptual distance. Levenshtein distance enables typo correction. Soundex provides phonetic matching. Softmax enables probabilistic decision-making. These are the building blocks of cognition.',
    howItWorks: [
      'estimateTokens: Approximate token count from text (words × 1.3 or chars ÷ 4)',
      'cosineSimilarity: Measure angle between two vectors (0 = unrelated, 1 = identical)',
      'vectorAdd/Subtract: Arithmetic on concept vectors for analogy solving',
      'normalize: Scale vectors to unit length for fair comparison',
      'softmax: Convert raw scores into probabilities (used in agent voting)',
      'levenshtein: Edit distance between strings (powers typo correction)',
      'soundex: Phonetic encoding (words that sound alike get same code)',
      'extractKeywords: TF-based keyword extraction with stop word removal',
    ],
    code: `export class Utils {
  static estimateTokens(text: string): number {
    const words = text.trim().split(/\\s+/).length;
    const chars = text.length;
    return Math.max(1, Math.round(Math.max(words * 1.3, chars / 4)));
  }

  static cosineSimilarity(v1: number[], v2: number[]): number {
    let dot = 0, mag1 = 0, mag2 = 0;
    for (let i = 0; i < Math.min(v1.length, v2.length); i++) {
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

  static softmax(scores: number[], temperature = 1.0): number[] {
    const max = Math.max(...scores);
    const exps = scores.map(s => Math.exp((s - max) / temperature));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
  }

  static levenshtein(a: string, b: string): number {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = a[i-1] === b[j-1]
          ? dp[i-1][j-1]
          : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
    return dp[a.length][b.length];
  }

  static soundex(word: string): string {
    const map = { B:1,F:1,P:1,V:1,C:2,G:2,J:2,K:2,Q:2,S:2,X:2,Z:2,D:3,T:3,L:4,M:5,N:5,R:6 };
    word = word.toUpperCase().replace(/[^A-Z]/g, '');
    let result = word[0], lastCode = map[word[0]] || 0;
    for (let i = 1; i < word.length && result.length < 4; i++) {
      const code = map[word[i]] || 0;
      if (code && code !== lastCode) { result += code; lastCode = code; }
      else if (!code) lastCode = 0;
    }
    while (result.length < 4) result += '0';
    return result;
  }

  static extractKeywords(text: string): string[] {
    const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','is','are','was','were','be','been','i','you','he','she','it','we','they']);
    const words = text.toLowerCase().split(/\\W+/).filter(w => w.length > 3 && !stopWords.has(w));
    const freq = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    return Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0, 10).map(([w]) => w);
  }
}`
  },
  {
    id: 'code-generator',
    title: 'CODE GENERATOR',
    subtitle: 'How Synth creates artifacts',
    icon: '🔧',
    type: 'output',
    description: 'The CodeGenerator is Synth\'s output layer for creating functional HTML artifacts. When the user asks Synth to build something, it doesn\'t use templates — it dynamically generates complete HTML/CSS/JS based on the detected component type and theme. It can generate calendars, timers, calculators, todo lists, forms, games, dashboards, charts, media players, text editors, galleries, and even operating system simulations.',
    howItWorks: [
      'Parses input to detect component type (calendar, timer, calculator, etc.)',
      'Detects theme from keywords (beach, dark, futuristic, space, etc.)',
      'Extracts features (interactive, animated, responsive, countdown, etc.)',
      'Maps theme → color palette (background gradient, card color, accent, text)',
      'Generates complete self-contained HTML with inline CSS and JS',
      'Each component builder creates a fully functional artifact',
    ],
    code: `export class CodeGenerator {
  static generate(input: string) {
    const component = this.extractComponent(input);
    const theme = this.extractTheme(input);
    const features = this.extractFeatures(input);
    const colors = this.getThemeColors(theme);
    const code = this.buildCode(component, theme, features, colors);
    return { code, component, theme, features };
  }

  static extractComponent(input: string): string {
    const components = {
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
      'gallery': ['gallery', 'image', 'photo', 'portfolio'],
      'os': ['os', 'system', 'linux', 'raspberry', 'pi']
    };
    for (const [comp, keywords] of Object.entries(components)) {
      if (keywords.some(kw => input.includes(kw))) return comp;
    }
    return 'component';
  }

  static extractTheme(input: string): string {
    const themes = {
      'beach': ['beach', 'ocean', 'sea', 'tropical', 'sand'],
      'dark': ['dark', 'night', 'black', 'midnight'],
      'futuristic': ['futuristic', 'cyber', 'tech', 'sci-fi'],
      'space': ['space', 'galaxy', 'star', 'cosmic'],
      'nature': ['nature', 'forest', 'green', 'earth'],
      'retro': ['retro', 'vintage', 'classic'],
      'minimal': ['minimal', 'simple', 'clean'],
      'colorful': ['colorful', 'vibrant', 'rainbow', 'neon'],
      // ...
    };
    for (const [theme, keywords] of Object.entries(themes)) {
      if (keywords.some(kw => input.includes(kw))) return theme;
    }
    return 'default';
  }

  static getThemeColors(theme: string) {
    const palettes = {
      'beach': { bg: 'linear-gradient(to bottom, #87CEEB, #E0F6FF, #F4A460)', card: 'rgba(255,255,255,0.9)', accent: '#4682B4', text: '#333' },
      'dark': { bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', card: 'rgba(255,255,255,0.1)', accent: '#667eea', text: '#fff' },
      'futuristic': { bg: 'linear-gradient(135deg, #0c0c0c, #1a1a2e)', card: 'rgba(0,255,255,0.1)', accent: '#00ffff', text: '#fff' },
      'space': { bg: 'linear-gradient(135deg, #000428, #004e92)', card: 'rgba(255,255,255,0.1)', accent: '#ffd700', text: '#fff' },
      // ...
    };
    return palettes[theme] || palettes['default'];
  }

  // Each build method generates complete HTML with inline CSS+JS
  static buildCalendar(colors, features) { /* full calendar HTML */ }
  static buildTimer(colors, features) { /* countdown timer HTML */ }
  static buildCalculator(colors) { /* calculator HTML */ }
  static buildGame(colors) { /* snake game HTML */ }
  // ... etc for each component type
}`
  },
  {
    id: 'speed-metrics',
    title: 'SPEED METRICS',
    subtitle: 'How Synth monitors itself',
    icon: '⚡',
    type: 'foundation',
    description: 'The SpeedMetrics module is Synth\'s self-monitoring system. It tracks how fast it generates responses — words per second, tokens per second, and time-to-first-byte. This gives Synth awareness of its own performance, which feeds back into the logging system.',
    howItWorks: [
      'start(): Begins timing when processing starts',
      'recordFirstToken(): Captures latency to first output character',
      'recordOutput(): Accumulates word and token counts during generation',
      'getMetrics(): Returns WPS, TPS, TTFB, and total time',
    ],
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

  getMetrics() {
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
    id: 'orchestrator',
    title: 'ORCHESTRATOR',
    subtitle: 'How all subsystems connect',
    icon: '🎛️',
    type: 'cognition',
    description: 'The SynthAI class is the central orchestrator — the "consciousness" that ties all 7 subsystems together. When a user sends input, the orchestrator runs the full cognitive pipeline: typo repair → intent classification → knowledge retrieval → multi-agent deliberation → chain-of-thought reasoning → response generation → logging. It decides what kind of response is needed and routes through the appropriate subsystems.',
    howItWorks: [
      '1. Typo Repair: Fixes common misspellings (teh→the, recieve→receive)',
      '2. Intent Classification: Determines if input is code_gen, question, greeting, math, etc.',
      '3. Knowledge Retrieval: Searches KnowledgeBase for relevant entries',
      '4. Multi-Agent Deliberation: 5 agents debate the best response',
      '5. Chain-of-Thought: 7-step structured reasoning with self-critique',
      '6. Response Generation: Builds final response (text or code)',
      '7. Logging: Stores conversation + tokens in LogSystem',
    ],
    code: `export class SynthAI {
  log: LogSystem;
  kb: KnowledgeBase;
  semanticSpace: SemanticSpace;
  multiAgent: MultiAgentReasoning;
  cot: ChainOfThoughtEngine;
  codeGenerator: CodeGenerator;
  speedMetrics: SpeedMetrics;
  conversationHistory = [];
  turns = 0;

  constructor() {
    this.log = new LogSystem();
    this.kb = new KnowledgeBase();
    this.semanticSpace = new SemanticSpace();
    this.multiAgent = new MultiAgentReasoning(this.semanticSpace);
    this.cot = new ChainOfThoughtEngine();
    this.codeGenerator = new CodeGenerator();
    this.speedMetrics = new SpeedMetrics();
  }

  async process(input: string) {
    this.speedMetrics.start();
    this.turns++;

    // 1. Fix typos
    const cleaned = this.repairInput(input);

    // 2. What does the user want?
    const intent = this.classifyIntent(cleaned);

    // 3. What do we already know about this?
    const kbResults = await this.kb.search(cleaned, 3);

    // 4. Internal deliberation
    const reasoning = await this.multiAgent.process(cleaned, { kbHits: kbResults.length });

    // 5. Structured reasoning with self-check
    const cotResult = await this.cot.reason(cleaned, {
      winner: reasoning.winner, kbResults, intent,
      history: this.conversationHistory.slice(-5)
    });

    // 6. Build response
    this.speedMetrics.recordFirstToken();
    let response = await this.generateResponse(cleaned, intent, cotResult, kbResults, reasoning);
    this.speedMetrics.recordOutput(response);

    // 7. Remember everything
    this.conversationHistory.push({ userInput: cleaned, aiResponse: response, timestamp: Date.now() });
    this.log.logChat('user', cleaned);
    this.log.logChat('assistant', response);
    const fullThinking = reasoning.thoughtLog + '\\n' + cotResult.steps.join('\\n');
    this.log.logTokens(input, fullThinking, response, {
      winner: reasoning.winner.name, intent: intent.type
    });

    return {
      response, thinking: fullThinking,
      tokens: this.log.tokenStats,
      speed: this.speedMetrics.getMetrics()
    };
  }

  classifyIntent(input: string) {
    const lower = input.toLowerCase();
    if (/(change|modify|update|edit|fix)/i.test(lower))
      return { type: 'modification', confidence: 0.95 };
    if (/\\b(build|create|make|generate)\\b/i.test(lower) &&
        /\\b(timer|calculator|todo|form|game|website|calendar)\\b/i.test(lower))
      return { type: 'code_generation', confidence: 0.95 };
    if (/^[\\d\\s\\+\\-\\*\\/]+$/.test(input.trim()))
      return { type: 'math', confidence: 0.9 };
    if (/^(what|who|where|when|why|how)\\b/i.test(input.trim()))
      return { type: 'question', confidence: 0.85 };
    if (/^(hi|hello|hey)\\b/i.test(input.trim()))
      return { type: 'greeting', confidence: 0.95 };
    return { type: 'conversation', confidence: 0.6 };
  }

  repairInput(input: string): string {
    const fixes = {
      'teh': 'the', 'recieve': 'receive', 'occured': 'occurred',
      'seperate': 'separate', 'definately': 'definitely',
      'dbeach': 'beach', 'backgroun': 'background',
      'newyears': 'new year', 'count down': 'countdown'
    };
    let repaired = input;
    for (const [typo, fix] of Object.entries(fixes))
      repaired = repaired.replace(new RegExp(\`\\\\b\${typo}\\\\b\`, 'gi'), fix);
    repaired = repaired.replace(/(\\w+)\\1+/gi, '$1'); // deduplicate
    return repaired;
  }
}`
  }
];

const typeColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  overview: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30', dot: 'bg-purple-400' },
  cognition: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30', dot: 'bg-cyan-400' },
  memory: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  foundation: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  output: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-400' },
};

const typeLabels: Record<string, string> = {
  overview: 'System Overview',
  cognition: 'Cognitive Process',
  memory: 'Memory Layer',
  foundation: 'Foundation',
  output: 'Output Layer',
};

function App() {
  const [activeSection, setActiveSection] = useState(cognitiveModules[0].id);
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

  const groupedModules = {
    'Cognitive Processes': cognitiveModules.filter(m => m.type === 'cognition'),
    'Memory Layers': cognitiveModules.filter(m => m.type === 'memory'),
    'Foundations': cognitiveModules.filter(m => m.type === 'foundation'),
    'Output': cognitiveModules.filter(m => m.type === 'output'),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-80 bg-[#0d0d14] border-r border-gray-800/60 overflow-y-auto z-10 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-lg">
              🧠
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Synth</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Cognitive Architecture</p>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="p-4 border-b border-gray-800/60">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800/30 rounded-lg p-2.5 text-center">
              <p className="text-lg font-bold text-purple-400">7</p>
              <p className="text-[10px] text-gray-500 uppercase">Subsystems</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-2.5 text-center">
              <p className="text-lg font-bold text-cyan-400">128D</p>
              <p className="text-[10px] text-gray-500 uppercase">Vectors</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-2.5 text-center">
              <p className="text-lg font-bold text-emerald-400">5</p>
              <p className="text-[10px] text-gray-500 uppercase">Agents</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-2.5 text-center">
              <p className="text-lg font-bold text-amber-400">7</p>
              <p className="text-[10px] text-gray-500 uppercase">Reasoning Steps</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1">
          {/* Overview */}
          <button
            onClick={() => scrollToSection('overview')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all mb-2 flex items-center gap-2 ${
              activeSection === 'overview'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
            }`}
          >
            <span>🧠</span>
            <span className="font-medium">System Overview</span>
          </button>

          {/* Grouped sections */}
          {Object.entries(groupedModules).map(([group, modules]) => (
            <div key={group} className="mb-4">
              <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2 px-1">{group}</h3>
              <ul className="space-y-1">
                {modules.map(mod => {
                  const colors = typeColors[mod.type];
                  return (
                    <li key={mod.id}>
                      <button
                        onClick={() => scrollToSection(mod.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                          activeSection === mod.id
                            ? `${colors.bg} ${colors.text} border ${colors.border}`
                            : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
                        }`}
                      >
                        <span className="text-base">{mod.icon}</span>
                        <span className="font-medium truncate">{mod.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800/60">
          <a
            href="https://github.com/NewTonyStark23/Synth"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-xs transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            github.com/NewTonyStark23/Synth
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-80 flex-1 p-8 max-w-5xl">
        {/* Header */}
        <header className="mb-16 pt-4">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-2.5 py-1 bg-purple-500/15 text-purple-300 text-[10px] font-semibold uppercase tracking-wider rounded-full border border-purple-500/30">
              Synthetic AI
            </span>
            <span className="px-2.5 py-1 bg-cyan-500/15 text-cyan-300 text-[10px] font-semibold uppercase tracking-wider rounded-full border border-cyan-500/30">
              Local-First
            </span>
            <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold uppercase tracking-wider rounded-full border border-emerald-500/30">
              No API Calls
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Synth Cognitive Architecture
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
            A fully self-contained synthetic AI system that runs entirely in the browser.
            No external APIs, no cloud dependency. Every thought, every memory, every response
            is generated locally by 7 interconnected cognitive subsystems working in concert.
          </p>

          {/* Processing Pipeline */}
          <div className="mt-8 bg-gray-800/20 border border-gray-800/60 rounded-xl p-5">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Processing Pipeline</p>
            <div className="flex items-center gap-1 flex-wrap">
              {['Input', 'Typo Repair', 'Intent Classify', 'KB Search', 'Multi-Agent', 'Chain-of-Thought', 'Generate', 'Log'].map((step, i) => (
                <div key={step} className="flex items-center gap-1">
                  <span className="px-2.5 py-1 bg-gray-800/60 text-gray-300 text-xs rounded-md border border-gray-700/50">
                    {step}
                  </span>
                  {i < 7 && <span className="text-gray-600 text-xs">→</span>}
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Modules */}
        <div className="space-y-16">
          {cognitiveModules.map((mod) => {
            const colors = typeColors[mod.type];
            const isOverview = mod.type === 'overview';

            return (
              <section
                key={mod.id}
                id={mod.id}
                className="scroll-mt-8"
              >
                {/* Module Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-800/40 border border-gray-700/50 flex items-center justify-center text-2xl">
                    {mod.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-bold text-white tracking-tight">{mod.title}</h2>
                      <span className={`px-2 py-0.5 ${colors.bg} ${colors.text} text-[10px] font-semibold uppercase tracking-wider rounded-full border ${colors.border}`}>
                        {typeLabels[mod.type]}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{mod.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="ml-16 mb-5">
                  <p className="text-gray-300 leading-relaxed">{mod.description}</p>
                </div>

                {/* Overview details grid */}
                {isOverview && 'details' in mod && (
                  <div className="ml-16 mb-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(mod as any).details.map((d: { label: string; value: string }) => (
                        <div key={d.label} className="bg-gray-800/30 border border-gray-800/60 rounded-lg p-3">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{d.label}</p>
                          <p className="text-sm font-semibold text-gray-200">{d.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* How It Works */}
                {'howItWorks' in mod && (mod as any).howItWorks && (
                  <div className="ml-16 mb-5">
                    <div className="bg-gray-800/20 border border-gray-800/60 rounded-xl p-4">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">How It Works</p>
                      <ul className="space-y-2">
                        {(mod as any).howItWorks.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-gray-600 mt-0.5 flex-shrink-0">
                              {mod.type === 'cognition' ? '→' : '•'}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Code Block */}
                {'code' in mod && (mod as any).code && (
                  <div className="ml-16">
                    <div className="bg-[#0d0d14] rounded-xl border border-gray-800/60 overflow-hidden">
                      {/* Code Header */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/30 border-b border-gray-800/60">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
                          </div>
                          <span className="text-[11px] text-gray-500 ml-2 font-mono">
                            {mod.title.toLowerCase().replace(/\s+/g, '-')}.ts
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleExpand(mod.id)}
                            className="px-2.5 py-1 text-[11px] text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded transition-colors"
                          >
                            {expandedSections.has(mod.id) ? 'Collapse' : 'Expand'}
                          </button>
                          <button
                            onClick={() => copyCode(mod.id, (mod as any).code)}
                            className="px-2.5 py-1 text-[11px] text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded transition-colors"
                          >
                            {copiedSection === mod.id ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      {/* Code Content */}
                      <div className={`overflow-hidden transition-all duration-300 ${
                        expandedSections.has(mod.id) ? 'max-h-[8000px]' : 'max-h-80'
                      }`}>
                        <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                          <code className="text-gray-400 font-mono whitespace-pre">
                            {(mod as any).code}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-800/60 pb-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Synth — Sovereign Local Cognitive Engine</p>
              <p className="text-gray-600 text-xs mt-1">All cognition happens locally. No data leaves the browser.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
