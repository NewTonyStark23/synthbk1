// Enhanced Context Awareness System - Advanced Features
// Long-term memory consolidation, contextual learning, sophisticated reference resolution

import { SynapticNetwork, SynapticNetworkImpl } from './deep-reasoning-neural';

// ============================================
// Long-Term Memory Consolidation
// ============================================

interface MemoryTrace {
  id: string;
  content: string;
  timestamp: number;
  importance: number;
  accessCount: number;
  lastAccessed: number;
  relatedMemories: string[];
  semanticEmbedding: number[];
  consolidationLevel: 'working' | 'short-term' | 'long-term' | 'forgotten';
}

export class LongTermMemoryConsolidation {
  private memoryTraces: Map<string, MemoryTrace> = new Map();
  private consolidationNetwork: SynapticNetwork;
  private maxWorkingMemory: number = 20;
  private maxShortTermMemory: number = 100;
  
  constructor() {
    this.consolidationNetwork = new SynapticNetworkImpl();
    this.initializeConsolidationRules();
  }
  
  private initializeConsolidationRules(): void {
    // Consolidation triggers
    this.consolidationNetwork.addNeuron('high_importance', [{ target: 'long_term', weight: 0.9 }]);
    this.consolidationNetwork.addNeuron('frequent_access', [{ target: 'long_term', weight: 0.8 }]);
    this.consolidationNetwork.addNeuron('emotional_content', [{ target: 'long_term', weight: 0.85 }]);
    this.consolidationNetwork.addNeuron('novel_information', [{ target: 'short_term', weight: 0.7 }]);
  }
  
  addMemory(content: string, importance: number = 0.5): string {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const trace: MemoryTrace = {
      id,
      content,
      timestamp: Date.now(),
      importance,
      accessCount: 0,
      lastAccessed: Date.now(),
      relatedMemories: [],
      semanticEmbedding: this.generateSemanticEmbedding(content),
      consolidationLevel: 'working'
    };
    
    this.memoryTraces.set(id, trace);
    this.consolidateMemories();
    
    return id;
  }
  
  private generateSemanticEmbedding(content: string): number[] {
    // Advanced semantic embedding using word frequencies and context
    const words = content.toLowerCase().split(/\s+/);
    const embedding = new Array(128).fill(0);
    
    words.forEach((word, idx) => {
      // Hash-based embedding with position weighting
      const hash = word.split('').reduce((acc, char, i) => {
        return acc + char.charCodeAt(0) * Math.pow(31, i);
      }, 0);
      
      const position = hash % 128;
      embedding[position] += (1 / (idx + 1)); // Position decay
    });
    
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }
  
  private consolidateMemories(): void {
    const traces = Array.from(this.memoryTraces.values());
    
    // Move working memory to short-term if over limit
    const workingMemories = traces.filter(t => t.consolidationLevel === 'working');
    if (workingMemories.length > this.maxWorkingMemory) {
      const toConsolidate = workingMemories
        .sort((a, b) => b.importance - a.importance)
        .slice(this.maxWorkingMemory);
      
      toConsolidate.forEach(trace => {
        trace.consolidationLevel = 'short-term';
      });
    }
    
    // Move short-term to long-term based on consolidation rules
    const shortTermMemories = traces.filter(t => t.consolidationLevel === 'short-term');
    shortTermMemories.forEach(trace => {
      const consolidationScore = this.calculateConsolidationScore(trace);
      
      if (consolidationScore > 0.7) {
        trace.consolidationLevel = 'long-term';
      } else if (shortTermMemories.length > this.maxShortTermMemory) {
        // Remove least important memories
        trace.consolidationLevel = 'forgotten';
      }
    });
    
    // Remove forgotten memories
    traces.forEach(trace => {
      if (trace.consolidationLevel === 'forgotten') {
        this.memoryTraces.delete(trace.id);
      }
    });
    
    // Link related memories
    this.linkRelatedMemories();
  }
  
  private calculateConsolidationScore(trace: MemoryTrace): number {
    let score = 0;
    
    // Importance factor
    score += trace.importance * 0.4;
    
    // Access frequency factor
    const accessFactor = Math.min(1, trace.accessCount / 10);
    score += accessFactor * 0.3;
    
    // Recency factor (exponential decay)
    const age = (Date.now() - trace.timestamp) / (1000 * 60 * 60); // hours
    const recencyFactor = Math.exp(-age / 24); // 24-hour half-life
    score += recencyFactor * 0.2;
    
    // Emotional content factor
    const emotionalWords = ['important', 'critical', 'urgent', 'amazing', 'terrible', 'love', 'hate'];
    const hasEmotion = emotionalWords.some(word => 
      trace.content.toLowerCase().includes(word)
    );
    score += hasEmotion ? 0.1 : 0;
    
    return Math.min(1, score);
  }
  
