// Novel Problem Solving - Items 4.1 through 4.10
// Handle problems never explicitly programmed for

import { Utils } from './utils';

// ============================================
// ITEM 4.1: Composition Engine
// Combine existing solutions in new ways
// ============================================
export class CompositionEngine {
  private components: Map<string, { type: string; capabilities: string[] }> = new Map();

  constructor() {
    this.loadComponents();
  }

  private loadComponents() {
    const componentData: Record<string, { type: string; capabilities: string[] }> = {
      'calendar': { type: 'time', capabilities: ['display dates', 'navigate months', 'select days', 'show events'] },
      'timer': { type: 'time', capabilities: ['count down', 'count up', 'set duration', 'alarm'] },
      'calculator': { type: 'math', capabilities: ['add', 'subtract', 'multiply', 'divide', 'evaluate expressions'] },
      'todo': { type: 'data', capabilities: ['add items', 'mark complete', 'delete items', 'persist data'] },
      'form': { type: 'input', capabilities: ['collect data', 'validate input', 'submit data', 'show errors'] },
      'chart': { type: 'visualization', capabilities: ['display data', 'show trends', 'compare values', 'animate'] },
      'game': { type: 'interactive', capabilities: ['handle input', 'track score', 'update state', 'detect collision'] },
      'player': { type: 'media', capabilities: ['play audio', 'control playback', 'show progress', 'adjust volume'] },
    };

    Object.entries(componentData).forEach(([name, data]) => {
      this.components.set(name, data);
    });
  }

  compose(requirements: string[]): { composition: string[]; rationale: string } {
    const matched: Array<{ name: string; score: number; matchedCaps: string[] }> = [];

    this.components.forEach((comp, name) => {
      const matchedCaps = comp.capabilities.filter(cap =>
        requirements.some(req => req.toLowerCase().includes(cap.toLowerCase()))
      );
      
      if (matchedCaps.length > 0) {
        matched.push({
          name,
          score: matchedCaps.length / requirements.length,
          matchedCaps
        });
      }
    });

    matched.sort((a, b) => b.score - a.score);

    const composition = matched.slice(0, 3).map(m => m.name);
    const rationale = matched.length > 0
      ? `Combined ${composition.join(' + ')} to handle: ${requirements.join(', ')}`
      : 'No suitable components found for these requirements';

    return { composition, rationale };
  }

  addComponent(name: string, type: string, capabilities: string[]) {
    this.components.set(name, { type, capabilities });
  }
}

// ============================================
// ITEM 4.2: Analogy Transfer
// Map structural similarities across domains
// ============================================
export class AnalogyTransfer {
  private analogyPatterns: Map<string, { source: string; target: string; mapping: Record<string, string> }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    const patterns: Record<string, { source: string; target: string; mapping: Record<string, string> }> = {
      'biology_to_software': {
        source: 'biology',
        target: 'software',
        mapping: {
          'cell': 'function',
          'dna': 'code',
          'organ': 'module',
          'organism': 'application',
          'evolution': 'iteration',
          'mutation': 'bug fix',
          'adaptation': 'optimization',
        }
      },
      'cooking_to_programming': {
        source: 'cooking',
        target: 'programming',
        mapping: {
          'recipe': 'algorithm',
          'ingredient': 'variable',
          'cook': 'execute',
          'taste': 'test',
          'chef': 'programmer',
          'kitchen': 'development environment',
        }
      },
      'construction_to_development': {
        source: 'construction',
        target: 'software development',
        mapping: {
          'blueprint': 'specification',
          'foundation': 'architecture',
          'brick': 'component',
          'builder': 'developer',
          'inspection': 'code review',
          'renovation': 'refactoring',
        }
      },
    };

