// Cognitive systems: Knowledge, Semantics, Multi-Agent, Chain-of-Thought

import { Utils } from './core';

export class KnowledgeBase {
  entries: any[] = [];
  stats = { total: 0, categories: {} as Record<string, number> };

  constructor() { this.seed(); }

  seed() {
    this.entries = [
      { category: 'survival', title: 'Water Purification', content: 'Boil 1 min (3 min above 6500ft). Or 8 drops bleach per gallon, wait 30 min. Or SODIS: clear bottle in sun 6 hours.', keywords: ['water', 'purification', 'boil', 'bleach', 'clean'] },
      { category: 'survival', title: 'Edible Plants', content: 'SAFE: Dandelion (all parts), Cattail (shoots/roots), Clover (flowers/leaves), Pine needles (vitamin C). DEADLY: Poison hemlock, Water hemlock, Nightshade berries.', keywords: ['plants', 'edible', 'dandelion', 'poison', 'safe'] },
      { category: 'survival', title: 'Fire Starting', content: 'Methods: Flint & steel, bow drill, ferro rod, magnifying glass. Tinder: dry grass, birch bark, cotton balls with petroleum jelly. Kindling: small dry twigs.', keywords: ['fire', 'starting', 'tinder', 'flint'] },
      { category: 'survival', title: 'Shelter Building', content: 'Priority: protection from wind/rain/sun. Types: debris hut, lean-to, tarp shelter. Insulate from ground with leaves/pine needles (6 inches minimum).', keywords: ['shelter', 'building', 'protection', 'insulation'] },
      { category: 'survival', title: 'First Aid Basics', content: 'Stop bleeding: direct pressure. Burns: cool water 10 min. Fractures: immobilize. CPR: 30 compressions, 2 breaths. Always seek professional help when possible.', keywords: ['first aid', 'bleeding', 'burns', 'cpr'] },
      { category: 'tech', title: 'HTTP Status Codes', content: '2xx Success (200 OK, 201 Created). 4xx Client Error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found). 5xx Server Error (500, 502, 503).', keywords: ['http', 'status', 'error', '404', 'web'] },
      { category: 'tech', title: 'JavaScript Basics', content: 'Variables: let, const, var. Functions: function keyword or arrow (=>). Async: Promises, async/await. DOM: document.querySelector, addEventListener.', keywords: ['javascript', 'js', 'programming', 'code'] },
      { category: 'tech', title: 'CSS Flexbox', content: 'Container: display:flex, flex-direction, justify-content, align-items. Items: flex-grow, flex-shrink, flex-basis. Common: center with justify-content:center, align-items:center.', keywords: ['css', 'flexbox', 'layout', 'center'] },
      { category: 'tech', title: 'Git Commands', content: 'git init, git add, git commit -m, git push, git pull, git branch, git checkout, git merge. Staging: git add -A. Undo: git reset --soft HEAD~1.', keywords: ['git', 'version control', 'commit', 'branch'] },
      { category: 'trading', title: 'Position Sizing', content: 'Shares = (Account × Risk%) ÷ Stop Distance. Example: $2000 account, 2% risk, $0.30 stop → 133 shares. Never risk >2% per trade.', keywords: ['position', 'sizing', 'risk', 'shares', 'trading'] },
      { category: 'trading', title: 'Risk Management', content: 'Max 2% risk per trade. Risk/reward ratio minimum 1:2. Stop loss always. Diversify across sectors. Never trade with money you cannot afford to lose.', keywords: ['risk', 'management', 'stop loss', 'diversify'] },
      { category: 'trading', title: 'Technical Analysis', content: 'Support/Resistance: price levels where buying/selling pressure concentrates. Moving averages: SMA, EMA. RSI: overbought >70, oversold <30. Volume confirms trends.', keywords: ['technical', 'analysis', 'support', 'resistance', 'rsi'] },
    ];
    this.stats.total = this.entries.length;
    this.entries.forEach(e => {
      this.stats.categories[e.category] = (this.stats.categories[e.category] || 0) + 1;
    });
  }

  async search(query: string, limit: number = 5): Promise<any[]> {
    const keywords = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
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
}

export class SemanticSpace {
  dimensions = 128;
  concepts = new Map<string, number[]>();

  constructor() { this.seed(); }