  private linkRelatedMemories(): void {
    const traces = Array.from(this.memoryTraces.values());
    
    traces.forEach(trace1 => {
      traces.forEach(trace2 => {
        if (trace1.id !== trace2.id) {
          const similarity = this.cosineSimilarity(
            trace1.semanticEmbedding,
            trace2.semanticEmbedding
          );
          
          if (similarity > 0.7) {
            if (!trace1.relatedMemories.includes(trace2.id)) {
              trace1.relatedMemories.push(trace2.id);
            }
          }
        }
      });
    });
  }
  
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
  }
  
  accessMemory(id: string): MemoryTrace | null {
    const trace = this.memoryTraces.get(id);
    if (trace) {
      trace.accessCount++;
      trace.lastAccessed = Date.now();
      this.consolidateMemories();
    }
    return trace || null;
  }
  
  searchMemories(query: string, limit: number = 5): MemoryTrace[] {
    const queryEmbedding = this.generateSemanticEmbedding(query);
    
    const traces = Array.from(this.memoryTraces.values());
    const scored = traces.map(trace => ({
      trace,
      similarity: this.cosineSimilarity(queryEmbedding, trace.semanticEmbedding)
    }));
    
    return scored
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(s => s.trace);
  }
  
  getMemoryStats(): { working: number; shortTerm: number; longTerm: number; total: number } {
    const traces = Array.from(this.memoryTraces.values());
    
    return {
      working: traces.filter(t => t.consolidationLevel === 'working').length,
      shortTerm: traces.filter(t => t.consolidationLevel === 'short-term').length,
      longTerm: traces.filter(t => t.consolidationLevel === 'long-term').length,
      total: traces.length
    };
  }
  
  getMemoryReport(): string {
    const stats = this.getMemoryStats();
    
    let report = '**Long-Term Memory Consolidation Report**\n\n';
    report += `**Memory Distribution:**\n`;
    report += `- Working Memory: ${stats.working} traces\n`;
    report += `- Short-Term Memory: ${stats.shortTerm} traces\n`;
    report += `- Long-Term Memory: ${stats.longTerm} traces\n`;
    report += `- Total: ${stats.total} traces\n\n`;
    
    // Show most important long-term memories
    const longTermMemories = Array.from(this.memoryTraces.values())
      .filter(t => t.consolidationLevel === 'long-term')
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5);
    
    if (longTermMemories.length > 0) {
      report += '**Most Important Long-Term Memories:**\n';
      longTermMemories.forEach((mem, i) => {
        report += `${i + 1}. ${mem.content.substring(0, 80)}... (importance: ${(mem.importance * 100).toFixed(0)}%)\n`;
      });
    }
    
    return report;
  }
}

// ============================================
// Contextual Learning System
// ============================================

interface LearningPattern {
  pattern: string;
  frequency: number;
  lastSeen: number;
  context: string[];
  confidence: number;
}

export class ContextualLearningSystem {
  private patterns: Map<string, LearningPattern> = new Map();
  private learningNetwork: SynapticNetwork;
  
  constructor() {
    this.learningNetwork = new SynapticNetworkImpl();
    this.initializeLearningRules();
  }
  
  private initializeLearningRules(): void {
    this.learningNetwork.addNeuron('pattern_detected', [{ target: 'reinforce', weight: 0.8 }]);
    this.learningNetwork.addNeuron('reinforce', [{ target: 'strengthen', weight: 0.9 }]);
    this.learningNetwork.addNeuron('strengthen', [{ target: 'apply', weight: 0.7 }]);
  }
  
  observePattern(pattern: string, context: string[]): void {
    const key = pattern.toLowerCase();
    
    if (this.patterns.has(key)) {
      const existing = this.patterns.get(key)!;
      existing.frequency++;
      existing.lastSeen = Date.now();
      existing.context = [...new Set([...existing.context, ...context])];
      existing.confidence = Math.min(1, existing.confidence + 0.1);
    } else {
      this.patterns.set(key, {
        pattern,
        frequency: 1,
        lastSeen: Date.now(),
        context,
        confidence: 0.3
      });
    }
  }
  
