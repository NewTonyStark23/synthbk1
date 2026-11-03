// Theory of Mind - Items 27.1-27.10
// Understanding others' mental states, beliefs, intentions, knowledge, desires, emotions, perspective taking, deception detection, mind reading, social cognition, recursive mind reading

// ============================================
// ITEM 27.1: Belief Attribution
// Attribute beliefs to others, track belief updates
// ============================================
export class BeliefAttribution {
  private agentBeliefs: Map<string, Map<string, { belief: string; confidence: number; timestamp: number }>> = new Map();

  attributeBelief(agent: string, proposition: string, confidence: number = 1.0) {
    if (!this.agentBeliefs.has(agent)) {
      this.agentBeliefs.set(agent, new Map());
    }
    
    this.agentBeliefs.get(agent)!.set(proposition, {
      belief: proposition,
      confidence,
      timestamp: Date.now()
    });
  }

  getBelief(agent: string, proposition: string): { belief: string; confidence: number } | null {
    const beliefs = this.agentBeliefs.get(agent);
    if (!beliefs) return null;
    
    const belief = beliefs.get(proposition);
    if (!belief) return null;
    
    return { belief: belief.belief, confidence: belief.confidence };
  }

  updateBelief(agent: string, proposition: string, newConfidence: number) {
    const beliefs = this.agentBeliefs.get(agent);
    if (!beliefs) return;
    
    const belief = beliefs.get(proposition);
    if (belief) {
      belief.confidence = newConfidence;
      belief.timestamp = Date.now();
    }
  }

  getFalseBeliefs(agent: string, reality: Map<string, boolean>): Array<{ belief: string; reality: boolean }> {
    const beliefs = this.agentBeliefs.get(agent);
    if (!beliefs) return [];
    
    const falseBeliefs: Array<{ belief: string; reality: boolean }> = [];
    
    beliefs.forEach((data, proposition) => {
      const actualState = reality.get(proposition);
      if (actualState !== undefined && data.confidence > 0.5 && actualState !== (data.confidence > 0.5)) {
        falseBeliefs.push({ belief: proposition, reality: actualState });
      }
    });
    
    return falseBeliefs;
  }

  predictAction(agent: string, desires: Map<string, number>): string | null {
    const beliefs = this.agentBeliefs.get(agent);
    if (!beliefs) return null;
    
    // Find action that maximizes expected utility
    let bestAction: string | null = null;
    let bestUtility = -Infinity;
    
    beliefs.forEach((beliefData, proposition) => {
      desires.forEach((desireStrength, desire) => {
        // Simple utility calculation
        const utility = beliefData.confidence * desireStrength;
        if (utility > bestUtility) {
          bestUtility = utility;
          bestAction = proposition;
        }
      });
    });
    
    return bestAction;
  }

  getAllBeliefs(agent: string): Array<{ proposition: string; confidence: number }> {
    const beliefs = this.agentBeliefs.get(agent);
    if (!beliefs) return [];
    
    return Array.from(beliefs.entries()).map(([prop, data]) => ({
      proposition: prop,
      confidence: data.confidence
    }));
  }

  clear(agent?: string) {
    if (agent) {
      this.agentBeliefs.delete(agent);
    } else {
      this.agentBeliefs.clear();
    }
  }
}

// ============================================
// ITEM 27.2: Intention Detection
// Infer goals and intentions from behavior
// ============================================
export class IntentionDetection {
  private intentionPatterns: Map<string, { indicators: string[]; goal: string; confidence: number }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.intentionPatterns.set('helping', {
      indicators: ['offer', 'assist', 'help', 'support', 'aid'],
      goal: 'assist someone',
      confidence: 0.8
    });

    this.intentionPatterns.set('persuasion', {
      indicators: ['convince', 'argue', 'persuade', 'recommend', 'suggest'],
      goal: 'change someone\'s mind',
      confidence: 0.75
    });

