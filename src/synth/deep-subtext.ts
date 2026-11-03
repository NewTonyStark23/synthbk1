// Deep Subtext - Items 19.1-19.10
// Read between the lines, understand implicit meaning

import { Utils } from './utils';

// ============================================
// ITEM 19.1: Implicature Detection
// Gricean maxims - detect what's implied but not stated
// ============================================
export class ImplicatureDetector {
  private maximViolations: Map<string, { maxim: string; implicature: string }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    // Quantity violations (saying less than needed)
    this.maximViolations.set("it's cold in here", {
      maxim: 'quantity',
      implicature: 'close the window or turn up the heat'
    });
    this.maximViolations.set("i'm hungry", {
      maxim: 'quantity',
      implicature: 'let\'s eat or get food'
    });
    this.maximViolations.set("this is taking forever", {
      maxim: 'quantity',
      implicature: 'this is taking too long, speed up'
    });

    // Quality violations (saying something false/ironic)
    this.maximViolations.set("oh great", {
      maxim: 'quality',
      implicature: 'this is actually bad (sarcastic)'
    });
    this.maximViolations.set("perfect timing", {
      maxim: 'quality',
      implicature: 'terrible timing (sarcastic)'
    });

    // Relation violations (being irrelevant)
    this.maximViolations.set("do you like my cooking", {
      maxim: 'relation',
      implicature: 'seeking approval, not just information'
    });

    // Manner violations (being unclear)
    this.maximViolations.set("he's not exactly the sharpest tool", {
      maxim: 'manner',
      implicature: 'he\'s not very smart (euphemism)'
    });
  }

  detect(text: string): { detected: boolean; maxim?: string; implicature?: string } {
    const textLower = text.toLowerCase();
    
    for (const [pattern, data] of this.maximViolations.entries()) {
      if (textLower.includes(pattern)) {
        return {
          detected: true,
          maxim: data.maxim,
          implicature: data.implicature
        };
      }
    }

    return { detected: false };
  }

  explain(text: string): string {
    const result = this.detect(text);
    
    if (!result.detected) {
      return "No clear implicature detected in this statement.";
    }

    return `**Implicature Detected**\n\n` +
           `**Maxim Violated:** ${result.maxim}\n` +
           `**What's Said:** "${text}"\n` +
           `**What's Meant:** ${result.implicature}`;
  }

  addPattern(pattern: string, maxim: string, implicature: string) {
    this.maximViolations.set(pattern, { maxim, implicature });
  }
}

// ============================================
// ITEM 19.2: Pragmatic Inference Engine
// Infer intended meaning from context
// ============================================
export class PragmaticInferenceEngine {
  private speechActs: Map<string, { type: string; intendedAction: string }> = new Map();

  constructor() {
    this.loadSpeechActs();
  }

  private loadSpeechActs() {
    // Directives (requests, commands)
    this.speechActs.set("can you pass the salt", {
      type: 'directive',
      intendedAction: 'request to pass salt (not asking about ability)'
    });
    this.speechActs.set("could you help me", {
      type: 'directive',
      intendedAction: 'request for help'
    });

    // Commissives (promises, commitments)
    this.speechActs.set("i'll be there", {
      type: 'commissive',
      intendedAction: 'promise to attend'
    });
    this.speechActs.set("i promise to finish", {
      type: 'commissive',
      intendedAction: 'commitment to complete task'
    });

    // Expressives (emotions, attitudes)
    this.speechActs.set("i'm sorry", {
      type: 'expressive',
      intendedAction: 'apology, expressing regret'
    });
    this.speechActs.set("thank you", {
      type: 'expressive',
      intendedAction: 'gratitude, appreciation'
    });

    // Assertives (statements, claims)
    this.speechActs.set("it's raining", {
      type: 'assertive',
      intendedAction: 'statement of fact, possibly suggesting to bring umbrella'
    });
  }

  infer(text: string): { type?: string; intendedAction?: string; confidence: number } {
    const textLower = text.toLowerCase();
    
    for (const [pattern, data] of this.speechActs.entries()) {
      if (textLower.includes(pattern)) {
        return {
          type: data.type,
          intendedAction: data.intendedAction,
          confidence: 0.9
        };
      }
    }

    return { confidence: 0 };
  }

  explain(text: string): string {
    const result = this.infer(text);
    
    if (result.confidence === 0) {
      return "Unable to infer specific pragmatic meaning from this statement.";
    }

    return `**Pragmatic Inference**\n\n` +
           `**Speech Act Type:** ${result.type}\n` +
           `**Intended Action:** ${result.intendedAction}\n` +
           `**Confidence:** ${(result.confidence * 100).toFixed(0)}%`;
  }