    Object.entries(patterns).forEach(([name, pattern]) => {
      this.analogyPatterns.set(name, pattern);
    });
  }

  transfer(concept: string, fromDomain: string, toDomain: string): string {
    const pattern = Array.from(this.analogyPatterns.values()).find(
      p => p.source === fromDomain && p.target === toDomain
    );

    if (!pattern) return concept;

    return pattern.mapping[concept.toLowerCase()] || concept;
  }

  findAnalogy(sourceConcept: string, targetDomain: string): { concept: string; analogy: string } | null {
    for (const pattern of this.analogyPatterns.values()) {
      if (pattern.target === targetDomain) {
        const reverseMapping = Object.fromEntries(
          Object.entries(pattern.mapping).map(([k, v]) => [v, k])
        );
        const sourceConceptMapped = reverseMapping[sourceConcept.toLowerCase()];
        if (sourceConceptMapped) {
          return { concept: sourceConcept, analogy: sourceConceptMapped };
        }
      }
    }
    return null;
  }

  addPattern(name: string, source: string, target: string, mapping: Record<string, string>) {
    this.analogyPatterns.set(name, { source, target, mapping });
  }
}

// ============================================
// ITEM 4.4: Pattern Recognition
// Identify problem type from features
// ============================================
export class PatternRecognizer {
  private patterns: Map<string, { features: string[]; solution: string }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    const patternData: Record<string, { features: string[]; solution: string }> = {
      'data_validation': {
        features: ['input', 'validate', 'check', 'verify', 'sanitize'],
        solution: 'Apply validation rules: check type, range, format, and constraints'
      },
      'performance_optimization': {
        features: ['slow', 'fast', 'optimize', 'performance', 'speed'],
        solution: 'Identify bottlenecks, cache results, reduce complexity, optimize algorithms'
      },
      'error_handling': {
        features: ['error', 'exception', 'catch', 'handle', 'fail'],
        solution: 'Wrap in try-catch, provide fallback, log error, show user-friendly message'
      },
      'data_persistence': {
        features: ['save', 'store', 'persist', 'remember', 'database'],
        solution: 'Use localStorage for simple data, IndexedDB for complex, or external API'
      },
      'user_authentication': {
        features: ['login', 'auth', 'password', 'user', 'secure'],
        solution: 'Implement auth flow: validate credentials, create session, protect routes'
      },
      'real_time_updates': {
        features: ['real-time', 'live', 'update', 'stream', 'websocket'],
        solution: 'Use WebSockets or Server-Sent Events for real-time data push'
      },
      'search_functionality': {
        features: ['search', 'find', 'query', 'filter', 'lookup'],
        solution: 'Implement search: index data, match query, rank results, display'
      },
      'form_handling': {
        features: ['form', 'input', 'submit', 'collect', 'data'],
        solution: 'Create form: define fields, validate input, handle submission, show feedback'
      },
    };

    Object.entries(patternData).forEach(([name, data]) => {
      this.patterns.set(name, data);
    });
  }

  recognize(problem: string): { pattern: string; solution: string; confidence: number } | null {
    const problemLower = problem.toLowerCase();
    let bestPattern = '';
    let bestSolution = '';
    let bestConfidence = 0;

    for (const [name, data] of this.patterns.entries()) {
      const matchedFeatures = data.features.filter(f => problemLower.includes(f));
      const confidence = matchedFeatures.length / data.features.length;

      if (confidence > bestConfidence) {
        bestPattern = name;
        bestSolution = data.solution;
        bestConfidence = confidence;
      }
    }

    return bestConfidence > 0.3 ? { pattern: bestPattern, solution: bestSolution, confidence: bestConfidence } : null;
  }

  addPattern(name: string, features: string[], solution: string) {
    this.patterns.set(name, { features, solution });
  }
}

// ============================================
// ITEM 4.5: Decomposition Engine
// Break complex problems into sub-problems
// ============================================
export class DecompositionEngine {
  decompose(problem: string): { subProblems: string[]; strategy: string } {
    const keywords = Utils.extractKeywords(problem);
    
    // Check for common decomposition patterns
    if (problem.toLowerCase().includes('and')) {
      const parts = problem.split(/\band\b/i).map(p => p.trim());
      return {
        subProblems: parts,
        strategy: 'Split into independent sub-problems connected by "and"'
      };
    }

    if (problem.toLowerCase().includes('then')) {
      const parts = problem.split(/\bthen\b/i).map(p => p.trim());
      return {
        subProblems: parts,
        strategy: 'Sequence of steps to execute in order'
      };
    }

    // Generic decomposition based on keywords
    if (keywords.length > 3) {
      const subProblems = keywords.slice(0, 3).map(kw => `Handle ${kw}`);
      return {
        subProblems,
        strategy: 'Break down by key concepts'
      };
    }

    return {
      subProblems: [problem],
      strategy: 'Single problem, no decomposition needed'
    };
  }