    this.intentionPatterns.set('deception', {
      indicators: ['lie', 'hide', 'conceal', 'mislead', 'fake'],
      goal: 'mislead someone',
      confidence: 0.7
    });

    this.intentionPatterns.set('learning', {
      indicators: ['ask', 'question', 'study', 'learn', 'understand'],
      goal: 'gain knowledge',
      confidence: 0.85
    });

    this.intentionPatterns.set('achievement', {
      indicators: ['complete', 'finish', 'achieve', 'accomplish', 'succeed'],
      goal: 'reach a goal',
      confidence: 0.8
    });

    this.intentionPatterns.set('avoidance', {
      indicators: ['avoid', 'escape', 'prevent', 'stop', 'block'],
      goal: 'prevent something',
      confidence: 0.75
    });
  }

  detectIntention(behavior: string): { intention: string; goal: string; confidence: number } | null {
    const behaviorLower = behavior.toLowerCase();
    let bestMatch: { intention: string; goal: string; confidence: number } | null = null;
    let bestScore = 0;

    this.intentionPatterns.forEach((data, intention) => {
      const matchCount = data.indicators.filter(ind => behaviorLower.includes(ind)).length;
      const score = matchCount * data.confidence;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = {
          intention,
          goal: data.goal,
          confidence: Math.min(1, score)
        };
      }
    });

    return bestMatch;
  }

  predictNextAction(agent: string, currentIntention: string, context: string): string {
    // Simple prediction based on intention
    switch (currentIntention.toLowerCase()) {
      case 'helping':
        return 'Continue offering assistance';
      case 'persuasion':
        return 'Provide more arguments or evidence';
      case 'learning':
        return 'Ask follow-up questions';
      case 'achievement':
        return 'Take next step toward goal';
      default:
        return 'Continue current behavior';
    }
  }

  getIntentionReport(behavior: string, intention: { intention: string; goal: string; confidence: number } | null): string {
    if (!intention) return 'No clear intention detected';

    let report = '**Intention Detection**\n\n';
    report += `**Behavior:** ${behavior}\n\n`;
    report += `**Detected Intention:** ${intention.intention}\n`;
    report += `**Goal:** ${intention.goal}\n`;
    report += `**Confidence:** ${(intention.confidence * 100).toFixed(0)}%\n`;

    return report;
  }

  addPattern(intention: string, indicators: string[], goal: string, confidence: number) {
    this.intentionPatterns.set(intention, { indicators, goal, confidence });
  }
}

// ============================================
// ITEM 27.3: Knowledge Attribution
// Track what others know/don't know
// ============================================
export class KnowledgeAttribution {
  private agentKnowledge: Map<string, Set<string>> = new Map();
  private agentIgnorance: Map<string, Set<string>> = new Map();

  attributeKnowledge(agent: string, fact: string) {
    if (!this.agentKnowledge.has(agent)) {
      this.agentKnowledge.set(agent, new Set());
    }
    this.agentKnowledge.get(agent)!.add(fact.toLowerCase());
    
    // Remove from ignorance if present
    const ignorance = this.agentIgnorance.get(agent);
    if (ignorance) {
      ignorance.delete(fact.toLowerCase());
    }
  }

  attributeIgnorance(agent: string, fact: string) {
    if (!this.agentIgnorance.has(agent)) {
      this.agentIgnorance.set(agent, new Set());
    }
    this.agentIgnorance.get(agent)!.add(fact.toLowerCase());
  }

  knows(agent: string, fact: string): boolean {
    const knowledge = this.agentKnowledge.get(agent);
    if (!knowledge) return false;
    return knowledge.has(fact.toLowerCase());
  }

  ignorant(agent: string, fact: string): boolean {
    const ignorance = this.agentIgnorance.get(agent);
    if (!ignorance) return false;
    return ignorance.has(fact.toLowerCase());
  }

  getKnowledge(agent: string): string[] {
    const knowledge = this.agentKnowledge.get(agent);
    if (!knowledge) return [];
    return Array.from(knowledge);
  }