  predictNextPattern(currentContext: string[]): string | null {
    const patterns = Array.from(this.patterns.values());
    
    // Find patterns that match current context
    const matching = patterns.filter(p => 
      p.context.some(ctx => currentContext.some(c => c.toLowerCase().includes(ctx.toLowerCase())))
    );
    
    if (matching.length === 0) return null;
    
    // Return highest confidence pattern
    return matching
      .sort((a, b) => b.confidence - a.confidence)[0]
      .pattern;
  }
  
  getLearnedPatterns(): LearningPattern[] {
    return Array.from(this.patterns.values())
      .sort((a, b) => b.confidence - a.confidence);
  }
  
  getLearningReport(): string {
    const patterns = this.getLearnedPatterns().slice(0, 10);
    
    let report = '**Contextual Learning Report**\n\n';
    report += `**Learned Patterns (${this.patterns.size} total):**\n\n`;
    
    patterns.forEach((p, i) => {
      report += `${i + 1}. **${p.pattern}**\n`;
      report += `   Frequency: ${p.frequency}\n`;
      report += `   Confidence: ${(p.confidence * 100).toFixed(0)}%\n`;
      report += `   Context: ${p.context.join(', ')}\n\n`;
    });
    
    return report;
  }
}

// ============================================
// Advanced Reference Resolution
// ============================================

interface ReferenceChain {
  pronoun: string;
  resolvedTo: string;
  confidence: number;
  context: string;
}

export class AdvancedReferenceResolver {
  private referenceChains: ReferenceChain[] = [];
  private resolutionNetwork: SynapticNetwork;
  
  constructor() {
    this.resolutionNetwork = new SynapticNetworkImpl();
    this.initializeResolutionRules();
  }
  
  private initializeResolutionRules(): void {
    // Reference resolution patterns
    this.resolutionNetwork.addNeuron('pronoun', [{ target: 'antecedent', weight: 0.9 }]);
    this.resolutionNetwork.addNeuron('antecedent', [{ target: 'context', weight: 0.8 }]);
    this.resolutionNetwork.addNeuron('context', [{ target: 'resolution', weight: 0.85 }]);
  }
  
  resolveReference(text: string, conversationHistory: string[]): {
    resolved: string;
    confidence: number;
    reasoning: string;
  } {
    // Extract pronouns
    const pronouns = text.match(/\b(it|this|that|they|these|those|he|she|we)\b/gi);
    
    if (!pronouns || pronouns.length === 0) {
      return { resolved: text, confidence: 1.0, reasoning: 'No pronouns detected' };
    }
    
    let resolved = text;
    let totalConfidence = 0;
    let reasoning = '';
    
    pronouns.forEach(pronoun => {
      const resolution = this.resolvePronoun(pronoun, conversationHistory);
      
      if (resolution) {
        resolved = resolved.replace(new RegExp(`\\b${pronoun}\\b`, 'gi'), resolution.resolved);
        totalConfidence += resolution.confidence;
        reasoning += resolution.reasoning + '\n';
        
        this.referenceChains.push({
          pronoun,
          resolvedTo: resolution.resolved,
          confidence: resolution.confidence,
          context: conversationHistory.slice(-3).join(' ')
        });
      }
    });
    
    const avgConfidence = pronouns.length > 0 ? totalConfidence / pronouns.length : 1.0;
    
    return {
      resolved,
      confidence: avgConfidence,
      reasoning: reasoning || 'Direct resolution'
    };
  }
  
  private resolvePronoun(pronoun: string, history: string[]): { resolved: string; confidence: number; reasoning: string } | null {
    const pronounLower = pronoun.toLowerCase();
    
    // Search history for potential antecedents
    const recentHistory = history.slice(-5);
    
    // Extract entities from history
    const entities = this.extractEntities(recentHistory.join(' '));
    
    if (entities.length === 0) return null;
    
    // Match pronoun to entity based on gender/number
    let bestMatch: string | null = null;
    let bestConfidence = 0;
    
    entities.forEach(entity => {
      const confidence = this.calculateMatchConfidence(pronounLower, entity);
      
      if (confidence > bestConfidence) {
        bestConfidence = confidence;
        bestMatch = entity;
      }
    });
    
    if (bestMatch && bestConfidence > 0.5) {
      return {
        resolved: bestMatch,
        confidence: bestConfidence,
        reasoning: `Resolved "${pronoun}" to "${bestMatch}" based on context matching`
      };
    }
    
    return null;
  }
  