  recursiveDecompose(problem: string, depth: number = 2): string[] {
    if (depth === 0) return [problem];

    const { subProblems } = this.decompose(problem);
    
    if (subProblems.length === 1) return subProblems;

    const allSubProblems: string[] = [];
    subProblems.forEach(sub => {
      allSubProblems.push(...this.recursiveDecompose(sub, depth - 1));
    });

    return allSubProblems;
  }
}

// ============================================
// ITEM 4.6: Heuristic Search
// Explore solution space with guided search
// ============================================
export class HeuristicSearch {
  search(
    start: any,
    goal: (state: any) => boolean,
    getNeighbors: (state: any) => any[],
    heuristic: (state: any) => number,
    maxIterations: number = 100
  ): { path: any[]; found: boolean } {
    const openSet = [start];
    const cameFrom = new Map<any, any>();
    const gScore = new Map<any, number>();
    const fScore = new Map<any, number>();

    gScore.set(start, 0);
    fScore.set(start, heuristic(start));

    let iterations = 0;

    while (openSet.length > 0 && iterations < maxIterations) {
      iterations++;

      // Get node with lowest fScore
      openSet.sort((a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity));
      const current = openSet.shift()!;

      if (goal(current)) {
        // Reconstruct path
        const path = [current];
        let node = current;
        while (cameFrom.has(node)) {
          node = cameFrom.get(node);
          path.unshift(node);
        }
        return { path, found: true };
      }

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        const tentativeG = (gScore.get(current) || Infinity) + 1;

        if (tentativeG < (gScore.get(neighbor) || Infinity)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeG);
          fScore.set(neighbor, tentativeG + heuristic(neighbor));

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return { path: [], found: false };
  }
}

// ============================================
// ITEM 4.7: Case-Based Reasoning
// Retrieve similar past problems, adapt solutions
// ============================================
export class CaseBasedReasoner {
  private cases: Array<{ problem: string; solution: string; features: string[] }> = [];

  addCase(problem: string, solution: string, features: string[]) {
    this.cases.push({ problem, solution, features });
  }

