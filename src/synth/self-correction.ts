// Self-Correction - Items 18.1-18.10
// Mid-generation pivoting when going wrong

import { Utils } from './utils';

// ============================================
// ITEM 18.1: Streaming Self-Evaluation
// Evaluate each sentence as generated
// ============================================
export class StreamingSelfEvaluator {
  private evaluationHistory: Array<{ sentence: string; score: number; timestamp: number }> = [];
  private qualityThreshold = 0.7;

  evaluate(sentence: string): { score: number; issues: string[]; passed: boolean } {
    const issues: string[] = [];
    let score = 1.0;

    // Check length
    if (sentence.length < 10) {
      issues.push('Too short');
      score -= 0.3;
    }

    // Check for incomplete sentences
    if (!/[.!?]$/.test(sentence.trim())) {
      issues.push('Incomplete sentence');
      score -= 0.2;
    }

    // Check for repetition
    const words = sentence.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    if (uniqueWords.size < words.length * 0.5) {
      issues.push('Repetitive');
      score -= 0.3;
    }

    // Check for filler words
    const fillers = ['um', 'uh', 'like', 'basically', 'actually'];
    if (fillers.some(f => sentence.toLowerCase().includes(f))) {
      issues.push('Contains filler words');
      score -= 0.2;
    }

    score = Math.max(0, score);
    const passed = score >= this.qualityThreshold;

    this.evaluationHistory.push({
      sentence,
      score,
      timestamp: Date.now()
    });

    return { score, issues, passed };
  }

  getAverageQuality(): number {
    if (this.evaluationHistory.length === 0) return 0;
    const sum = this.evaluationHistory.reduce((acc, e) => acc + e.score, 0);
    return sum / this.evaluationHistory.length;
  }

  setThreshold(threshold: number) {
    this.qualityThreshold = Math.max(0, Math.min(1, threshold));
  }

  clear() {
    this.evaluationHistory = [];
  }
}

// ============================================
// ITEM 18.2: Confidence Monitoring
// Track confidence during generation
// ============================================
export class ConfidenceMonitor {
  private confidenceHistory: Array<{ context: string; confidence: number; timestamp: number }> = [];
  private dropThreshold = 0.2; // Alert if confidence drops by 20%

  record(context: string, confidence: number) {
    this.confidenceHistory.push({
      context,
      confidence,
      timestamp: Date.now()
    });

    // Keep only last 50
    if (this.confidenceHistory.length > 50) {
      this.confidenceHistory = this.confidenceHistory.slice(-50);
    }
  }

  detectDrop(): { detected: boolean; drop: number; context?: string } {
    if (this.confidenceHistory.length < 2) {
      return { detected: false, drop: 0 };
    }

    const recent = this.confidenceHistory.slice(-2);
    const prev = recent[0].confidence;
    const curr = recent[1].confidence;
    const drop = prev - curr;

    if (drop > this.dropThreshold) {
      return {
        detected: true,
        drop,
        context: recent[1].context
      };
    }

    return { detected: false, drop };
  }

  getTrend(): 'improving' | 'declining' | 'stable' {
    if (this.confidenceHistory.length < 3) return 'stable';

    const recent = this.confidenceHistory.slice(-3);
    const trend = recent[2].confidence - recent[0].confidence;

    if (trend > 0.1) return 'improving';
    if (trend < -0.1) return 'declining';
    return 'stable';
  }

  setDropThreshold(threshold: number) {
    this.dropThreshold = Math.max(0, Math.min(1, threshold));
  }

  clear() {
    this.confidenceHistory = [];
  }
}

// ============================================
// ITEM 18.3: Direction Validation
// Check if response is heading in right direction
// ============================================
export class DirectionValidator {
  private originalQuery: string = '';
  private checkpoints: Array<{ text: string; aligned: boolean; timestamp: number }> = [];

  setQuery(query: string) {
    this.originalQuery = query;
    this.checkpoints = [];
  }

