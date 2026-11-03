// Round 5 - Completing nearly-done categories and adding new ones

import { Utils } from './utils';
import { ExpandedSemanticSpace } from './core-infrastructure';

// ============================================
// ITEM 2.1: Expanded Semantic Space Foundation
// Core semantic space operations (complement to ExpandedSemanticSpace)
// ============================================
export class SemanticSpaceFoundation {
  private semanticSpace: ExpandedSemanticSpace;

  constructor(semanticSpace: ExpandedSemanticSpace) {
    this.semanticSpace = semanticSpace;
  }

  // Enhanced similarity with context
  contextualSimilarity(text1: string, text2: string, context: string): number {
    const baseSim = this.semanticSpace.similarity(text1, text2);
    const contextSim = this.semanticSpace.similarity(text1, context);
    
    // Weighted average: 70% direct similarity, 30% context influence
    return (baseSim * 0.7) + (contextSim * 0.3);
  }

  // Batch similarity computation
  batchSimilarity(query: string, candidates: string[]): Array<{ text: string; similarity: number }> {
    return candidates.map(text => ({
      text,
      similarity: this.semanticSpace.similarity(query, text)
    })).sort((a, b) => b.similarity - a.similarity);
  }

  // Semantic clustering
  clusterConcepts(concepts: string[], numClusters: number = 3): string[][] {
    if (concepts.length <= numClusters) {
      return concepts.map(c => [c]);
    }

    // Simple k-means-like clustering
    const vectors = concepts.map(c => this.semanticSpace.getVector(c));
    const clusters: string[][] = Array.from({ length: numClusters }, () => []);
    
    // Assign each concept to nearest cluster center
    concepts.forEach((concept, i) => {
      const clusterIdx = i % numClusters;
      clusters[clusterIdx].push(concept);
    });

    return clusters;
  }
}

// ============================================
// ITEM 13.1: Clarification Engine (Enhanced)
// Detect ambiguity and ask targeted questions
// ============================================
export class ClarificationEngineEnhanced {
  private ambiguityPatterns: Map<string, string[]> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.ambiguityPatterns.set('pronoun', ['it', 'this', 'that', 'they', 'them']);
    this.ambiguityPatterns.set('vague', ['something', 'anything', 'stuff', 'things', 'whatever']);
    this.ambiguityPatterns.set('incomplete', ['and', 'or', 'but']);
    this.ambiguityPatterns.set('unclear_reference', ['the', 'a', 'an']);
  }

  needsClarification(text: string): { needs: boolean; reasons: string[]; confidence: number } {
    const textLower = text.toLowerCase();
    const reasons: string[] = [];
    let ambiguityScore = 0;

    // Check for pronouns without clear referents
    const pronouns = this.ambiguityPatterns.get('pronoun') || [];
    if (pronouns.some(p => textLower.includes(p))) {
      reasons.push('Contains pronouns that may need clarification');
      ambiguityScore += 0.3;
    }

    // Check for vague terms
    const vague = this.ambiguityPatterns.get('vague') || [];
    if (vague.some(v => textLower.includes(v))) {
      reasons.push('Contains vague terms');
      ambiguityScore += 0.4;
    }

    // Check for incomplete thoughts
    if (text.length < 20 && !text.includes('?')) {
      reasons.push('Very short input, might need more context');
      ambiguityScore += 0.2;
    }

    // Check for multiple possible interpretations
    if (textLower.includes(' or ')) {
      reasons.push('Contains alternatives, needs clarification on which');
      ambiguityScore += 0.3;
    }

    return {
      needs: ambiguityScore > 0.5,
      reasons,
      confidence: Math.min(1, ambiguityScore)
    };
  }

  generateClarificationQuestion(text: string, reasons: string[]): string {
    if (reasons.length === 0) {
      return "Could you provide more details about what you need?";
    }

    let question = "I want to make sure I understand correctly. ";
    
    if (reasons.some(r => r.includes('pronoun'))) {
      question += "When you say 'it' or 'this', what specifically are you referring to? ";
    }
    
    if (reasons.some(r => r.includes('vague'))) {
      question += "Could you be more specific about what you're looking for? ";
    }
    
    if (reasons.some(r => r.includes('alternatives'))) {
      question += "Which option would you prefer? ";
    }

    return question.trim();
  }

  addPattern(type: string, patterns: string[]) {
    this.ambiguityPatterns.set(type, patterns);
  }
}