  getIgnorance(agent: string): string[] {
    const ignorance = this.agentIgnorance.get(agent);
    if (!ignorance) return [];
    return Array.from(ignorance);
  }

  predictExplanation(agent: string, topic: string): string {
    if (this.knows(agent, topic)) {
      return `${agent} can explain ${topic} accurately`;
    } else if (this.ignorant(agent, topic)) {
      return `${agent} lacks knowledge about ${topic} and may give incorrect information`;
    } else {
      return `${agent}'s knowledge about ${topic} is uncertain`;
    }
  }

  getKnowledgeReport(agent: string): string {
    const knowledge = this.getKnowledge(agent);
    const ignorance = this.getIgnorance(agent);

    let report = `**Knowledge Report for ${agent}**\n\n`;
    
    report += `**Known Facts (${knowledge.length}):**\n`;
    if (knowledge.length === 0) {
      report += 'No known facts recorded\n';
    } else {
      knowledge.forEach(fact => report += `- ${fact}\n`);
    }

    report += `\n**Unknown Facts (${ignorance.length}):**\n`;
    if (ignorance.length === 0) {
      report += 'No ignorance recorded\n';
    } else {
      ignorance.forEach(fact => report += `- ${fact}\n`);
    }

    return report;
  }

  clear(agent?: string) {
    if (agent) {
      this.agentKnowledge.delete(agent);
      this.agentIgnorance.delete(agent);
    } else {
      this.agentKnowledge.clear();
      this.agentIgnorance.clear();
    }
  }
}

// ============================================
// ITEM 27.4: Desire Attribution
// Infer what others want/desire
// ============================================
export class DesireAttribution {
  private agentDesires: Map<string, Map<string, number>> = new Map(); // agent -> (desire -> strength)

  attributeDesire(agent: string, desire: string, strength: number = 1.0) {
    if (!this.agentDesires.has(agent)) {
      this.agentDesires.set(agent, new Map());
    }
    this.agentDesires.get(agent)!.set(desire.toLowerCase(), strength);
  }

  getDesire(agent: string, desire: string): number {
    const desires = this.agentDesires.get(agent);
    if (!desires) return 0;
    return desires.get(desire.toLowerCase()) || 0;
  }

  getStrongestDesire(agent: string): { desire: string; strength: number } | null {
    const desires = this.agentDesires.get(agent);
    if (!desires || desires.size === 0) return null;

    let strongest: { desire: string; strength: number } | null = null;
    
    desires.forEach((strength, desire) => {
      if (!strongest || strength > strongest.strength) {
        strongest = { desire, strength };
      }
    });

    return strongest;
  }

  getAllDesires(agent: string): Array<{ desire: string; strength: number }> {
    const desires = this.agentDesires.get(agent);
    if (!desires) return [];

    return Array.from(desires.entries())
      .map(([desire, strength]) => ({ desire, strength }))
      .sort((a, b) => b.strength - a.strength);
  }

