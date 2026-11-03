// Counterfactual Reasoning - Items 28.1-28.10
// Reasoning about "what if" scenarios, alternative realities, causal reasoning

// ============================================
// ITEM 28.1: Counterfactual Generation
// Generate "what if" scenarios
// ============================================
export class CounterfactualGeneration {
  private scenarios: Map<string, { antecedent: string; consequent: string; plausibility: number }> = new Map();

  generateCounterfactual(fact: string, negation: string): { scenario: string; plausibility: number } {
    const scenario = `What if ${negation} instead of ${fact}?`;
    
    // Calculate plausibility based on how much the negation deviates from reality
    const plausibility = this.calculatePlausibility(fact, negation);
    
    this.scenarios.set(scenario, {
      antecedent: negation,
      consequent: 'unknown',
      plausibility
    });
    
    return { scenario, plausibility };
  }

  private calculatePlausibility(fact: string, negation: string): number {
    // Simple plausibility heuristic
    // In production, would use more sophisticated causal models
    const factWords = fact.toLowerCase().split(/\s+/);
    const negWords = negation.toLowerCase().split(/\s+/);
    
    // More word overlap = more plausible
    const overlap = factWords.filter(w => negWords.includes(w)).length;
    const basePlausibility = overlap / Math.max(factWords.length, negWords.length);
    
    return Math.max(0.1, Math.min(0.9, basePlausibility));
  }

  generateAlternativeHistory(event: string, alternative: string): string {
    return `**Counterfactual History:**\n\n**Actual Event:** ${event}\n\n**Alternative:** ${alternative}\n\n**Implications:** This change would have cascading effects on subsequent events, potentially altering the course of history in significant ways.`;
  }

  getScenario(scenario: string): { antecedent: string; consequent: string; plausibility: number } | null {
    return this.scenarios.get(scenario) || null;
  }

  getAllScenarios(): Array<{ scenario: string; antecedent: string; consequent: string; plausibility: number }> {
    return Array.from(this.scenarios.entries()).map(([scenario, data]) => ({
      scenario,
      ...data
    }));
  }

  clear() {
    this.scenarios.clear();
  }
}

// ============================================
// ITEM 28.2: Causal Counterfactuals
// "If A hadn't occurred, would B still have happened?"
// ============================================
export class CausalCounterfactuals {
  private causalChains: Map<string, Array<{ cause: string; effect: string; strength: number }>> = new Map();

  addCausalRelation(cause: string, effect: string, strength: number = 0.8) {
    const key = cause.toLowerCase();
    if (!this.causalChains.has(key)) {
      this.causalChains.set(key, []);
    }
    this.causalChains.get(key)!.push({ cause, effect, strength });
  }

  analyzeCounterfactual(cause: string, effect: string): { 
    wouldStillOccur: boolean; 
    confidence: number; 
    reasoning: string 
  } {
    const chains = this.causalChains.get(cause.toLowerCase());
    
    if (!chains || chains.length === 0) {
      return {
        wouldStillOccur: false,
        confidence: 0.3,
        reasoning: `No causal data available for ${cause}. Cannot determine counterfactual outcome.`
      };
    }

    const relevantChain = chains.find(c => c.effect.toLowerCase() === effect.toLowerCase());
    
    if (!relevantChain) {
      return {
        wouldStillOccur: false,
        confidence: 0.4,
        reasoning: `No direct causal link found between ${cause} and ${effect}.`
      };
    }

    // If cause is strong, effect likely wouldn't occur without it
    const wouldStillOccur = relevantChain.strength < 0.5;
    const confidence = relevantChain.strength;

    let reasoning = '';
    if (wouldStillOccur) {
      reasoning = `The effect ${effect} has weak causal dependence on ${cause} (strength: ${(relevantChain.strength * 100).toFixed(0)}%). `;
      reasoning += `Other factors likely contribute, so ${effect} might still occur even without ${cause}.`;
    } else {
      reasoning = `The effect ${effect} has strong causal dependence on ${cause} (strength: ${(relevantChain.strength * 100).toFixed(0)}%). `;
      reasoning += `Without ${cause}, ${effect} likely would not occur.`;
    }

    return { wouldStillOccur, confidence, reasoning };
  }

