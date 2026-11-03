// Ambiguity Resolution - Items 13.2-13.10
// Ask instead of guess

import { Utils } from './utils';

// ============================================
// ITEM 13.2: Confidence Thresholds
// Below 70% confidence → ask for clarification
// ============================================
export class ConfidenceThresholds {
  private threshold: number = 0.7;

  needsClarification(confidence: number): boolean {
    return confidence < this.threshold;
  }

  setThreshold(threshold: number) {
    this.threshold = Math.max(0, Math.min(1, threshold));
  }

  getThreshold(): number {
    return this.threshold;
  }
}

// ============================================
// ITEM 13.3: Option Presentation
// "Did you mean A, B, or C?"
// ============================================
export class OptionPresenter {
  present(options: Array<{ label: string; description: string; confidence: number }>): string {
    if (options.length === 0) {
      return "I'm not sure what you mean. Could you clarify?";
    }

    const sortedOptions = options.sort((a, b) => b.confidence - a.confidence);
    const topOptions = sortedOptions.slice(0, 3);

    let response = "Did you mean:\n\n";
    topOptions.forEach((option, index) => {
      response += `${index + 1}. ${option.label} - ${option.description}\n`;
    });

    response += "\nPlease select an option or provide more details.";
    return response;
  }

  presentWithConfidence(options: Array<{ label: string; confidence: number }>): string {
    if (options.length === 0) {
      return "I'm uncertain about your request. Could you provide more context?";
    }

    const sortedOptions = options.sort((a, b) => b.confidence - a.confidence);
    
    let response = "I think you might mean one of these:\n\n";
    sortedOptions.forEach((option, index) => {
      const confPercent = (option.confidence * 100).toFixed(0);
      response += `${index + 1}. ${option.label} (${confPercent}% confident)\n`;
    });

    return response;
  }
}

// ============================================
// ITEM 13.4: Progressive Refinement
// Start broad, narrow down with follow-ups
// ============================================
export class ProgressiveRefiner {
  private refinementHistory: Array<{ query: string; response: string; timestamp: number }> = [];

  addInteraction(query: string, response: string) {
    this.refinementHistory.push({
      query,
      response,
      timestamp: Date.now()
    });

    // Keep only last 10 interactions
    if (this.refinementHistory.length > 10) {
      this.refinementHistory = this.refinementHistory.slice(-10);
    }
  }

  refine(query: string, options: string[]): { refinedQuery: string; followUp: string } {
    // Analyze history to understand user's pattern
    const recentQueries = this.refinementHistory.slice(-3).map(h => h.query);
    
    // Extract keywords from recent queries
    const allKeywords = recentQueries.join(' ').toLowerCase();
    const commonWords = Utils.extractKeywords(allKeywords);

    // If query is vague, ask for specifics
    if (query.length < 20 || commonWords.length < 2) {
      return {
        refinedQuery: query,
        followUp: "Could you provide more details about what you're looking for?"
      };
    }

    // If multiple options, narrow down
    if (options.length > 1) {
      const keywords = Utils.extractKeywords(query);
      const distinguishingFactors = options.map(opt => {
        const optKeywords = Utils.extractKeywords(opt);
        const unique = optKeywords.filter(kw => !keywords.includes(kw));
        return { option: opt, unique: unique.slice(0, 2) };
      });

      const followUp = distinguishingFactors.length > 0
        ? `To help me narrow it down, are you looking for something related to ${distinguishingFactors[0].unique.join(' or ')}?`
        : "Could you tell me more about your specific requirements?";

      return { refinedQuery: query, followUp };
    }

    return { refinedQuery: query, followUp: "" };
  }

  getHistory(): Array<{ query: string; response: string }> {
    return this.refinementHistory.map(h => ({ query: h.query, response: h.response }));
  }

  clear() {
    this.refinementHistory = [];
  }
}

// ============================================
// ITEM 13.5: User Intent Prediction
// Based on history, predict most likely intent
// ============================================
export class IntentPredictor {
  private intentHistory: Map<string, number> = new Map();
  private sequenceHistory: Array<{ intent: string; timestamp: number }> = [];

  recordIntent(intent: string) {
    // Count frequency
    this.intentHistory.set(intent, (this.intentHistory.get(intent) || 0) + 1);

    // Record sequence
    this.sequenceHistory.push({ intent, timestamp: Date.now() });
    
    // Keep only last 50
    if (this.sequenceHistory.length > 50) {
      this.sequenceHistory = this.sequenceHistory.slice(-50);
    }
  }