  predictBehavior(agent: string, options: string[]): string | null {
    const desires = this.agentDesires.get(agent);
    if (!desires) return null;

    let bestOption: string | null = null;
    let bestScore = -Infinity;

    options.forEach(option => {
      let score = 0;
      desires.forEach((strength, desire) => {
        if (option.toLowerCase().includes(desire)) {
          score += strength;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestOption = option;
      }
    });

    return bestOption;
  }

  getDesireReport(agent: string): string {
    const desires = this.getAllDesires(agent);

    let report = `**Desire Report for ${agent}**\n\n`;
    
    if (desires.length === 0) {
      report += 'No desires recorded\n';
    } else {
      report += '**Desires (sorted by strength):**\n';
      desires.forEach(d => {
        report += `- ${d.desire}: ${(d.strength * 100).toFixed(0)}%\n`;
      });
    }

    const strongest = this.getStrongestDesire(agent);
    if (strongest) {
      report += `\n**Strongest Desire:** ${strongest.desire} (${(strongest.strength * 100).toFixed(0)}%)\n`;
    }

    return report;
  }

  clear(agent?: string) {
    if (agent) {
      this.agentDesires.delete(agent);
    } else {
      this.agentDesires.clear();
    }
  }
}

// ============================================
// ITEM 27.5: Emotion Attribution
// Infer others' emotional states
// ============================================
export class EmotionAttribution {
  private emotionIndicators: Map<string, { indicators: string[]; intensity: number }> = new Map();

  constructor() {
    this.loadEmotions();
  }

  private loadEmotions() {
    this.emotionIndicators.set('happy', {
      indicators: ['smile', 'laugh', 'joy', 'excited', 'great', 'wonderful', 'awesome'],
      intensity: 0.8
    });

    this.emotionIndicators.set('sad', {
      indicators: ['cry', 'tears', 'unhappy', 'depressed', 'terrible', 'awful', 'miserable'],
      intensity: 0.8
    });

    this.emotionIndicators.set('angry', {
      indicators: ['angry', 'furious', 'mad', 'rage', 'hate', 'frustrated', 'annoyed'],
      intensity: 0.9
    });

    this.emotionIndicators.set('fear', {
      indicators: ['afraid', 'scared', 'fear', 'terrified', 'anxious', 'worried', 'nervous'],
      intensity: 0.85
    });

    this.emotionIndicators.set('surprise', {
      indicators: ['surprised', 'shocked', 'astonished', 'amazed', 'unexpected', 'wow'],
      intensity: 0.7
    });

    this.emotionIndicators.set('disgust', {
      indicators: ['disgusted', 'gross', 'revolting', 'nauseating', 'repulsive'],
      intensity: 0.8
    });
  }

  detectEmotion(text: string): Array<{ emotion: string; confidence: number }> {
    const textLower = text.toLowerCase();
    const detected: Array<{ emotion: string; confidence: number }> = [];

    this.emotionIndicators.forEach((data, emotion) => {
      const matchCount = data.indicators.filter(ind => textLower.includes(ind)).length;
      if (matchCount > 0) {
        const confidence = Math.min(1, (matchCount / data.indicators.length) * data.intensity);
        detected.push({ emotion, confidence });
      }
    });

    return detected.sort((a, b) => b.confidence - a.confidence);
  }

  getDominantEmotion(text: string): { emotion: string; confidence: number } | null {
    const emotions = this.detectEmotion(text);
    return emotions.length > 0 ? emotions[0] : null;
  }

  predictBehavior(emotion: string): string {
    switch (emotion.toLowerCase()) {
      case 'happy':
        return 'Likely to engage positively, help others, take risks';
      case 'sad':
        return 'May withdraw, seek comfort, need support';
      case 'angry':
        return 'May confront, argue, or withdraw; needs cooling down';
      case 'fear':
        return 'May avoid, seek safety, need reassurance';
      case 'surprise':
        return 'May pause to process, then adapt';
      case 'disgust':
        return 'May reject, avoid, or express disapproval';
      default:
        return 'Behavior prediction uncertain';
    }
  }

  getEmotionReport(text: string): string {
    const emotions = this.detectEmotion(text);

    let report = '**Emotion Attribution**\n\n';
    report += `**Text:** "${text}"\n\n`;

    if (emotions.length === 0) {
      report += 'No clear emotions detected\n';
    } else {
      report += '**Detected Emotions:**\n';
      emotions.forEach(e => {
        report += `- ${e.emotion}: ${(e.confidence * 100).toFixed(0)}% confidence\n`;
      });

      const dominant = emotions[0];
      report += `\n**Dominant Emotion:** ${dominant.emotion}\n`;
      report += `**Predicted Behavior:** ${this.predictBehavior(dominant.emotion)}\n`;
    }

    return report;
  }

  addEmotion(emotion: string, indicators: string[], intensity: number) {
    this.emotionIndicators.set(emotion, { indicators, intensity });
  }
}

// ============================================
// ITEM 27.6: Perspective Taking
// Adopt others' viewpoints
// ============================================
export class PerspectiveTaking {
  private perspectives: Map<string, { 
    background: string; 
    values: string[]; 
    knowledge: string[]; 
    biases: string[] 
  }> = new Map();

  setPerspective(agent: string, background: string, values: string[], knowledge: string[], biases: string[] = []) {
    this.perspectives.set(agent, {
      background,
      values,
      knowledge,
      biases
    });
  }

  getPerspective(agent: string): { background: string; values: string[]; knowledge: string[]; biases: string[] } | null {
    return this.perspectives.get(agent) || null;
  }

  interpretFromPerspective(agent: string, statement: string): string {
    const perspective = this.perspectives.get(agent);
    if (!perspective) return `No perspective data for ${agent}`;

    let interpretation = `**Interpretation from ${agent}'s Perspective:**\n\n`;
    interpretation += `**Background:** ${perspective.background}\n`;
    interpretation += `**Values:** ${perspective.values.join(', ')}\n`;
    interpretation += `**Relevant Knowledge:** ${perspective.knowledge.join(', ')}\n\n`;
    
    interpretation += `**Statement:** "${statement}"\n\n`;
    interpretation += `**Interpretation:** ${agent} would likely interpret this statement through the lens of their background and values. `;
    
    // Check if statement aligns with values
    const alignsWithValues = perspective.values.some(v => statement.toLowerCase().includes(v));
    if (alignsWithValues) {
      interpretation += 'The statement aligns with their core values, so they would likely view it positively.\n';
    } else {
      interpretation += 'The statement may conflict with their values, so they might view it skeptically.\n';
    }

    // Check biases
    if (perspective.biases.length > 0) {
      interpretation += `\n**Potential Biases:** ${perspective.biases.join(', ')}\n`;
      interpretation += 'These biases may color their interpretation.\n';
    }

    return interpretation;
  }

  findCommonGround(agent1: string, agent2: string): string[] {
    const p1 = this.perspectives.get(agent1);
    const p2 = this.perspectives.get(agent2);

    if (!p1 || !p2) return [];

    const commonValues = p1.values.filter(v => p2.values.includes(v));
    const commonKnowledge = p1.knowledge.filter(k => p2.knowledge.includes(k));

    return [...commonValues, ...commonKnowledge];
  }

  getPerspectiveComparison(agent1: string, agent2: string): string {
    const p1 = this.perspectives.get(agent1);
    const p2 = this.perspectives.get(agent2);

    if (!p1 || !p2) return 'Insufficient perspective data for comparison';

    const common = this.findCommonGround(agent1, agent2);

    let comparison = `**Perspective Comparison: ${agent1} vs ${agent2}**\n\n`;
    
    comparison += `**${agent1}:**\n`;
    comparison += `- Background: ${p1.background}\n`;
    comparison += `- Values: ${p1.values.join(', ')}\n\n`;

    comparison += `**${agent2}:**\n`;
    comparison += `- Background: ${p2.background}\n`;
    comparison += `- Values: ${p2.values.join(', ')}\n\n`;

    comparison += `**Common Ground (${common.length} items):**\n`;
    if (common.length === 0) {
      comparison += 'No obvious common ground identified\n';
    } else {
      common.forEach(item => comparison += `- ${item}\n`);
    }

    return comparison;
  }

  clear(agent?: string) {
    if (agent) {
      this.perspectives.delete(agent);
    } else {
      this.perspectives.clear();
    }
  }
}

// ============================================
// ITEM 27.7: Deception Detection
// Detect lies, inconsistencies
// ============================================
export class DeceptionDetection {
  private deceptionIndicators: Map<string, { pattern: RegExp; description: string; confidence: number }> = new Map();

  constructor() {
    this.loadIndicators();
  }

  private loadIndicators() {
    this.deceptionIndicators.set('vagueness', {
      pattern: /\b(something|thing|stuff|whatever|maybe|perhaps)\b/i,
      description: 'Vague language may indicate deception',
      confidence: 0.3
    });

    this.deceptionIndicators.set('overqualification', {
      pattern: /\b(to be honest|frankly|truthfully|actually)\b/i,
      description: 'Overqualification may signal deception',
      confidence: 0.4
    });

    this.deceptionIndicators.set('distancing', {
      pattern: /\b(they|them|those|that)\s+(people|thing|situation)\b/i,
      description: 'Linguistic distancing from subject',
      confidence: 0.35
    });

    this.deceptionIndicators.set('inconsistency', {
      pattern: /\b(but|however|although|except)\b.*\b(but|however|although|except)\b/i,
      description: 'Multiple contradictions may indicate deception',
      confidence: 0.5
    });

    this.deceptionIndicators.set('deflection', {
      pattern: /\b(why are you asking|that's not relevant|let's change the subject)\b/i,
      description: 'Deflecting questions may indicate deception',
      confidence: 0.6
    });

    this.deceptionIndicators.set('excessive_detail', {
      pattern: /\b(um|uh|like|you know)\b.*\b(um|uh|like|you know)\b.*\b(um|uh|like|you know)\b/i,
      description: 'Excessive filler words may indicate fabrication',
      confidence: 0.4
    });
  }

  detectDeception(text: string): { deceptive: boolean; indicators: Array<{ type: string; description: string; confidence: number }>; overallConfidence: number } {
    const textLower = text.toLowerCase();
    const indicators: Array<{ type: string; description: string; confidence: number }> = [];
    let totalConfidence = 0;

    this.deceptionIndicators.forEach((data, type) => {
      if (data.pattern.test(textLower)) {
        indicators.push({
          type,
          description: data.description,
          confidence: data.confidence
        });
        totalConfidence += data.confidence;
      }
    });

    const overallConfidence = indicators.length > 0 ? Math.min(1, totalConfidence / indicators.length) : 0;
    const deceptive = overallConfidence > 0.4;

    return { deceptive, indicators, overallConfidence };
  }

  getDeceptionReport(text: string): string {
    const result = this.detectDeception(text);

    let report = '**Deception Detection Analysis**\n\n';
    report += `**Text:** "${text}"\n\n`;

    if (result.indicators.length === 0) {
      report += '✓ No deception indicators detected\n';
    } else {
      report += `**Deception Indicators (${result.indicators.length}):**\n`;
      result.indicators.forEach(ind => {
        report += `- **${ind.type}:** ${ind.description} (${(ind.confidence * 100).toFixed(0)}% confidence)\n`;
      });

      report += `\n**Overall Deception Confidence:** ${(result.overallConfidence * 100).toFixed(0)}%\n`;
      
      if (result.deceptive) {
        report += `\n**Assessment:** Text shows signs of potential deception. Recommend verification.\n`;
      } else {
        report += `\n**Assessment:** Some indicators present but below deception threshold.\n`;
      }
    }

    return report;
  }

  addIndicator(name: string, pattern: RegExp, description: string, confidence: number) {
    this.deceptionIndicators.set(name, { pattern, description, confidence });
  }
}

// ============================================
// ITEM 27.8: Mind Reading
// Infer mental states from behavior
// ============================================
export class MindReading {
  private behaviorPatterns: Map<string, { mentalState: string; confidence: number }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.behaviorPatterns.set('avoiding eye contact', { mentalState: 'uncomfortable or hiding something', confidence: 0.6 });
    this.behaviorPatterns.set('fidgeting', { mentalState: 'anxious or nervous', confidence: 0.7 });
    this.behaviorPatterns.set('crossed arms', { mentalState: 'defensive or closed off', confidence: 0.65 });
    this.behaviorPatterns.set('leaning forward', { mentalState: 'interested or engaged', confidence: 0.75 });
    this.behaviorPatterns.set('checking phone frequently', { mentalState: 'bored or distracted', confidence: 0.7 });
    this.behaviorPatterns.set('smiling', { mentalState: 'happy or friendly', confidence: 0.8 });
    this.behaviorPatterns.set('sighing', { mentalState: 'frustrated or tired', confidence: 0.65 });
    this.behaviorPatterns.set('nodding', { mentalState: 'agreeing or understanding', confidence: 0.8 });
  }

  inferMentalState(behavior: string): { mentalState: string; confidence: number } | null {
    const behaviorLower = behavior.toLowerCase();
    
    for (const [pattern, data] of this.behaviorPatterns.entries()) {
      if (behaviorLower.includes(pattern)) {
        return {
          mentalState: data.mentalState,
          confidence: data.confidence
        };
      }
    }

    return null;
  }

  inferMultipleStates(behaviors: string[]): Array<{ behavior: string; mentalState: string; confidence: number }> {
    return behaviors
      .map(behavior => {
        const state = this.inferMentalState(behavior);
        return state ? { behavior, ...state } : null;
      })
      .filter((result): result is { behavior: string; mentalState: string; confidence: number } => result !== null);
  }

  getMindReadingReport(behaviors: string[]): string {
    const states = this.inferMultipleStates(behaviors);

    let report = '**Mind Reading Analysis**\n\n';

    if (states.length === 0) {
      report += 'No mental states could be inferred from the provided behaviors\n';
    } else {
      report += '**Inferred Mental States:**\n\n';
      states.forEach(s => {
        report += `- **Behavior:** ${s.behavior}\n`;
        report += `  **Mental State:** ${s.mentalState}\n`;
        report += `  **Confidence:** ${(s.confidence * 100).toFixed(0)}%\n\n`;
      });
    }

    return report;
  }

  addPattern(behavior: string, mentalState: string, confidence: number) {
    this.behaviorPatterns.set(behavior, { mentalState, confidence });
  }
}

// ============================================
// ITEM 27.9: Social Cognition
// Understand social situations, norms, dynamics
// ============================================
export class SocialCognition {
  private socialSituations: Map<string, { norms: string[]; roles: string[]; expectations: string[] }> = new Map();