  getCounterfactualReport(cause: string, effect: string): string {
    const analysis = this.analyzeCounterfactual(cause, effect);
    
    let report = `**Causal Counterfactual Analysis**\n\n`;
    report += `**Question:** If ${cause} hadn't occurred, would ${effect} still have happened?\n\n`;
    report += `**Answer:** ${analysis.wouldStillOccur ? 'Yes, likely' : 'No, probably not'}\n`;
    report += `**Confidence:** ${(analysis.confidence * 100).toFixed(0)}%\n\n`;
    report += `**Reasoning:** ${analysis.reasoning}`;
    
    return report;
  }

  clear() {
    this.causalChains.clear();
  }
}

// ============================================
// ITEM 28.3: Alternative History
// Explore "what if history was different?"
// ============================================
export class AlternativeHistory {
  private historicalEvents: Map<string, { 
    actual: string; 
    date: string; 
    consequences: string[];
    alternatives: Array<{ scenario: string; consequences: string[] }>
  }> = new Map();

  constructor() {
    this.loadEvents();
  }

  private loadEvents() {
    this.historicalEvents.set('world_war_2', {
      actual: 'Allied powers defeated Axis powers in 1945',
      date: '1939-1945',
      consequences: ['United Nations formed', 'Cold War began', 'Decolonization accelerated', 'Technology advanced rapidly'],
      alternatives: [
        {
          scenario: 'What if Germany had won?',
          consequences: ['Axis dominance in Europe', 'Different political structure', 'Altered technological development']
        },
        {
          scenario: 'What if war ended in 1943?',
          consequences: ['Fewer casualties', 'Different post-war order', 'Less devastation']
        }
      ]
    });

    this.historicalEvents.set('moon_landing', {
      actual: 'Apollo 11 landed on moon in 1969',
      date: 'July 20, 1969',
      consequences: ['Space race won by USA', 'Technological inspiration', 'Scientific discoveries'],
      alternatives: [
        {
          scenario: 'What if Soviet Union landed first?',
          consequences: ['Different geopolitical outcome', 'Altered space race dynamics']
        },
        {
          scenario: 'What if landing failed?',
          consequences: ['Program delays', 'Public disappointment', 'Budget cuts']
        }
      ]
    });

    this.historicalEvents.set('internet_creation', {
      actual: 'ARPANET evolved into modern internet',
      date: '1969-present',
      consequences: ['Global communication revolution', 'E-commerce emergence', 'Social media', 'Information age'],
      alternatives: [
        {
          scenario: 'What if internet was never invented?',
          consequences: ['Slower information exchange', 'Different communication methods', 'No social media']
        },
        {
          scenario: 'What if internet was government-controlled only?',
          consequences: ['Limited access', 'Less innovation', 'Different social dynamics']
        }
      ]
    });
  }

  exploreAlternative(event: string, alternativeIndex: number = 0): string {
    const eventData = this.historicalEvents.get(event.toLowerCase());
    
    if (!eventData) {
      return `No historical data for: ${event}`;
    }

    if (alternativeIndex >= eventData.alternatives.length) {
      return `Alternative ${alternativeIndex} not available for ${event}`;
    }

    const alternative = eventData.alternatives[alternativeIndex];

    let exploration = `**Alternative History Exploration**\n\n`;
    exploration += `**Event:** ${event.replace(/_/g, ' ')}\n`;
    exploration += `**Date:** ${eventData.date}\n\n`;
    exploration += `**Actual Outcome:** ${eventData.actual}\n\n`;
    exploration += `**Alternative Scenario:** ${alternative.scenario}\n\n`;
    exploration += `**Potential Consequences:**\n`;
    alternative.consequences.forEach(c => exploration += `- ${c}\n`);
    exploration += `\n**Actual Consequences (for comparison):**\n`;
    eventData.consequences.forEach(c => exploration += `- ${c}\n`);

    return exploration;
  }

