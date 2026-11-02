// Synth SAI - Core Infrastructure
// This is the foundation everything else builds on

import { Utils } from './utils';

// ============================================
// ITEM 8.1: Hierarchical Memory Architecture
// L1: Working (200K), L2: Session (500K), L3: Long-term (1.3M)
// ============================================
export class HierarchicalMemory {
  private workingMemory: any[] = []; // L1: Current conversation
  private sessionMemory: any[] = []; // L2: This session
  private longTermMemory: any[] = []; // L3: All sessions
  private maxWorkingTokens = 200000;
  private maxSessionTokens = 500000;
  private maxLongTermTokens = 1300000;

  constructor() {
    this.loadFromStorage();
  }

  add(message: any, level: 'working' | 'session' | 'longterm' = 'working') {
    const tokens = Utils.estimateTokens(JSON.stringify(message));
    message.tokens = tokens;
    message.timestamp = Date.now();

    switch (level) {
      case 'working':
        this.workingMemory.push(message);
        this.pruneIfNeeded('working');
        break;
      case 'session':
        this.sessionMemory.push(message);
        this.pruneIfNeeded('session');
        break;
      case 'longterm':
        this.longTermMemory.push(message);
        this.pruneIfNeeded('longterm');
        break;
    }

    this.saveToStorage();
  }

  private pruneIfNeeded(level: string) {
    let memory: any[];
    let maxTokens: number;

    switch (level) {
      case 'working':
        memory = this.workingMemory;
        maxTokens = this.maxWorkingTokens;
        break;
      case 'session':
        memory = this.sessionMemory;
        maxTokens = this.maxSessionTokens;
        break;
      case 'longterm':
        memory = this.longTermMemory;
        maxTokens = this.maxLongTermTokens;
        break;
      default:
        return;
    }

    let totalTokens = memory.reduce((sum, m) => sum + (m.tokens || 0), 0);
    while (totalTokens > maxTokens && memory.length > 0) {
      const removed = memory.shift();
      totalTokens -= removed.tokens || 0;
    }
  }