  constructor() {
    this.loadSituations();
  }

  private loadSituations() {
    this.socialSituations.set('job interview', {
      norms: ['dress professionally', 'arrive on time', 'be polite', 'answer honestly'],
      roles: ['interviewer', 'candidate'],
      expectations: ['ask questions', 'show interest', 'demonstrate skills']
    });

    this.socialSituations.set('first date', {
      norms: ['be respectful', 'listen actively', 'share about yourself', 'be authentic'],
      roles: ['date1', 'date2'],
      expectations: ['find common interests', 'build rapport', 'enjoy each other\'s company']
    });

    this.socialSituations.set('team meeting', {
      norms: ['stay on topic', 'respect speaking time', 'take notes', 'participate'],
      roles: ['leader', 'participants'],
      expectations: ['share updates', 'solve problems', 'make decisions']
    });

    this.socialSituations.set('funeral', {
      norms: ['dress somberly', 'be quiet', 'show respect', 'offer condolences'],
      roles: ['family', 'friends', 'mourners'],
      expectations: ['support each other', 'remember deceased', 'be present']
    });

    this.socialSituations.set('party', {
      norms: ['be social', 'respect boundaries', 'have fun', 'be inclusive'],
      roles: ['host', 'guests'],
      expectations: ['mingle', 'enjoy activities', 'make connections']
    });
  }