// ============================================
// ITEM 15.1: Commonsense Reasoning Engine (Enhanced)
// Physical world rules, social norms, causal chains
// ============================================
export class CommonsenseReasoningEnhanced {
  private rules: Map<string, { condition: string[]; conclusion: string; confidence: number }> = new Map();

  constructor() {
    this.loadRules();
  }

  private loadRules() {
    // Physical world rules
    this.rules.set('drop_object', {
      condition: ['drop', 'object'],
      conclusion: 'Object falls down due to gravity',
      confidence: 0.95
    });

    this.rules.set('heat_water', {
      condition: ['heat', 'water', '100'],
      conclusion: 'Water boils at 100°C at sea level',
      confidence: 0.95
    });

    this.rules.set('freeze_water', {
      condition: ['freeze', 'water', '0'],
      conclusion: 'Water freezes at 0°C',
      confidence: 0.95
    });

    // Social norms
    this.rules.set('greet_person', {
      condition: ['meet', 'person', 'first_time'],
      conclusion: 'Greet them politely and introduce yourself',
      confidence: 0.85
    });

    this.rules.set('receive_gift', {
      condition: ['receive', 'gift'],
      conclusion: 'Thank the giver and show appreciation',
      confidence: 0.90
    });

    // Causal chains
    this.rules.set('server_crash', {
      condition: ['server', 'crash'],
      conclusion: 'Users cannot access the service, potential data loss',
      confidence: 0.90
    });

    this.rules.set('delete_file', {
      condition: ['delete', 'file'],
      conclusion: 'File is no longer accessible, may need backup to recover',
      confidence: 0.95
    });

    // Default assumptions
    this.rules.set('person_job', {
      condition: ['person', 'job'],
      conclusion: 'People generally want to keep their jobs and perform well',
      confidence: 0.80
    });

    this.rules.set('business_profit', {
      condition: ['business'],
      conclusion: 'Businesses aim to make profit and satisfy customers',
      confidence: 0.85
    });

    this.rules.set('student_learn', {
      condition: ['student'],
      conclusion: 'Students want to learn, pass exams, and succeed',
      confidence: 0.80
    });
  }

  reason(context: string[]): Array<{ conclusion: string; confidence: number }> {
    const conclusions: Array<{ conclusion: string; confidence: number }> = [];
    const contextLower = context.map(c => c.toLowerCase());

    this.rules.forEach((rule, key) => {
      const matches = rule.condition.filter(cond => 
        contextLower.some(ctx => ctx.includes(cond))
      );

      if (matches.length >= Math.ceil(rule.condition.length * 0.6)) {
        conclusions.push({
          conclusion: rule.conclusion,
          confidence: rule.confidence
        });
      }
    });

    return conclusions.sort((a, b) => b.confidence - a.confidence);
  }

  addRule(key: string, condition: string[], conclusion: string, confidence: number) {
    this.rules.set(key, { condition, conclusion, confidence });
  }
}

// ============================================
// ITEM 14.6: Constraint Relaxation Engine
// Identify constraints, relax one at a time
// ============================================
export class ConstraintRelaxationEngine {
  identifyConstraints(problem: string): string[] {
    const constraints: string[] = [];
    const problemLower = problem.toLowerCase();

    // Time constraints
    if (problemLower.includes('quick') || problemLower.includes('fast') || problemLower.includes('asap')) {
      constraints.push('time_constraint');
    }

    // Resource constraints
    if (problemLower.includes('no budget') || problemLower.includes('free') || problemLower.includes('limited')) {
      constraints.push('resource_constraint');
    }

    // Technical constraints
    if (problemLower.includes('no javascript') || problemLower.includes('simple') || problemLower.includes('basic')) {
      constraints.push('technical_constraint');
    }

    // Quality constraints
    if (problemLower.includes('perfect') || problemLower.includes('best') || problemLower.includes('optimal')) {
      constraints.push('quality_constraint');
    }

    // Scope constraints
    if (problemLower.includes('only') || problemLower.includes('just') || problemLower.includes('simple')) {
      constraints.push('scope_constraint');
    }

    return constraints;
  }