  addSpeechAct(pattern: string, type: string, intendedAction: string) {
    this.speechActs.set(pattern, { type, intendedAction });
  }
}

// ============================================
// ITEM 19.3: Speech Act Analysis
// Classify: assertives, directives, commissives, expressives, declarations
// ============================================
export class SpeechActAnalyzer {
  private patterns: Map<string, string> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    // Assertives (state of affairs)
    this.patterns.set("i think", "assertive");
    this.patterns.set("i believe", "assertive");
    this.patterns.set("it is", "assertive");
    this.patterns.set("the fact is", "assertive");

    // Directives (get listener to do something)
    this.patterns.set("please", "directive");
    this.patterns.set("can you", "directive");
    this.patterns.set("could you", "directive");
    this.patterns.set("would you", "directive");
    this.patterns.set("you should", "directive");

    // Commissives (commit speaker to action)
    this.patterns.set("i promise", "commissive");
    this.patterns.set("i will", "commissive");
    this.patterns.set("i'll", "commissive");
    this.patterns.set("i swear", "commissive");

    // Expressives (express psychological state)
    this.patterns.set("i'm sorry", "expressive");
    this.patterns.set("i apologize", "expressive");
    this.patterns.set("thank you", "expressive");
    this.patterns.set("i'm grateful", "expressive");
    this.patterns.set("i'm happy", "expressive");

    // Declarations (change reality)
    this.patterns.set("i declare", "declaration");
    this.patterns.set("i pronounce", "declaration");
    this.patterns.set("i name", "declaration");
  }

  analyze(text: string): { type: string; confidence: number } {
    const textLower = text.toLowerCase();
    
    for (const [pattern, type] of this.patterns.entries()) {
      if (textLower.includes(pattern)) {
        return { type, confidence: 0.85 };
      }
    }

    return { type: 'unknown', confidence: 0 };
  }

  explain(text: string): string {
    const result = this.analyze(text);
    
    const descriptions: Record<string, string> = {
      'assertive': 'States what speaker believes to be the case',
      'directive': 'Attempts to get listener to do something',
      'commissive': 'Commits speaker to future action',
      'expressive': 'Expresses speaker\'s psychological state',
      'declaration': 'Changes reality through utterance',
      'unknown': 'Unable to classify speech act'
    };

    return `**Speech Act Analysis**\n\n` +
           `**Type:** ${result.type}\n` +
           `**Description:** ${descriptions[result.type]}\n` +
           `**Confidence:** ${(result.confidence * 100).toFixed(0)}%`;
  }

  addPattern(pattern: string, type: string) {
    this.patterns.set(pattern, type);
  }
}

// ============================================
// ITEM 19.4: Indirect Request Detection
// Detect indirect requests, politeness strategies
// ============================================
export class IndirectRequestDetector {
  private indirectPatterns: Map<string, { directRequest: string; politenessStrategy: string }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.indirectPatterns.set("it's getting late", {
      directRequest: 'let\'s leave or wrap up',
      politenessStrategy: 'hint (off-record)'
    });
    this.indirectPatterns.set("i'm cold", {
      directRequest: 'close the window or turn up heat',
      politenessStrategy: 'state feeling (off-record)'
    });
    this.indirectPatterns.set("do you know what time it is", {
      directRequest: 'tell me the time',
      politenessStrategy: 'question about knowledge (negative politeness)'
    });
    this.indirectPatterns.set("this is really heavy", {
      directRequest: 'help me carry this',
      politenessStrategy: 'statement about object (off-record)'
    });
    this.indirectPatterns.set("i'm stuck", {
      directRequest: 'help me',
      politenessStrategy: 'statement about state (off-record)'
    });
  }

  detect(text: string): { isIndirect: boolean; directRequest?: string; politenessStrategy?: string } {
    const textLower = text.toLowerCase();
    
    for (const [pattern, data] of this.indirectPatterns.entries()) {
      if (textLower.includes(pattern)) {
        return {
          isIndirect: true,
          directRequest: data.directRequest,
          politenessStrategy: data.politenessStrategy
        };
      }
    }

    return { isIndirect: false };
  }

  explain(text: string): string {
    const result = this.detect(text);
    
    if (!result.isIndirect) {
      return "This appears to be a direct request or statement.";
    }

    return `**Indirect Request Detected**\n\n` +
           `**What's Said:** "${text}"\n` +
           `**What's Meant:** ${result.directRequest}\n` +
           `**Politeness Strategy:** ${result.politenessStrategy}`;
  }

  addPattern(pattern: string, directRequest: string, politenessStrategy: string) {
    this.indirectPatterns.set(pattern, { directRequest, politenessStrategy });
  }
}

