// Context Awareness System - Neural-Inspired Implementation
// Enables conversation history tracking, context window management, and reference to previous questions

import { SynapticNetwork, SynapticNetworkImpl } from './deep-reasoning-neural';

// ============================================
// Context Window Network
// ============================================

interface ContextNode {
  id: string;
  content: string;
  timestamp: number;
  importance: number;
  connections: string[];  // IDs of related context nodes
  embedding: number[];    // Semantic embedding for similarity
}

export class ContextAwarenessNetwork {
  private contextWindow: ContextNode[] = [];
  private maxWindowSize: number = 100;  // Max context nodes to keep
  private relevanceNetwork: SynapticNetwork;
  private temporalNetwork: SynapticNetwork;
  
  constructor() {
    this.relevanceNetwork = new SynapticNetworkImpl();
    this.temporalNetwork = new SynapticNetworkImpl();
    this.initializeNetworks();
  }
  
  private initializeNetworks(): void {
    // Relevance network: connects related concepts
    this.relevanceNetwork.addNeuron('question', [{ target: 'answer', weight: 0.9 }]);
    this.relevanceNetwork.addNeuron('answer', [{ target: 'followup', weight: 0.7 }]);
    this.relevanceNetwork.addNeuron('topic', [{ target: 'subtopic', weight: 0.8 }]);
    this.relevanceNetwork.addNeuron('entity', [{ target: 'reference', weight: 0.85 }]);
    
    // Temporal network: tracks conversation flow
    this.temporalNetwork.addNeuron('recent', [{ target: 'current', weight: 0.95 }]);
    this.temporalNetwork.addNeuron('previous', [{ target: 'recent', weight: 0.8 }]);
    this.temporalNetwork.addNeuron('old', [{ target: 'previous', weight: 0.6 }]);
  }
  