  analyzeSituation(situation: string): { norms: string[]; roles: string[]; expectations: string[] } | null {
    return this.socialSituations.get(situation.toLowerCase()) || null;
  }

  suggestBehavior(situation: string, role: string): string[] {
    const data = this.socialSituations.get(situation.toLowerCase());
    if (!data) return [];

    const suggestions: string[] = [];
    
    // Add relevant norms
    suggestions.push(...data.norms.slice(0, 3));
    
    // Add role-specific expectations
    suggestions.push(...data.expectations.slice(0, 2));

    return suggestions;
  }

  getSocialReport(situation: string): string {
    const data = this.socialSituations.get(situation.toLowerCase());

    if (!data) return `No social cognition data for: ${situation}`;

    let report = `**Social Cognition: ${situation}**\n\n`;
    
    report += '**Social Norms:**\n';
    data.norms.forEach(norm => report += `- ${norm}\n`);
    
    report += '\n**Roles:**\n';
    data.roles.forEach(role => report += `- ${role}\n`);
    
    report += '\n**Expectations:**\n';
    data.expectations.forEach(exp => report += `- ${exp}\n`);

    return report;
  }

  addSituation(name: string, norms: string[], roles: string[], expectations: string[]) {
    this.socialSituations.set(name.toLowerCase(), { norms, roles, expectations });
  }
}

// ============================================
// ITEM 27.10: Recursive Mind Reading
// "I think that you think that I think..."
// ============================================
export class RecursiveMindReading {
  private beliefNesting: Map<string, Array<{ level: number; agent: string; belief: string }>> = new Map();