// ============================================
// ITEM 19.5: Emotional Subtext Reading
// Detect emotions beneath surface
// ============================================
export class EmotionalSubtextReader {
  private emotionIndicators: Map<string, { emotion: string; indicators: string[] }> = new Map();

  constructor() {
    this.loadIndicators();
  }

  private loadIndicators() {
    this.emotionIndicators.set("frustration", {
      emotion: 'frustrated',
      indicators: ['fine', 'whatever', 'doesn\'t matter', 'i guess']
    });
    this.emotionIndicators.set("anxiety", {
      emotion: 'anxious',
      indicators: ['what if', 'i hope', 'i\'m worried', 'i\'m nervous']
    });
    this.emotionIndicators.set("anger", {
      emotion: 'angry',
      indicators: ['unbelievable', 'ridiculous', 'are you kidding', 'seriously']
    });
    this.emotionIndicators.set("sadness", {
      emotion: 'sad',
      indicators: ['i don\'t care', 'it\'s fine', 'doesn\'t matter', 'i\'m tired']
    });
    this.emotionIndicators.set("excitement", {
      emotion: 'excited',
      indicators: ['omg', 'wow', 'amazing', 'can\'t wait']
    });
  }

  read(text: string): { detected: boolean; emotion?: string; confidence: number } {
    const textLower = text.toLowerCase();
    let maxMatches = 0;
    let detectedEmotion = '';

    for (const [emotion, data] of this.emotionIndicators.entries()) {
      const matches = data.indicators.filter(indicator => textLower.includes(indicator)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = data.emotion;
      }
    }

    if (maxMatches > 0) {
      return {
        detected: true,
        emotion: detectedEmotion,
        confidence: Math.min(1, maxMatches * 0.3)
      };
    }

    return { detected: false, confidence: 0 };
  }

  explain(text: string): string {
    const result = this.read(text);
    
    if (!result.detected) {
      return "No strong emotional subtext detected.";
    }

    return `**Emotional Subtext Detected**\n\n` +
           `**Surface:** "${text}"\n` +
           `**Underlying Emotion:** ${result.emotion}\n` +
           `**Confidence:** ${(result.confidence * 100).toFixed(0)}%`;
  }

  addEmotion(emotion: string, indicators: string[]) {
    this.emotionIndicators.set(emotion, { emotion, indicators });
  }
}

// ============================================
// ITEM 19.6: Cultural Implication Detection
// Cultural context affects meaning
// ============================================
export class CulturalImplicationDetector {
  private culturalPatterns: Map<string, { culture: string; implication: string }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    // Western cultures (direct)
    this.culturalPatterns.set("that's interesting", {
      culture: 'western',
      implication: 'genuine interest or polite dismissal depending on tone'
    });
    this.culturalPatterns.set("i'll think about it", {
      culture: 'western',
      implication: 'likely a polite refusal'
    });

    // Asian cultures (indirect)
    this.culturalPatterns.set("maybe", {
      culture: 'asian',
      implication: 'often means no (face-saving)'
    });
    this.culturalPatterns.set("it's difficult", {
      culture: 'asian',
      implication: 'likely impossible (indirect refusal)'
    });

    // High-context cultures
    this.culturalPatterns.set("we'll see", {
      culture: 'high-context',
      implication: 'probably not, but avoiding direct refusal'
    });
  }

  detect(text: string, context?: string): { detected: boolean; culture?: string; implication?: string } {
    const textLower = text.toLowerCase();
    
    for (const [pattern, data] of this.culturalPatterns.entries()) {
      if (textLower.includes(pattern)) {
        return {
          detected: true,
          culture: data.culture,
          implication: data.implication
        };
      }
    }

    return { detected: false };
  }

  explain(text: string, context?: string): string {
    const result = this.detect(text, context);
    
    if (!result.detected) {
      return "No specific cultural implications detected.";
    }

    return `**Cultural Implication Detected**\n\n` +
           `**Phrase:** "${text}"\n` +
           `**Cultural Context:** ${result.culture}\n` +
           `**Implication:** ${result.implication}`;
  }

  addPattern(pattern: string, culture: string, implication: string) {
    this.culturalPatterns.set(pattern, { culture, implication });
  }
}