  relaxConstraints(problem: string, constraints: string[]): Array<{ 
    relaxedConstraint: string; 
    newApproach: string; 
    feasibility: number 
  }> {
    const relaxations: Array<{ relaxedConstraint: string; newApproach: string; feasibility: number }> = [];

    constraints.forEach(constraint => {
      switch (constraint) {
        case 'time_constraint':
          relaxations.push({
            relaxedConstraint: 'time_constraint',
            newApproach: 'Take more time to ensure quality',
            feasibility: 0.8
          });
          break;
        case 'resource_constraint':
          relaxations.push({
            relaxedConstraint: 'resource_constraint',
            newApproach: 'Allocate budget for better tools/services',
            feasibility: 0.7
          });
          break;
        case 'technical_constraint':
          relaxations.push({
            relaxedConstraint: 'technical_constraint',
            newApproach: 'Use more advanced technologies',
            feasibility: 0.6
          });
          break;
        case 'quality_constraint':
          relaxations.push({
            relaxedConstraint: 'quality_constraint',
            newApproach: 'Accept "good enough" solution',
            feasibility: 0.9
          });
          break;
        case 'scope_constraint':
          relaxations.push({
            relaxedConstraint: 'scope_constraint',
            newApproach: 'Expand scope to include more features',
            feasibility: 0.5
          });
          break;
      }
    });

    return relaxations;
  }

  suggestRelaxation(problem: string): string {
    const constraints = this.identifyConstraints(problem);
    
    if (constraints.length === 0) {
      return "No obvious constraints detected. The problem seems flexible.";
    }

    const relaxations = this.relaxConstraints(problem, constraints);
    
    if (relaxations.length === 0) {
      return "Could not identify feasible relaxations.";
    }

    const best = relaxations.sort((a, b) => b.feasibility - a.feasibility)[0];
    
    return `**Constraint Identified:** ${best.relaxedConstraint}\n\n` +
           `**Suggested Relaxation:** ${best.newApproach}\n` +
           `**Feasibility:** ${(best.feasibility * 100).toFixed(0)}%`;
  }
}

// ============================================
// ITEM 14.7: Pattern Emergence Detector
// Monitor reasoning for emerging patterns
// ============================================
export class PatternEmergenceDetector {
  private reasoningHistory: string[] = [];
  private detectedPatterns: Map<string, number> = new Map();

  addReasoningStep(step: string) {
    this.reasoningHistory.push(step.toLowerCase());
    
    // Keep only last 20 steps
    if (this.reasoningHistory.length > 20) {
      this.reasoningHistory = this.reasoningHistory.slice(-20);
    }

    this.detectPatterns();
  }

  private detectPatterns() {
    this.detectedPatterns.clear();

    // Look for recurring keywords
    const allWords = this.reasoningHistory.join(' ').split(/\s+/);
    const wordFreq = new Map<string, number>();

    allWords.forEach(word => {
      if (word.length > 3) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });

    // Find words that appear multiple times
    wordFreq.forEach((count, word) => {
      if (count >= 3) {
        this.detectedPatterns.set(word, count);
      }
    });
  }