  getEventDetails(event: string): string {
    const eventData = this.historicalEvents.get(event.toLowerCase());
    
    if (!eventData) {
      return `No historical data for: ${event}`;
    }

    let details = `**Historical Event: ${event.replace(/_/g, ' ')}**\n\n`;
    details += `**Date:** ${eventData.date}\n`;
    details += `**Actual Outcome:** ${eventData.actual}\n\n`;
    details += `**Consequences:**\n`;
    eventData.consequences.forEach(c => details += `- ${c}\n`);
    details += `\n**Alternative Scenarios (${eventData.alternatives.length}):**\n`;
    eventData.alternatives.forEach((alt, i) => {
      details += `${i + 1}. ${alt.scenario}\n`;
    });

    return details;
  }

  addEvent(name: string, actual: string, date: string, consequences: string[], alternatives: Array<{ scenario: string; consequences: string[] }>) {
    this.historicalEvents.set(name.toLowerCase(), { actual, date, consequences, alternatives });
  }
}

// ============================================
// ITEM 28.4: Personal Counterfactuals
// "What if I had chosen differently?"
// ============================================
export class PersonalCounterfactuals {
  private decisions: Map<string, { 
    choice: string; 
    outcome: string; 
    alternatives: Array<{ choice: string; predictedOutcome: string }>
  }> = new Map();

  recordDecision(id: string, choice: string, outcome: string, alternatives: Array<{ choice: string; predictedOutcome: string }>) {
    this.decisions.set(id, { choice, outcome, alternatives });
  }

  analyzeCounterfactual(decisionId: string, alternativeIndex: number = 0): string {
    const decision = this.decisions.get(decisionId);
    
    if (!decision) {
      return `No decision recorded with id: ${decisionId}`;
    }

    if (alternativeIndex >= decision.alternatives.length) {
      return `Alternative ${alternativeIndex} not available for decision ${decisionId}`;
    }

    const alternative = decision.alternatives[alternativeIndex];

    let analysis = `**Personal Counterfactual Analysis**\n\n`;
    analysis += `**Decision:** ${decisionId}\n\n`;
    analysis += `**Actual Choice:** ${decision.choice}\n`;
    analysis += `**Actual Outcome:** ${decision.outcome}\n\n`;
    analysis += `**Alternative Choice:** ${alternative.choice}\n`;
    analysis += `**Predicted Outcome:** ${alternative.predictedOutcome}\n\n`;
    analysis += `**Reflection:** This counterfactual explores how different choices could have led to different outcomes. `;
    analysis += `Understanding these alternatives can inform future decision-making.`;

    return analysis;
  }

  compareOutcomes(decisionId: string): string {
    const decision = this.decisions.get(decisionId);
    
    if (!decision) {
      return `No decision recorded with id: ${decisionId}`;
    }

    let comparison = `**Outcome Comparison**\n\n`;
    comparison += `**Decision:** ${decisionId}\n\n`;
    comparison += `**Actual Path:**\n`;
    comparison += `- Choice: ${decision.choice}\n`;
    comparison += `- Outcome: ${decision.outcome}\n\n`;
    
    comparison += `**Alternative Paths:**\n`;
    decision.alternatives.forEach((alt, i) => {
      comparison += `${i + 1}. ${alt.choice}\n`;
      comparison += `   Predicted: ${alt.predictedOutcome}\n\n`;
    });

    return comparison;
  }

  getDecision(id: string): any {
    return this.decisions.get(id);
  }

  clear() {
    this.decisions.clear();
  }
}

// ============================================
// ITEM 28.5: Scientific Counterfactuals
// "What if gravity was stronger?"
// ============================================
export class ScientificCounterfactuals {
  private physicalLaws: Map<string, { 
    current: string; 
    alternatives: Array<{ modification: string; consequences: string[] }>
  }> = new Map();

  constructor() {
    this.loadLaws();
  }