// ============================================
// ITEM 19.7: Power Dynamic Analysis
// Detect power relationships in text
// ============================================
export class PowerDynamicAnalyzer {
  private powerIndicators: Map<string, { level: string; indicators: string[] }> = new Map();

  constructor() {
    this.loadIndicators();
  }

  private loadIndicators() {
    this.powerIndicators.set("high_power", {
      level: 'high',
      indicators: ['i demand', 'you must', 'i require', 'do this', 'i expect']
    });
    this.powerIndicators.set("medium_power", {
      level: 'medium',
      indicators: ['i need', 'you should', 'please', 'could you', 'would you']
    });
    this.powerIndicators.set("low_power", {
      level: 'low',
      indicators: ['i was wondering', 'if it\'s not too much trouble', 'sorry to bother', 'i hate to ask']
    });
  }

  analyze(text: string): { level: string; confidence: number } {
    const textLower = text.toLowerCase();
    let maxMatches = 0;
    let detectedLevel = '';

    for (const [level, data] of this.powerIndicators.entries()) {
      const matches = data.indicators.filter(indicator => textLower.includes(indicator)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedLevel = data.level;
      }
    }

    if (maxMatches > 0) {
      return {
        level: detectedLevel,
        confidence: Math.min(1, maxMatches * 0.4)
      };
    }

    return { level: 'neutral', confidence: 0.5 };
  }

  explain(text: string): string {
    const result = this.analyze(text);
    
    const descriptions: Record<string, string> = {
      'high': 'Speaker has high power/status, using direct commands',
      'medium': 'Speaker has moderate power, using polite requests',
      'low': 'Speaker has low power/status, using very deferential language',
      'neutral': 'Balanced power dynamic'
    };

    return `**Power Dynamic Analysis**\n\n` +
           `**Level:** ${result.level}\n` +
           `**Description:** ${descriptions[result.level]}\n` +
           `**Confidence:** ${(result.confidence * 100).toFixed(0)}%`;
  }

  addLevel(level: string, indicators: string[]) {
    this.powerIndicators.set(level, { level, indicators });
  }
}

// ============================================
// ITEM 19.8: Face-Saving Detection
// Detect when user is saving face
// ============================================
export class FaceSavingDetector {
  private faceSavingPatterns: Map<string, { type: string; explanation: string }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.faceSavingPatterns.set("i didn't really want it anyway", {
      type: 'positive_face',
      explanation: 'Saving face after rejection, protecting self-image'
    });
    this.faceSavingPatterns.set("it's not that important", {
      type: 'positive_face',
      explanation: 'Downplaying importance to avoid appearing needy'
    });
    this.faceSavingPatterns.set("i was just curious", {
      type: 'positive_face',
      explanation: 'Minimizing interest to avoid vulnerability'
    });
    this.faceSavingPatterns.set("no worries", {
      type: 'negative_face',
      explanation: 'Minimizing imposition to respect other\'s autonomy'
    });
    this.faceSavingPatterns.set("don't worry about it", {
      type: 'negative_face',
      explanation: 'Reassuring to avoid burdening other'
    });
  }

  detect(text: string): { detected: boolean; type?: string; explanation?: string } {
    const textLower = text.toLowerCase();
    
    for (const [pattern, data] of this.faceSavingPatterns.entries()) {
      if (textLower.includes(pattern)) {
        return {
          detected: true,
          type: data.type,
          explanation: data.explanation
        };
      }
    }

    return { detected: false };
  }

  explain(text: string): string {
    const result = this.detect(text);
    
    if (!result.detected) {
      return "No clear face-saving behavior detected.";
    }

    return `**Face-Saving Detected**\n\n` +
           `**Phrase:** "${text}"\n` +
           `**Type:** ${result.type}\n` +
           `**Explanation:** ${result.explanation}`;
  }

  addPattern(pattern: string, type: string, explanation: string) {
    this.faceSavingPatterns.set(pattern, { type, explanation });
  }
}

// ============================================
// ITEM 19.9: Politeness Theory Application
// Brown & Levinson's politeness theory
// ============================================
export class PolitenessTheoryAnalyzer {
  private strategies: Map<string, { strategy: string; description: string }> = new Map();

  constructor() {
    this.loadStrategies();
  }