  seed() {
    const coreConcepts = [
      'hi', 'hello', 'hey', 'greetings', 'goodbye', 'bye',
      'analyze', 'why', 'how', 'what', 'when', 'where', 'who', 'which',
      'create', 'imagine', 'design', 'build', 'make', 'generate', 'construct',
      'trade', 'buy', 'sell', 'stock', 'crypto', 'market', 'invest', 'profit',
      'code', 'program', 'debug', 'function', 'api', 'javascript', 'python', 'html', 'css',
      'fix', 'repair', 'solve', 'error', 'bug', 'issue', 'problem',
      'logo', 'graph', 'chart', 'ui', 'hud', 'mockup', 'design',
      'business', 'startup', 'company', 'revenue', 'profit', 'growth',
      'recipe', 'cook', 'ingredient', 'meal', 'food', 'kitchen',
      'legal', 'law', 'court', 'lawsuit', 'contract', 'attorney',
      'survival', 'plant', 'water', 'danger', 'safe', 'edible', 'poison', 'shelter',
      'switch', 'mode', 'role', 'rename', 'change', 'modify', 'update',
      'stupid', 'hate', 'wrong', 'messed', 'fail', 'frustrated', 'angry',
      'key', 'api key', 'token', 'secret', 'password', 'auth',
      'remind', 'goal', 'task', 'schedule', 'calendar', 'timer', 'countdown',
      'king', 'queen', 'man', 'woman', 'person', 'human',
      'hot', 'cold', 'fast', 'slow', 'big', 'small', 'light', 'dark',
      'happy', 'sad', 'love', 'fear', 'anger', 'joy',
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

    // Add relational pairs for better analogy solving
    this.addRelation('king', 'queen', 'man', 'woman');
    this.addRelation('hot', 'cold', 'fast', 'slow');
    this.addRelation('big', 'small', 'light', 'dark');
  }

  addRelation(a: string, b: string, c: string, d: string) {
    const vecA = this.concepts.get(a);
    const vecB = this.concepts.get(b);
    const vecC = this.concepts.get(c);
    const vecD = this.concepts.get(d);
    if (vecA && vecB && vecC && vecD) {
      // Blend vectors so analogies work better
      const rel1 = Utils.vectorSubtract(vecB, vecA);
      const rel2 = Utils.vectorSubtract(vecD, vecC);
      const avgRel = Utils.normalize(rel1.map((v, i) => (v + rel2[i]) / 2));
      // Adjust vectors to be closer in relationship space
      const newB = Utils.normalize(vecB.map((v, i) => v * 0.8 + avgRel[i] * 0.2));
      const newD = Utils.normalize(vecD.map((v, i) => v * 0.8 + avgRel[i] * 0.2));
      this.concepts.set(b, newB);
      this.concepts.set(d, newD);
    }
  }

  getVector(text: string): number[] {
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 0);
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

  generateVector(word: string): number[] {
    const vec = new Array(this.dimensions).fill(0);
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(i);
      hash = hash & hash;
    }
    for (let i = 0; i < this.dimensions; i++) {
      vec[i] = Math.sin(hash + i * 1000) * 0.5 + 0.5;
    }
    return Utils.normalize(vec);
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
}

export class MultiAgentReasoning {
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
          const premises = keywords.slice(0, 3).map(k => `• ${k} is a key factor`);
          const isQuestion = /^(what|who|where|when|why|how)\b/i.test(input);
          if (isQuestion) {
            return `**Logical Analysis:**\n\nPremises:\n${premises.join('\n')}\n\nBy deductive reasoning, the answer centers on ${keywords[0]}. Given the context, ${keywords.slice(0, 2).join(' and ')} are the primary elements to address.`;
          }
          return `**Logical Analysis:**\n\nPremises:\n${premises.join('\n')}\n\nConclusion: Based on deductive reasoning, the optimal approach involves ${keywords.slice(0, 2).join(' and ')}.`;
        }
      },
      {
        name: 'CREATE',
        strategy: 'combinatorial',
        generateResponse: (input: string, context: any) => {
          const keywords = Utils.extractKeywords(input);
          return `**Creative Exploration:**\n\nWhat if we approach ${keywords[0] || 'this'} from a completely different angle?\n\nCombining ${keywords[0] || 'concept A'} with ${keywords[1] || 'concept B'} creates new possibilities. Consider unconventional solutions that merge these elements in unexpected ways.`;
        }
      },
      {
        name: 'ANALYZE',
        strategy: 'statistical',
        generateResponse: (input: string, context: any) => {
          const keywords = Utils.extractKeywords(input);
          return `**Analytical Breakdown:**\n\nKey factors: ${keywords.join(', ')}\n\nPattern analysis suggests focusing on ${keywords[0] || 'the primary element'} as the main variable. Secondary factors include ${keywords.slice(1, 3).join(', ') || 'related concepts'}.`;
        }
      },
      {
        name: 'EMPATHY',
        strategy: 'contextual',
        generateResponse: (input: string, context: any) => {
          const isFrustrated = /stupid|wrong|fail|messed|hate/i.test(input);
          const isQuestion = /^(what|who|where|when|why|how)\b/i.test(input);
          if (isFrustrated) {
            return `**Human Context:**\n\nI understand your frustration. Let me address this directly and clearly. Your concern is valid, and I'll provide a straightforward answer.`;
          }
          if (isQuestion) {
            return `**Human Context:**\n\nYou're looking for understanding. Let me explain this in a way that's clear and helpful, considering what would be most useful to you.`;
          }
          return `**Human Context:**\n\nLet me consider what would be most helpful for your situation and provide a response that addresses your actual needs.`;
        }
      },
      {
        name: 'CRITIC',
        strategy: 'adversarial',
        generateResponse: (input: string, context: any) => {
          const keywords = Utils.extractKeywords(input);
          return `**Critical Assessment:**\n\nPotential issues to consider:\n• ${keywords[0] || 'The main concept'} might have edge cases\n• Assumptions should be verified\n• Alternative interpretations exist\n\nWe should verify these assumptions before proceeding with confidence.`;
        }
      }
    ];
  }

  async process(input: string, context: any = {}): Promise<{ winner: any; analyses: any[]; responses: string[]; thoughtLog: string }> {
    const thoughtLog: string[] = [];
    thoughtLog.push('═══ MULTI-AGENT DELIBERATION ═══');
    thoughtLog.push(`Input: "${input.substring(0, 100)}${input.length > 100 ? '...' : ''}"`);
    thoughtLog.push(`Context: ${JSON.stringify(context).substring(0, 200)}`);

    const responses = this.agents.map(agent => {
      const response = agent.generateResponse(input, context);
      thoughtLog.push(`\n[${agent.name}] Strategy: ${agent.strategy}`);
      thoughtLog.push(`Response: ${response.substring(0, 150)}...`);
      return { agent: agent.name, response, strategy: agent.strategy };
    });

    // Voting: each agent scores all responses
    const votes = this.agents.map(agent => {
      const scores = responses.map(r => {
        // Agents favor responses matching their own strategy
        if (agent.strategy === 'deductive' && r.response.includes('Logical')) return 0.9;
        if (agent.strategy === 'combinatorial' && r.response.includes('Creative')) return 0.9;
        if (agent.strategy === 'statistical' && r.response.includes('Analytical')) return 0.9;
        if (agent.strategy === 'contextual' && r.response.includes('Human')) return 0.9;
        if (agent.strategy === 'adversarial' && r.response.includes('Critical')) return 0.9;
        // Cross-voting with slight randomness for diversity
        return 0.3 + Math.random() * 0.3;
      });
      return { agent: agent.name, votes: scores };
    });

    const totalScores = responses.map((_, i) =>
      votes.reduce((sum, v) => sum + v.votes[i], 0)
    );

    const winnerIndex = totalScores.indexOf(Math.max(...totalScores));
    const winner = responses[winnerIndex];

    thoughtLog.push(`\n═══ VOTING RESULTS ═══`);
    responses.forEach((r, i) => {
      thoughtLog.push(`${r.agent}: ${totalScores[i].toFixed(2)} (${r.strategy})`);
    });
    thoughtLog.push(`\nWinner: ${winner.agent} (${winner.strategy})`);

    return {
      winner: { name: winner.agent, strategy: winner.strategy },
      analyses: responses.map((r, i) => ({ name: r.agent, score: totalScores[i], strategy: r.strategy })),
      responses: responses.map(r => r.response),
      thoughtLog: thoughtLog.join('\n')
    };
  }
}

