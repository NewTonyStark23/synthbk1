// Unprecedented Inputs - Items 16.1-16.10
// Handle weird, unusual, never-before-seen inputs gracefully

import { Utils } from './utils';

// ============================================
// ITEM 16.1: Novelty Detection + Fallback Generation
// Detect when input doesn't match any pattern
// ============================================
export class NoveltyDetector {
  private knownPatterns: Set<string> = new Set();
  private fallbackResponses: string[] = [];

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    const patterns = [
      'build', 'create', 'make', 'generate', 'fix', 'change',
      'what', 'how', 'why', 'when', 'where', 'who',
      'hello', 'hi', 'hey', 'thanks', 'please',
      'calculator', 'timer', 'calendar', 'todo', 'form',
    ];
    patterns.forEach(p => this.knownPatterns.add(p));

    this.fallbackResponses = [
      "I haven't seen this exact request before, but let me try to help.",
      "This is a novel request. Let me approach it step by step.",
      "I'm not sure I've encountered this before, but here's my best attempt.",
      "Interesting request! Let me work through this.",
    ];
  }

  isNovel(input: string): { isNovel: boolean; confidence: number } {
    const words = input.toLowerCase().split(/\W+/);
    const knownCount = words.filter(w => this.knownPatterns.has(w)).length;
    const novelty = 1 - (knownCount / words.length);

    return {
      isNovel: novelty > 0.7,
      confidence: novelty
    };
  }

  generateFallback(input: string): string {
    const response = this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
    return `${response}\n\nI'm approaching "${input}" by breaking it down into manageable parts.`;
  }

  addPattern(pattern: string) {
    this.knownPatterns.add(pattern.toLowerCase());
  }

  addFallback(response: string) {
    this.fallbackResponses.push(response);
  }
}

// ============================================
// ITEM 16.2: Absurdity Handling Engine
// Engage playfully with absurd requests
// ============================================
export class AbsurdityHandler {
  private absurdityMarkers = ['time machine', 'perpetual motion', 'teleportation', 'invisibility cloak'];
  private playfulResponses: Map<string, string> = new Map();

  constructor() {
    this.loadResponses();
  }

  private loadResponses() {
    this.playfulResponses.set('time machine', "A time machine? Let's explore the physics and engineering challenges involved in temporal navigation!");
    this.playfulResponses.set('perpetual motion', "Perpetual motion? While thermodynamics says no, let's explore the closest we can get with efficient systems!");
    this.playfulResponses.set('teleportation', "Teleportation? Fascinating! Let's discuss quantum entanglement and the challenges of matter transmission.");
    this.playfulResponses.set('invisibility cloak', "Invisibility cloak? Let's explore metamaterials and light manipulation!");
  }

  isAbsurd(input: string): { isAbsurd: boolean; topic?: string } {
    const inputLower = input.toLowerCase();
    
    for (const marker of this.absurdityMarkers) {
      if (inputLower.includes(marker)) {
        return { isAbsurd: true, topic: marker };
      }
    }

    // Check for impossible constraints
    if (inputLower.includes('impossible') || inputLower.includes('violate physics')) {
      return { isAbsurd: true, topic: 'impossible' };
    }

    return { isAbsurd: false };
  }

  handle(input: string): string {
    const { isAbsurd, topic } = this.isAbsurd(input);
    
    if (!isAbsurd) return input;

    if (topic && this.playfulResponses.has(topic)) {
      return this.playfulResponses.get(topic)!;
    }

    return "That's an interesting challenge! While it might seem impossible, let's explore what's actually achievable and how we can get creative with the solution.";
  }

  addMarker(marker: string, response: string) {
    this.absurdityMarkers.push(marker);
    this.playfulResponses.set(marker, response);
  }
}

// ============================================
// ITEM 16.3: Hypothetical Scenario Engine
// "What if X?" → simulate hypothetical
// ============================================
export class HypotheticalScenarioEngine {
  private scenarioRules: Map<string, { consequences: string[]; constraints: string[] }> = new Map();