  private loadLaws() {
    this.physicalLaws.set('gravity', {
      current: 'Gravity follows inverse-square law with G = 6.674×10⁻¹¹ N⋅m²/kg²',
      alternatives: [
        {
          modification: 'What if gravity was 10x stronger?',
          consequences: ['Planets would be smaller', 'Stars would burn faster', 'Life would be different', 'Buildings would need to be stronger']
        },
        {
          modification: 'What if gravity was repulsive?',
          consequences: ['Matter would fly apart', 'No planets or stars', 'Universe would expand rapidly', 'No structure formation']
        }
      ]
    });

    this.physicalLaws.set('speed_of_light', {
      current: 'Speed of light c = 299,792,458 m/s',
      alternatives: [
        {
          modification: 'What if light speed was 10x slower?',
          consequences: ['Relativistic effects at lower speeds', 'Different chemistry', 'Slower communication', 'Altered physics']
        },
        {
          modification: 'What if light speed was infinite?',
          consequences: ['No relativity', 'Instant communication', 'Different causality', 'Altered physics']
        }
      ]
    });

    this.physicalLaws.set('electromagnetism', {
      current: 'Electromagnetic force follows Coulomb\'s law',
      alternatives: [
        {
          modification: 'What if electromagnetic force was weaker?',
          consequences: ['Weaker chemical bonds', 'Different materials', 'Altered biology', 'Different technology']
        },
        {
          modification: 'What if electromagnetic force was stronger?',
          consequences: ['Stronger chemical bonds', 'Different materials', 'Altered biology', 'Different technology']
        }
      ]
    });
  }

  exploreCounterfactual(law: string, alternativeIndex: number = 0): string {
    const lawData = this.physicalLaws.get(law.toLowerCase());
    
    if (!lawData) {
      return `No data for physical law: ${law}`;
    }

    if (alternativeIndex >= lawData.alternatives.length) {
      return `Alternative ${alternativeIndex} not available for ${law}`;
    }

    const alternative = lawData.alternatives[alternativeIndex];

    let exploration = `**Scientific Counterfactual**\n\n`;
    exploration += `**Physical Law:** ${law.replace(/_/g, ' ')}\n\n`;
    exploration += `**Current Law:** ${lawData.current}\n\n`;
    exploration += `**Counterfactual:** ${alternative.modification}\n\n`;
    exploration += `**Consequences:**\n`;
    alternative.consequences.forEach(c => exploration += `- ${c}\n`);

    return exploration;
  }

  getLawDetails(law: string): string {
    const lawData = this.physicalLaws.get(law.toLowerCase());
    
    if (!lawData) {
      return `No data for physical law: ${law}`;
    }

    let details = `**Physical Law: ${law.replace(/_/g, ' ')}**\n\n`;
    details += `**Current:** ${lawData.current}\n\n`;
    details += `**Alternative Scenarios (${lawData.alternatives.length}):**\n`;
    lawData.alternatives.forEach((alt, i) => {
      details += `${i + 1}. ${alt.modification}\n`;
    });

    return details;
  }

  addLaw(name: string, current: string, alternatives: Array<{ modification: string; consequences: string[] }>) {
    this.physicalLaws.set(name.toLowerCase(), { current, alternatives });
  }
}

// ============================================
// ITEM 28.6: Moral Counterfactuals
// "What if everyone did that?"
// ============================================
export class MoralCounterfactuals {
  private actions: Map<string, { 
    action: string; 
    universalized: string; 
    consequences: string[];
    permissible: boolean 
  }> = new Map();

  constructor() {
    this.loadActions();
  }

  private loadActions() {
    this.actions.set('lying', {
      action: 'Lying when convenient',
      universalized: 'Everyone lies when convenient',
      consequences: ['Trust breaks down', 'Communication fails', 'Social contracts collapse', 'Cooperation impossible'],
      permissible: false
    });

    this.actions.set('stealing', {
      action: 'Stealing when in need',
      universalized: 'Everyone steals when in need',
      consequences: ['Property rights meaningless', 'No incentive to produce', 'Social order collapses', 'Economic system fails'],
      permissible: false
    });

    this.actions.set('helping', {
      action: 'Helping others in need',
      universalized: 'Everyone helps others in need',
      consequences: ['Stronger social bonds', 'Reduced suffering', 'Cooperative society', 'Mutual support system'],
      permissible: true
    });

    this.actions.set('keeping_promises', {
      action: 'Keeping promises',
      universalized: 'Everyone keeps promises',
      consequences: ['Trust increases', 'Cooperation improves', 'Social contracts strengthen', 'Predictability increases'],
      permissible: true
    });
  }

