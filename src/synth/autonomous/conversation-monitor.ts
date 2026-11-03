// Conversation Monitor - Tracks and analyzes conversations
// Part of Autonomous Learning System - Week 1 Foundation

import { logger } from './logging-system';

export interface Conversation {
  id: string;
  input: string;
  response: string;
  confidence: number;
  intent: string;
  topic: string;
  timestamp: Date;
  hasFollowUp: boolean;
  followUpInput?: string;
  isGeneric: boolean;
}

export class ConversationMonitor {
  private conversations: Conversation[] = [];
  private maxConversations: number = 10000;

  constructor() {
    logger.info('ConversationMonitor', 'Initialized');
  }

  /**
   * Record a new conversation
   */
  recordConversation(
    input: string,
    response: string,
    confidence: number,
    intent: string,
    topic: string = this.extractTopic(input)
  ): Conversation {
    const conversation: Conversation = {
      id: this.generateId(),
      input,
      response,
      confidence,
      intent,
      topic,
      timestamp: new Date(),
      hasFollowUp: false,
      isGeneric: this.isGenericResponse(response)
    };

    this.conversations.push(conversation);

    // Keep only recent conversations
    if (this.conversations.length > this.maxConversations) {
      this.conversations = this.conversations.slice(-this.maxConversations);
    }

    logger.debug('ConversationMonitor', `Recorded conversation: ${topic}`, { confidence, intent });

    return conversation;
  }

  /**
   * Record a follow-up to a conversation
   */
  recordFollowUp(conversationId: string, followUpInput: string): void {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.hasFollowUp = true;
      conversation.followUpInput = followUpInput;
      logger.debug('ConversationMonitor', `Recorded follow-up for conversation ${conversationId}`);
    }
  }

  /**
   * Get all conversations
   */
  getConversations(): Conversation[] {
    return [...this.conversations];
  }

  /**
   * Get recent conversations
   */
  getRecentConversations(count: number = 10): Conversation[] {
    return this.conversations.slice(-count);
  }

  /**
   * Get conversations by topic
   */
  getConversationsByTopic(topic: string): Conversation[] {
    return this.conversations.filter(c => c.topic === topic);
  }

  /**
   * Get conversations by intent
   */
  getConversationsByIntent(intent: string): Conversation[] {
    return this.conversations.filter(c => c.intent === intent);
  }

  /**
   * Get conversations with low confidence
   */
  getLowConfidenceConversations(threshold: number = 0.6): Conversation[] {
    return this.conversations.filter(c => c.confidence < threshold);
  }

  /**
   * Get conversations with follow-ups
   */
  getConversationsWithFollowUps(): Conversation[] {
    return this.conversations.filter(c => c.hasFollowUp);
  }

  /**
   * Extract topic from input
   */
  private extractTopic(input: string): string {
    // Simple topic extraction - can be enhanced with NLP
    const words = input.toLowerCase().split(/\s+/);
    const stopWords = new Set(['what', 'is', 'the', 'a', 'an', 'how', 'why', 'when', 'where', 'who', 'which', 'do', 'does', 'can', 'could', 'would', 'should', 'will', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from']);
    
    const keywords = words.filter(w => !stopWords.has(w) && w.length > 2);
    return keywords.slice(0, 3).join(' ') || 'general';
  }

  /**
   * Check if response is generic
   */
  private isGenericResponse(response: string): boolean {
    const genericPatterns = [
      /i'm not sure/i,
      /i don't know/i,
      /i don't have information/i,
      /could you provide more/i,
      /that's an interesting question/i,
      /i'd be happy to help/i,
      /let me know if/i
    ];

    return genericPatterns.some(pattern => pattern.test(response));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get conversation statistics
   */
  getStats(): {
    total: number;
    avgConfidence: number;
    genericCount: number;
    followUpCount: number;
    topics: Map<string, number>;
    intents: Map<string, number>;
  } {
    const topics = new Map<string, number>();
    const intents = new Map<string, number>();
    let totalConfidence = 0;
    let genericCount = 0;
    let followUpCount = 0;

    for (const conv of this.conversations) {
      // Count topics
      topics.set(conv.topic, (topics.get(conv.topic) || 0) + 1);
      
      // Count intents
      intents.set(conv.intent, (intents.get(conv.intent) || 0) + 1);
      
      // Sum confidence
      totalConfidence += conv.confidence;
      
      // Count generic
      if (conv.isGeneric) genericCount++;
      
      // Count follow-ups
      if (conv.hasFollowUp) followUpCount++;
    }

    return {
      total: this.conversations.length,
      avgConfidence: this.conversations.length > 0 ? totalConfidence / this.conversations.length : 0,
      genericCount,
      followUpCount,
      topics,
      intents
    };
  }

  /**
   * Clear all conversations
   */
  clear(): void {
    this.conversations = [];
    logger.info('ConversationMonitor', 'All conversations cleared');
  }

  /**
   * Generate conversation report
   */
  generateReport(): string {
    const stats = this.getStats();
    
    let report = '**Conversation Monitor Report**\n\n';
    report += `**Total Conversations:** ${stats.total}\n`;
    report += `**Average Confidence:** ${(stats.avgConfidence * 100).toFixed(1)}%\n`;
    report += `**Generic Responses:** ${stats.genericCount} (${((stats.genericCount / stats.total) * 100).toFixed(1)}%)\n`;
    report += `**Follow-ups:** ${stats.followUpCount} (${((stats.followUpCount / stats.total) * 100).toFixed(1)}%)\n\n`;
    
    // Top topics
    const topTopics = Array.from(stats.topics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    if (topTopics.length > 0) {
      report += '**Top 5 Topics:**\n';
      topTopics.forEach(([topic, count], i) => {
        report += `${i + 1}. ${topic}: ${count} conversations\n`;
      });
      report += '\n';
    }
    
    // Top intents
    const topIntents = Array.from(stats.intents.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    if (topIntents.length > 0) {
      report += '**Top 5 Intents:**\n';
      topIntents.forEach(([intent, count], i) => {
        report += `${i + 1}. ${intent}: ${count} conversations\n`;
      });
    }
    
    return report;
  }
}