  constructor() {
    this.loadScenarios();
  }

  private loadScenarios() {
    this.scenarioRules.set('no gravity', {
      consequences: ['objects float', 'no weight', 'atmosphere escapes', 'planets disperse'],
      constraints: ['must have containment', 'need alternative propulsion']
    });

    this.scenarioRules.set('faster than light', {
      consequences: ['time dilation', 'causality violation', 'infinite energy required'],
      constraints: ['violates relativity', 'theoretical only']
    });

    this.scenarioRules.set('infinite money', {
      consequences: ['inflation', 'currency devaluation', 'economic collapse'],
      constraints: ['supply and demand still apply', 'resources still limited']
    });

    this.scenarioRules.set('no internet', {
      consequences: ['no online communication', 'local systems only', 'manual processes'],
      constraints: ['need offline alternatives', 'limited information access']
    });
  }

  simulate(scenario: string): { consequences: string[]; constraints: string[]; plausible: boolean } {
    const scenarioLower = scenario.toLowerCase();
    
    for (const [key, data] of this.scenarioRules.entries()) {
      if (scenarioLower.includes(key)) {
        return {
          consequences: data.consequences,
          constraints: data.constraints,
          plausible: true
        };
      }
    }

    // Generic hypothetical handling
    return {
      consequences: ['unknown consequences - need more analysis'],
      constraints: ['undefined constraints'],
      plausible: false
    };
  }

  formatScenario(scenario: string): string {
    const result = this.simulate(scenario);
    
    let output = `**Hypothetical Scenario: "${scenario}"**\n\n`;
    output += `**Consequences:**\n`;
    result.consequences.forEach(c => output += `• ${c}\n`);
    
    if (result.constraints.length > 0) {
      output += `\n**Constraints:**\n`;
      result.constraints.forEach(c => output += `• ${c}\n`);
    }

    output += `\n**Plausibility:** ${result.plausible ? 'Theoretically possible' : 'Highly speculative'}`;
    
    return output;
  }

  addScenario(key: string, consequences: string[], constraints: string[]) {
    this.scenarioRules.set(key, { consequences, constraints });
  }
}

// ============================================
// ITEM 16.4: Counterfactual Reasoning System
// "What if history was different?"
// ============================================
export class CounterfactualReasoningSystem {
  private historicalEvents: Map<string, { actual: string; alternatives: string[] }> = new Map();

  constructor() {
    this.loadEvents();
  }

  private loadEvents() {
    this.historicalEvents.set('internet', {
      actual: 'Internet developed in late 1960s (ARPANET)',
      alternatives: [
        'What if internet was invented in 1950s?',
        'What if internet never existed?',
        'What if internet was controlled by one entity?'
      ]
    });

    this.historicalEvents.set('world war 2', {
      actual: 'WWII ended in 1945 with Allied victory',
      alternatives: [
        'What if WWII ended differently?',
        'What if certain battles had different outcomes?',
        'What if certain technologies were available earlier?'
      ]
    });

    this.historicalEvents.set('moon landing', {
      actual: 'Apollo 11 landed on moon in 1969',
      alternatives: [
        'What if moon landing happened in 1950s?',
        'What if moon landing failed?',
        'What if we never went to the moon?'
      ]
    });
  }

  exploreCounterfactual(event: string, alternative: string): { actual: string; exploration: string } {
    const eventData = this.historicalEvents.get(event.toLowerCase());
    
    if (!eventData) {
      return {
        actual: 'Unknown historical event',
        exploration: 'This counterfactual requires more historical context to explore.'
      };
    }

    return {
      actual: eventData.actual,
      exploration: `**Actual:** ${eventData.actual}\n\n**Counterfactual:** ${alternative}\n\nLet's explore the implications of this alternate timeline...`
    };
  }

  getAlternatives(event: string): string[] {
    return this.historicalEvents.get(event.toLowerCase())?.alternatives || [];
  }

  addEvent(event: string, actual: string, alternatives: string[]) {
    this.historicalEvents.set(event.toLowerCase(), { actual, alternatives });
  }
}

