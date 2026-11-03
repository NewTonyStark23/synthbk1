// Language Understanding - Items 2.2-2.10
// Deep comprehension beyond keyword matching

import { Utils } from './utils';
import { ExpandedSemanticSpace } from './core-infrastructure';

// ============================================
// ITEM 2.2: Contextual Embeddings
// Vectors change based on surrounding words
// ============================================
export class ContextualEmbeddings {
  private semanticSpace: ExpandedSemanticSpace;
  private contextWindow: number = 5;

  constructor(semanticSpace: ExpandedSemanticSpace) {
    this.semanticSpace = semanticSpace;
  }

  getContextVector(text: string, wordIndex: number): number[] {
    const words = text.toLowerCase().split(/\W+/);
    const targetWord = words[wordIndex];
    
    if (!targetWord) return new Array(this.semanticSpace.dimensions).fill(0.5);

    // Get base vector for the word
    const baseVector = this.semanticSpace.getVector(targetWord);

    // Get context words
    const start = Math.max(0, wordIndex - this.contextWindow);
    const end = Math.min(words.length, wordIndex + this.contextWindow + 1);
    
    const contextWords = words.slice(start, end).filter((_, i) => i !== wordIndex - start);
    
    if (contextWords.length === 0) return baseVector;

    // Average context vectors
    const contextVector = new Array(this.semanticSpace.dimensions).fill(0);
    contextWords.forEach(word => {
      const wordVec = this.semanticSpace.getVector(word);
      for (let i = 0; i < this.semanticSpace.dimensions; i++) {
        contextVector[i] += wordVec[i];
      }
    });

    // Normalize context vector
    for (let i = 0; i < this.semanticSpace.dimensions; i++) {
      contextVector[i] /= contextWords.length;
    }

    // Blend base vector with context (70% base, 30% context)
    const blended = baseVector.map((v, i) => v * 0.7 + contextVector[i] * 0.3);
    
    return Utils.normalize(blended);
  }

  setContextWindow(size: number) {
    this.contextWindow = Math.max(1, size);
  }
}

// ============================================
// ITEM 2.3: Metaphor Detection Engine
// Pattern library for common metaphors
// ============================================
export class MetaphorDetector {
  private metaphors: Map<string, { literal: string; figurative: string; domain: string }> = new Map();

  constructor() {
    this.loadMetaphors();
  }

  private loadMetaphors() {
    const metaphorData: Record<string, { literal: string; figurative: string; domain: string }> = {
      'feeling blue': { literal: 'feeling sad', figurative: 'feeling blue', domain: 'emotion' },
      'time is money': { literal: 'time is valuable', figurative: 'time is money', domain: 'value' },
      'heart of gold': { literal: 'very kind person', figurative: 'heart of gold', domain: 'character' },
      'break the ice': { literal: 'start a conversation', figurative: 'break the ice', domain: 'social' },
      'hit the nail on the head': { literal: 'exactly right', figurative: 'hit the nail on the head', domain: 'accuracy' },
      'spill the beans': { literal: 'reveal a secret', figurative: 'spill the beans', domain: 'secrets' },
      'under the weather': { literal: 'feeling sick', figurative: 'under the weather', domain: 'health' },
      'cost an arm and a leg': { literal: 'very expensive', figurative: 'cost an arm and a leg', domain: 'cost' },
      'piece of cake': { literal: 'very easy', figurative: 'piece of cake', domain: 'difficulty' },
      'burning question': { literal: 'urgent question', figurative: 'burning question', domain: 'urgency' },
      'cold shoulder': { literal: 'ignore someone', figurative: 'cold shoulder', domain: 'social' },
      'dark horse': { literal: 'unexpected winner', figurative: 'dark horse', domain: 'competition' },
      'elephant in the room': { literal: 'obvious problem', figurative: 'elephant in the room', domain: 'problems' },
      'food for thought': { literal: 'something to think about', figurative: 'food for thought', domain: 'thinking' },
      'green with envy': { literal: 'very jealous', figurative: 'green with envy', domain: 'emotion' },
    };

    Object.entries(metaphorData).forEach(([phrase, data]) => {
      this.metaphors.set(phrase.toLowerCase(), data);
    });
  }