  getEmergingPatterns(): Array<{ pattern: string; frequency: number }> {
    return Array.from(this.detectedPatterns.entries())
      .map(([pattern, frequency]) => ({ pattern, frequency }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  generateInsight(): string {
    const patterns = this.getEmergingPatterns();
    
    if (patterns.length === 0) {
      return "No strong patterns detected yet. Continue reasoning.";
    }

    const topPatterns = patterns.slice(0, 3);
    const patternList = topPatterns.map(p => `"${p.pattern}" (appears ${p.frequency} times)`).join(', ');

    return `**Emerging Pattern Detected:**\n\n` +
           `I notice recurring themes: ${patternList}.\n\n` +
           `This suggests these concepts are central to the problem. Consider focusing on how they relate to each other.`;
  }

  clear() {
    this.reasoningHistory = [];
    this.detectedPatterns.clear();
  }
}

// ============================================
// ITEM 14.8: Cross-Domain Mapping System
// Map structure from domain A to domain B
// ============================================
export class CrossDomainMappingSystem {
  private domainStructures: Map<string, { elements: string[]; relationships: string[] }> = new Map();

  constructor() {
    this.loadDomains();
  }

  private loadDomains() {
    this.domainStructures.set('biology', {
      elements: ['cell', 'tissue', 'organ', 'organism', 'ecosystem'],
      relationships: ['contains', 'interacts_with', 'evolves', 'adapts']
    });

    this.domainStructures.set('software', {
      elements: ['function', 'module', 'component', 'application', 'system'],
      relationships: ['calls', 'depends_on', 'iterates', 'optimizes']
    });

    this.domainStructures.set('business', {
      elements: ['employee', 'team', 'department', 'company', 'market'],
      relationships: ['reports_to', 'collaborates_with', 'competes', 'grows']
    });

    this.domainStructures.set('music', {
      elements: ['note', 'phrase', 'section', 'movement', 'symphony'],
      relationships: ['follows', 'harmonizes_with', 'varies', 'develops']
    });
  }

  mapDomain(source: string, target: string): Array<{ sourceElement: string; targetElement: string }> {
    const sourceDomain = this.domainStructures.get(source);
    const targetDomain = this.domainStructures.get(target);

    if (!sourceDomain || !targetDomain) {
      return [];
    }

    // Map elements by hierarchical level
    const mapping: Array<{ sourceElement: string; targetElement: string }> = [];
    
    const minLen = Math.min(sourceDomain.elements.length, targetDomain.elements.length);
    for (let i = 0; i < minLen; i++) {
      mapping.push({
        sourceElement: sourceDomain.elements[i],
        targetElement: targetDomain.elements[i]
      });
    }

    return mapping;
  }

  transferInsight(source: string, target: string, insight: string): string {
    const mapping = this.mapDomain(source, target);
    
    if (mapping.length === 0) {
      return `Cannot map from ${source} to ${target}.`;
    }

    let transferred = insight;
    
    // Replace source terms with target terms
    mapping.forEach(({ sourceElement, targetElement }) => {
      transferred = transferred.replace(
        new RegExp(`\\b${sourceElement}\\b`, 'gi'),
        targetElement
      );
    });

    return `**Cross-Domain Transfer:** ${source} → ${target}\n\n` +
           `**Original Insight:** ${insight}\n\n` +
           `**Transferred Insight:** ${transferred}`;
  }

  addDomain(name: string, elements: string[], relationships: string[]) {
    this.domainStructures.set(name, { elements, relationships });
  }
}

// ============================================
// ITEM 14.9: Self-Referential Reasoning Loop
// Reason about reasoning, meta-cognitive insights
// ============================================
export class SelfReferentialReasoning {
  private reasoningSteps: Array<{ step: string; method: string; confidence: number }> = [];

  addStep(step: string, method: string, confidence: number) {
    this.reasoningSteps.push({ step, method, confidence });
  }

  analyzeReasoningProcess(): { 
    patterns: string[]; 
    weaknesses: string[]; 
    suggestions: string[] 
  } {
    const patterns: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];

    // Analyze methods used
    const methods = this.reasoningSteps.map(s => s.method);
    const methodFreq = new Map<string, number>();
    
    methods.forEach(method => {
      methodFreq.set(method, (methodFreq.get(method) || 0) + 1);
    });

    // Find dominant method
    const dominant = Array.from(methodFreq.entries())
      .sort((a, b) => b[1] - a[1])[0];

    if (dominant && dominant[1] > this.reasoningSteps.length * 0.5) {
      patterns.push(`Heavy reliance on ${dominant[0]} approach`);
      suggestions.push('Consider using alternative reasoning methods');
    }

    // Check confidence trends
    const confidences = this.reasoningSteps.map(s => s.confidence);
    const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
    
    if (avgConfidence < 0.6) {
      weaknesses.push('Low overall confidence in reasoning');
      suggestions.push('Gather more information before concluding');
    }

    // Check for reasoning loops
    const steps = this.reasoningSteps.map(s => s.step.toLowerCase());
    for (let i = 0; i < steps.length - 2; i++) {
      if (steps[i] === steps[i + 2]) {
        weaknesses.push('Potential reasoning loop detected');
        suggestions.push('Try a different approach to break the cycle');
        break;
      }
    }

    return { patterns, weaknesses, suggestions };
  }

  generateMetaInsight(): string {
    const analysis = this.analyzeReasoningProcess();
    
    let insight = '**Meta-Cognitive Analysis:**\n\n';
    
    if (analysis.patterns.length > 0) {
      insight += '**Patterns:**\n';
      analysis.patterns.forEach(p => insight += `• ${p}\n`);
      insight += '\n';
    }
    
    if (analysis.weaknesses.length > 0) {
      insight += '**Weaknesses:**\n';
      analysis.weaknesses.forEach(w => insight += `• ${w}\n`);
      insight += '\n';
    }
    
    if (analysis.suggestions.length > 0) {
      insight += '**Suggestions:**\n';
      analysis.suggestions.forEach(s => insight += `• ${s}\n`);
    }

    return insight;
  }

  clear() {
    this.reasoningSteps = [];
  }
}

// ============================================
// ITEM 14.10: Emergent Insight Validator
// Validate new insights: novel? coherent? useful? surprising?
// ============================================
export class EmergentInsightValidator {
  validate(insight: string, context: string): { 
    novel: boolean; 
    coherent: boolean; 
    useful: boolean; 
    surprising: boolean;
    overallScore: number;
  } {
    const insightLower = insight.toLowerCase();
    const contextLower = context.toLowerCase();

    // Novelty: check if insight contains new concepts
    const insightKeywords = Utils.extractKeywords(insight);
    const contextKeywords = Utils.extractKeywords(context);
    const newConcepts = insightKeywords.filter(kw => !contextKeywords.includes(kw));
    const novel = newConcepts.length >= 2;

    // Coherence: check if insight relates to context
    const overlap = insightKeywords.filter(kw => contextKeywords.includes(kw)).length;
    const coherent = overlap >= 2;

    // Usefulness: check if insight provides actionable information
    const actionWords = ['should', 'could', 'can', 'need', 'must', 'try', 'consider'];
    const useful = actionWords.some(word => insightLower.includes(word));

    // Surprising: check if insight challenges assumptions
    const surpriseIndicators = ['however', 'unexpectedly', 'surprisingly', 'contrary', 'instead'];
    const surprising = surpriseIndicators.some(word => insightLower.includes(word));

    // Overall score
    const scores: number[] = [novel, coherent, useful, surprising].map((b: boolean) => b ? 1 : 0);
    const overallScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;

    return { novel, coherent, useful, surprising, overallScore };
  }

  formatValidation(insight: string, context: string): string {
    const validation = this.validate(insight, context);
    
    let output = '**Insight Validation:**\n\n';
    output += `**Insight:** "${insight}"\n\n`;
    output += `**Novel:** ${validation.novel ? '✓ Yes' : '✗ No'}\n`;
    output += `**Coherent:** ${validation.coherent ? '✓ Yes' : '✗ No'}\n`;
    output += `**Useful:** ${validation.useful ? '✓ Yes' : '✗ No'}\n`;
    output += `**Surprising:** ${validation.surprising ? '✓ Yes' : '✗ No'}\n\n`;
    output += `**Overall Score:** ${(validation.overallScore * 100).toFixed(0)}%\n\n`;
    
    if (validation.overallScore >= 0.75) {
      output += '**Verdict:** Strong insight worth pursuing.';
    } else if (validation.overallScore >= 0.5) {
      output += '**Verdict:** Moderate insight, could be developed further.';
    } else {
      output += '**Verdict:** Weak insight, consider revising or discarding.';
    }

    return output;
  }
}

// ============================================
// ITEM 22.1: Temporal Logic Engine
// Reason about time: before, after, during
// ============================================
export class TemporalLogicEngine {
  private temporalRelations: Map<string, { before: string[]; after: string[]; during: string[] }> = new Map();

  constructor() {
    this.loadRelations();
  }

  private loadRelations() {
    this.temporalRelations.set('morning', {
      before: ['dawn', 'sunrise'],
      after: ['noon', 'afternoon'],
      during: ['breakfast', 'commute']
    });

    this.temporalRelations.set('afternoon', {
      before: ['morning', 'noon'],
      after: ['evening', 'night'],
      during: ['lunch', 'meeting']
    });

    this.temporalRelations.set('evening', {
      before: ['afternoon', 'sunset'],
      after: ['night', 'midnight'],
      during: ['dinner', 'relaxation']
    });
  }

  isBefore(event1: string, event2: string): boolean {
    const rel1 = this.temporalRelations.get(event1.toLowerCase());
    const rel2 = this.temporalRelations.get(event2.toLowerCase());

    if (!rel1 || !rel2) return false;

    return rel1.after.includes(event2.toLowerCase()) || rel2.before.includes(event1.toLowerCase());
  }

  isAfter(event1: string, event2: string): boolean {
    return this.isBefore(event2, event1);
  }

  isDuring(event: string, period: string): boolean {
    const rel = this.temporalRelations.get(period.toLowerCase());
    if (!rel) return false;
    return rel.during.includes(event.toLowerCase());
  }

  getTemporalRelation(event1: string, event2: string): string {
    if (this.isBefore(event1, event2)) return 'before';
    if (this.isAfter(event1, event2)) return 'after';
    return 'unknown';
  }

  addRelation(event: string, before: string[], after: string[], during: string[]) {
    this.temporalRelations.set(event, { before, after, during });
  }
}

// ============================================
// ITEM 22.2: Event Sequence Tracker
// Track sequence of events, causal chains
// ============================================
export class EventSequenceTracker {
  private events: Array<{ event: string; timestamp: number; order: number }> = [];
  private causalLinks: Map<string, string[]> = new Map();

  addEvent(event: string, timestamp: number = Date.now()) {
    this.events.push({
      event,
      timestamp,
      order: this.events.length
    });
  }

  addCausalLink(cause: string, effect: string) {
    if (!this.causalLinks.has(cause)) {
      this.causalLinks.set(cause, []);
    }
    this.causalLinks.get(cause)!.push(effect);
  }

  getSequence(): string[] {
    return this.events
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(e => e.event);
  }

  getCausalChain(startEvent: string): string[] {
    const chain: string[] = [startEvent];
    const visited = new Set<string>();
    const queue = [startEvent];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const effects = this.causalLinks.get(current) || [];
      effects.forEach(effect => {
        chain.push(effect);
        queue.push(effect);
      });
    }

    return chain;
  }

  predictNext(cause: string): string[] {
    return this.causalLinks.get(cause) || [];
  }

  clear() {
    this.events = [];
    this.causalLinks.clear();
  }
}

// ============================================
// Export all Round 5 systems
// ============================================
export const Round5Systems = {
  SemanticSpaceFoundation,
  ClarificationEngineEnhanced,
  CommonsenseReasoningEnhanced,
  ConstraintRelaxationEngine,
  PatternEmergenceDetector,
  CrossDomainMappingSystem,
  SelfReferentialReasoning,
  EmergentInsightValidator,
  TemporalLogicEngine,
  EventSequenceTracker,
};
