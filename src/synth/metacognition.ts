// Metacognition - Items 26.1-26.10
// Reasoning process monitor, confidence calibration, knowledge boundary detection, reasoning strategy selection, error detection, learning from mistakes, reasoning transparency, cognitive bias detection, reasoning efficiency analysis, metacognitive awareness

// ============================================
// ITEM 26.1: Reasoning Process Monitor
// Track reasoning steps, detect patterns
// ============================================
export class ReasoningProcessMonitor {
  private steps: Array<{ step: string; confidence: number; timestamp: number }> = [];
  private patterns: Map<string, number> = new Map();

  addStep(step: string, confidence: number = 1.0) {
    this.steps.push({
      step,
      confidence,
      timestamp: Date.now()
    });

    // Track patterns
    const normalized = step.toLowerCase().trim();
    this.patterns.set(normalized, (this.patterns.get(normalized) || 0) + 1);
  }

  getReasoningTrace(): string {
    if (this.steps.length === 0) return 'No reasoning steps recorded';

    let trace = '**Reasoning Trace:**\n\n';
    this.steps.forEach((s, i) => {
      trace += `${i + 1}. ${s.step} (confidence: ${(s.confidence * 100).toFixed(0)}%)\n`;
    });

    return trace;
  }

  detectPatterns(): Array<{ pattern: string; frequency: number }> {
    return Array.from(this.patterns.entries())
      .map(([pattern, frequency]) => ({ pattern, frequency }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  getAverageConfidence(): number {
    if (this.steps.length === 0) return 0;
    return this.steps.reduce((sum, s) => sum + s.confidence, 0) / this.steps.length;
  }

  detectLoops(): boolean {
    const recent = this.steps.slice(-5);
    const stepsText = recent.map(s => s.step.toLowerCase().trim());
    
    // Check for repeated sequences
    for (let i = 0; i < stepsText.length - 1; i++) {
      for (let j = i + 1; j < stepsText.length; j++) {
        if (stepsText[i] === stepsText[j]) {
          return true;
        }
      }
    }
    
    return false;
  }

  clear() {
    this.steps = [];
    this.patterns.clear();
  }
}

// ============================================
// ITEM 26.2: Confidence Calibration
// Calibrate confidence levels, detect over/underconfidence
// ============================================
export class ConfidenceCalibration {
  private predictions: Array<{ prediction: string; confidence: number; outcome: boolean | null; timestamp: number }> = [];

  recordPrediction(prediction: string, confidence: number) {
    this.predictions.push({
      prediction,
      confidence,
      outcome: null,
      timestamp: Date.now()
    });
  }

  updateOutcome(predictionIndex: number, outcome: boolean) {
    if (predictionIndex >= 0 && predictionIndex < this.predictions.length) {
      this.predictions[predictionIndex].outcome = outcome;
    }
  }

  calibrateConfidence(statedConfidence: number): number {
    const completed = this.predictions.filter(p => p.outcome !== null);
    if (completed.length < 5) return statedConfidence; // Not enough data

    // Calculate actual accuracy for similar confidence levels
    const similarConfidence = completed.filter(p => 
      Math.abs(p.confidence - statedConfidence) < 0.1
    );

    if (similarConfidence.length === 0) return statedConfidence;

    const actualAccuracy = similarConfidence.filter(p => p.outcome).length / similarConfidence.length;
    
    // Adjust confidence based on actual accuracy
    const adjustment = (actualAccuracy - statedConfidence) * 0.3; // Conservative adjustment
    return Math.max(0, Math.min(1, statedConfidence + adjustment));
  }

  detectOverconfidence(): boolean {
    const completed = this.predictions.filter(p => p.outcome !== null);
    if (completed.length < 5) return false;

    const avgConfidence = completed.reduce((sum, p) => sum + p.confidence, 0) / completed.length;
    const avgAccuracy = completed.filter(p => p.outcome).length / completed.length;

    return avgConfidence > avgAccuracy + 0.1; // Overconfident if stated > actual by 10%
  }

  detectUnderconfidence(): boolean {
    const completed = this.predictions.filter(p => p.outcome !== null);
    if (completed.length < 5) return false;

    const avgConfidence = completed.reduce((sum, p) => sum + p.confidence, 0) / completed.length;
    const avgAccuracy = completed.filter(p => p.outcome).length / completed.length;

    return avgAccuracy > avgConfidence + 0.1; // Underconfident if actual > stated by 10%
  }

  getCalibrationReport(): string {
    const completed = this.predictions.filter(p => p.outcome !== null);
    
    if (completed.length === 0) {
      return 'No completed predictions to analyze';
    }

    const avgConfidence = completed.reduce((sum, p) => sum + p.confidence, 0) / completed.length;
    const avgAccuracy = completed.filter(p => p.outcome).length / completed.length;

    let report = '**Confidence Calibration Report**\n\n';
    report += `Total Predictions: ${this.predictions.length}\n`;
    report += `Completed: ${completed.length}\n`;
    report += `Average Stated Confidence: ${(avgConfidence * 100).toFixed(1)}%\n`;
    report += `Actual Accuracy: ${(avgAccuracy * 100).toFixed(1)}%\n\n`;

    if (this.detectOverconfidence()) {
      report += '⚠️ **Overconfidence Detected:** Stated confidence exceeds actual accuracy\n';
      report += 'Recommendation: Reduce confidence estimates by 10-20%\n';
    } else if (this.detectUnderconfidence()) {
      report += '⚠️ **Underconfidence Detected:** Actual accuracy exceeds stated confidence\n';
      report += 'Recommendation: Increase confidence estimates\n';
    } else {
      report += '✓ Confidence levels are well-calibrated\n';
    }

    return report;
  }

  clear() {
    this.predictions = [];
  }
}

// ============================================
// ITEM 26.3: Knowledge Boundary Detection
// Detect what is known vs unknown
// ============================================
export class KnowledgeBoundaryDetection {
  private knownTopics: Set<string> = new Set();
  private uncertainTopics: Map<string, number> = new Map(); // topic -> confidence

  addKnownTopic(topic: string) {
    this.knownTopics.add(topic.toLowerCase());
  }

  addUncertainTopic(topic: string, confidence: number) {
    this.uncertainTopics.set(topic.toLowerCase(), confidence);
  }

  isKnown(topic: string): boolean {
    return this.knownTopics.has(topic.toLowerCase());
  }

  getConfidence(topic: string): number {
    const lower = topic.toLowerCase();
    if (this.knownTopics.has(lower)) return 1.0;
    return this.uncertainTopics.get(lower) || 0.0;
  }

  detectBoundaries(query: string): { known: string[]; unknown: string[]; uncertain: string[] } {
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const known: string[] = [];
    const unknown: string[] = [];
    const uncertain: string[] = [];

    words.forEach(word => {
      if (this.knownTopics.has(word)) {
        known.push(word);
      } else if (this.uncertainTopics.has(word)) {
        uncertain.push(word);
      } else {
        unknown.push(word);
      }
    });

    return { known, unknown, uncertain };
  }

  formatBoundaries(query: string, boundaries: { known: string[]; unknown: string[]; uncertain: string[] }): string {
    let report = '**Knowledge Boundary Analysis**\n\n';
    report += `Query: "${query}"\n\n`;

    if (boundaries.known.length > 0) {
      report += `**Known Topics (${boundaries.known.length}):**\n`;
      boundaries.known.forEach(t => report += `- ${t}\n`);
      report += '\n';
    }

    if (boundaries.uncertain.length > 0) {
      report += `**Uncertain Topics (${boundaries.uncertain.length}):**\n`;
      boundaries.uncertain.forEach(t => {
        const conf = this.uncertainTopics.get(t) || 0;
        report += `- ${t} (${(conf * 100).toFixed(0)}% confident)\n`;
      });
      report += '\n';
    }

    if (boundaries.unknown.length > 0) {
      report += `**Unknown Topics (${boundaries.unknown.length}):**\n`;
      boundaries.unknown.forEach(t => report += `- ${t}\n`);
      report += '\n';
      report += '**Recommendation:** Seek additional information or clarify these topics before proceeding.\n';
    }

    return report;
  }

  clear() {
    this.knownTopics.clear();
    this.uncertainTopics.clear();
  }
}

// ============================================
// ITEM 26.4: Reasoning Strategy Selection
// Select best reasoning approach for problem type
// ============================================
export class ReasoningStrategySelection {
  private strategies: Map<string, { 
    problemTypes: string[]; 
    strengths: string[]; 
    weaknesses: string[];
    confidence: number 
  }> = new Map();

  constructor() {
    this.loadStrategies();
  }

  private loadStrategies() {
    this.strategies.set('analytical', {
      problemTypes: ['math', 'logic', 'data analysis', 'optimization'],
      strengths: ['precise', 'systematic', 'verifiable'],
      weaknesses: ['slow', 'may miss context'],
      confidence: 0.9
    });

    this.strategies.set('intuitive', {
      problemTypes: ['creative', 'social', 'ambiguous'],
      strengths: ['fast', 'holistic', 'context-aware'],
      weaknesses: ['hard to verify', 'may be biased'],
      confidence: 0.7
    });

    this.strategies.set('analogical', {
      problemTypes: ['novel', 'complex', 'cross-domain'],
      strengths: ['leverages experience', 'creative'],
      weaknesses: ['may not transfer well', 'requires similar cases'],
      confidence: 0.75
    });

    this.strategies.set('decompositional', {
      problemTypes: ['complex', 'multi-step', 'large'],
      strengths: ['manageable', 'systematic', 'trackable'],
      weaknesses: ['may miss interactions', 'slow'],
      confidence: 0.85
    });

    this.strategies.set('collaborative', {
      problemTypes: ['multi-perspective', 'conflicting', 'social'],
      strengths: ['diverse views', 'balanced', 'comprehensive'],
      weaknesses: ['slow', 'requires coordination'],
      confidence: 0.8
    });
  }

  selectStrategy(problemType: string): { strategy: string; confidence: number; reasoning: string } {
    const problemLower = problemType.toLowerCase();
    let bestStrategy = 'analytical';
    let bestConfidence = 0;
    let reasoning = '';

    this.strategies.forEach((data, strategy) => {
      const matchCount = data.problemTypes.filter(pt => problemLower.includes(pt)).length;
      const score = matchCount * data.confidence;

      if (score > bestConfidence) {
        bestConfidence = score;
        bestStrategy = strategy;
        reasoning = `Selected based on ${matchCount} matching problem types with ${(data.confidence * 100).toFixed(0)}% base confidence`;
      }
    });

    return {
      strategy: bestStrategy,
      confidence: Math.min(1, bestConfidence),
      reasoning
    };
  }

  compareStrategies(problemType: string, strategies: string[]): string {
    let comparison = `**Strategy Comparison for: ${problemType}**\n\n`;

    strategies.forEach(strategy => {
      const data = this.strategies.get(strategy.toLowerCase());
      if (data) {
        comparison += `**${strategy.toUpperCase()}:**\n`;
        comparison += `- Strengths: ${data.strengths.join(', ')}\n`;
        comparison += `- Weaknesses: ${data.weaknesses.join(', ')}\n`;
        comparison += `- Base Confidence: ${(data.confidence * 100).toFixed(0)}%\n\n`;
      }
    });

    return comparison;
  }

  getStrategyDetails(strategy: string): string {
    const data = this.strategies.get(strategy.toLowerCase());
    if (!data) return `Unknown strategy: ${strategy}`;

    let details = `**Strategy: ${strategy}**\n\n`;
    details += `**Problem Types:** ${data.problemTypes.join(', ')}\n`;
    details += `**Strengths:** ${data.strengths.join(', ')}\n`;
    details += `**Weaknesses:** ${data.weaknesses.join(', ')}\n`;
    details += `**Base Confidence:** ${(data.confidence * 100).toFixed(0)}%`;

    return details;
  }

  addStrategy(name: string, problemTypes: string[], strengths: string[], weaknesses: string[], confidence: number) {
    this.strategies.set(name.toLowerCase(), { problemTypes, strengths, weaknesses, confidence });
  }
}

// ============================================
// ITEM 26.5: Error Detection
// Detect reasoning errors, logical fallacies
// ============================================
export class ErrorDetection {
  private fallacies: Map<string, { pattern: RegExp; description: string; example: string }> = new Map();

  constructor() {
    this.loadFallacies();
  }

  private loadFallacies() {
    this.fallacies.set('ad_hominem', {
      pattern: /\b(you're|they're|he's|she's)\s+(stupid|wrong|idiot|dumb)/i,
      description: 'Attacking the person instead of the argument',
      example: '"You\'re stupid so your argument is wrong"'
    });

    this.fallacies.set('straw_man', {
      pattern: /\b(so you're saying|you mean|in other words)\s+.*\?/i,
      description: 'Misrepresenting opponent\'s argument',
      example: '"So you\'re saying we should do nothing?"'
    });

    this.fallacies.set('false_dichotomy', {
      pattern: /\b(either|or)\s+.*\s+(or|must)\s+/i,
      description: 'Presenting only two options when more exist',
      example: '"Either you\'re with us or against us"'
    });

    this.fallacies.set('slippery_slope', {
      pattern: /\b(if|once)\s+.*\s+(then|we'll|we will)\s+.*\s+(disaster|ruin|destroy)/i,
      description: 'Assuming one event will inevitably lead to extreme consequences',
      example: '"If we allow this, soon society will collapse"'
    });

    this.fallacies.set('appeal_to_authority', {
      pattern: /\b(because|since)\s+.*\s+(said|states|claims)/i,
      description: 'Accepting claim as true because authority figure said it',
      example: '"It\'s true because the expert said so"'
    });

    this.fallacies.set('hasty_generalization', {
      pattern: /\b(all|every|always|never)\s+/i,
      description: 'Drawing broad conclusion from limited evidence',
      example: '"All politicians are corrupt"'
    });
  }

  detectErrors(text: string): Array<{ fallacy: string; description: string; location: string }> {
    const errors: Array<{ fallacy: string; description: string; location: string }> = [];
    const lines = text.split('\n');

    lines.forEach((line, lineIdx) => {
      this.fallacies.forEach((data, fallacy) => {
        if (data.pattern.test(line)) {
          errors.push({
            fallacy,
            description: data.description,
            location: `Line ${lineIdx + 1}`
          });
        }
      });
    });

    return errors;
  }

  formatErrors(errors: Array<{ fallacy: string; description: string; location: string }>): string {
    if (errors.length === 0) return '✓ No logical fallacies detected';

    let report = '**Logical Fallacies Detected:**\n\n';
    errors.forEach((e, i) => {
      report += `${i + 1}. **${e.fallacy.replace(/_/g, ' ').toUpperCase()}** (${e.location})\n`;
      report += `   ${e.description}\n\n`;
    });

    report += '**Recommendation:** Review these arguments for logical validity and consider alternative reasoning.';

    return report;
  }

  addFallacy(name: string, pattern: RegExp, description: string, example: string) {
    this.fallacies.set(name, { pattern, description, example });
  }
}

// ============================================
// ITEM 26.6: Learning from Mistakes
// Track errors, improve over time
// ============================================
export class LearningFromMistakes {
  private mistakes: Array<{ 
    context: string; 
    error: string; 
    correction: string; 
    timestamp: number;
    category: string 
  }> = [];

  private corrections: Map<string, string> = new Map();

  recordMistake(context: string, error: string, correction: string, category: string = 'general') {
    this.mistakes.push({
      context,
      error,
      correction,
      timestamp: Date.now(),
      category
    });

    // Store correction for future reference
    this.corrections.set(error.toLowerCase(), correction);
  }

  getCorrection(error: string): string | null {
    return this.corrections.get(error.toLowerCase()) || null;
  }

  getMistakesByCategory(category: string): Array<{ context: string; error: string; correction: string }> {
    return this.mistakes
      .filter(m => m.category === category)
      .map(m => ({ context: m.context, error: m.error, correction: m.correction }));
  }

  getRecentMistakes(count: number = 10): Array<{ context: string; error: string; correction: string; category: string }> {
    return this.mistakes
      .slice(-count)
      .map(m => ({ context: m.context, error: m.error, correction: m.correction, category: m.category }));
  }

  analyzePatterns(): Map<string, number> {
    const patterns = new Map<string, number>();
    
    this.mistakes.forEach(m => {
      patterns.set(m.category, (patterns.get(m.category) || 0) + 1);
    });

    return patterns;
  }

  getLearningReport(): string {
    const patterns = this.analyzePatterns();
    
    let report = '**Learning from Mistakes Report**\n\n';
    report += `Total Mistakes Recorded: ${this.mistakes.length}\n\n`;

    if (patterns.size > 0) {
      report += '**Mistake Patterns by Category:**\n';
      patterns.forEach((count, category) => {
        report += `- ${category}: ${count} mistakes\n`;
      });
      report += '\n';
    }

    const recent = this.getRecentMistakes(5);
    if (recent.length > 0) {
      report += '**Recent Mistakes:**\n';
      recent.forEach((m, i) => {
        report += `${i + 1}. Error: "${m.error}" → Correction: "${m.correction}"\n`;
      });
    }

    return report;
  }

  clear() {
    this.mistakes = [];
    this.corrections.clear();
  }
}

// ============================================
// ITEM 26.7: Reasoning Transparency
// Make reasoning process visible and explainable
// ============================================
export class ReasoningTransparency {
  private reasoningSteps: Array<{ 
    step: string; 
    rationale: string; 
    confidence: number; 
    alternatives: string[] 
  }> = [];

  addStep(step: string, rationale: string, confidence: number, alternatives: string[] = []) {
    this.reasoningSteps.push({
      step,
      rationale,
      confidence,
      alternatives
    });
  }

  getTransparentReasoning(): string {
    if (this.reasoningSteps.length === 0) {
      return 'No reasoning steps recorded';
    }

    let transparency = '**Transparent Reasoning Process**\n\n';

    this.reasoningSteps.forEach((s, i) => {
      transparency += `**Step ${i + 1}:** ${s.step}\n`;
      transparency += `**Rationale:** ${s.rationale}\n`;
      transparency += `**Confidence:** ${(s.confidence * 100).toFixed(0)}%\n`;
      
      if (s.alternatives.length > 0) {
        transparency += `**Alternatives Considered:**\n`;
        s.alternatives.forEach(alt => transparency += `  - ${alt}\n`);
      }
      
      transparency += '\n';
    });

    return transparency;
  }

  explainDecision(decision: string): string {
    const relevantSteps = this.reasoningSteps.filter(s => 
      decision.toLowerCase().includes(s.step.toLowerCase().split(' ')[0])
    );

    if (relevantSteps.length === 0) {
      return `No reasoning steps found for decision: ${decision}`;
    }

    let explanation = `**Explanation for Decision: ${decision}**\n\n`;
    explanation += 'This decision was based on the following reasoning:\n\n';

    relevantSteps.forEach((s, i) => {
      explanation += `${i + 1}. ${s.step}\n`;
      explanation += `   Reason: ${s.rationale}\n`;
      explanation += `   Confidence: ${(s.confidence * 100).toFixed(0)}%\n\n`;
    });

    return explanation;
  }

  getConfidenceBreakdown(): Array<{ step: string; confidence: number }> {
    return this.reasoningSteps.map(s => ({
      step: s.step,
      confidence: s.confidence
    }));
  }

  clear() {
    this.reasoningSteps = [];
  }
}

// ============================================
// ITEM 26.8: Cognitive Bias Detection
// Detect common cognitive biases
// ============================================
export class CognitiveBiasDetection {
  private biases: Map<string, { pattern: RegExp; description: string; mitigation: string }> = new Map();

  constructor() {
    this.loadBiases();
  }

  private loadBiases() {
    this.biases.set('confirmation_bias', {
      pattern: /\b(see|found|confirms)\s+.*\b(belief|expectation|hypothesis)\b/i,
      description: 'Seeking information that confirms existing beliefs',
      mitigation: 'Actively seek disconfirming evidence'
    });

    this.biases.set('anchoring', {
      pattern: /\b(first|initial|starting)\s+.*\b(number|price|estimate)\b/i,
      description: 'Relying too heavily on first piece of information',
      mitigation: 'Consider multiple reference points'
    });

    this.biases.set('availability_heuristic', {
      pattern: /\b(recent|memorable|vivid)\s+.*\b(example|case|instance)\b/i,
      description: 'Overestimating likelihood based on ease of recall',
      mitigation: 'Use statistical data instead of anecdotes'
    });

    this.biases.set('sunk_cost', {
      pattern: /\b(already|invested|spent)\s+.*\b(time|money|effort)\b/i,
      description: 'Continuing based on past investment rather than future value',
      mitigation: 'Focus on future costs and benefits, ignore past investments'
    });

    this.biases.set('overconfidence', {
      pattern: /\b(certain|sure|definitely|absolutely)\b.*\b(know|right|correct)\b/i,
      description: 'Overestimating accuracy of beliefs or predictions',
      mitigation: 'Consider uncertainty and seek feedback'
    });

    this.biases.set('dunning_kruger', {
      pattern: /\b(obvious|simple|easy|anyone can)\b/i,
      description: 'Overestimating competence in unfamiliar domains',
      mitigation: 'Seek expert feedback and acknowledge complexity'
    });
  }

  detectBiases(text: string): Array<{ bias: string; description: string; mitigation: string }> {
    const detected: Array<{ bias: string; description: string; mitigation: string }> = [];
    const textLower = text.toLowerCase();

    this.biases.forEach((data, bias) => {
      if (data.pattern.test(textLower)) {
        detected.push({
          bias,
          description: data.description,
          mitigation: data.mitigation
        });
      }
    });

    return detected;
  }

  formatBiases(biases: Array<{ bias: string; description: string; mitigation: string }>): string {
    if (biases.length === 0) return '✓ No cognitive biases detected';

    let report = '**Cognitive Biases Detected:**\n\n';
    biases.forEach((b, i) => {
      report += `${i + 1}. **${b.bias.replace(/_/g, ' ').toUpperCase()}**\n`;
      report += `   Description: ${b.description}\n`;
      report += `   Mitigation: ${b.mitigation}\n\n`;
    });

    report += '**Recommendation:** Be aware of these biases and apply the suggested mitigations.';

    return report;
  }

  addBias(name: string, pattern: RegExp, description: string, mitigation: string) {
    this.biases.set(name, { pattern, description, mitigation });
  }
}

// ============================================
// ITEM 26.9: Reasoning Efficiency Analysis
// Analyze reasoning efficiency, optimize process
// ============================================
export class ReasoningEfficiencyAnalysis {
  private reasoningSessions: Array<{
    problem: string;
    steps: number;
    time: number;
    successful: boolean;
    timestamp: number;
  }> = [];

  recordSession(problem: string, steps: number, time: number, successful: boolean) {
    this.reasoningSessions.push({
      problem,
      steps,
      time,
      successful,
      timestamp: Date.now()
    });
  }

  analyzeEfficiency(): {
    avgSteps: number;
    avgTime: number;
    successRate: number;
    efficiency: number;
  } {
    if (this.reasoningSessions.length === 0) {
      return { avgSteps: 0, avgTime: 0, successRate: 0, efficiency: 0 };
    }

    const avgSteps = this.reasoningSessions.reduce((sum, s) => sum + s.steps, 0) / this.reasoningSessions.length;
    const avgTime = this.reasoningSessions.reduce((sum, s) => sum + s.time, 0) / this.reasoningSessions.length;
    const successRate = this.reasoningSessions.filter(s => s.successful).length / this.reasoningSessions.length;
    
    // Efficiency = success rate / (steps * time)
    const efficiency = successRate / (avgSteps * avgTime / 1000);

    return { avgSteps, avgTime, successRate, efficiency };
  }

  identifyInefficiencies(): string[] {
    const issues: string[] = [];
    const efficiency = this.analyzeEfficiency();

    if (efficiency.avgSteps > 10) {
      issues.push('High number of reasoning steps - consider decomposition or pattern matching');
    }

    if (efficiency.avgTime > 5000) {
      issues.push('Slow reasoning time - consider caching or parallel processing');
    }

    if (efficiency.successRate < 0.7) {
      issues.push('Low success rate - review reasoning strategies and knowledge base');
    }

    if (efficiency.efficiency < 0.01) {
      issues.push('Low overall efficiency - optimize reasoning process');
    }

    return issues;
  }

  getEfficiencyReport(): string {
    const efficiency = this.analyzeEfficiency();
    const issues = this.identifyInefficiencies();

    let report = '**Reasoning Efficiency Analysis**\n\n';
    report += `Total Sessions: ${this.reasoningSessions.length}\n`;
    report += `Average Steps: ${efficiency.avgSteps.toFixed(1)}\n`;
    report += `Average Time: ${(efficiency.avgTime / 1000).toFixed(2)}s\n`;
    report += `Success Rate: ${(efficiency.successRate * 100).toFixed(1)}%\n`;
    report += `Efficiency Score: ${efficiency.efficiency.toFixed(4)}\n\n`;

    if (issues.length > 0) {
      report += '**Identified Inefficiencies:**\n';
      issues.forEach(issue => report += `- ${issue}\n`);
    } else {
      report += '✓ Reasoning process is efficient';
    }

    return report;
  }

  clear() {
    this.reasoningSessions = [];
  }
}

// ============================================
// ITEM 26.10: Metacognitive Awareness
// Awareness of own cognitive processes
// ============================================
export class MetacognitiveAwareness {
  private cognitiveStates: Map<string, { 
    active: boolean; 
    confidence: number; 
    lastUpdated: number 
  }> = new Map();

  private strategies: Map<string, number> = new Map(); // strategy -> usage count

  updateCognitiveState(state: string, active: boolean, confidence: number) {
    this.cognitiveStates.set(state, {
      active,
      confidence,
      lastUpdated: Date.now()
    });
  }

  recordStrategyUsage(strategy: string) {
    this.strategies.set(strategy, (this.strategies.get(strategy) || 0) + 1);
  }

  getActiveStates(): string[] {
    return Array.from(this.cognitiveStates.entries())
      .filter(([_, data]) => data.active)
      .map(([state, _]) => state);
  }

  getPreferredStrategies(): Array<{ strategy: string; usage: number }> {
    return Array.from(this.strategies.entries())
      .map(([strategy, usage]) => ({ strategy, usage }))
      .sort((a, b) => b.usage - a.usage);
  }

  getMetacognitiveReport(): string {
    const activeStates = this.getActiveStates();
    const preferredStrategies = this.getPreferredStrategies();

    let report = '**Metacognitive Awareness Report**\n\n';

    report += '**Active Cognitive States:**\n';
    if (activeStates.length === 0) {
      report += 'No active cognitive states\n';
    } else {
      activeStates.forEach(state => {
        const data = this.cognitiveStates.get(state)!;
        report += `- ${state} (confidence: ${(data.confidence * 100).toFixed(0)}%)\n`;
      });
    }

    report += '\n**Preferred Reasoning Strategies:**\n';
    if (preferredStrategies.length === 0) {
      report += 'No strategies recorded yet\n';
    } else {
      preferredStrategies.slice(0, 5).forEach(s => {
        report += `- ${s.strategy}: ${s.usage} times\n`;
      });
    }

    report += '\n**Self-Assessment:**\n';
    report += '- Monitoring reasoning process: Active\n';
    report += '- Tracking confidence levels: Active\n';
    report += '- Detecting cognitive biases: Active\n';
    report += '- Learning from mistakes: Active\n';

    return report;
  }

  clear() {
    this.cognitiveStates.clear();
    this.strategies.clear();
  }
}

// ============================================
// Export all metacognition systems
// ============================================
export const MetacognitionSystems = {
  ReasoningProcessMonitor,
  ConfidenceCalibration,
  KnowledgeBoundaryDetection,
  ReasoningStrategySelection,
  ErrorDetection,
  LearningFromMistakes,
  ReasoningTransparency,
  CognitiveBiasDetection,
  ReasoningEfficiencyAnalysis,
  MetacognitiveAwareness,
};