  addNestedBelief(topic: string, level: number, agent: string, belief: string) {
    if (!this.beliefNesting.has(topic)) {
      this.beliefNesting.set(topic, []);
    }
    this.beliefNesting.get(topic)!.push({ level, agent, belief });
  }

  getNestedBeliefs(topic: string): Array<{ level: number; agent: string; belief: string }> {
    return this.beliefNesting.get(topic) || [];
  }

  analyzeRecursion(topic: string): { maxLevel: number; complexity: string } {
    const beliefs = this.getNestedBeliefs(topic);
    
    if (beliefs.length === 0) {
      return { maxLevel: 0, complexity: 'none' };
    }

    const maxLevel = Math.max(...beliefs.map(b => b.level));
    
    let complexity: string;
    if (maxLevel === 1) complexity = 'simple (first-order)';
    else if (maxLevel === 2) complexity = 'moderate (second-order)';
    else if (maxLevel === 3) complexity = 'complex (third-order)';
    else complexity = 'very complex (higher-order)';

    return { maxLevel, complexity };
  }

  generateRecursiveStatement(topic: string): string {
    const beliefs = this.getNestedBeliefs(topic);
    
    if (beliefs.length === 0) return `No nested beliefs about: ${topic}`;

    // Sort by level
    const sorted = [...beliefs].sort((a, b) => a.level - b.level);
    
    let statement = '';
    sorted.forEach((belief, index) => {
      if (index === 0) {
        statement += `${belief.agent} believes that ${belief.belief}`;
      } else {
        statement += `, and ${belief.agent} believes that `;
        if (index === 1) {
          statement += belief.belief;
        } else {
          statement += `this is the case`;
        }
      }
    });

    return statement;
  }