  predictNext(): { intent: string; confidence: number } | null {
    if (this.sequenceHistory.length < 2) return null;

    // Get last intent
    const lastIntent = this.sequenceHistory[this.sequenceHistory.length - 1].intent;

    // Find sequences that follow this intent
    const followingIntents: Map<string, number> = new Map();
    
    for (let i = 0; i < this.sequenceHistory.length - 1; i++) {
      if (this.sequenceHistory[i].intent === lastIntent) {
        const nextIntent = this.sequenceHistory[i + 1].intent;
        followingIntents.set(nextIntent, (followingIntents.get(nextIntent) || 0) + 1);
      }
    }

    if (followingIntents.size === 0) {
      // Fall back to most common intent
      let maxCount = 0;
      let mostCommon = '';
      this.intentHistory.forEach((count, intent) => {
        if (count > maxCount) {
          maxCount = count;
          mostCommon = intent;
        }
      });
      return mostCommon ? { intent: mostCommon, confidence: 0.5 } : null;
    }

    // Find most likely next intent
    let maxCount = 0;
    let predictedIntent = '';
    followingIntents.forEach((count, intent) => {
      if (count > maxCount) {
        maxCount = count;
        predictedIntent = intent;
      }
    });

    const totalFollowing = Array.from(followingIntents.values()).reduce((a, b) => a + b, 0);
    const confidence = maxCount / totalFollowing;

    return { intent: predictedIntent, confidence };
  }

  getIntentFrequencies(): Map<string, number> {
    return new Map(this.intentHistory);
  }

  clear() {
    this.intentHistory.clear();
    this.sequenceHistory = [];
  }
}

// ============================================
// ITEM 13.6: Contextual Disambiguation
// Use conversation history to resolve ambiguity
// ============================================
export class ContextualDisambiguator {
  private conversationContext: Array<{ role: string; content: string; timestamp: number }> = [];

  addMessage(role: string, content: string) {
    this.conversationContext.push({
      role,
      content,
      timestamp: Date.now()
    });

    // Keep last 20 messages
    if (this.conversationContext.length > 20) {
      this.conversationContext = this.conversationContext.slice(-20);
    }
  }

  disambiguate(query: string, candidates: string[]): { selected: string; confidence: number } | null {
    if (candidates.length === 0) return null;
    if (candidates.length === 1) return { selected: candidates[0], confidence: 1.0 };

    // Extract keywords from conversation history
    const contextText = this.conversationContext
      .slice(-5)
      .map(msg => msg.content)
      .join(' ')
      .toLowerCase();

    const contextKeywords = Utils.extractKeywords(contextText);

    // Score each candidate based on context overlap
    const scored = candidates.map(candidate => {
      const candidateKeywords = Utils.extractKeywords(candidate);
      const overlap = candidateKeywords.filter(kw => contextKeywords.includes(kw)).length;
      const confidence = candidateKeywords.length > 0 ? overlap / candidateKeywords.length : 0;
      return { candidate, confidence };
    });

    // Sort by confidence
    scored.sort((a, b) => b.confidence - a.confidence);

    const best = scored[0];
    return best.confidence > 0.3 ? { selected: best.candidate, confidence: best.confidence } : null;
  }

  getContext(): Array<{ role: string; content: string }> {
    return this.conversationContext.map(msg => ({ role: msg.role, content: msg.content }));
  }

  clear() {
    this.conversationContext = [];
  }
}

// ============================================
// ITEM 13.7: Explicit/Implicit Detection
// Know when user is being vague vs specific
// ============================================
export class ExplicitImplicitDetector {
  detect(text: string): { isExplicit: boolean; confidence: number; indicators: string[] } {
    const indicators: string[] = [];
    let explicitScore = 0;

    // Explicit indicators
    const explicitMarkers = [
      { pattern: /\b(specifically|exactly|precisely|definitely)\b/i, weight: 2 },
      { pattern: /\b(for example|such as|like|including)\b/i, weight: 1.5 },
      { pattern: /\b(\d+|\d+\.\d+)\b/, weight: 1 }, // Numbers
      { pattern: /["'][^"']+["']/, weight: 1.5 }, // Quoted text
      { pattern: /\b(must|should|need to|have to)\b/i, weight: 1 },
    ];

    explicitMarkers.forEach(marker => {
      if (marker.pattern.test(text)) {
        explicitScore += marker.weight;
        indicators.push('explicit');
      }
    });

    // Implicit indicators
    const implicitMarkers = [
      { pattern: /\b(something|anything|whatever|stuff|things)\b/i, weight: 2 },
      { pattern: /\b(maybe|perhaps|possibly|might)\b/i, weight: 1.5 },
      { pattern: /\b(you know|like|um|uh)\b/i, weight: 1 },
      { pattern: /\.\.\.$/, weight: 1.5 }, // Trailing ellipsis
    ];

    let implicitScore = 0;
    implicitMarkers.forEach(marker => {
      if (marker.pattern.test(text)) {
        implicitScore += marker.weight;
        indicators.push('implicit');
      }
    });

    // Length indicator
    if (text.length < 20) {
      implicitScore += 1;
      indicators.push('short');
    } else if (text.length > 100) {
      explicitScore += 1;
      indicators.push('detailed');
    }

    const totalScore = explicitScore + implicitScore;
    const isExplicit = explicitScore > implicitScore;
    const confidence = totalScore > 0 ? Math.abs(explicitScore - implicitScore) / totalScore : 0.5;

    return { isExplicit, confidence, indicators };
  }
}