// ============================================
// ITEM 16.5: Metaphorical Interpretation Engine
// Detect and interpret metaphors
// ============================================
export class MetaphoricalInterpretationEngine {
  private metaphorMappings: Map<string, { source: string; target: string; meaning: string }> = new Map();

  constructor() {
    this.loadMappings();
  }

  private loadMappings() {
    this.metaphorMappings.set('time is money', {
      source: 'money',
      target: 'time',
      meaning: 'Time is valuable and should be spent wisely'
    });

    this.metaphorMappings.set('life is a journey', {
      source: 'journey',
      target: 'life',
      meaning: 'Life has a path, destinations, obstacles, and progress'
    });

    this.metaphorMappings.set('ideas are food', {
      source: 'food',
      target: 'ideas',
      meaning: 'Ideas can be consumed, digested, and nourish the mind'
    });

    this.metaphorMappings.set('argument is war', {
      source: 'war',
      target: 'argument',
      meaning: 'Arguments involve attacks, defenses, victories, and defeats'
    });

    this.metaphorMappings.set('code is poetry', {
      source: 'poetry',
      target: 'code',
      meaning: 'Code can be elegant, expressive, and beautiful'
    });
  }

  interpret(text: string): { isMetaphor: boolean; metaphor?: string; meaning?: string } {
    const textLower = text.toLowerCase();
    
    for (const [metaphor, data] of this.metaphorMappings.entries()) {
      if (textLower.includes(metaphor)) {
        return {
          isMetaphor: true,
          metaphor,
          meaning: data.meaning
        };
      }
    }

    return { isMetaphor: false };
  }

  explainMetaphor(metaphor: string): string {
    const data = this.metaphorMappings.get(metaphor.toLowerCase());
    
    if (!data) {
      return `I don't have information about the metaphor "${metaphor}".`;
    }

    return `**Metaphor:** "${metaphor}"\n\n**Source Domain:** ${data.source}\n**Target Domain:** ${data.target}\n**Meaning:** ${data.meaning}`;
  }

  addMetaphor(metaphor: string, source: string, target: string, meaning: string) {
    this.metaphorMappings.set(metaphor.toLowerCase(), { source, target, meaning });
  }
}

// ============================================
// ITEM 16.6: Abstract Concept Mapping
// Handle abstract concepts: justice, love, freedom
// ============================================
export class AbstractConceptMapper {
  private abstractConcepts: Map<string, { definitions: string[]; examples: string[]; related: string[] }> = new Map();

  constructor() {
    this.loadConcepts();
  }

  private loadConcepts() {
    this.abstractConcepts.set('justice', {
      definitions: ['fairness in treatment', 'moral rightness', 'legal system'],
      examples: ['court verdicts', 'equal pay', 'criminal punishment'],
      related: ['fairness', 'law', 'ethics', 'equality']
    });

    this.abstractConcepts.set('love', {
      definitions: ['deep affection', 'romantic attachment', 'unconditional care'],
      examples: ['parent-child bond', 'romantic partnership', 'friendship'],
      related: ['affection', 'care', 'compassion', 'attachment']
    });

    this.abstractConcepts.set('freedom', {
      definitions: ['ability to act without constraint', 'liberty', 'autonomy'],
      examples: ['free speech', 'choice of career', 'movement'],
      related: ['liberty', 'autonomy', 'independence', 'rights']
    });

    this.abstractConcepts.set('truth', {
      definitions: ['accordance with fact', 'reality', 'honesty'],
      examples: ['scientific facts', 'honest statements', 'verified information'],
      related: ['fact', 'reality', 'honesty', 'accuracy']
    });
  }

  map(concept: string): { definitions: string[]; examples: string[]; related: string[] } | null {
    return this.abstractConcepts.get(concept.toLowerCase()) || null;
  }