  private loadStrategies() {
    // Bald on-record (direct)
    this.strategies.set("give me that", {
      strategy: 'bald_on_record',
      description: 'Direct, no politeness marking'
    });
    this.strategies.set("do this now", {
      strategy: 'bald_on_record',
      description: 'Direct command, no mitigation'
    });

    // Positive politeness (solidarity)
    this.strategies.set("hey buddy", {
      strategy: 'positive_politeness',
      description: 'Showing solidarity, in-group membership'
    });
    this.strategies.set("let's", {
      strategy: 'positive_politeness',
      description: 'Including speaker and listener together'
    });

    // Negative politeness (respect autonomy)
    this.strategies.set("i'm sorry to bother you", {
      strategy: 'negative_politeness',
      description: 'Acknowledging imposition, respecting autonomy'
    });
    this.strategies.set("if you don't mind", {
      strategy: 'negative_politeness',
      description: 'Giving listener option to refuse'
    });

    // Off-record (indirect)
    this.strategies.set("it's cold in here", {
      strategy: 'off_record',
      description: 'Indirect hint, allowing listener to infer'
    });
  }

  analyze(text: string): { strategy: string; description: string; confidence: number } {
    const textLower = text.toLowerCase();
    
    for (const [pattern, data] of this.strategies.entries()) {
      if (textLower.includes(pattern)) {
        return {
          strategy: data.strategy,
          description: data.description,
          confidence: 0.85
        };
      }
    }

    return { strategy: 'unknown', description: 'Unable to classify', confidence: 0 };
  }

  explain(text: string): string {
    const result = this.analyze(text);
    
    return `**Politeness Strategy Analysis**\n\n` +
           `**Strategy:** ${result.strategy}\n` +
           `**Description:** ${result.description}\n` +
           `**Confidence:** ${(result.confidence * 100).toFixed(0)}%`;
  }

  addStrategy(pattern: string, strategy: string, description: string) {
    this.strategies.set(pattern, { strategy, description });
  }
}

// ============================================
// ITEM 19.10: Gricean Maxims Checking
// Quality, Quantity, Relation, Manner - detect and interpret violations
// ============================================
export class GriceanMaximsChecker {
  private violations: Map<string, { maxim: string; violationType: string; interpretation: string }> = new Map();

  constructor() {
    this.loadViolations();
  }

  private loadViolations() {
    // Quantity violations
    this.violations.set("i have nothing to wear", {
      maxim: 'quantity',
      violationType: 'under-informative',
      interpretation: 'hyperbole - has clothes but nothing suitable'
    });

    // Quality violations
    this.violations.set("you're a genius", {
      maxim: 'quality',
      violationType: 'irony',
      interpretation: 'sarcastic - means opposite (not a genius)'
    });
    this.violations.set("what a beautiful day", {
      maxim: 'quality',
      violationType: 'irony',
      interpretation: 'sarcastic - day is actually bad (raining/stormy)'
    });

    // Relation violations
    this.violations.set("do you like my painting", {
      maxim: 'relation',
      violationType: 'seeking_approval',
      interpretation: 'not asking for critique, seeking validation'
    });

    // Manner violations
    this.violations.set("he's not exactly a morning person", {
      maxim: 'manner',
      violationType: 'understatement',
      interpretation: 'euphemism - hates mornings, difficult before noon'
    });
    this.violations.set("she's between jobs", {
      maxim: 'manner',
      violationType: 'euphemism',
      interpretation: 'unemployed, using softer expression'
    });
  }

  check(text: string): { detected: boolean; maxim?: string; violationType?: string; interpretation?: string } {
    const textLower = text.toLowerCase();
    
    for (const [pattern, data] of this.violations.entries()) {
      if (textLower.includes(pattern)) {
        return {
          detected: true,
          maxim: data.maxim,
          violationType: data.violationType,
          interpretation: data.interpretation
        };
      }
    }

    return { detected: false };
  }

  explain(text: string): string {
    const result = this.check(text);
    
    if (!result.detected) {
      return "No clear Gricean maxim violations detected.";
    }

    return `**Gricean Maxim Violation Detected**\n\n` +
           `**Maxim Violated:** ${result.maxim}\n` +
           `**Violation Type:** ${result.violationType}\n` +
           `**What's Said:** "${text}"\n` +
           `**What's Meant:** ${result.interpretation}`;
  }

  addViolation(pattern: string, maxim: string, violationType: string, interpretation: string) {
    this.violations.set(pattern, { maxim, violationType, interpretation });
  }
}

// ============================================
// Export all deep subtext systems
// ============================================
export const DeepSubtextSystems = {
  ImplicatureDetector,
  PragmaticInferenceEngine,
  SpeechActAnalyzer,
  IndirectRequestDetector,
  EmotionalSubtextReader,
  CulturalImplicationDetector,
  PowerDynamicAnalyzer,
  FaceSavingDetector,
  PolitenessTheoryAnalyzer,
  GriceanMaximsChecker,
};