// ============================================
// ITEM 13.8: Assumption Surfacing
// "I'm assuming you mean X, is that correct?"
// ============================================
export class AssumptionSurfacer {
  private assumptionPatterns: Map<string, string[]> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.assumptionPatterns.set('code generation', ['you want me to generate code', 'you need a working implementation']);
    this.assumptionPatterns.set('explanation', ['you want an explanation', 'you need to understand this concept']);
    this.assumptionPatterns.set('fix', ['something is broken', 'you need a solution to a problem']);
    this.assumptionPatterns.set('comparison', ['you want to compare options', 'you need help making a decision']);
    this.assumptionPatterns.set('recommendation', ['you want suggestions', 'you need advice on what to choose']);
  }

  surface(query: string, intent: string): string {
    const assumptions = this.assumptionPatterns.get(intent);
    
    if (!assumptions || assumptions.length === 0) {
      return `I'm assuming you want help with ${intent}. Is that correct?`;
    }

    const assumption = assumptions[0];
    return `${assumption}. Is that correct, or did you mean something else?`;
  }

  surfaceMultiple(query: string, intents: string[]): string {
    if (intents.length === 0) {
      return "I'm not sure what you're looking for. Could you clarify?";
    }

    if (intents.length === 1) {
      return this.surface(query, intents[0]);
    }

    const assumptions = intents.map(intent => {
      const pattern = this.assumptionPatterns.get(intent);
      return pattern ? pattern[0] : `you want ${intent}`;
    });

    let response = "I'm trying to understand your request. Are you looking for:\n\n";
    assumptions.forEach((assumption, index) => {
      response += `${index + 1}. ${assumption}\n`;
    });

    response += "\nPlease let me know which one is correct.";
    return response;
  }

  addPattern(intent: string, assumptions: string[]) {
    this.assumptionPatterns.set(intent, assumptions);
  }
}

// ============================================
// ITEM 13.9: Multi-Intent Handling
// Detect when user wants multiple things
// ============================================
export class MultiIntentHandler {
  private intentSeparators = [' and ', ' also ', ' plus ', ' as well as ', ' additionally '];

  detectMultipleIntents(text: string): { hasMultiple: boolean; intents: string[] } {
    const textLower = text.toLowerCase();
    
    // Check for separators
    for (const separator of this.intentSeparators) {
      if (textLower.includes(separator)) {
        const parts = textLower.split(separator).map(p => p.trim());
        if (parts.length > 1) {
          return { hasMultiple: true, intents: parts };
        }
      }
    }

    // Check for numbered items
    const numberedPattern = /\d+\.\s*([^\.]+)/g;
    const matches = Array.from(text.matchAll(numberedPattern));
    if (matches.length > 1) {
      return {
        hasMultiple: true,
        intents: matches.map(m => m[1].trim())
      };
    }

    return { hasMultiple: false, intents: [text] };
  }

  processMultiple(intents: string[]): Array<{ intent: string; priority: number }> {
    return intents.map((intent, index) => ({
      intent,
      priority: intents.length - index // First intent has highest priority
    }));
  }
}

// ============================================
// ITEM 13.10: Fallback Strategies
// When uncertain, provide general answer + ask for specifics
// ============================================
export class FallbackStrategies {
  generateFallback(query: string, confidence: number, alternatives: string[]): string {
    if (confidence > 0.5) {
      // High confidence but not perfect
      return `I believe you're asking about ${query}. ${alternatives.length > 0 ? `If that's not right, you might mean: ${alternatives.join(', ')}.` : ''}`;
    }

    if (confidence > 0.3) {
      // Medium confidence
      return `I'm not entirely sure, but I think you might be asking about ${query}. Could you provide more details?`;
    }

    // Low confidence
    if (alternatives.length > 0) {
      return `I'm uncertain about your request. Are you looking for:\n${alternatives.map((alt, i) => `${i + 1}. ${alt}`).join('\n')}\n\nPlease clarify which one you need.`;
    }

    return `I'm having trouble understanding your request. Could you rephrase it or provide more context?`;
  }

  generatePartialAnswer(query: string, partialKnowledge: string): string {
    return `I can provide some information about ${query}: ${partialKnowledge}\n\nWould you like me to elaborate on any specific aspect?`;
  }

  generateClarificationRequest(query: string, missingInfo: string[]): string {
    if (missingInfo.length === 0) {
      return "Could you provide more details about what you need?";
    }

    return `To help you better, I need to know:\n${missingInfo.map((info, i) => `${i + 1}. ${info}`).join('\n')}`;
  }
}

// ============================================
// Export all ambiguity resolution systems
// ============================================
export const AmbiguityResolutionSystems = {
  ConfidenceThresholds,
  OptionPresenter,
  ProgressiveRefiner,
  IntentPredictor,
  ContextualDisambiguator,
  ExplicitImplicitDetector,
  AssumptionSurfacer,
  MultiIntentHandler,
  FallbackStrategies,
};