  validate(currentText: string): { aligned: boolean; score: number; suggestions: string[] } {
    if (!this.originalQuery) {
      return { aligned: true, score: 1.0, suggestions: [] };
    }

    const queryKeywords = Utils.extractKeywords(this.originalQuery);
    const textKeywords = Utils.extractKeywords(currentText);
    
    const overlap = queryKeywords.filter(kw => textKeywords.includes(kw)).length;
    const score = queryKeywords.length > 0 ? overlap / queryKeywords.length : 0;
    
    const aligned = score > 0.3;
    const suggestions: string[] = [];

    if (!aligned) {
      const missing = queryKeywords.filter(kw => !textKeywords.includes(kw));
      if (missing.length > 0) {
        suggestions.push(`Consider addressing: ${missing.join(', ')}`);
      }
    }

    this.checkpoints.push({
      text: currentText,
      aligned,
      timestamp: Date.now()
    });

    return { aligned, score, suggestions };
  }

  getAlignmentHistory(): Array<{ aligned: boolean; score: number }> {
    return this.checkpoints.map(c => ({
      aligned: c.aligned,
      score: Utils.extractKeywords(this.originalQuery).filter(kw => 
        Utils.extractKeywords(c.text).includes(kw)
      ).length / Math.max(1, Utils.extractKeywords(this.originalQuery).length)
    }));
  }

  clear() {
    this.originalQuery = '';
    this.checkpoints = [];
  }
}

// ============================================
// ITEM 18.4: Coherence Checking
// Ensure internal consistency
// ============================================
export class CoherenceChecker {
  private statements: string[] = [];

  addStatement(statement: string) {
    this.statements.push(statement);
  }

  checkCoherence(): { coherent: boolean; contradictions: string[] } {
    const contradictions: string[] = [];

    // Check for direct contradictions
    for (let i = 0; i < this.statements.length; i++) {
      for (let j = i + 1; j < this.statements.length; j++) {
        if (this.areContradictory(this.statements[i], this.statements[j])) {
          contradictions.push(`"${this.statements[i]}" contradicts "${this.statements[j]}"`);
        }
      }
    }

    return {
      coherent: contradictions.length === 0,
      contradictions
    };
  }

  private areContradictory(s1: string, s2: string): boolean {
    const s1Lower = s1.toLowerCase();
    const s2Lower = s2.toLowerCase();

    // Check for opposite assertions
    const opposites = [
      ['is', 'is not'],
      ['are', 'are not'],
      ['can', 'cannot'],
      ['will', 'will not'],
      ['should', 'should not'],
    ];

    for (const [pos, neg] of opposites) {
      if ((s1Lower.includes(pos) && s2Lower.includes(neg)) ||
          (s1Lower.includes(neg) && s2Lower.includes(pos))) {
        // Check if they're about the same subject
        const words1 = Utils.extractKeywords(s1);
        const words2 = Utils.extractKeywords(s2);
        const overlap = words1.filter(w => words2.includes(w)).length;
        if (overlap >= 2) return true;
      }
    }

    return false;
  }

  clear() {
    this.statements = [];
  }
}

// ============================================
// ITEM 18.5: Relevance Scoring
// Score each part for relevance to question
// ============================================
export class RelevanceScorer {
  score(text: string, query: string): { score: number; relevant: boolean; keywords: string[] } {
    const queryKeywords = Utils.extractKeywords(query);
    const textKeywords = Utils.extractKeywords(text);
    
    const matchedKeywords = queryKeywords.filter(kw => textKeywords.includes(kw));
    const score = queryKeywords.length > 0 ? matchedKeywords.length / queryKeywords.length : 0;
    
    return {
      score,
      relevant: score > 0.3,
      keywords: matchedKeywords
    };
  }

  filterRelevant(texts: string[], query: string, threshold: number = 0.3): string[] {
    return texts.filter(text => {
      const { score } = this.score(text, query);
      return score >= threshold;
    });
  }

  rankByRelevance(texts: string[], query: string): Array<{ text: string; score: number }> {
    return texts
      .map(text => ({ text, score: this.score(text, query).score }))
      .sort((a, b) => b.score - a.score);
  }
}

// ============================================
// ITEM 18.6: Audience Adaptation
// Monitor if response matches audience level
// ============================================
export class AudienceAdapter {
  private detectedLevel: string = 'intermediate';