  search(query: string, limit: number = 10): any[] {
    const allMemory = [...this.workingMemory, ...this.sessionMemory, ...this.longTermMemory];
    const queryLower = query.toLowerCase();

    const scored = allMemory.map(item => {
      let score = 0;
      const content = JSON.stringify(item).toLowerCase();
      
      // Keyword matching
      const keywords = queryLower.split(/\s+/);
      keywords.forEach(kw => {
        if (content.includes(kw)) score += 1;
      });

      // Recency boost
      const age = Date.now() - item.timestamp;
      const recencyBoost = Math.max(0, 1 - age / (1000 * 60 * 60 * 24)); // 24 hour decay
      score += recencyBoost * 2;

      return { item, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.item);
  }

  getByCodeVersion(version: number): any {
    return this.sessionMemory.find(m => m.codeVersion === version);
  }

  getRecentTurns(count: number): any[] {
    return this.workingMemory.slice(-count);
  }

  private saveToStorage() {
    try {
      localStorage.setItem('synth_working_memory', JSON.stringify(this.workingMemory));
      localStorage.setItem('synth_session_memory', JSON.stringify(this.sessionMemory));
      localStorage.setItem('synth_longterm_memory', JSON.stringify(this.longTermMemory));
    } catch (e) {
      console.warn('Memory storage full, pruning...');
      this.workingMemory = this.workingMemory.slice(-100);
      this.sessionMemory = this.sessionMemory.slice(-500);
    }
  }

  private loadFromStorage() {
    try {
      const working = localStorage.getItem('synth_working_memory');
      const session = localStorage.getItem('synth_session_memory');
      const longterm = localStorage.getItem('synth_longterm_memory');
      
      if (working) this.workingMemory = JSON.parse(working);
      if (session) this.sessionMemory = JSON.parse(session);
      if (longterm) this.longTermMemory = JSON.parse(longterm);
    } catch (e) {
      console.warn('Failed to load memory from storage');
    }
  }
}

// ============================================
// ITEM 1.1: Graphify Knowledge Graph
// Nodes = concepts, edges = relationships
// ============================================
export class KnowledgeGraph {
  private nodes: Map<string, any> = new Map();
  private edges: Map<string, Set<string>> = new Map();

  addNode(id: string, data: any) {
    this.nodes.set(id, { id, ...data, timestamp: Date.now() });
    if (!this.edges.has(id)) {
      this.edges.set(id, new Set());
    }
  }

  addEdge(from: string, to: string, relationship: string = 'related') {
    if (!this.edges.has(from)) {
      this.edges.set(from, new Set());
    }
    this.edges.get(from)!.add(`${to}:${relationship}`);
  }

  getNode(id: string): any {
    return this.nodes.get(id);
  }

  getConnectedNodes(id: string): string[] {
    const edges = this.edges.get(id);
    if (!edges) return [];
    return Array.from(edges).map(e => e.split(':')[0]);
  }

  search(query: string): any[] {
    const queryLower = query.toLowerCase();
    const results: any[] = [];

    this.nodes.forEach((node, id) => {
      const nodeStr = JSON.stringify(node).toLowerCase();
      if (nodeStr.includes(queryLower)) {
        results.push(node);
      }
    });

    return results;
  }

  traverse(startId: string, depth: number = 2): any[] {
    const visited = new Set<string>();
    const queue: Array<{ id: string; depth: number }> = [{ id: startId, depth: 0 }];
    const results: any[] = [];

    while (queue.length > 0) {
      const { id, depth: currentDepth } = queue.shift()!;
      
      if (visited.has(id) || currentDepth > depth) continue;
      visited.add(id);

      const node = this.nodes.get(id);
      if (node) results.push(node);

      if (currentDepth < depth) {
        const connected = this.getConnectedNodes(id);
        connected.forEach(connectedId => {
          if (!visited.has(connectedId)) {
            queue.push({ id: connectedId, depth: currentDepth + 1 });
          }
        });
      }
    }

    return results;
  }

  save() {
    try {
      localStorage.setItem('synth_knowledge_graph_nodes', JSON.stringify(Array.from(this.nodes.entries())));
      localStorage.setItem('synth_knowledge_graph_edges', JSON.stringify(
        Array.from(this.edges.entries()).map(([k, v]) => [k, Array.from(v)])
      ));
    } catch (e) {
      console.warn('Knowledge graph storage full');
    }
  }

  load() {
    try {
      const nodes = localStorage.getItem('synth_knowledge_graph_nodes');
      const edges = localStorage.getItem('synth_knowledge_graph_edges');
      
      if (nodes) this.nodes = new Map(JSON.parse(nodes));
      if (edges) {
        const edgesArray = JSON.parse(edges);
        this.edges = new Map(edgesArray.map(([k, v]: [string, string[]]) => [k, new Set(v)]));
      }
    } catch (e) {
      console.warn('Failed to load knowledge graph');
    }
  }
}

// ============================================
// ITEM 2.1: Expanded Semantic Space (1024D)
// ============================================
export class ExpandedSemanticSpace {
  dimensions = 1024;
  concepts: Map<string, number[]> = new Map();

  constructor() {
    this.seedCoreConcepts();
  }

  private seedCoreConcepts() {
    const coreConcepts = [
      // Basic concepts
      'thing', 'object', 'entity', 'concept', 'idea',
      // Actions
      'do', 'make', 'create', 'build', 'destroy', 'change', 'move', 'stop', 'start',
      // Qualities
      'good', 'bad', 'big', 'small', 'fast', 'slow', 'hot', 'cold', 'new', 'old',
      // People
      'person', 'man', 'woman', 'child', 'friend', 'enemy', 'leader', 'follower',
      // Places
      'place', 'home', 'work', 'school', 'city', 'country', 'world',
      // Time
      'time', 'now', 'past', 'future', 'today', 'tomorrow', 'yesterday',
      // Emotions
      'happy', 'sad', 'angry', 'afraid', 'surprised', 'disgusted', 'love', 'hate',
      // Technology
      'computer', 'program', 'code', 'data', 'network', 'internet', 'software', 'hardware',
      // Business
      'business', 'money', 'market', 'trade', 'stock', 'crypto', 'invest', 'profit',
      // Science
      'science', 'physics', 'chemistry', 'biology', 'math', 'theory', 'experiment',
      // Programming
      'function', 'variable', 'loop', 'array', 'object', 'class', 'method', 'interface',
      // Trading
      'buy', 'sell', 'order', 'price', 'volume', 'trend', 'support', 'resistance',
      // Survival
      'water', 'food', 'shelter', 'fire', 'danger', 'safe', 'help', 'survive',
      // Abstract
      'truth', 'lie', 'justice', 'freedom', 'power', 'knowledge', 'wisdom', 'beauty'
    ];

    coreConcepts.forEach(concept => {
      this.addConcept(concept);
    });
  }

  addConcept(concept: string) {
    if (this.concepts.has(concept)) return;

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
  }

  getVector(text: string): number[] {
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 0);
    const vec = new Array(this.dimensions).fill(0);
    let count = 0;

    words.forEach(word => {
      let conceptVec = this.concepts.get(word);
      if (!conceptVec) {
        this.addConcept(word);
        conceptVec = this.concepts.get(word)!;
      }
      for (let i = 0; i < this.dimensions; i++) {
        vec[i] += conceptVec[i];
      }
      count++;
    });

    if (count === 0) return new Array(this.dimensions).fill(0.5);
    return Utils.normalize(vec.map(v => v / count));
  }

  similarity(text1: string, text2: string): number {
    const vec1 = this.getVector(text1);
    const vec2 = this.getVector(text2);
    return Utils.cosineSimilarity(vec1, vec2);
  }

  findSimilar(text: string, topN: number = 5): Array<{ concept: string; similarity: number }> {
    const targetVec = this.getVector(text);
    const results: Array<{ concept: string; similarity: number }> = [];

    this.concepts.forEach((vec, concept) => {
      const sim = Utils.cosineSimilarity(targetVec, vec);
      results.push({ concept, similarity: sim });
    });

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topN);
  }