export class ChainOfThoughtEngine {
  async reason(input: string, context: any): Promise<{ steps: string[]; conclusion: string; passed: boolean; revision?: string }> {
    const steps: string[] = [];
    let passed = true;
    let revision: string | undefined;

    // STEP 1: DECOMPOSE
    steps.push('═══ STEP 1: DECOMPOSE ═══');
    const parsed = this.decomposeInput(input);
    steps.push(`Subject: ${parsed.subject}`);
    steps.push(`Action: ${parsed.action}`);
    steps.push(`Context: ${parsed.context.join(', ')}`);
    steps.push(`Question type: ${parsed.type}`);

    // STEP 2: RETRIEVE
    steps.push('\n═══ STEP 2: RETRIEVE ═══');
    const retrieved = await this.retrieveKnowledge(input, context);
    steps.push(`Knowledge base hits: ${retrieved.kb.length}`);
    steps.push(`Web search: ${retrieved.web ? 'available' : 'not needed'}`);

    // STEP 3: HYPOTHESIZE
    steps.push('\n═══ STEP 3: HYPOTHESIZE ═══');
    const hypotheses = this.generateHypotheses(input, parsed, retrieved, context);
    steps.push(`Generated ${hypotheses.length} candidate responses`);

    // STEP 4: VERIFY
    steps.push('\n═══ STEP 4: VERIFY ═══');
    const verified = this.verifyHypotheses(hypotheses, retrieved);
    verified.forEach((v, i) => {
      steps.push(`Hypothesis ${i + 1}: confidence ${v.confidence.toFixed(2)}, issues: [${v.issues.join(', ')}]`);
    });

    // STEP 5: SYNTHESIZE
    steps.push('\n═══ STEP 5: SYNTHESIZE ═══');
    let bestIndex = 0;
    let bestConfidence = 0;
    verified.forEach((v, i) => {
      if (v.confidence > bestConfidence) {
        bestConfidence = v.confidence;
        bestIndex = i;
      }
    });
    steps.push(`Selected hypothesis ${bestIndex + 1} with confidence ${bestConfidence.toFixed(2)}`);

    // STEP 6: CRITIQUE
    steps.push('\n═══ STEP 6: CRITIQUE ═══');
    const critique = this.critiqueResponse(hypotheses[bestIndex], input, parsed, retrieved);
    steps.push(`Completeness: ${critique.completeness}`);
    steps.push(`Accuracy: ${critique.accuracy}`);
    steps.push(`Clarity: ${critique.clarity}`);
    steps.push(`Relevance: ${critique.relevance}`);
    if (critique.missing.length > 0) steps.push(`Missing keywords: ${critique.missing.join(', ')}`);

    // STEP 7: REVISE or PASS
    const allPassed = critique.completeness && critique.accuracy && critique.clarity && critique.relevance;
    if (!allPassed) {
      steps.push('\n═══ STEP 7: REVISE ═══');
      revision = this.reviseResponse(hypotheses[bestIndex], critique);
      steps.push(`Revised response generated`);
      passed = false;
    } else {
      steps.push('\n═══ STEP 7: PASSED ═══');
      steps.push(`Response approved without revision`);
    }

    return { steps, conclusion: revision || hypotheses[bestIndex], passed, revision };
  }