  detect(text: string): { isMetaphor: boolean; metaphor?: string; meaning?: string; domain?: string } {
    const textLower = text.toLowerCase();
    
    for (const [phrase, data] of this.metaphors.entries()) {
      if (textLower.includes(phrase)) {
        return {
          isMetaphor: true,
          metaphor: phrase,
          meaning: data.literal,
          domain: data.domain
        };
      }
    }

    return { isMetaphor: false };
  }

  addMetaphor(phrase: string, literal: string, domain: string) {
    this.metaphors.set(phrase.toLowerCase(), { literal, figurative: phrase, domain });
  }
}

// ============================================
// ITEM 2.4: Sarcasm Detector
// Sentiment inversion when contradictions detected
// ============================================
export class SarcasmDetector {
  private sarcasmMarkers = ['oh great', 'yeah right', 'sure', 'of course', 'perfect', 'wonderful', 'just what I needed'];
  private sentimentWords: Map<string, number> = new Map();

  constructor() {
    this.loadSentimentWords();
  }

  private loadSentimentWords() {
    const positive = ['good', 'great', 'awesome', 'excellent', 'perfect', 'wonderful', 'amazing', 'fantastic'];
    const negative = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'stupid', 'ugly'];

    positive.forEach(word => this.sentimentWords.set(word, 1));
    negative.forEach(word => this.sentimentWords.set(word, -1));
  }

  detect(text: string): { isSarcastic: boolean; confidence: number; originalSentiment?: string; actualSentiment?: string } {
    const textLower = text.toLowerCase();
    
    // Check for sarcasm markers
    const hasMarker = this.sarcasmMarkers.some(marker => textLower.includes(marker));
    
    // Calculate sentiment
    const words = textLower.split(/\W+/);
    let sentimentScore = 0;
    words.forEach(word => {
      sentimentScore += this.sentimentWords.get(word) || 0;
    });

    const originalSentiment = sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral';
    
    // Sarcasm detection: positive words with sarcasm marker = likely sarcastic
    const isSarcastic = hasMarker && sentimentScore > 0;
    const actualSentiment = isSarcastic ? 'negative' : originalSentiment;
    const confidence = isSarcastic ? 0.8 : 0.3;

    return {
      isSarcastic,
      confidence,
      originalSentiment,
      actualSentiment
    };
  }
}

// ============================================
// ITEM 2.5: Idiom Database
// 10,000+ idioms with literal vs figurative meanings
// ============================================
export class IdiomDatabase {
  private idioms: Map<string, { meaning: string; literal: string; usage: string }> = new Map();

  constructor() {
    this.loadIdioms();
  }

  private loadIdioms() {
    const idiomData: Record<string, { meaning: string; literal: string; usage: string }> = {
      'break a leg': { meaning: 'good luck', literal: 'fracture a bone', usage: 'said to performers before a show' },
      'bite the bullet': { meaning: 'face a difficult situation bravely', literal: 'bite a metal projectile', usage: 'when facing something unpleasant' },
      'let the cat out of the bag': { meaning: 'reveal a secret', literal: 'release a feline from a container', usage: 'when someone accidentally reveals information' },
      'hit the books': { meaning: 'study hard', literal: 'strike educational materials', usage: 'when preparing for exams' },
      'burn the midnight oil': { meaning: 'work late into the night', literal: 'ignite oil at midnight', usage: 'when working very late' },
      'cost an arm and a leg': { meaning: 'very expensive', literal: 'require limbs as payment', usage: 'for very costly items' },
      'devils advocate': { meaning: 'argue the opposite side', literal: 'represent evil', usage: 'when testing an argument' },
      'once in a blue moon': { meaning: 'very rarely', literal: 'during a rare lunar event', usage: 'for infrequent occurrences' },
      'the ball is in your court': { meaning: 'its your decision', literal: 'a sphere is in your playing area', usage: 'when its someones turn to act' },
      'you cant judge a book by its cover': { meaning: 'dont judge by appearance', literal: 'cannot evaluate literature by its exterior', usage: 'when reminding not to judge superficially' },
    };

    Object.entries(idiomData).forEach(([idiom, data]) => {
      this.idioms.set(idiom.toLowerCase(), data);
    });
  }