  solveAnalogy(a: string, b: string, c: string): { answer: string; confidence: number } {
    const vecA = this.getVector(a);
    const vecB = this.getVector(b);
    const vecC = this.getVector(c);

    const relation = Utils.vectorSubtract(vecB, vecA);
    const target = Utils.vectorAdd(vecC, relation);

    const closest = this.findSimilar(
      target.map((v: number) => v.toString()).join(' '),
      1
    );

    return {
      answer: closest[0]?.concept || 'unknown',
      confidence: closest[0]?.similarity || 0
    };
  }
}

// ============================================
// ITEM 8.3: Code Versioning System
// ============================================
export class CodeVersioning {
  private versions: Map<number, any> = new Map();
  private currentVersion = 0;

  addCode(code: string, metadata: any = {}): number {
    this.currentVersion++;
    this.versions.set(this.currentVersion, {
      version: this.currentVersion,
      code,
      timestamp: Date.now(),
      ...metadata
    });
    this.save();
    return this.currentVersion;
  }

  getVersion(version: number): any {
    return this.versions.get(version);
  }

  getRecentVersions(count: number = 5): any[] {
    const versions = Array.from(this.versions.values());
    return versions.slice(-count).reverse();
  }

  getNthCodeAgo(n: number): any {
    const versions = Array.from(this.versions.values());
    const index = versions.length - n;
    if (index < 0) return null;
    return versions[index];
  }

  diff(version1: number, version2: number): string {
    const v1 = this.versions.get(version1);
    const v2 = this.versions.get(version2);
    if (!v1 || !v2) return 'Version not found';

    // Simple line-by-line diff
    const lines1 = v1.code.split('\n');
    const lines2 = v2.code.split('\n');
    const diff: string[] = [];

    const maxLines = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 !== line2) {
        if (line1) diff.push(`- ${line1}`);
        if (line2) diff.push(`+ ${line2}`);
      }
    }

    return diff.join('\n');
  }

  private save() {
    try {
      localStorage.setItem('synth_code_versions', JSON.stringify(Array.from(this.versions.entries())));
    } catch (e) {
      console.warn('Code version storage full');
    }
  }

  load() {
    try {
      const versions = localStorage.getItem('synth_code_versions');
      if (versions) {
        this.versions = new Map(JSON.parse(versions));
        this.currentVersion = this.versions.size;
      }
    } catch (e) {
      console.warn('Failed to load code versions');
    }
  }
}

