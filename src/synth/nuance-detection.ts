// Nuance Detection - Items 12.1-12.10
// Word sense disambiguation, context vectors, polysemy handling, domain detection, sentiment-context binding, temporal context, cultural context, pragmatic markers, collocation analysis, ambiguity resolution

// ============================================
// ITEM 12.1: Word Sense Disambiguation
// Different vectors for different meanings
// ============================================
export class WordSenseDisambiguation {
  private wordSenses: Map<string, Array<{ sense: string; definition: string; examples: string[]; vector: number[] }>> = new Map();

  constructor() {
    this.loadSenses();
  }

  private loadSenses() {
    // Bank
    this.wordSenses.set('bank', [
      {
        sense: 'financial institution',
        definition: 'A financial establishment for keeping money',
        examples: ['I need to go to the bank', 'The bank approved my loan'],
        vector: [0.9, 0.1, 0.2, 0.8, 0.3]
      },
      {
        sense: 'river edge',
        definition: 'The land alongside a river',
        examples: ['We sat on the bank of the river', 'The river bank was eroding'],
        vector: [0.1, 0.9, 0.8, 0.2, 0.3]
      }
    ]);

    // Bat
    this.wordSenses.set('bat', [
      {
        sense: 'sports equipment',
        definition: 'A club used in baseball or cricket',
        examples: ['He swung the bat', 'The bat hit the ball'],
        vector: [0.8, 0.2, 0.3, 0.7, 0.4]
      },
      {
        sense: 'nocturnal animal',
        definition: 'A flying mammal',
        examples: ['The bat flew out of the cave', 'Bats use echolocation'],
        vector: [0.2, 0.8, 0.4, 0.3, 0.7]
      }
    ]);

    // Run
    this.wordSenses.set('run', [
      {
        sense: 'move quickly',
        definition: 'To move at a speed faster than walking',
        examples: ['I run every morning', 'She ran to catch the bus'],
        vector: [0.7, 0.3, 0.5, 0.6, 0.2]
      },
      {
        sense: 'operate/manage',
        definition: 'To manage or operate something',
        examples: ['He runs a business', 'She runs the department'],
        vector: [0.3, 0.7, 0.6, 0.5, 0.3]
      },
      {
        sense: 'flow',
        definition: 'To flow like liquid',
        examples: ['The river runs through the valley', 'Water runs downhill'],
        vector: [0.4, 0.6, 0.8, 0.3, 0.5]
      }
    ]);
  }