  analyzeUniversalization(action: string): string {
    const actionData = this.actions.get(action.toLowerCase());
    
    if (!actionData) {
      return `No moral data for action: ${action}`;
    }

    let analysis = `**Moral Counterfactual: Universalization Test**\n\n`;
    analysis += `**Action:** ${actionData.action}\n\n`;
    analysis += `**Universalized:** ${actionData.universalized}\n\n`;
    analysis += `**Consequences:**\n`;
    actionData.consequences.forEach(c => analysis += `- ${c}\n`);
    analysis += `\n**Kantian Assessment:** ${actionData.permissible ? 'Permissible' : 'Impermissible'}\n`;
    analysis += `\n**Reasoning:** `;
    
    if (actionData.permissible) {
      analysis += `This action can be universalized without contradiction. A world where everyone acts this way would be coherent and potentially beneficial.`;
    } else {
      analysis += `This action cannot be universalized without contradiction. A world where everyone acts this way would be self-defeating or incoherent.`;
    }

    return analysis;
  }

  getActionDetails(action: string): string {
    const actionData = this.actions.get(action.toLowerCase());
    
    if (!actionData) {
      return `No moral data for action: ${action}`;
    }

    let details = `**Moral Action: ${action}**\n\n`;
    details += `**Action:** ${actionData.action}\n`;
    details += `**Universalized:** ${actionData.universalized}\n`;
    details += `**Permissible:** ${actionData.permissible ? 'Yes' : 'No'}\n\n`;
    details += `**Consequences:**\n`;
    actionData.consequences.forEach(c => details += `- ${c}\n`);

    return details;
  }

  addAction(name: string, action: string, universalized: string, consequences: string[], permissible: boolean) {
    this.actions.set(name.toLowerCase(), { action, universalized, consequences, permissible });
  }
}

// ============================================
// ITEM 28.7: Counterfactual Consistency
// Ensure counterfactual consistency
// ============================================
export class CounterfactualConsistency {
  private counterfactuals: Array<{ 
    antecedent: string; 
    consequent: string; 
    timestamp: number 
  }> = [];

  addCounterfactual(antecedent: string, consequent: string) {
    this.counterfactuals.push({
      antecedent,
      consequent,
      timestamp: Date.now()
    });
  }

  checkConsistency(): { consistent: boolean; contradictions: string[] } {
    const contradictions: string[] = [];

    // Check for logical contradictions
    for (let i = 0; i < this.counterfactuals.length; i++) {
      for (let j = i + 1; j < this.counterfactuals.length; j++) {
        const cf1 = this.counterfactuals[i];
        const cf2 = this.counterfactuals[j];

        // Check if same antecedent with contradictory consequents
        if (cf1.antecedent.toLowerCase() === cf2.antecedent.toLowerCase()) {
          if (this.areContradictory(cf1.consequent, cf2.consequent)) {
            contradictions.push(
              `Contradictory consequents for "${cf1.antecedent}": "${cf1.consequent}" vs "${cf2.consequent}"`
            );
          }
        }
      }
    }

    return {
      consistent: contradictions.length === 0,
      contradictions
    };
  }

  private areContradictory(statement1: string, statement2: string): boolean {
    const s1 = statement1.toLowerCase();
    const s2 = statement2.toLowerCase();

    // Check for direct negation
    if (s1.includes('not') && !s2.includes('not')) return true;
    if (!s1.includes('not') && s2.includes('not')) return true;

    // Check for opposite outcomes
    const opposites = [
      ['success', 'failure'],
      ['happen', 'not happen'],
      ['true', 'false'],
      ['yes', 'no']
    ];

    for (const [term1, term2] of opposites) {
      if ((s1.includes(term1) && s2.includes(term2)) ||
          (s1.includes(term2) && s2.includes(term1))) {
        return true;
      }
    }

    return false;
  }

  getConsistencyReport(): string {
    const { consistent, contradictions } = this.checkConsistency();

    let report = `**Counterfactual Consistency Check**\n\n`;
    report += `Total Counterfactuals: ${this.counterfactuals.length}\n\n`;

    if (consistent) {
      report += `✓ All counterfactuals are consistent\n`;
    } else {
      report += `✗ Contradictions detected:\n\n`;
      contradictions.forEach(c => report += `- ${c}\n`);
      report += `\n**Recommendation:** Review and reconcile contradictory counterfactuals.\n`;
    }

    return report;
  }