// ============================================
// ITEM 8.5: Pronoun Resolution Engine
// ============================================
export class PronounResolver {
  private entities: Array<{ name: string; type: string; timestamp: number; mentions: number }> = [];

  addEntity(name: string, type: string = 'object') {
    const existing = this.entities.find(e => e.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      existing.mentions++;
      existing.timestamp = Date.now();
    } else {
      this.entities.push({
        name,
        type,
        timestamp: Date.now(),
        mentions: 1
      });
    }
  }

  resolve(pronoun: string, context: string): string | null {
    const pronounLower = pronoun.toLowerCase();

    // "it" → most recent singular entity
    if (pronounLower === 'it' || pronounLower === 'this') {
      const recent = this.entities
        .filter(e => e.type !== 'plural')
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      return recent?.name || null;
    }

    // "they" → most recent plural entity or last mentioned
    if (pronounLower === 'they' || pronounLower === 'these') {
      const plural = this.entities.find(e => e.type === 'plural');
      if (plural) return plural.name;
      
      const recent = this.entities.sort((a, b) => b.timestamp - a.timestamp)[0];
      return recent?.name || null;
    }

    // "that" → look for "that X" in context
    const thatMatch = context.match(/that\s+(\w+)/i);
    if (thatMatch) {
      const entity = this.entities.find(e => 
        e.name.toLowerCase().includes(thatMatch[1].toLowerCase())
      );
      return entity?.name || null;
    }

    return null;
  }

  extractEntities(text: string) {
    // Extract potential entities from text
    const patterns = [
      /(?:the|a|an)\s+(\w+)/gi, // "the calculator", "a timer"
      /(?:my|your|his|her)\s+(\w+)/gi, // "my code", "your app"
      /(\w+)(?:\s+code|\s+app|\s+website|\s+timer|\s+calculator)/gi // "calendar code"
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        this.addEntity(match[1], 'object');
      }
    });
  }

  getRecentEntities(count: number = 5): any[] {
    return this.entities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }
}

// ============================================
// ITEM 3.1: Synonym Expansion
// ============================================
export class SynonymExpander {
  private synonyms: Map<string, string[]> = new Map();

  constructor() {
    this.loadSynonyms();
  }

  private loadSynonyms() {
    const synonymData: Record<string, string[]> = {
      'water': ['h2o', 'aqua', 'liquid', 'fluid', 'moisture'],
      'happy': ['glad', 'joyful', 'pleased', 'cheerful', 'delighted'],
      'sad': ['unhappy', 'sorrowful', 'depressed', 'melancholy', 'gloomy'],
      'big': ['large', 'huge', 'enormous', 'massive', 'giant'],
      'small': ['tiny', 'little', 'miniature', 'compact', 'mini'],
      'fast': ['quick', 'rapid', 'swift', 'speedy', 'hasty'],
      'slow': ['sluggish', 'gradual', 'unhurried', 'leisurely', 'delayed'],
      'good': ['excellent', 'great', 'fine', 'superior', 'outstanding'],
      'bad': ['poor', 'terrible', 'awful', 'horrible', 'dreadful'],
      'create': ['build', 'make', 'generate', 'construct', 'produce'],
      'fix': ['repair', 'mend', 'correct', 'resolve', 'patch'],
      'change': ['modify', 'alter', 'adjust', 'update', 'transform'],
      'start': ['begin', 'initiate', 'launch', 'commence', 'open'],
      'stop': ['end', 'halt', 'cease', 'terminate', 'finish'],
      'help': ['assist', 'aid', 'support', 'guide', 'facilitate'],
      'problem': ['issue', 'trouble', 'difficulty', 'challenge', 'obstacle'],
      'solution': ['answer', 'resolution', 'fix', 'remedy', 'resolution'],
      'code': ['program', 'script', 'application', 'software', 'implementation'],
      'error': ['bug', 'mistake', 'fault', 'issue', 'defect'],
      'test': ['check', 'verify', 'validate', 'examine', 'inspect']
    };

    Object.entries(synonymData).forEach(([word, syns]) => {
      this.synonyms.set(word.toLowerCase(), syns);
      syns.forEach(syn => {
        if (!this.synonyms.has(syn.toLowerCase())) {
          this.synonyms.set(syn.toLowerCase(), [word, ...syns.filter(s => s !== syn)]);
        }
      });
    });
  }