  retrieve(query: string, topK: number = 3): Array<{ problem: string; solution: string; similarity: number }> {
    const queryFeatures = Utils.extractKeywords(query);

    const scored = this.cases.map(c => {
      const overlap = queryFeatures.filter(qf => c.features.includes(qf)).length;
      const similarity = c.features.length > 0 ? overlap / Math.max(queryFeatures.length, c.features.length) : 0;
      return { ...c, similarity };
    });

    return scored
      .filter(c => c.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  adapt(query: string, retrievedCase: { problem: string; solution: string }): string {
    // Simple adaptation: replace problem-specific terms
    const queryKeywords = Utils.extractKeywords(query);
    const caseKeywords = Utils.extractKeywords(retrievedCase.problem);

    let adapted = retrievedCase.solution;

    // This is a simplified adaptation - in practice would be more sophisticated
    caseKeywords.forEach((ck, i) => {
      if (i < queryKeywords.length && ck !== queryKeywords[i]) {
        adapted = adapted.replace(new RegExp(ck, 'gi'), queryKeywords[i]);
      }
    });

    return adapted;
  }

  solve(query: string): { solution: string; source: string; confidence: number } | null {
    const retrieved = this.retrieve(query, 1);
    
    if (retrieved.length === 0 || retrieved[0].similarity < 0.3) {
      return null;
    }

    const adapted = this.adapt(query, retrieved[0]);
    
    return {
      solution: adapted,
      source: retrieved[0].problem,
      confidence: retrieved[0].similarity
    };
  }
}

// ============================================
// ITEM 4.8: Generative Templates
// Fill-in-the-blank templates that adapt to context
// ============================================
export class GenerativeTemplates {
  private templates: Map<string, { template: string; slots: string[] }> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates() {
    const templateData: Record<string, { template: string; slots: string[] }> = {
      'greeting': {
        template: 'Hello! I can help you with {task}. What would you like to do?',
        slots: ['task']
      },
      'explanation': {
        template: '{concept} is {description}. It works by {mechanism}.',
        slots: ['concept', 'description', 'mechanism']
      },
      'solution': {
        template: 'To solve {problem}, you should {approach}. This will {outcome}.',
        slots: ['problem', 'approach', 'outcome']
      },
      'code_generation': {
        template: 'Here\'s a {component} that {functionality}. It uses {technology}.',
        slots: ['component', 'functionality', 'technology']
      },
      'error_handling': {
        template: 'The error {error} occurred because {cause}. To fix it, {solution}.',
        slots: ['error', 'cause', 'solution']
      },
    };

    Object.entries(templateData).forEach(([name, data]) => {
      this.templates.set(name, data);
    });
  }

  generate(templateName: string, values: Record<string, string>): string {
    const template = this.templates.get(templateName);
    if (!template) return '';

    let result = template.template;
    template.slots.forEach(slot => {
      const value = values[slot] || `[${slot}]`;
      result = result.replace(`{${slot}}`, value);
    });

    return result;
  }

  addTemplate(name: string, template: string, slots: string[]) {
    this.templates.set(name, { template, slots });
  }
}

// ============================================
// ITEM 4.9: Meta-Learning
// Learn which strategies work for which problem types
// ============================================
export class MetaLearner {
  private strategyEffectiveness: Map<string, Map<string, { success: number; total: number }>> = new Map();

  recordOutcome(problemType: string, strategy: string, success: boolean) {
    if (!this.strategyEffectiveness.has(problemType)) {
      this.strategyEffectiveness.set(problemType, new Map());
    }

    const strategies = this.strategyEffectiveness.get(problemType)!;
    if (!strategies.has(strategy)) {
      strategies.set(strategy, { success: 0, total: 0 });
    }

    const stats = strategies.get(strategy)!;
    stats.total++;
    if (success) stats.success++;
  }

  getBestStrategy(problemType: string): { strategy: string; successRate: number } | null {
    const strategies = this.strategyEffectiveness.get(problemType);
    if (!strategies || strategies.size === 0) return null;

    let best: { strategy: string; successRate: number } | null = null;

    strategies.forEach((stats, strategy) => {
      const successRate = stats.total > 0 ? stats.success / stats.total : 0;
      if (!best || successRate > best.successRate) {
        best = { strategy, successRate };
      }
    });

    return best;
  }

  getAllStrategies(problemType: string): Array<{ strategy: string; successRate: number; attempts: number }> {
    const strategies = this.strategyEffectiveness.get(problemType);
    if (!strategies) return [];

    return Array.from(strategies.entries()).map(([strategy, stats]) => ({
      strategy,
      successRate: stats.total > 0 ? stats.success / stats.total : 0,
      attempts: stats.total
    }));
  }
}

// ============================================
// ITEM 4.10: Improvisation Engine
// When no exact match, generate closest approximation
// ============================================
export class ImprovisationEngine {
  improvise(query: string, availableTools: string[]): { response: string; approach: string } {
    const keywords = Utils.extractKeywords(query);
    
    // Find closest matching tools
    const toolMatches = availableTools.map(tool => {
      const toolKeywords = Utils.extractKeywords(tool);
      const overlap = keywords.filter(k => toolKeywords.includes(k)).length;
      return { tool, overlap, score: overlap / Math.max(keywords.length, toolKeywords.length) };
    });

    toolMatches.sort((a, b) => b.score - a.score);

    if (toolMatches.length > 0 && toolMatches[0].score > 0) {
      const bestTool = toolMatches[0].tool;
      return {
        response: `I'll use ${bestTool} to address your request, even though it's not an exact match.`,
        approach: `Adapted ${bestTool} for: ${query}`
      };
    }

    return {
      response: `I don't have an exact tool for this, but I can try to help by breaking it down into smaller parts.`,
      approach: 'Decomposed and improvised'
    };
  }
}

// ============================================
// Export all problem solving systems
// ============================================
export const ProblemSolvingSystems = {
  CompositionEngine,
  AnalogyTransfer,
  PatternRecognizer,
  DecompositionEngine,
  HeuristicSearch,
  CaseBasedReasoner,
  GenerativeTemplates,
  MetaLearner,
  ImprovisationEngine,
};