  clear() {
    this.counterfactuals = [];
  }
}

// ============================================
// ITEM 28.8: Counterfactual Evaluation
// Evaluate counterfactual plausibility
// ============================================
export class CounterfactualEvaluation {
  evaluatePlausibility(antecedent: string, consequent: string): { 
    plausible: boolean; 
    score: number; 
    reasoning: string 
  } {
    // Simple plausibility scoring
    // In production, would use more sophisticated causal models
    let score = 0.5; // Base plausibility
    const reasoning: string[] = [];

    // Check temporal consistency
    const antecedentLower = antecedent.toLowerCase();
    const consequentLower = consequent.toLowerCase();

    // Past events affecting past = less plausible
    if (antecedentLower.includes('yesterday') && consequentLower.includes('tomorrow')) {
      score -= 0.3;
      reasoning.push('Temporal inconsistency detected');
    }

    // Check causal plausibility
    if (this.hasCausalConnection(antecedent, consequent)) {
      score += 0.3;
      reasoning.push('Causal connection exists');
    } else {
      score -= 0.2;
      reasoning.push('Weak causal connection');
    }

    // Check logical consistency
    if (this.isLogicallyConsistent(antecedent, consequent)) {
      score += 0.2;
      reasoning.push('Logically consistent');
    } else {
      score -= 0.3;
      reasoning.push('Logical inconsistency detected');
    }

    score = Math.max(0, Math.min(1, score));
    const plausible = score >= 0.5;

    return {
      plausible,
      score,
      reasoning: reasoning.join('. ')
    };
  }

  private hasCausalConnection(antecedent: string, consequent: string): boolean {
    // Simple heuristic: check for semantic overlap
    const antWords = antecedent.toLowerCase().split(/\s+/);
    const consWords = consequent.toLowerCase().split(/\s+/);
    
    const overlap = antWords.filter(w => consWords.includes(w) && w.length > 3).length;
    return overlap > 0;
  }

  private isLogicallyConsistent(antecedent: string, consequent: string): boolean {
    // Check for obvious logical contradictions
    const ant = antecedent.toLowerCase();
    const cons = consequent.toLowerCase();

    // Same subject with contradictory predicates
    if (ant.includes('is true') && cons.includes('is false')) return false;
    if (ant.includes('exists') && cons.includes('does not exist')) return false;

    return true;
  }

  getEvaluationReport(antecedent: string, consequent: string): string {
    const evaluation = this.evaluatePlausibility(antecedent, consequent);

    let report = `**Counterfactual Evaluation**\n\n`;
    report += `**Antecedent:** If ${antecedent}\n`;
    report += `**Consequent:** Then ${consequent}\n\n`;
    report += `**Plausibility Score:** ${(evaluation.score * 100).toFixed(0)}%\n`;
    report += `**Assessment:** ${evaluation.plausible ? 'Plausible' : 'Implausible'}\n\n`;
    report += `**Reasoning:** ${evaluation.reasoning}`;

    return report;
  }
}

// ============================================
// ITEM 28.9: Counterfactual Explanation
// Use counterfactuals to explain causation
// ============================================
export class CounterfactualExplanation {
  explainCausation(event: string, cause: string): string {
    const counterfactual = `If ${cause} had not occurred, ${event} would not have happened.`;
    
    let explanation = `**Counterfactual Explanation of Causation**\n\n`;
    explanation += `**Event:** ${event}\n`;
    explanation += `**Cause:** ${cause}\n\n`;
    explanation += `**Counterfactual:** ${counterfactual}\n\n`;
    explanation += `**Explanation:** This counterfactual demonstrates the causal relationship between ${cause} and ${event}. `;
    explanation += `By considering what would have happened in the absence of ${cause}, we can see that ${cause} was necessary for ${event} to occur.`;

    return explanation;
  }