  detectLevel(text: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const textLower = text.toLowerCase();
    
    const beginnerMarkers = ['what is', 'how do i', 'basic', 'simple', 'explain'];
    const advancedMarkers = ['architecture', 'optimize', 'scale', 'distributed', 'complex'];
    const expertMarkers = ['internals', 'implementation', 'low-level', 'cutting-edge'];

    const beginnerCount = beginnerMarkers.filter(m => textLower.includes(m)).length;
    const advancedCount = advancedMarkers.filter(m => textLower.includes(m)).length;
    const expertCount = expertMarkers.filter(m => textLower.includes(m)).length;

    if (expertCount > advancedCount && expertCount > beginnerCount) {
      this.detectedLevel = 'expert';
      return 'expert';
    }
    if (advancedCount > beginnerCount) {
      this.detectedLevel = 'advanced';
      return 'advanced';
    }
    if (beginnerCount > 0) {
      this.detectedLevel = 'beginner';
      return 'beginner';
    }

    this.detectedLevel = 'intermediate';
    return 'intermediate';
  }

  adapt(content: string, targetLevel: string): string {
    if (targetLevel === this.detectedLevel) return content;

    // Simplify for beginners
    if (targetLevel === 'beginner' && this.detectedLevel !== 'beginner') {
      return `Let me explain this simply: ${content}\n\nFeel free to ask if you need more clarification!`;
    }

    // Add depth for advanced
    if (targetLevel === 'advanced' && this.detectedLevel === 'beginner') {
      return `${content}\n\nHere are some advanced considerations to keep in mind.`;
    }

    return content;
  }

  getDetectedLevel(): string {
    return this.detectedLevel;
  }
}

// ============================================
// ITEM 18.7: Complexity Adjustment
// Detect too complex/simple, dynamic scaling
// ============================================
export class ComplexityAdjuster {
  analyze(text: string): { complexity: number; tooComplex: boolean; tooSimple: boolean } {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Calculate average words per sentence
    const avgWordsPerSentence = words.length / Math.max(1, sentences.length);
    
    // Calculate average word length
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / Math.max(1, words.length);
    
    // Count technical terms (words with hyphens, camelCase, or all caps)
    const technicalTerms = words.filter(w => 
      w.includes('-') || 
      /[a-z][A-Z]/.test(w) || 
      (w === w.toUpperCase() && w.length > 2)
    ).length;

    // Calculate complexity score (0-1)
    const sentenceComplexity = Math.min(1, avgWordsPerSentence / 30);
    const wordComplexity = Math.min(1, avgWordLength / 10);
    const technicalDensity = Math.min(1, technicalTerms / Math.max(1, words.length) * 5);
    
    const complexity = (sentenceComplexity + wordComplexity + technicalDensity) / 3;

    return {
      complexity,
      tooComplex: complexity > 0.7,
      tooSimple: complexity < 0.3
    };
  }

  adjust(text: string, targetComplexity: number): string {
    const { complexity } = this.analyze(text);
    
    if (Math.abs(complexity - targetComplexity) < 0.1) {
      return text; // Already at target
    }

    if (complexity > targetComplexity) {
      // Simplify
      return this.simplify(text);
    } else {
      // Add complexity
      return this.addComplexity(text);
    }
  }

  private simplify(text: string): string {
    // Break long sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    const simplified = sentences.map(s => {
      if (s.length > 100) {
        // Break at conjunctions
        return s.replace(/,\s*(and|or|but|which|that)\s+/gi, '. $1 ');
      }
      return s;
    });
    return simplified.join(' ');
  }

  private addComplexity(text: string): string {
    // Add technical details
    return `${text}\n\nThis involves several technical considerations that are worth exploring in depth.`;
  }
}

// ============================================
// ITEM 18.8: Tone Calibration
// Monitor tone during generation
// ============================================
export class ToneCalibrator {
  private detectedTone: string = 'neutral';

  detectTone(text: string): 'formal' | 'informal' | 'neutral' {
    const textLower = text.toLowerCase();
    
    const formalMarkers = ['please', 'kindly', 'would', 'shall', 'therefore', 'furthermore'];
    const informalMarkers = ['gonna', 'wanna', 'gotta', 'yeah', 'cool', 'awesome', 'lol'];
    
    const formalCount = formalMarkers.filter(m => textLower.includes(m)).length;
    const informalCount = informalMarkers.filter(m => textLower.includes(m)).length;

    if (formalCount > informalCount + 1) {
      this.detectedTone = 'formal';
      return 'formal';
    }
    if (informalCount > formalCount + 1) {
      this.detectedTone = 'informal';
      return 'informal';
    }

    this.detectedTone = 'neutral';
    return 'neutral';
  }