  disambiguate(word: string, context: string): { sense: string; confidence: number } | null {
    const senses = this.wordSenses.get(word.toLowerCase());
    if (!senses || senses.length === 0) return null;

    const contextLower = context.toLowerCase();
    let bestSense = senses[0];
    let bestScore = 0;

    senses.forEach(sense => {
      let score = 0;
      
      // Check if context words appear in examples
      sense.examples.forEach(example => {
        const exampleWords = example.toLowerCase().split(/\s+/);
        const contextWords = contextLower.split(/\s+/);
        
        exampleWords.forEach(word => {
          if (contextWords.includes(word) && word.length > 3) {
            score += 1;
          }
        });
      });

      // Check definition words in context
      const defWords = sense.definition.toLowerCase().split(/\s+/);
      defWords.forEach(word => {
        if (contextLower.includes(word) && word.length > 3) {
          score += 0.5;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestSense = sense;
      }
    });

    const confidence = bestScore > 0 ? Math.min(1, bestScore / 3) : 0.3;
    return { sense: bestSense.sense, confidence };
  }

  getAllSenses(word: string): Array<{ sense: string; definition: string }> {
    const senses = this.wordSenses.get(word.toLowerCase());
    if (!senses) return [];
    return senses.map(s => ({ sense: s.sense, definition: s.definition }));
  }

  formatDisambiguation(word: string, result: { sense: string; confidence: number } | null): string {
    if (!result) return `No disambiguation available for "${word}"`;
    
    return `**Word:** ${word}\n**Detected Sense:** ${result.sense}\n**Confidence:** ${(result.confidence * 100).toFixed(0)}%`;
  }

  addWordSense(word: string, sense: string, definition: string, examples: string[], vector: number[]) {
    if (!this.wordSenses.has(word.toLowerCase())) {
      this.wordSenses.set(word.toLowerCase(), []);
    }
    this.wordSenses.get(word.toLowerCase())!.push({ sense, definition, examples, vector });
  }
}

// ============================================
// ITEM 12.2: Context Vectors
// Modify word vectors based on surrounding words
// ============================================
export class ContextVectors {
  private baseVectors: Map<string, number[]> = new Map();
  private contextWindow: number = 5;

  constructor() {
    this.loadBaseVectors();
  }

  private loadBaseVectors() {
    // Initialize with some base vectors
    const words = ['the', 'a', 'is', 'are', 'run', 'bank', 'bat', 'light', 'book', 'table'];
    words.forEach(word => {
      const vector = Array.from({ length: 10 }, () => Math.random());
      this.baseVectors.set(word, vector);
    });
  }

  getContextVector(text: string, targetWord: string): number[] {
    const words = text.toLowerCase().split(/\s+/);
    const targetIndex = words.indexOf(targetWord.toLowerCase());
    
    if (targetIndex === -1) {
      return this.baseVectors.get(targetWord.toLowerCase()) || Array(10).fill(0);
    }

    const baseVector = this.baseVectors.get(targetWord.toLowerCase()) || Array(10).fill(0.5);
    const contextWords = words.slice(
      Math.max(0, targetIndex - this.contextWindow),
      Math.min(words.length, targetIndex + this.contextWindow + 1)
    ).filter(w => w !== targetWord.toLowerCase());

    if (contextWords.length === 0) return baseVector;

    // Average context vectors
    const contextVector = Array(10).fill(0);
    contextWords.forEach(word => {
      const wordVector = this.baseVectors.get(word) || Array(10).fill(0.5);
      wordVector.forEach((val, idx) => {
        contextVector[idx] += val;
      });
    });

    contextVector.forEach((_, idx) => {
      contextVector[idx] /= contextWords.length;
    });

    // Blend base and context (70% base, 30% context)
    return baseVector.map((val, idx) => val * 0.7 + contextVector[idx] * 0.3);
  }

  similarity(vector1: number[], vector2: number[]): number {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      norm1 += vector1[i] * vector1[i];
      norm2 += vector2[i] * vector2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  setContextWindow(size: number) {
    this.contextWindow = Math.max(1, size);
  }

  addBaseVector(word: string, vector: number[]) {
    this.baseVectors.set(word.toLowerCase(), vector);
  }
}

// ============================================
// ITEM 12.3: Polysemy Handler
// Multiple meanings per word, select by context
// ============================================
export class PolysemyHandler {
  private polysemousWords: Map<string, Array<{ meaning: string; context: string[]; probability: number }>> = new Map();

  constructor() {
    this.loadPolysemousWords();
  }

  private loadPolysemousWords() {
    this.polysemousWords.set('head', [
      { meaning: 'body part', context: ['body', 'neck', 'face', 'hair'], probability: 0.4 },
      { meaning: 'leader', context: ['company', 'team', 'department', 'organization'], probability: 0.3 },
      { meaning: 'top/front', context: ['line', 'queue', 'table', 'page'], probability: 0.2 },
      { meaning: 'mind/intellect', context: ['think', 'know', 'understand', 'idea'], probability: 0.1 }
    ]);

    this.polysemousWords.set('light', [
      { meaning: 'illumination', context: ['bright', 'dark', 'lamp', 'sun'], probability: 0.5 },
      { meaning: 'not heavy', context: ['heavy', 'weight', 'carry', 'load'], probability: 0.3 },
      { meaning: 'pale color', context: ['color', 'dark', 'shade', 'hue'], probability: 0.2 }
    ]);

    this.polysemousWords.set('play', [
      { meaning: 'theater performance', context: ['theater', 'stage', 'actor', 'audience'], probability: 0.3 },
      { meaning: 'engage in activity', context: ['game', 'sport', 'fun', 'children'], probability: 0.4 },
      { meaning: 'perform music', context: ['music', 'instrument', 'band', 'song'], probability: 0.3 }
    ]);
  }

  resolve(word: string, context: string): { meaning: string; confidence: number } | null {
    const meanings = this.polysemousWords.get(word.toLowerCase());
    if (!meanings || meanings.length === 0) return null;

    const contextLower = context.toLowerCase();
    let bestMeaning = meanings[0];
    let bestScore = 0;

    meanings.forEach(meaning => {
      let score = meaning.probability; // Start with base probability
      
      // Boost score based on context matches
      meaning.context.forEach(ctxWord => {
        if (contextLower.includes(ctxWord)) {
          score += 0.3;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestMeaning = meaning;
      }
    });

    const confidence = Math.min(1, bestScore);
    return { meaning: bestMeaning.meaning, confidence };
  }

  getAllMeanings(word: string): Array<{ meaning: string; probability: number }> {
    const meanings = this.polysemousWords.get(word.toLowerCase());
    if (!meanings) return [];
    return meanings.map(m => ({ meaning: m.meaning, probability: m.probability }));
  }

  formatResolution(word: string, result: { meaning: string; confidence: number } | null): string {
    if (!result) return `No polysemy data for "${word}"`;
    
    return `**Word:** ${word}\n**Selected Meaning:** ${result.meaning}\n**Confidence:** ${(result.confidence * 100).toFixed(0)}%`;
  }

  addPolysemousWord(word: string, meanings: Array<{ meaning: string; context: string[]; probability: number }>) {
    this.polysemousWords.set(word.toLowerCase(), meanings);
  }
}

// ============================================
// ITEM 12.4: Domain Detection
// Technical vs casual vs formal contexts
// ============================================
export class DomainDetector {
  private domainIndicators: Map<string, { keywords: string[]; patterns: RegExp[] }> = new Map();

  constructor() {
    this.loadDomains();
  }

  private loadDomains() {
    this.domainIndicators.set('technical', {
      keywords: ['algorithm', 'function', 'variable', 'database', 'api', 'server', 'code', 'program', 'syntax', 'debug'],
      patterns: [/\b\w+\([^)]*\)/, /=>/, /const\s+\w+/, /function\s+\w+/]
    });

    this.domainIndicators.set('casual', {
      keywords: ['gonna', 'wanna', 'cool', 'awesome', 'yeah', 'stuff', 'things', 'like', 'maybe'],
      patterns: [/!+$/, /\.\.\.$/, /\b(hey|hi|yo)\b/i]
    });

    this.domainIndicators.set('formal', {
      keywords: ['furthermore', 'consequently', 'nevertheless', 'thus', 'hence', 'therefore', 'moreover'],
      patterns: [/^(Dear|To whom)/, /Sincerely,/, /Respectfully,/]
    });

    this.domainIndicators.set('academic', {
      keywords: ['hypothesis', 'methodology', 'analysis', 'research', 'study', 'findings', 'conclusion', 'abstract'],
      patterns: [/\[\d+\]/, /et al\./, /ibid\./]
    });

    this.domainIndicators.set('business', {
      keywords: ['revenue', 'profit', 'market', 'strategy', 'stakeholder', 'ROI', 'KPI', 'quarterly', 'fiscal'],
      patterns: [/\$\d+/, /\d+%/, /Q[1-4]/]
    });
  }

  detectDomain(text: string): { domain: string; confidence: number; indicators: string[] } {
    const textLower = text.toLowerCase();
    let bestDomain = 'general';
    let bestScore = 0;
    const indicators: string[] = [];

    this.domainIndicators.forEach((data, domain) => {
      let score = 0;
      const domainIndicators: string[] = [];

      // Check keywords
      data.keywords.forEach(keyword => {
        if (textLower.includes(keyword)) {
          score += 1;
          domainIndicators.push(`keyword: ${keyword}`);
        }
      });

      // Check patterns
      data.patterns.forEach(pattern => {
        if (pattern.test(text)) {
          score += 1.5;
          domainIndicators.push(`pattern: ${pattern}`);
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestDomain = domain;
        indicators.length = 0;
        indicators.push(...domainIndicators);
      }
    });

    const confidence = bestScore > 0 ? Math.min(1, bestScore / 5) : 0.2;
    return { domain: bestDomain, confidence, indicators };
  }

  formatDetection(text: string, result: { domain: string; confidence: number; indicators: string[] }): string {
    return `**Detected Domain:** ${result.domain}\n**Confidence:** ${(result.confidence * 100).toFixed(0)}%\n**Indicators:** ${result.indicators.join(', ')}`;
  }

  addDomain(domain: string, keywords: string[], patterns: RegExp[]) {
    this.domainIndicators.set(domain, { keywords, patterns });
  }
}

// ============================================
// ITEM 12.5: Sentiment-Context Binding
// "blue" + "feeling" = sad, "blue" + "sky" = color
// ============================================
export class SentimentContextBinding {
  private contextSentiments: Map<string, Map<string, { sentiment: string; intensity: number }>> = new Map();

  constructor() {
    this.loadBindings();
  }

  private loadBindings() {
    // Blue
    const blueContexts = new Map<string, { sentiment: string; intensity: number }>();
    blueContexts.set('feeling', { sentiment: 'sad', intensity: 0.8 });
    blueContexts.set('sky', { sentiment: 'neutral', intensity: 0.2 });
    blueContexts.set('ocean', { sentiment: 'calm', intensity: 0.6 });
    blueContexts.set('mood', { sentiment: 'sad', intensity: 0.9 });
    this.contextSentiments.set('blue', blueContexts);

    // Green
    const greenContexts = new Map<string, { sentiment: string; intensity: number }>();
    greenContexts.set('with envy', { sentiment: 'jealous', intensity: 0.9 });
    greenContexts.set('grass', { sentiment: 'neutral', intensity: 0.1 });
    greenContexts.set('thumb', { sentiment: 'skilled', intensity: 0.7 });
    greenContexts.set('light', { sentiment: 'go', intensity: 0.8 });
    this.contextSentiments.set('green', greenContexts);

    // Hot
    const hotContexts = new Map<string, { sentiment: string; intensity: number }>();
    hotContexts.set('temper', { sentiment: 'angry', intensity: 0.9 });
    hotContexts.set('weather', { sentiment: 'uncomfortable', intensity: 0.7 });
    hotContexts.set('topic', { sentiment: 'popular', intensity: 0.8 });
    hotContexts.set('sauce', { sentiment: 'spicy', intensity: 0.6 });
    this.contextSentiments.set('hot', hotContexts);
  }

  bind(word: string, context: string): { sentiment: string; intensity: number } | null {
    const contexts = this.contextSentiments.get(word.toLowerCase());
    if (!contexts) return null;

    const contextLower = context.toLowerCase();
    
    for (const [contextKey, data] of contexts.entries()) {
      if (contextLower.includes(contextKey)) {
        return data;
      }
    }

    return null;
  }

  formatBinding(word: string, context: string, result: { sentiment: string; intensity: number } | null): string {
    if (!result) return `No sentiment binding for "${word}" in this context`;
    
    return `**Word:** ${word}\n**Context:** "${context}"\n**Sentiment:** ${result.sentiment}\n**Intensity:** ${(result.intensity * 100).toFixed(0)}%`;
  }

  addBinding(word: string, context: string, sentiment: string, intensity: number) {
    if (!this.contextSentiments.has(word.toLowerCase())) {
      this.contextSentiments.set(word.toLowerCase(), new Map());
    }
    this.contextSentiments.get(word.toLowerCase())!.set(context, { sentiment, intensity });
  }
}

// ============================================
// ITEM 12.6: Temporal Context
// "Apple" (fruit) vs "Apple" (company) by era/topic
// ============================================
export class TemporalContext {
  private temporalSenses: Map<string, Array<{ sense: string; timePeriod: string; topic: string; indicators: string[] }>> = new Map();

  constructor() {
    this.loadTemporalSenses();
  }

  private loadTemporalSenses() {
    this.temporalSenses.set('apple', [
      { sense: 'fruit', timePeriod: 'any', topic: 'food', indicators: ['eat', 'fruit', 'tree', 'orchard'] },
      { sense: 'technology company', timePeriod: '1976-present', topic: 'tech', indicators: ['iPhone', 'Mac', 'Steve Jobs', 'iOS'] },
      { sense: 'record label', timePeriod: '1968-present', topic: 'music', indicators: ['Beatles', 'album', 'music'] }
    ]);

    this.temporalSenses.set('mouse', [
      { sense: 'animal', timePeriod: 'any', topic: 'biology', indicators: ['rodent', 'cheese', 'cat', 'squeak'] },
      { sense: 'computer device', timePeriod: '1964-present', topic: 'tech', indicators: ['click', 'cursor', 'computer', 'pointer'] }
    ]);

    this.temporalSenses.set('web', [
      { sense: 'spider structure', timePeriod: 'any', topic: 'nature', indicators: ['spider', 'silk', 'catch', 'insect'] },
      { sense: 'internet', timePeriod: '1990-present', topic: 'tech', indicators: ['site', 'page', 'browser', 'online'] }
    ]);
  }

  resolve(word: string, context: string, timePeriod?: string): { sense: string; confidence: number } | null {
    const senses = this.temporalSenses.get(word.toLowerCase());
    if (!senses || senses.length === 0) return null;

    const contextLower = context.toLowerCase();
    let bestSense = senses[0];
    let bestScore = 0;

    senses.forEach(sense => {
      let score = 0;

      // Check time period
      if (timePeriod && sense.timePeriod !== 'any') {
        const [start, end] = sense.timePeriod.split('-');
        const year = parseInt(timePeriod);
        if (year >= parseInt(start) && (end === 'present' || year <= parseInt(end))) {
          score += 0.5;
        }
      }

      // Check context indicators
      sense.indicators.forEach(indicator => {
        if (contextLower.includes(indicator.toLowerCase())) {
          score += 1;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestSense = sense;
      }
    });

    const confidence = bestScore > 0 ? Math.min(1, bestScore / 3) : 0.3;
    return { sense: bestSense.sense, confidence };
  }

  formatResolution(word: string, result: { sense: string; confidence: number } | null): string {
    if (!result) return `No temporal context data for "${word}"`;
    
    return `**Word:** ${word}\n**Detected Sense:** ${result.sense}\n**Confidence:** ${(result.confidence * 100).toFixed(0)}%`;
  }

  addTemporalSense(word: string, sense: string, timePeriod: string, topic: string, indicators: string[]) {
    if (!this.temporalSenses.has(word.toLowerCase())) {
      this.temporalSenses.set(word.toLowerCase(), []);
    }
    this.temporalSenses.get(word.toLowerCase())!.push({ sense, timePeriod, topic, indicators });
  }
}

// ============================================
// ITEM 12.7: Cultural Context
// Different meanings in different cultures
// ============================================
export class CulturalContext {
  private culturalMeanings: Map<string, Map<string, { meaning: string; context: string; appropriateness: string }>> = new Map();

  constructor() {
    this.loadCulturalMeanings();
  }

  private loadCulturalMeanings() {
    // Thumbs up
    const thumbsUp = new Map<string, { meaning: string; context: string; appropriateness: string }>();
    thumbsUp.set('western', { meaning: 'approval/good', context: 'casual', appropriateness: 'appropriate' });
    thumbsUp.set('middle-eastern', { meaning: 'offensive gesture', context: 'formal', appropriateness: 'inappropriate' });
    this.culturalMeanings.set('thumbs up', thumbsUp);

    // Eye contact
    const eyeContact = new Map<string, { meaning: string; context: string; appropriateness: string }>();
    eyeContact.set('western', { meaning: 'confidence/honesty', context: 'business', appropriateness: 'expected' });
    eyeContact.set('asian', { meaning: 'can be disrespectful to superiors', context: 'formal', appropriateness: 'context-dependent' });
    eyeContact.set('middle-eastern', { meaning: 'sign of respect', context: 'formal', appropriateness: 'expected' });
    this.culturalMeanings.set('eye contact', eyeContact);

    // Gift giving
    const giftGiving = new Map<string, { meaning: string; context: string; appropriateness: string }>();
    giftGiving.set('japanese', { meaning: 'show respect, wrap carefully', context: 'business', appropriateness: 'expected with proper etiquette' });
    giftGiving.set('chinese', { meaning: 'avoid clocks (sounds like death)', context: 'any', appropriateness: 'avoid certain items' });
    giftGiving.set('western', { meaning: 'thoughtful gesture', context: 'social', appropriateness: 'appropriate' });
    this.culturalMeanings.set('gift giving', giftGiving);
  }

  getCulturalMeaning(concept: string, culture: string): { meaning: string; context: string; appropriateness: string } | null {
    const meanings = this.culturalMeanings.get(concept.toLowerCase());
    if (!meanings) return null;
    return meanings.get(culture.toLowerCase()) || null;
  }

  compareCultures(concept: string, cultures: string[]): string {
    const meanings = this.culturalMeanings.get(concept.toLowerCase());
    if (!meanings) return `No cultural data for "${concept}"`;

    let comparison = `**Cultural Comparison: ${concept}**\n\n`;
    
    cultures.forEach(culture => {
      const meaning = meanings.get(culture.toLowerCase());
      if (meaning) {
        comparison += `**${culture}:**\n`;
        comparison += `- Meaning: ${meaning.meaning}\n`;
        comparison += `- Context: ${meaning.context}\n`;
        comparison += `- Appropriateness: ${meaning.appropriateness}\n\n`;
      }
    });

    return comparison;
  }

  addCulturalMeaning(concept: string, culture: string, meaning: string, context: string, appropriateness: string) {
    if (!this.culturalMeanings.has(concept.toLowerCase())) {
      this.culturalMeanings.set(concept.toLowerCase(), new Map());
    }
    this.culturalMeanings.get(concept.toLowerCase())!.set(culture.toLowerCase(), { meaning, context, appropriateness });
  }
}

// ============================================
// ITEM 12.8: Pragmatic Markers
// Punctuation, capitalization, emphasis change meaning
// ============================================
export class PragmaticMarkers {
  private markerPatterns: Map<string, { pattern: RegExp; effect: string; intensity: number }> = new Map();

  constructor() {
    this.loadMarkers();
  }

  private loadMarkers() {
    this.markerPatterns.set('exclamation', {
      pattern: /!+$/,
      effect: 'increased intensity/emotion',
      intensity: 0.3
    });

    this.markerPatterns.set('ellipsis', {
      pattern: /\.{3,}$/,
      effect: 'hesitation/trailing thought',
      intensity: 0.2
    });

    this.markerPatterns.set('question-exclamation', {
      pattern: /\?!|!\?/,
      effect: 'surprised question',
      intensity: 0.5
    });

    this.markerPatterns.set('all-caps', {
      pattern: /^[A-Z\s]+$/,
      effect: 'shouting/emphasis',
      intensity: 0.8
    });

    this.markerPatterns.set('quotes', {
      pattern: /^["'].*["']$/,
      effect: 'irony/sarcasm/special meaning',
      intensity: 0.4
    });

    this.markerPatterns.set('repeated-chars', {
      pattern: /(.)\1{2,}/,
      effect: 'emphasis/elongation',
      intensity: 0.3
    });
  }

  analyze(text: string): Array<{ marker: string; effect: string; intensity: number }> {
    const findings: Array<{ marker: string; effect: string; intensity: number }> = [];

    this.markerPatterns.forEach((data, marker) => {
      if (data.pattern.test(text)) {
        findings.push({
          marker,
          effect: data.effect,
          intensity: data.intensity
        });
      }
    });

    return findings;
  }

  formatAnalysis(text: string, findings: Array<{ marker: string; effect: string; intensity: number }>): string {
    if (findings.length === 0) return 'No pragmatic markers detected';

    let analysis = `**Pragmatic Analysis:**\n\n**Text:** "${text}"\n\n`;
    
    findings.forEach(f => {
      analysis += `- **${f.marker}:** ${f.effect} (intensity: ${(f.intensity * 100).toFixed(0)}%)\n`;
    });

    return analysis;
  }

  addMarker(name: string, pattern: RegExp, effect: string, intensity: number) {
    this.markerPatterns.set(name, { pattern, effect, intensity });
  }
}

// ============================================
// ITEM 12.9: Collocation Analysis
// Words that appear together change meaning
// ============================================
export class CollocationAnalysis {
  private collocations: Map<string, Map<string, { meaning: string; strength: number }>> = new Map();

  constructor() {
    this.loadCollocations();
  }

  private loadCollocations() {
    // Heavy
    const heavy = new Map<string, { meaning: string; strength: number }>();
    heavy.set('rain', { meaning: 'intense rainfall', strength: 0.9 });
    heavy.set('traffic', { meaning: 'congested roads', strength: 0.8 });
    heavy.set('smoker', { meaning: 'regular tobacco user', strength: 0.9 });
    heavy.set('metal', { meaning: 'dense metallic material', strength: 0.7 });
    this.collocations.set('heavy', heavy);

    // Fast
    const fast = new Map<string, { meaning: string; strength: number }>();
    fast.set('food', { meaning: 'quick-service restaurant', strength: 0.9 });
    fast.set('car', { meaning: 'high-speed vehicle', strength: 0.8 });
    fast.set('learner', { meaning: 'quick student', strength: 0.7 });
    fast.set('track', { meaning: 'sprinting surface', strength: 0.8 });
    this.collocations.set('fast', fast);

    // Break
    const brk = new Map<string, { meaning: string; strength: number }>();
    brk.set('record', { meaning: 'surpass previous best', strength: 0.9 });
    brk.set('news', { meaning: 'announce information', strength: 0.8 });
    brk.set('heart', { meaning: 'cause emotional pain', strength: 0.9 });
    brk.set('leg', { meaning: 'fracture bone', strength: 0.8 });
    this.collocations.set('break', brk);
  }

  analyze(word: string, context: string): { collocate: string; meaning: string; strength: number } | null {
    const collocations = this.collocations.get(word.toLowerCase());
    if (!collocations) return null;

    const contextLower = context.toLowerCase();
    
    for (const [collocate, data] of collocations.entries()) {
      if (contextLower.includes(collocate)) {
        return { collocate, meaning: data.meaning, strength: data.strength };
      }
    }

    return null;
  }

  getCollocations(word: string): Array<{ collocate: string; meaning: string; strength: number }> {
    const collocations = this.collocations.get(word.toLowerCase());
    if (!collocations) return [];
    
    return Array.from(collocations.entries()).map(([collocate, data]) => ({
      collocate,
      meaning: data.meaning,
      strength: data.strength
    }));
  }

  formatAnalysis(word: string, result: { collocate: string; meaning: string; strength: number } | null): string {
    if (!result) return `No collocation detected for "${word}" in this context`;
    
    return `**Word:** ${word}\n**Collocate:** ${result.collocate}\n**Meaning:** ${result.meaning}\n**Strength:** ${(result.strength * 100).toFixed(0)}%`;
  }

  addCollocation(word: string, collocate: string, meaning: string, strength: number) {
    if (!this.collocations.has(word.toLowerCase())) {
      this.collocations.set(word.toLowerCase(), new Map());
    }
    this.collocations.get(word.toLowerCase())!.set(collocate, { meaning, strength });
  }
}

// ============================================
// ITEM 12.10: Ambiguity Resolution
// Ask clarifying questions when multiple meanings possible
// ============================================
export class AmbiguityResolution {
  private ambiguousTerms: Map<string, Array<{ meaning: string; context: string[] }>> = new Map();

  constructor() {
    this.loadAmbiguousTerms();
  }

  private loadAmbiguousTerms() {
    this.ambiguousTerms.set('bank', [
      { meaning: 'financial institution', context: ['money', 'account', 'loan', 'deposit'] },
      { meaning: 'river edge', context: ['river', 'water', 'shore', 'erosion'] }
    ]);

    this.ambiguousTerms.set('bat', [
      { meaning: 'sports equipment', context: ['baseball', 'cricket', 'swing', 'hit'] },
      { meaning: 'nocturnal animal', context: ['cave', 'fly', 'nocturnal', 'echolocation'] }
    ]);

    this.ambiguousTerms.set('run', [
      { meaning: 'move quickly', context: ['fast', 'jog', 'sprint', 'race'] },
      { meaning: 'operate/manage', context: ['business', 'company', 'manage', 'direct'] },
      { meaning: 'flow', context: ['water', 'river', 'stream', 'flow'] }
    ]);
  }

  detectAmbiguity(word: string, context: string): { ambiguous: boolean; meanings: string[]; question: string } | null {
    const meanings = this.ambiguousTerms.get(word.toLowerCase());
    if (!meanings || meanings.length < 2) return null;

    const contextLower = context.toLowerCase();
    const matchingMeanings: string[] = [];

    meanings.forEach(meaning => {
      const hasContext = meaning.context.some(ctx => contextLower.includes(ctx));
      if (hasContext) {
        matchingMeanings.push(meaning.meaning);
      }
    });

    if (matchingMeanings.length > 1) {
      const question = `When you say "${word}", do you mean ${matchingMeanings.map(m => `"${m}"`).join(' or ')}?`;
      return { ambiguous: true, meanings: matchingMeanings, question };
    }

    return null;
  }

  generateClarification(word: string, context: string): string {
    const result = this.detectAmbiguity(word, context);
    if (!result) return `No ambiguity detected for "${word}"`;
    
    return `**Ambiguity Detected:**\n\n**Word:** ${word}\n**Possible Meanings:** ${result.meanings.join(', ')}\n\n**Clarification Question:** ${result.question}`;
  }

  addAmbiguousTerm(word: string, meanings: Array<{ meaning: string; context: string[] }>) {
    this.ambiguousTerms.set(word.toLowerCase(), meanings);
  }
}

// ============================================
// Export all nuance detection systems
// ============================================
export const NuanceDetectionSystems = {
  WordSenseDisambiguation,
  ContextVectors,
  PolysemyHandler,
  DomainDetector,
  SentimentContextBinding,
  TemporalContext,
  CulturalContext,
  PragmaticMarkers,
  CollocationAnalysis,
  AmbiguityResolution,
};