  private extractEntities(text: string): string[] {
    const entities: string[] = [];
    
    // Extract noun phrases (simplified)
    const nounPatterns = [
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g, // Capitalized phrases
      /\b(the|a|an)\s+([a-z]+(?:\s+[a-z]+)*)\b/gi, // Noun phrases with articles
    ];
    
    nounPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const entity = match[match.length - 1].trim();
        if (entity.length > 2 && !['the', 'a', 'an'].includes(entity.toLowerCase())) {
          entities.push(entity);
        }
      }
    });
    
    return [...new Set(entities)]; // Remove duplicates
  }
  
  private calculateMatchConfidence(pronoun: string, entity: string): number {
    let confidence = 0.5; // Base confidence
    
    // Gender matching
    const malePronouns = ['he', 'him', 'his'];
    const femalePronouns = ['she', 'her', 'hers'];
    const neutralPronouns = ['it', 'its'];
    const pluralPronouns = ['they', 'them', 'their', 'these', 'those'];
    
    const entityLower = entity.toLowerCase();
    
    if (malePronouns.includes(pronoun)) {
      // Check for male indicators
      if (/\b(mr\.|sir|boy|man|he)\b/i.test(entity)) confidence += 0.3;
    } else if (femalePronouns.includes(pronoun)) {
      // Check for female indicators
      if (/\b(mrs\.|ms\.|miss|girl|woman|she)\b/i.test(entity)) confidence += 0.3;
    } else if (neutralPronouns.includes(pronoun)) {
      // Check for non-person indicators
      if (!/\b(mr\.|mrs\.|ms\.|sir|miss|boy|girl|man|woman)\b/i.test(entity)) confidence += 0.2;
    } else if (pluralPronouns.includes(pronoun)) {
      // Check for plural indicators
      if (entity.endsWith('s') || /\b(and|,)\b/.test(entity)) confidence += 0.3;
    }
    
    // Recency boost (more recent = higher confidence)
    confidence += 0.1;
    
    return Math.min(1, confidence);
  }
  
  getReferenceChains(): ReferenceChain[] {
    return this.referenceChains;
  }
  
  getResolutionReport(): string {
    const chains = this.referenceChains.slice(-10);
    
    let report = '**Reference Resolution Report**\n\n';
    report += `**Recent Resolutions (${this.referenceChains.length} total):**\n\n`;
    
    chains.forEach((chain, i) => {
      report += `${i + 1}. "${chain.pronoun}" → "${chain.resolvedTo}"\n`;
      report += `   Confidence: ${(chain.confidence * 100).toFixed(0)}%\n`;
      report += `   Context: ${chain.context.substring(0, 60)}...\n\n`;
    });
    
    return report;
  }
}

// ============================================
// Enhanced Context Awareness Integration
// ============================================

export class EnhancedContextAwareness {
  private longTermMemory: LongTermMemoryConsolidation;
  private contextualLearning: ContextualLearningSystem;
  private referenceResolver: AdvancedReferenceResolver;
  
  constructor() {
    this.longTermMemory = new LongTermMemoryConsolidation();
    this.contextualLearning = new ContextualLearningSystem();
    this.referenceResolver = new AdvancedReferenceResolver();
  }
  
  processWithContext(input: string, history: string[]): {
    resolvedInput: string;
    context: string;
    predictions: string[];
  } {
    // Add to long-term memory
    this.longTermMemory.addMemory(input, 0.7);
    
    // Observe patterns
    const context = history.slice(-3);
    this.contextualLearning.observePattern(input, context);
    
    // Resolve references
    const resolution = this.referenceResolver.resolveReference(input, history);
    
    // Predict next patterns
    const prediction = this.contextualLearning.predictNextPattern(context);
    const predictions = prediction ? [prediction] : [];
    
    // Generate context summary
    const memoryStats = this.longTermMemory.getMemoryStats();
    const learnedPatterns = this.contextualLearning.getLearnedPatterns().slice(0, 3);
    
    let contextSummary = '**Enhanced Context:**\n\n';
    contextSummary += `**Memory:** ${memoryStats.working} working, ${memoryStats.shortTerm} short-term, ${memoryStats.longTerm} long-term\n`;
    contextSummary += `**Learned Patterns:** ${learnedPatterns.length} active\n`;
    contextSummary += `**Reference Resolution:** ${resolution.confidence > 0.7 ? 'High confidence' : 'Low confidence'}\n`;
    
    return {
      resolvedInput: resolution.resolved,
      context: contextSummary,
      predictions
    };
  }
  
  getFullReport(): string {
    let report = '**Enhanced Context Awareness Report**\n\n';
    report += this.longTermMemory.getMemoryReport();
    report += '\n\n';
    report += this.contextualLearning.getLearningReport();
    report += '\n\n';
    report += this.referenceResolver.getResolutionReport();
    
    return report;
  }
}