  calibrate(text: string, targetTone: string): string {
    if (targetTone === this.detectedTone) return text;

    if (targetTone === 'formal' && this.detectedTone !== 'formal') {
      return text
        .replace(/\bgonna\b/gi, 'going to')
        .replace(/\bwanna\b/gi, 'want to')
        .replace(/\bgotta\b/gi, 'have to')
        .replace(/\byeah\b/gi, 'yes')
        .replace(/\bcool\b/gi, 'excellent');
    }

    if (targetTone === 'informal' && this.detectedTone !== 'informal') {
      return text
        .replace(/\btherefore\b/gi, 'so')
        .replace(/\bfurthermore\b/gi, 'also')
        .replace(/\bkindly\b/gi, 'please');
    }

    return text;
  }

  getDetectedTone(): string {
    return this.detectedTone;
  }
}

// ============================================
// ITEM 18.9: Progress Tracking
// Track progress toward answering question
// ============================================
export class ProgressTracker {
  private originalQuery: string = '';
  private coveredTopics: Set<string> = new Set();
  private requiredTopics: string[] = [];

  setQuery(query: string) {
    this.originalQuery = query;
    this.coveredTopics = new Set();
    this.requiredTopics = Utils.extractKeywords(query);
  }

  updateProgress(text: string) {
    const textKeywords = Utils.extractKeywords(text);
    textKeywords.forEach(kw => {
      if (this.requiredTopics.includes(kw)) {
        this.coveredTopics.add(kw);
      }
    });
  }

  getProgress(): { covered: number; total: number; percentage: number; missing: string[] } {
    const total = this.requiredTopics.length;
    const covered = this.coveredTopics.size;
    const percentage = total > 0 ? (covered / total) * 100 : 0;
    const missing = this.requiredTopics.filter(t => !this.coveredTopics.has(t));

    return { covered, total, percentage, missing };
  }

  isComplete(threshold: number = 80): boolean {
    const { percentage } = this.getProgress();
    return percentage >= threshold;
  }

  getSuggestions(): string[] {
    const { missing } = this.getProgress();
    if (missing.length === 0) return [];
    return [`Consider addressing: ${missing.join(', ')}`];
  }

  clear() {
    this.originalQuery = '';
    this.coveredTopics = new Set();
    this.requiredTopics = [];
  }
}

// ============================================
// ITEM 18.10: Backtracking Mechanism
// Ability to "undo" and try different approach
// ============================================
export class BacktrackingMechanism {
  private history: Array<{ approach: string; result: string; score: number; timestamp: number }> = [];
  private currentApproach: string = '';

  tryApproach(approach: string, result: string, score: number) {
    this.history.push({
      approach,
      result,
      score,
      timestamp: Date.now()
    });
    this.currentApproach = approach;

    // Keep only last 10
    if (this.history.length > 10) {
      this.history = this.history.slice(-10);
    }
  }

  backtrack(): { approach: string; result: string; score: number } | null {
    if (this.history.length < 2) return null;

    // Remove current approach
    this.history.pop();
    
    // Get previous approach
    const previous = this.history[this.history.length - 1];
    this.currentApproach = previous.approach;
    
    return previous;
  }

  getBestApproach(): { approach: string; result: string; score: number } | null {
    if (this.history.length === 0) return null;
    
    return this.history.reduce((best, current) => 
      current.score > best.score ? current : best
    );
  }

  getCurrentApproach(): string {
    return this.currentApproach;
  }

  getHistory(): Array<{ approach: string; score: number }> {
    return this.history.map(h => ({ approach: h.approach, score: h.score }));
  }

  clear() {
    this.history = [];
    this.currentApproach = '';
  }
}

// ============================================
// Export all self-correction systems
// ============================================
export const SelfCorrectionSystems = {
  StreamingSelfEvaluator,
  ConfidenceMonitor,
  DirectionValidator,
  CoherenceChecker,
  RelevanceScorer,
  AudienceAdapter,
  ComplexityAdjuster,
  ToneCalibrator,
  ProgressTracker,
  BacktrackingMechanism,
};