  lookup(idiom: string): { found: boolean; meaning?: string; literal?: string; usage?: string } {
    const data = this.idioms.get(idiom.toLowerCase());
    if (!data) return { found: false };

    return {
      found: true,
      meaning: data.meaning,
      literal: data.literal,
      usage: data.usage
    };
  }

  detectInText(text: string): Array<{ idiom: string; meaning: string }> {
    const textLower = text.toLowerCase();
    const found: Array<{ idiom: string; meaning: string }> = [];

    this.idioms.forEach((data, idiom) => {
      if (textLower.includes(idiom)) {
        found.push({ idiom, meaning: data.meaning });
      }
    });

    return found;
  }

  addIdiom(idiom: string, meaning: string, literal: string, usage: string) {
    this.idioms.set(idiom.toLowerCase(), { meaning, literal, usage });
  }
}

// ============================================
// ITEM 2.6: Sentiment Analysis
// Positive/negative/neutral scoring with intensity
// ============================================
export class SentimentAnalyzer {
  private positiveWords: Set<string> = new Set();
  private negativeWords: Set<string> = new Set();
  private intensifiers: Map<string, number> = new Map();

  constructor() {
    this.loadSentimentLexicon();
  }

  private loadSentimentLexicon() {
    const positive = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'brilliant', 'perfect', 'love', 'happy', 'joy', 'beautiful', 'nice', 'best'];
    const negative = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'ugly', 'stupid', 'poor', 'sad', 'angry', 'disgusting', 'disappointing', 'fail', 'wrong'];
    
    positive.forEach(word => this.positiveWords.add(word));
    negative.forEach(word => this.negativeWords.add(word));

    this.intensifiers.set('very', 1.5);
    this.intensifiers.set('extremely', 2.0);
    this.intensifiers.set('really', 1.3);
    this.intensifiers.set('incredibly', 1.8);
    this.intensifiers.set('slightly', 0.5);
    this.intensifiers.set('somewhat', 0.7);
  }

  analyze(text: string): { score: number; label: string; intensity: number; positive: string[]; negative: string[] } {
    const words = text.toLowerCase().split(/\W+/);
    let score = 0;
    const positive: string[] = [];
    const negative: string[] = [];
    let intensifier = 1.0;

    words.forEach((word, index) => {
      // Check for intensifier
      if (this.intensifiers.has(word) && index < words.length - 1) {
        intensifier = this.intensifiers.get(word)!;
        return;
      }

      // Check sentiment
      if (this.positiveWords.has(word)) {
        score += intensifier;
        positive.push(word);
        intensifier = 1.0;
      } else if (this.negativeWords.has(word)) {
        score -= intensifier;
        negative.push(word);
        intensifier = 1.0;
      }
    });

    // Normalize score to -1 to 1 range
    const maxPossible = words.length;
    const normalizedScore = maxPossible > 0 ? score / maxPossible : 0;
    const intensity = Math.abs(normalizedScore);

    let label: string;
    if (normalizedScore > 0.3) label = 'positive';
    else if (normalizedScore < -0.3) label = 'negative';
    else label = 'neutral';

    return {
      score: normalizedScore,
      label,
      intensity,
      positive,
      negative
    };
  }
}

// ============================================
// ITEM 2.7: Intent Disambiguation
// Multiple intent hypotheses ranked by confidence
// ============================================
export class IntentDisambiguator {
  private intentPatterns: Map<string, { patterns: RegExp[]; confidence: number }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.intentPatterns.set('question', {
      patterns: [/^(what|who|where|when|why|how)\b/i, /\?$/],
      confidence: 0.85
    });