  addContext(content: string, type: 'question' | 'answer' | 'system' = 'question'): void {
    const node: ContextNode = {
      id: `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      timestamp: Date.now(),
      importance: this.calculateImportance(content, type),
      connections: [],
      embedding: this.generateEmbedding(content)
    };
    
    // Connect to recent context
    if (this.contextWindow.length > 0) {
      const recentNode = this.contextWindow[this.contextWindow.length - 1];
      node.connections.push(recentNode.id);
      recentNode.connections.push(node.id);
      
      // Find semantically similar past contexts
      const similar = this.findSimilarContexts(node.embedding, 3);
      node.connections.push(...similar.map(s => s.id));
    }
    
    this.contextWindow.push(node);
    
    // Maintain window size
    if (this.contextWindow.length > this.maxWindowSize) {
      this.contextWindow = this.contextWindow.slice(-this.maxWindowSize);
    }
  }
  
  private calculateImportance(content: string, type: string): number {
    let importance = 0.5;
    
    // Questions are more important
    if (type === 'question') importance += 0.2;
    
    // Longer content is more important
    if (content.length > 100) importance += 0.1;
    if (content.length > 500) importance += 0.1;
    
    // Contains entities (names, numbers, etc.)
    if (/\b[A-Z][a-z]+\b/.test(content)) importance += 0.1;
    if (/\d+/.test(content)) importance += 0.1;
    
    return Math.min(1.0, importance);
  }
  
  private generateEmbedding(content: string): number[] {
    // Simple semantic embedding based on word frequencies
    const words = content.toLowerCase().split(/\s+/);
    const embedding = new Array(64).fill(0);
    
    words.forEach((word, idx) => {
      const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      embedding[hash % 64] += 1;
    });
    
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }
  
  private findSimilarContexts(embedding: number[], count: number): ContextNode[] {
    const similarities = this.contextWindow.map(node => ({
      node,
      similarity: this.cosineSimilarity(embedding, node.embedding)
    }));
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, count)
      .map(s => s.node);
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
  
  getContextSummary(): string {
    if (this.contextWindow.length === 0) {
      return 'No conversation context yet.';
    }
    
    const recentQuestions = this.contextWindow
      .filter(node => node.content.includes('?'))
      .slice(-3);
    
    const topics = this.extractTopics();
    
    let summary = '**Conversation Context:**\n\n';
    summary += `Total exchanges: ${this.contextWindow.length}\n`;
    summary += `Active topics: ${topics.join(', ')}\n\n`;
    
    if (recentQuestions.length > 0) {
      summary += '**Recent Questions:**\n';
      recentQuestions.forEach((q, i) => {
        summary += `${i + 1}. ${q.content.substring(0, 100)}...\n`;
      });
    }
    
    return summary;
  }
  
  private extractTopics(): string[] {
    const topics = new Set<string>();
    
    this.contextWindow.slice(-10).forEach(node => {
      const words = node.content.toLowerCase().split(/\s+/);
      const keywords = words.filter(w => w.length > 4);
      keywords.slice(0, 2).forEach(kw => topics.add(kw));
    });
    
    return Array.from(topics).slice(0, 5);
  }
  
  referencePreviousQuestion(query: string): ContextNode | null {
    const queryEmbedding = this.generateEmbedding(query);
    const similar = this.findSimilarContexts(queryEmbedding, 1);
    
    return similar.length > 0 ? similar[0] : null;
  }
  
  getConversationFlow(): string {
    if (this.contextWindow.length < 2) {
      return 'Conversation just started.';
    }
    
    const flow = this.contextWindow.slice(-5).map((node, i) => {
      const type = node.content.includes('?') ? 'Question' : 'Answer';
      return `${i + 1}. [${type}] ${node.content.substring(0, 80)}...`;
    });
    
    return '**Conversation Flow:**\n\n' + flow.join('\n');
  }
  
  clearContext(): void {
    this.contextWindow = [];
  }
}

// ============================================
// Reference Resolution System
// ============================================

export class ReferenceResolver {
  private contextNetwork: ContextAwarenessNetwork;
  private entityMap: Map<string, string> = new Map();
  
  constructor(contextNetwork: ContextAwarenessNetwork) {
    this.contextNetwork = contextNetwork;
  }
  
  resolveReference(text: string): string {
    // Check for pronouns and references
    const references = [
      { pattern: /\bit\b/gi, resolution: this.resolveIt.bind(this) },
      { pattern: /\bthis\b/gi, resolution: this.resolveThis.bind(this) },
      { pattern: /\bthat\b/gi, resolution: this.resolveThat.bind(this) },
      { pattern: /\bthey\b/gi, resolution: this.resolveThey.bind(this) },
      { pattern: /\bthe (previous|last|earlier) (question|topic|one)\b/gi, resolution: this.resolvePrevious.bind(this) }
    ];
    
    let resolved = text;
    
    references.forEach(ref => {
      resolved = resolved.replace(ref.pattern, (match) => {
        const resolution = ref.resolution(match);
        return resolution || match;
      });
    });
    
    return resolved;
  }
  
  private resolveIt(match: string): string | null {
    const context = this.contextNetwork.getContextSummary();
    // Find most recent entity or topic
    return 'the previously mentioned topic';
  }
  
  private resolveThis(match: string): string | null {
    return 'the current topic we\'re discussing';
  }
  
  private resolveThat(match: string): string | null {
    const previous = this.contextNetwork.referencePreviousQuestion('');
    return previous ? previous.content.substring(0, 50) : null;
  }
  
  private resolveThey(match: string): string | null {
    return 'the people/entities we were discussing';
  }
  
  private resolvePrevious(match: string): string | null {
    const previous = this.contextNetwork.referencePreviousQuestion('');
    return previous ? previous.content : null;
  }
  
  addEntity(name: string, description: string): void {
    this.entityMap.set(name.toLowerCase(), description);
  }
  
  getEntity(name: string): string | undefined {
    return this.entityMap.get(name.toLowerCase());
  }
}

// ============================================
// Context-Aware Response Generator
// ============================================

export class ContextAwareResponder {
  private contextNetwork: ContextAwarenessNetwork;
  private referenceResolver: ReferenceResolver;
  
  constructor() {
    this.contextNetwork = new ContextAwarenessNetwork();
    this.referenceResolver = new ReferenceResolver(this.contextNetwork);
  }
  
  processWith(input: string): { resolvedInput: string; context: string } {
    // Add to context
    this.contextNetwork.addContext(input, 'question');
    
    // Resolve references
    const resolved = this.referenceResolver.resolveReference(input);
    
    // Get context summary
    const context = this.contextNetwork.getContextSummary();
    
    return { resolvedInput: resolved, context };
  }
  
  addResponse(response: string): void {
    this.contextNetwork.addContext(response, 'answer');
  }
  
  getContext(): string {
    return this.contextNetwork.getContextSummary();
  }
  
  getFlow(): string {
    return this.contextNetwork.getConversationFlow();
  }
}