  expand(word: string): string[] {
    const syns = this.synonyms.get(word.toLowerCase());
    return syns ? [word, ...syns] : [word];
  }

  expandText(text: string): string[] {
    const words = text.toLowerCase().split(/\W+/);
    const expanded = new Set<string>();

    words.forEach(word => {
      if (word.length > 2) {
        this.expand(word).forEach(syn => expanded.add(syn));
      }
    });

    return Array.from(expanded);
  }

  areSynonyms(word1: string, word2: string): boolean {
    const syns1 = this.synonyms.get(word1.toLowerCase()) || [];
    const syns2 = this.synonyms.get(word2.toLowerCase()) || [];
    
    return syns1.includes(word2.toLowerCase()) || 
           syns2.includes(word1.toLowerCase()) ||
           word1.toLowerCase() === word2.toLowerCase();
  }
}

// ============================================
// ITEM 9.2: Confidence Calibration
// ============================================
export class ConfidenceCalibrator {
  calibrate(confidence: number, evidence: any[]): number {
    let calibrated = confidence;

    // Boost confidence with more evidence
    if (evidence.length > 0) {
      calibrated += Math.min(0.2, evidence.length * 0.05);
    }

    // Reduce confidence if evidence is conflicting
    const conflicting = evidence.filter(e => e.conflicts).length;
    if (conflicting > 0) {
      calibrated -= conflicting * 0.1;
    }

    // Ensure bounds
    return Math.max(0, Math.min(1, calibrated));
  }

  expressConfidence(confidence: number): string {
    if (confidence >= 0.9) return "I'm very confident";
    if (confidence >= 0.7) return "I'm fairly confident";
    if (confidence >= 0.5) return "I'm somewhat confident";
    if (confidence >= 0.3) return "I'm not very confident";
    return "I'm uncertain";
  }

  formatResponse(response: string, confidence: number): string {
    const confidenceStr = this.expressConfidence(confidence);
    return `${confidenceStr}: ${response}`;
  }
}

// ============================================
// ITEM 13.1: Clarification Engine
// ============================================
export class ClarificationEngine {
  needsClarification(intent: any, confidence: number): boolean {
    return confidence < 0.7;
  }

  generateClarification(intent: any, alternatives: any[]): string {
    if (alternatives.length === 0) {
      return "I'm not sure I understand. Could you clarify what you mean?";
    }

    const options = alternatives.slice(0, 3).map((alt, i) => 
      `${i + 1}. ${alt.description}`
    ).join('\n');

    return `I think you might mean one of these:\n${options}\n\nWhich one is correct?`;
  }

  detectAmbiguity(text: string): string[] {
    const ambiguities: string[] = [];

    // Check for pronouns without clear referents
    if (/\b(it|this|that|they)\b/i.test(text)) {
      ambiguities.push('Pronoun reference unclear');
    }

    // Check for vague terms
    if (/\b(thing|stuff|something|anything)\b/i.test(text)) {
      ambiguities.push('Vague terminology');
    }

    // Check for missing context
    if (text.length < 20 && !/\?/.test(text)) {
      ambiguities.push('Very short input, might need more context');
    }

    return ambiguities;
  }
}

// ============================================
// ITEM 20.1: Combinatorial Constraint Solver
// ============================================
export class ConstraintSolver {
  solve(constraints: Array<{ variable: string; condition: string; value: any }>): any {
    const solution: any = {};
    const variables = new Set(constraints.map(c => c.variable));

    // Simple backtracking solver
    const backtrack = (varIndex: number): boolean => {
      if (varIndex >= variables.size) return true;

      const variable = Array.from(variables)[varIndex];
      const relevantConstraints = constraints.filter(c => c.variable === variable);

      // Try different values
      for (let value = 0; value < 10; value++) {
        solution[variable] = value;

        // Check if all constraints are satisfied
        const satisfied = relevantConstraints.every(c => {
          return this.evaluateConstraint(c.condition, solution[c.variable], c.value);
        });

        if (satisfied && backtrack(varIndex + 1)) {
          return true;
        }
      }

      return false;
    };

    if (backtrack(0)) {
      return solution;
    }

    return null; // No solution found
  }