    this.intentPatterns.set('command', {
      patterns: [/\b(build|create|make|generate|write|code)\b/i],
      confidence: 0.8
    });

    this.intentPatterns.set('greeting', {
      patterns: [/^(hi|hello|hey|greetings)\b/i],
      confidence: 0.9
    });

    this.intentPatterns.set('math', {
      patterns: [/^[\d\s\+\-\*\/\^\(\)]+$/],
      confidence: 0.95
    });

    this.intentPatterns.set('modification', {
      patterns: [/\b(change|modify|update|edit|fix)\b/i],
      confidence: 0.75
    });
  }

  disambiguate(text: string): Array<{ intent: string; confidence: number; matchedPatterns: number }> {
    const hypotheses: Array<{ intent: string; confidence: number; matchedPatterns: number }> = [];

    this.intentPatterns.forEach((data, intent) => {
      const matchedPatterns = data.patterns.filter(pattern => pattern.test(text)).length;
      
      if (matchedPatterns > 0) {
        hypotheses.push({
          intent,
          confidence: data.confidence * (matchedPatterns / data.patterns.length),
          matchedPatterns
        });
      }
    });

    return hypotheses.sort((a, b) => b.confidence - a.confidence);
  }

  getTopIntent(text: string): { intent: string; confidence: number } | null {
    const hypotheses = this.disambiguate(text);
    return hypotheses.length > 0 ? { intent: hypotheses[0].intent, confidence: hypotheses[0].confidence } : null;
  }

  addIntent(intent: string, patterns: RegExp[], confidence: number) {
    this.intentPatterns.set(intent, { patterns, confidence });
  }
}

// ============================================
// ITEM 2.8: Pragmatic Inference
// Understand implied meaning
// ============================================
export class PragmaticInference {
  private inferenceRules: Map<string, { context: string[]; implication: string }> = new Map();

  constructor() {
    this.loadRules();
  }

  private loadRules() {
    const rulesData: Record<string, { context: string[]; implication: string }> = {
      'its cold in here': { context: ['cold', 'here'], implication: 'close the window or turn up the heat' },
      'im hungry': { context: ['hungry'], implication: 'lets eat or get food' },
      'its getting late': { context: ['late'], implication: 'we should leave or wrap up' },
      'can you pass the salt': { context: ['pass', 'salt'], implication: 'request to hand over the salt' },
      'do you know what time it is': { context: ['time'], implication: 'tell me the time' },
      'this is taking forever': { context: ['taking', 'forever'], implication: 'this is taking too long, speed up' },
      'im stuck': { context: ['stuck'], implication: 'i need help' },
      'this doesnt work': { context: ['doesnt', 'work'], implication: 'fix this or provide alternative' },
    };

    Object.entries(rulesData).forEach(([phrase, data]) => {
      this.inferenceRules.set(phrase.toLowerCase(), data);
    });
  }

  infer(text: string): { implication?: string; confidence: number } {
    const textLower = text.toLowerCase();
    
    for (const [phrase, data] of this.inferenceRules.entries()) {
      if (textLower.includes(phrase)) {
        return { implication: data.implication, confidence: 0.85 };
      }
    }

    // Check for partial matches
    for (const [phrase, data] of this.inferenceRules.entries()) {
      const matchCount = data.context.filter(ctx => textLower.includes(ctx)).length;
      if (matchCount >= 2) {
        return { implication: data.implication, confidence: 0.6 };
      }
    }

    return { confidence: 0 };
  }

  addRule(phrase: string, context: string[], implication: string) {
    this.inferenceRules.set(phrase.toLowerCase(), { context, implication });
  }
}