  explainPrevention(event: string, preventingFactor: string): string {
    const counterfactual = `If ${preventingFactor} had not been present, ${event} would have occurred.`;
    
    let explanation = `**Counterfactual Explanation of Prevention**\n\n`;
    explanation += `**Event (prevented):** ${event}\n`;
    explanation += `**Preventing Factor:** ${preventingFactor}\n\n`;
    explanation += `**Counterfactual:** ${counterfactual}\n\n`;
    explanation += `**Explanation:** This counterfactual shows how ${preventingFactor} prevented ${event} from occurring. `;
    explanation += `Without this factor, the event would have taken place.`;

    return explanation;
  }

  explainContribution(event: string, contributingFactor: string, degree: string): string {
    const counterfactual = `If ${contributingFactor} had been different, ${event} would have been ${degree}.`;
    
    let explanation = `**Counterfactual Explanation of Contribution**\n\n`;
    explanation += `**Event:** ${event}\n`;
    explanation += `**Contributing Factor:** ${contributingFactor}\n\n`;
    explanation += `**Counterfactual:** ${counterfactual}\n\n`;
    explanation += `**Explanation:** This counterfactual illustrates how ${contributingFactor} contributed to ${event}. `;
    explanation += `The degree of contribution can be understood by considering how changes to this factor would have altered the outcome.`;

    return explanation;
  }
}

// ============================================
// ITEM 28.10: Counterfactual Learning
// Learn from counterfactual reasoning
// ============================================
export class CounterfactualLearning {
  private lessons: Map<string, { 
    counterfactual: string; 
    lesson: string; 
    confidence: number;
    applications: string[]
  }> = new Map();

  recordLesson(id: string, counterfactual: string, lesson: string, confidence: number, applications: string[]) {
    this.lessons.set(id, {
      counterfactual,
      lesson,
      confidence,
      applications
    });
  }

  getLesson(id: string): { counterfactual: string; lesson: string; confidence: number; applications: string[] } | null {
    return this.lessons.get(id) || null;
  }

  applyLesson(lessonId: string, situation: string): string {
    const lesson = this.lessons.get(lessonId);
    
    if (!lesson) {
      return `No lesson found with id: ${lessonId}`;
    }

    let application = `**Applying Counterfactual Lesson**\n\n`;
    application += `**Lesson ID:** ${lessonId}\n\n`;
    application += `**Counterfactual:** ${lesson.counterfactual}\n\n`;
    application += `**Lesson:** ${lesson.lesson}\n\n`;
    application += `**Current Situation:** ${situation}\n\n`;
    application += `**Application:**\n`;
    lesson.applications.forEach(app => application += `- ${app}\n`);
    application += `\n**Confidence:** ${(lesson.confidence * 100).toFixed(0)}%`;

    return application;
  }

  getAllLessons(): Array<{ id: string; counterfactual: string; lesson: string; confidence: number }> {
    return Array.from(this.lessons.entries()).map(([id, data]) => ({
      id,
      counterfactual: data.counterfactual,
      lesson: data.lesson,
      confidence: data.confidence
    }));
  }

  getLearningReport(): string {
    const lessons = this.getAllLessons();

    let report = `**Counterfactual Learning Report**\n\n`;
    report += `Total Lessons Learned: ${lessons.length}\n\n`;

    if (lessons.length === 0) {
      report += `No counterfactual lessons recorded yet.\n`;
    } else {
      report += `**Lessons:**\n\n`;
      lessons.forEach((lesson, i) => {
        report += `${i + 1}. **${lesson.id}**\n`;
        report += `   Counterfactual: ${lesson.counterfactual}\n`;
        report += `   Lesson: ${lesson.lesson}\n`;
        report += `   Confidence: ${(lesson.confidence * 100).toFixed(0)}%\n\n`;
      });
    }

    return report;
  }

  clear() {
    this.lessons.clear();
  }
}

// ============================================
// Export all counterfactual reasoning systems
// ============================================
export const CounterfactualReasoningSystems = {
  CounterfactualGeneration,
  CausalCounterfactuals,
  AlternativeHistory,
  PersonalCounterfactuals,
  ScientificCounterfactuals,
  MoralCounterfactuals,
  CounterfactualConsistency,
  CounterfactualEvaluation,
  CounterfactualExplanation,
  CounterfactualLearning,
};