  private evaluateConstraint(condition: string, actual: any, expected: any): boolean {
    switch (condition) {
      case 'equals': return actual === expected;
      case 'not_equals': return actual !== expected;
      case 'greater_than': return actual > expected;
      case 'less_than': return actual < expected;
      case 'contains': return String(actual).includes(String(expected));
      default: return true;
    }
  }
}

// ============================================
// ITEM 15.1: Commonsense Reasoning Engine
// ============================================
export class CommonsenseReasoner {
  private rules: Array<{ condition: string[]; conclusion: string }> = [];

  constructor() {
    this.loadRules();
  }

  private loadRules() {
    this.rules = [
      // Physical world
      { condition: ['drop', 'object'], conclusion: 'Object falls down due to gravity' },
      { condition: ['heat', 'water'], conclusion: 'Water boils at 100°C' },
      { condition: ['freeze', 'water'], conclusion: 'Water freezes at 0°C' },
      
      // Social norms
      { condition: ['meet', 'person'], conclusion: 'Greet them politely' },
      { condition: ['receive', 'gift'], conclusion: 'Say thank you' },
      { condition: ['late', 'meeting'], conclusion: 'Apologize for being late' },
      
      // Causal chains
      { condition: ['server', 'crash'], conclusion: 'Users cannot access the service' },
      { condition: ['delete', 'file'], conclusion: 'File is no longer accessible' },
      { condition: ['no', 'backup'], conclusion: 'Data cannot be recovered' },
      
      // Default assumptions
      { condition: ['person', 'job'], conclusion: 'People want to keep their jobs' },
      { condition: ['business'], conclusion: 'Businesses want to make profit' },
      { condition: ['student'], conclusion: 'Students want to learn and pass' }
    ];
  }

  reason(context: string[]): string[] {
    const conclusions: string[] = [];
    const contextLower = context.map(c => c.toLowerCase());

    this.rules.forEach(rule => {
      const matches = rule.condition.every(cond => 
        contextLower.some(ctx => ctx.includes(cond))
      );

      if (matches) {
        conclusions.push(rule.conclusion);
      }
    });

    return conclusions;
  }
}

// ============================================
// ITEM 26.1: Reasoning Process Monitor
// ============================================
export class ReasoningMonitor {
  private steps: Array<{ step: string; timestamp: number; confidence: number }> = [];

  recordStep(step: string, confidence: number = 1.0) {
    this.steps.push({
      step,
      timestamp: Date.now(),
      confidence
    });
  }

  getReasoningTrace(): string {
    return this.steps.map((s, i) => 
      `${i + 1}. ${s.step} (confidence: ${(s.confidence * 100).toFixed(0)}%)`
    ).join('\n');
  }

  detectPattern(): string | null {
    if (this.steps.length < 3) return null;

    const recentSteps = this.steps.slice(-5);
    const stepNames = recentSteps.map(s => s.step);

    // Check for loops
    const uniqueSteps = new Set(stepNames);
    if (uniqueSteps.size < stepNames.length / 2) {
      return 'Detected reasoning loop';
    }

    // Check for low confidence
    const avgConfidence = recentSteps.reduce((sum, s) => sum + s.confidence, 0) / recentSteps.length;
    if (avgConfidence < 0.5) {
      return 'Low confidence in reasoning';
    }

    return null;
  }

  clear() {
    this.steps = [];
  }
}

// ============================================
// Export all core infrastructure
// ============================================
export const CoreInfrastructure = {
  HierarchicalMemory,
  KnowledgeGraph,
  ExpandedSemanticSpace,
  CodeVersioning,
  PronounResolver,
  SynonymExpander,
  ConfidenceCalibrator,
  ClarificationEngine,
  ConstraintSolver,
  CommonsenseReasoner,
  ReasoningMonitor
};