  explain(concept: string): string {
    const data = this.abstractConcepts.get(concept.toLowerCase());
    
    if (!data) {
      return `I don't have detailed information about the abstract concept "${concept}".`;
    }

    let output = `**Abstract Concept: ${concept}**\n\n`;
    output += `**Definitions:**\n`;
    data.definitions.forEach(d => output += `• ${d}\n`);
    
    output += `\n**Examples:**\n`;
    data.examples.forEach(e => output += `• ${e}\n`);
    
    output += `\n**Related Concepts:** ${data.related.join(', ')}`;
    
    return output;
  }

  addConcept(concept: string, definitions: string[], examples: string[], related: string[]) {
    this.abstractConcepts.set(concept.toLowerCase(), { definitions, examples, related });
  }
}

// ============================================
// ITEM 16.7: Creative Constraint Satisfaction
// Given unusual constraints, find valid solutions
// ============================================
export class CreativeConstraintSatisfaction {
  solve(constraints: string[]): { solution: string; approach: string; feasibility: number } {
    const constraintList = constraints.map(c => c.toLowerCase());
    
    // Analyze constraints
    const hasTimeConstraint = constraintList.some(c => c.includes('time') || c.includes('quick') || c.includes('fast'));
    const hasResourceConstraint = constraintList.some(c => c.includes('no budget') || c.includes('free') || c.includes('limited'));
    const hasTechnicalConstraint = constraintList.some(c => c.includes('no javascript') || c.includes('no framework') || c.includes('simple'));

    let solution = '';
    let approach = '';
    let feasibility = 1.0;

    if (hasTimeConstraint && hasResourceConstraint) {
      solution = 'Use existing tools and templates, minimize customization';
      approach = 'Leverage pre-built solutions to save time and money';
      feasibility = 0.7;
    } else if (hasTechnicalConstraint) {
      solution = 'Use vanilla technologies, avoid complex dependencies';
      approach = 'Keep it simple with basic HTML/CSS/JS';
      feasibility = 0.9;
    } else {
      solution = 'Standard approach with balanced trade-offs';
      approach = 'Follow best practices while meeting constraints';
      feasibility = 0.8;
    }

    return { solution, approach, feasibility };
  }

  formatSolution(constraints: string[]): string {
    const result = this.solve(constraints);
    
    let output = `**Constraint Satisfaction Solution**\n\n`;
    output += `**Constraints:**\n`;
    constraints.forEach(c => output += `• ${c}\n`);
    
    output += `\n**Solution:** ${result.solution}\n`;
    output += `\n**Approach:** ${result.approach}\n`;
    output += `\n**Feasibility:** ${(result.feasibility * 100).toFixed(0)}%`;
    
    return output;
  }
}

// ============================================
// ITEM 16.8: Improvisational Generation
// When no pattern matches, improvise coherently
// ============================================
export class ImprovisationalGenerator {
  generate(query: string, availableTools: string[]): { response: string; approach: string } {
    const keywords = Utils.extractKeywords(query);
    
    // Find closest matching tools
    const toolMatches = availableTools.map(tool => {
      const toolKeywords = Utils.extractKeywords(tool);
      const overlap = keywords.filter(k => toolKeywords.includes(k)).length;
      return { tool, overlap, score: overlap / Math.max(keywords.length, toolKeywords.length) };
    });

    toolMatches.sort((a, b) => b.score - a.score);

    if (toolMatches.length > 0 && toolMatches[0].score > 0.3) {
      const bestTool = toolMatches[0].tool;
      return {
        response: `I'll adapt ${bestTool} to address your request, even though it's not an exact match.`,
        approach: `Adapted ${bestTool} for: ${query}`
      };
    }

    // Combine multiple tools
    if (toolMatches.length >= 2) {
      const tools = toolMatches.slice(0, 2).map(t => t.tool);
      return {
        response: `I'll combine ${tools.join(' and ')} to create a solution for your request.`,
        approach: `Combined ${tools.join(' + ')} for: ${query}`
      };
    }

    return {
      response: `I don't have an exact tool for this, but I can break it down into smaller parts and address each one.`,
      approach: 'Decomposed and improvised'
    };
  }
}