  getRecursionReport(topic: string): string {
    const beliefs = this.getNestedBeliefs(topic);
    const analysis = this.analyzeRecursion(topic);

    let report = `**Recursive Mind Reading: ${topic}**\n\n`;
    
    if (beliefs.length === 0) {
      report += 'No nested beliefs recorded\n';
    } else {
      report += `**Complexity:** ${analysis.complexity}\n`;
      report += `**Maximum Recursion Level:** ${analysis.maxLevel}\n\n`;
      
      report += '**Nested Beliefs:**\n';
      beliefs.forEach(b => {
        const indent = '  '.repeat(b.level - 1);
        report += `${indent}Level ${b.level}: ${b.agent} believes "${b.belief}"\n`;
      });

      report += `\n**Recursive Statement:**\n`;
      report += this.generateRecursiveStatement(topic);
    }

    return report;
  }

  clear(topic?: string) {
    if (topic) {
      this.beliefNesting.delete(topic);
    } else {
      this.beliefNesting.clear();
    }
  }
}

// ============================================
// Export all Theory of Mind systems
// ============================================
export const TheoryOfMindSystems = {
  BeliefAttribution,
  IntentionDetection,
  KnowledgeAttribution,
  DesireAttribution,
  EmotionAttribution,
  PerspectiveTaking,
  DeceptionDetection,
  MindReading,
  SocialCognition,
  RecursiveMindReading,
};