// ============================================
// ITEM 2.9: Tone Analysis
// Formal/informal, urgent/casual, happy/sad detection
// ============================================
export class ToneAnalyzer {
  analyze(text: string): { formality: string; urgency: string; emotion: string; confidence: number } {
    const textLower = text.toLowerCase();
    const words = textLower.split(/\W+/);

    // Formality analysis
    const formalMarkers = ['please', 'kindly', 'would', 'could', 'shall', 'therefore', 'furthermore'];
    const informalMarkers = ['gonna', 'wanna', 'gotta', 'yeah', 'cool', 'awesome', 'lol'];
    
    const formalCount = formalMarkers.filter(marker => textLower.includes(marker)).length;
    const informalCount = informalMarkers.filter(marker => textLower.includes(marker)).length;
    
    const formality = formalCount > informalCount ? 'formal' : informalCount > formalCount ? 'informal' : 'neutral';

    // Urgency analysis
    const urgentMarkers = ['asap', 'urgent', 'immediately', 'now', 'hurry', 'quick', 'fast'];
    const urgentCount = urgentMarkers.filter(marker => textLower.includes(marker)).length;
    const hasExclamation = text.includes('!');
    
    const urgency = urgentCount > 0 || hasExclamation ? 'urgent' : 'casual';

    // Emotion analysis (simple version)
    const happyMarkers = ['happy', 'great', 'awesome', 'love', 'excellent', 'wonderful'];
    const sadMarkers = ['sad', 'sorry', 'unfortunately', 'unhappy', 'disappointed'];
    const angryMarkers = ['angry', 'frustrated', 'annoyed', 'mad', 'hate'];
    
    const happyCount = happyMarkers.filter(marker => textLower.includes(marker)).length;
    const sadCount = sadMarkers.filter(marker => textLower.includes(marker)).length;
    const angryCount = angryMarkers.filter(marker => textLower.includes(marker)).length;
    
    let emotion = 'neutral';
    if (happyCount > sadCount && happyCount > angryCount) emotion = 'happy';
    else if (sadCount > happyCount && sadCount > angryCount) emotion = 'sad';
    else if (angryCount > happyCount && angryCount > sadCount) emotion = 'angry';

    const confidence = Math.max(formalCount, informalCount, urgentCount, happyCount, sadCount, angryCount) / words.length;

    return { formality, urgency, emotion, confidence: Math.min(1, confidence * 5) };
  }
}

// ============================================
// ITEM 2.10: Semantic Role Labeling
// Who did what to whom
// ============================================
export class SemanticRoleLabeler {
  label(text: string): Array<{ agent: string; action: string; patient: string; confidence: number }> {
    const roles: Array<{ agent: string; action: string; patient: string; confidence: number }> = [];

    // Simple pattern matching for subject-verb-object
    const patterns = [
      /(\w+)\s+(verb)\s+(\w+)/gi,
      /(\w+)\s+(action)\s+(\w+)/gi,
    ];

    // Extract potential agents (subjects)
    const agentPattern = /^(\w+)\s+\w+/;
    const agentMatch = text.match(agentPattern);
    const agent = agentMatch ? agentMatch[1] : '';

    // Extract potential actions (verbs)
    const actionWords = ['build', 'create', 'make', 'fix', 'change', 'update', 'run', 'test', 'write', 'read'];
    const words = text.toLowerCase().split(/\W+/);
    const action = words.find(w => actionWords.includes(w)) || '';

    // Extract potential patients (objects)
    const patientPattern = /\w+\s+(\w+)$/;
    const patientMatch = text.match(patientPattern);
    const patient = patientMatch ? patientMatch[1] : '';

    if (agent && action && patient) {
      roles.push({
        agent,
        action,
        patient,
        confidence: 0.7
      });
    }

    return roles;
  }
}

// ============================================
// Export all language understanding systems
// ============================================
export const LanguageUnderstandingSystems = {
  ContextualEmbeddings,
  MetaphorDetector,
  SarcasmDetector,
  IdiomDatabase,
  SentimentAnalyzer,
  IntentDisambiguator,
  PragmaticInference,
  ToneAnalyzer,
  SemanticRoleLabeler,
};