// ============================================
// ITEM 16.9: Pattern Extrapolation
// See partial pattern, extrapolate to complete
// ============================================
export class PatternExtrapolator {
  extrapolate(pattern: string[]): { prediction: string; confidence: number; method: string } {
    if (pattern.length < 2) {
      return { prediction: 'Insufficient data', confidence: 0, method: 'none' };
    }

    // Check for arithmetic sequence
    const diffs: number[] = [];
    for (let i = 1; i < pattern.length; i++) {
      const curr = parseInt(pattern[i]);
      const prev = parseInt(pattern[i - 1]);
      if (isNaN(curr) || isNaN(prev)) {
        return { prediction: 'Non-numeric pattern', confidence: 0, method: 'none' };
      }
      diffs.push(curr - prev);
    }

    // Check if arithmetic (constant difference)
    const isArithmetic = diffs.every(d => d === diffs[0]);
    if (isArithmetic) {
      const next = parseInt(pattern[pattern.length - 1]) + diffs[0];
      return {
        prediction: next.toString(),
        confidence: 0.95,
        method: 'arithmetic sequence'
      };
    }

    // Check for geometric sequence
    const ratios: number[] = [];
    for (let i = 1; i < pattern.length; i++) {
      const curr = parseInt(pattern[i]);
      const prev = parseInt(pattern[i - 1]);
      if (prev !== 0) ratios.push(curr / prev);
    }

    const isGeometric = ratios.length > 0 && ratios.every(r => Math.abs(r - ratios[0]) < 0.01);
    if (isGeometric) {
      const next = parseInt(pattern[pattern.length - 1]) * ratios[0];
      return {
        prediction: next.toString(),
        confidence: 0.9,
        method: 'geometric sequence'
      };
    }

    return { prediction: 'Pattern not recognized', confidence: 0.3, method: 'unknown' };
  }

  formatExtrapolation(pattern: string[]): string {
    const result = this.extrapolate(pattern);
    
    let output = `**Pattern Extrapolation**\n\n`;
    output += `**Pattern:** ${pattern.join(', ')}\n\n`;
    output += `**Prediction:** ${result.prediction}\n`;
    output += `**Method:** ${result.method}\n`;
    output += `**Confidence:** ${(result.confidence * 100).toFixed(0)}%`;
    
    return output;
  }
}

// ============================================
// ITEM 16.10: Semantic Stretch Engine
// Stretch meaning to accommodate unusual input
// ============================================
export class SemanticStretchEngine {
  stretch(input: string, knownConcepts: string[]): { stretched: string; original: string; confidence: number } {
    const inputLower = input.toLowerCase();
    const inputKeywords = Utils.extractKeywords(input);
    
    // Find closest known concept
    let bestMatch = '';
    let bestScore = 0;

    knownConcepts.forEach(concept => {
      const conceptKeywords = Utils.extractKeywords(concept);
      const overlap = inputKeywords.filter(kw => conceptKeywords.includes(kw)).length;
      const score = overlap / Math.max(inputKeywords.length, conceptKeywords.length);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = concept;
      }
    });

    if (bestScore > 0.3) {
      return {
        stretched: bestMatch,
        original: input,
        confidence: bestScore
      };
    }

    return {
      stretched: input,
      original: input,
      confidence: 0.2
    };
  }

  formatStretch(input: string, knownConcepts: string[]): string {
    const result = this.stretch(input, knownConcepts);
    
    if (result.confidence < 0.3) {
      return `I'm not sure what you mean by "${input}". Could you clarify?`;
    }

    return `I think you might mean "${result.stretched}" (based on "${input}"). Is that correct?`;
  }
}

// ============================================
// Export all unprecedented input systems
// ============================================
export const UnprecedentedInputSystems = {
  NoveltyDetector,
  AbsurdityHandler,
  HypotheticalScenarioEngine,
  CounterfactualReasoningSystem,
  MetaphoricalInterpretationEngine,
  AbstractConceptMapper,
  CreativeConstraintSatisfaction,
  ImprovisationalGenerator,
  PatternExtrapolator,
  SemanticStretchEngine,
};