  decomposeInput(input: string): { subject: string; action: string; context: string[]; type: string } {
    const keywords = Utils.extractKeywords(input);
    let type = 'statement';
    if (/^(what|who|where|when|why|how)\b/i.test(input)) type = 'factual';
    else if (/^(can|could|will|would|should|is|are)\b/i.test(input)) type = 'yes/no';
    else if (/\b(build|create|make|generate)\b/i.test(input.toLowerCase())) type = 'creation';
    else if (/\b(define|explain|describe)\b/i.test(input.toLowerCase())) type = 'definition';
    else if (/\b(compare|difference|versus|vs)\b/i.test(input.toLowerCase())) type = 'comparison';

    return {
      subject: keywords[0] || 'unknown',
      action: input.match(/\b(build|create|make|generate|define|explain|describe|compare)\b/i)?.[1] || 'discuss',
      context: keywords.slice(1, 4),
      type
    };
  }

  async retrieveKnowledge(input: string, context: any): Promise<{ kb: any[]; web: string | null }> {
    const kb = context.kbResults || [];
    let web: string | null = null;

    // For factual questions, attempt Wikipedia search
    if (context.intent?.type === 'question' || context.intent?.type === 'factual') {
      try {
        const keywords = Utils.extractKeywords(input);
        if (keywords.length > 0) {
          const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(keywords[0])}`);
          if (response.ok) {
            const data = await response.json();
            if (data.extract) web = data.extract;
          }
        }
      } catch (e) {
        // Wikipedia not available, continue without
      }
    }

    return { kb, web };
  }

  generateHypotheses(input: string, parsed: any, retrieved: any, context: any): string[] {
    const hypotheses: string[] = [];

    // Hypothesis 1: Knowledge base answer
    if (retrieved.kb.length > 0 && retrieved.kb[0].score >= 3) {
      hypotheses.push(`**${retrieved.kb[0].title}**\n\n${retrieved.kb[0].content}\n\n*From local knowledge base*`);
    }

    // Hypothesis 2: Web search answer
    if (retrieved.web) {
      hypotheses.push(`**${parsed.subject}**\n\n${retrieved.web}\n\n*From Wikipedia*`);
    }

    // Hypothesis 3: Generated response
    const keywords = Utils.extractKeywords(input);
    let generated = '';
    switch (parsed.type) {
      case 'factual':
        generated = `Based on available knowledge, **${parsed.subject}** relates to ${keywords.slice(1, 3).join(' and ') || 'the context you provided'}. The key aspects to understand are the relationship between these elements and how they function together.`;
        break;
      case 'definition':
        generated = `**${parsed.subject}** can be defined as a concept involving ${keywords.slice(1, 3).join(', ') || 'specific characteristics'}. In practical terms, this means understanding how these elements interact and what role they play in their respective contexts.`;
        break;
      case 'creation':
        generated = `To ${parsed.action} ${parsed.subject}, we need to consider ${keywords.slice(1, 3).join(', ') || 'the key requirements'}. The approach involves breaking this down into manageable components and addressing each systematically.`;
        break;
      default:
        generated = `Regarding ${parsed.subject}, the key considerations are ${keywords.slice(0, 3).join(', ') || 'the elements you mentioned'}. Each aspect contributes to the overall understanding and should be considered in context.`;
    }
    hypotheses.push(generated);

    // Hypothesis 4: Context-aware response
    if (context.history && context.history.length > 0) {
      const lastExchange = context.history[context.history.length - 1];
      hypotheses.push(`Building on our previous discussion, ${generated}`);
    }

    return hypotheses;
  }

  verifyHypotheses(hypotheses: string[], retrieved: any): Array<{ confidence: number; issues: string[] }> {
    return hypotheses.map(h => {
      const issues: string[] = [];
      let confidence = 0.5;

      // Boost for knowledge base matches
      if (retrieved.kb.length > 0 && h.includes(retrieved.kb[0]?.title)) confidence += 0.3;

      // Boost for web search matches
      if (retrieved.web && h.includes(retrieved.web.substring(0, 50))) confidence += 0.2;

      // Penalize for brevity
      if (h.length < 50) { issues.push('Too brief'); confidence -= 0.2; }

      // Penalize for lack of structure
      if (!h.includes('**') && !h.includes('\n')) { issues.push('No formatting'); confidence -= 0.1; }

      return { confidence: Math.max(0.1, Math.min(1.0, confidence)), issues };
    });
  }

  critiqueResponse(response: string, input: string, parsed: any, retrieved: any) {
    const keywords = Utils.extractKeywords(input);
    const responseLower = response.toLowerCase();
    const missing = keywords.filter(kw => !responseLower.includes(kw));

    const completeness = missing.length === 0 || missing.length <= 1;
    const accuracy = !response.includes('undefined') && !response.includes('null');
    const clarity = response.length > 30 && (response.includes('**') || response.includes('\n'));
    const relevance = keywords.some(kw => responseLower.includes(kw));

    return {
      completeness, missing,
      accuracy, inaccuracies: accuracy ? [] : ['Contains undefined/null'],
      clarity, unclear: clarity ? [] : ['Too brief or unformatted'],
      relevance, offTopic: relevance ? [] : ['Missing key terms']
    };
  }

  reviseResponse(response: string, critique: any): string {
    let revised = response;
    if (critique.missing && critique.missing.length > 0) {
      revised += `\n\nAdditionally: ${critique.missing.join(', ')} are relevant considerations.`;
    }
    if (critique.unclear && critique.unclear.length > 0) {
      revised = `**Summary:**\n\n${revised}`;
    }
    return revised;
  }
}
