// Knowledge Gap Detector - Identifies topics where the system needs more knowledge
// Part of Autonomous Learning System - Week 1 Foundation

import { ConversationMonitor } from './conversation-monitor';
import { logger } from './logging-system';

export interface KnowledgeGap {
  topic: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: number;
  lastEncountered: Date;
  confidence: number;
  relatedQueries: string[];
}

export class KnowledgeGapDetector {
  private gaps: Map<string, KnowledgeGap> = new Map();
  private conversationMonitor: ConversationMonitor;
  
  // Configuration
  private readonly LOW_CONFIDENCE_THRESHOLD = 0.6;
  private readonly FREQUENCY_THRESHOLD = 3;
  private readonly SEVERITY_THRESHOLDS = {
    critical: 0.3,
    high: 0.5,
    medium: 0.7,
    low: 1.0
  };

  constructor(conversationMonitor: ConversationMonitor) {
    this.conversationMonitor = conversationMonitor;
    logger.info('KnowledgeGapDetector', 'Initialized');
  }

  /**
   * Detect knowledge gaps from conversation history
   */
  detectGaps(): KnowledgeGap[] {
    logger.debug('KnowledgeGapDetector', 'Detecting knowledge gaps');
    
    const conversations = this.conversationMonitor.getConversations();
    const topicStats = new Map<string, {
      count: number,
      avgConfidence: number,
      lastSeen: Date,
      queries: string[]
    }>();
    
    // Analyze conversations
    for (const conv of conversations) {
      const topic = conv.topic;
      if (!topic) continue;
      
      if (!topicStats.has(topic)) {
        topicStats.set(topic, {
          count: 0,
          avgConfidence: 0,
          lastSeen: conv.timestamp,
          queries: []
        });
      }
      
      const stats = topicStats.get(topic)!;
      stats.count++;
      stats.avgConfidence = (stats.avgConfidence * (stats.count - 1) + conv.confidence) / stats.count;
      stats.lastSeen = conv.timestamp;
      stats.queries.push(conv.input);
      
      // Keep only last 10 queries
      if (stats.queries.length > 10) {
        stats.queries.shift();
      }
    }
    
    // Identify gaps
    const detectedGaps: KnowledgeGap[] = [];
    
    topicStats.forEach((stats, topic) => {
      // Check if this is a gap
      const isGap = 
        stats.avgConfidence < this.LOW_CONFIDENCE_THRESHOLD ||
        stats.count >= this.FREQUENCY_THRESHOLD;
      
      if (isGap) {
        const severity = this.calculateSeverity(stats.avgConfidence, stats.count);
        
        const gap: KnowledgeGap = {
          topic,
          severity,
          frequency: stats.count,
          lastEncountered: stats.lastSeen,
          confidence: stats.avgConfidence,
          relatedQueries: stats.queries
        };
        
        detectedGaps.push(gap);
        this.gaps.set(topic, gap);
      }
    });
    
    // Sort by severity
    detectedGaps.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    
    logger.info('KnowledgeGapDetector', `Detected ${detectedGaps.length} knowledge gaps`);
    
    return detectedGaps;
  }

  /**
   * Calculate severity based on confidence and frequency
   */
  private calculateSeverity(confidence: number, frequency: number): KnowledgeGap['severity'] {
    const score = confidence * (1 / Math.min(frequency, 10));
    
    if (score < this.SEVERITY_THRESHOLDS.critical) return 'critical';
    if (score < this.SEVERITY_THRESHOLDS.high) return 'high';
    if (score < this.SEVERITY_THRESHOLDS.medium) return 'medium';
    return 'low';
  }

  /**
   * Get critical gaps
   */
  getCriticalGaps(): KnowledgeGap[] {
    return this.detectGaps().filter(g => g.severity === 'critical' || g.severity === 'high');
  }

  /**
   * Get all gaps
   */
  getAllGaps(): KnowledgeGap[] {
    return Array.from(this.gaps.values());
  }

  /**
   * Get gap by topic
   */
  getGap(topic: string): KnowledgeGap | undefined {
    return this.gaps.get(topic);
  }

  /**
   * Clear all gaps
   */
  clearGaps(): void {
    this.gaps.clear();
    logger.info('KnowledgeGapDetector', 'All gaps cleared');
  }

  /**
   * Get gap statistics
   */
  getStats(): {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  } {
    const gaps = this.detectGaps();
    
    return {
      total: gaps.length,
      critical: gaps.filter(g => g.severity === 'critical').length,
      high: gaps.filter(g => g.severity === 'high').length,
      medium: gaps.filter(g => g.severity === 'medium').length,
      low: gaps.filter(g => g.severity === 'low').length
    };
  }

  /**
   * Generate gap summary report
   */
  generateSummary(): string {
    const gaps = this.detectGaps();
    const stats = this.getStats();
    
    let report = '**Knowledge Gap Summary**\n\n';
    report += `**Total Gaps:** ${stats.total}\n`;
    report += `- Critical: ${stats.critical}\n`;
    report += `- High: ${stats.high}\n`;
    report += `- Medium: ${stats.medium}\n`;
    report += `- Low: ${stats.low}\n\n`;
    
    if (gaps.length > 0) {
      report += '**Top 5 Gaps:**\n';
      gaps.slice(0, 5).forEach((gap, i) => {
        report += `${i + 1}. **${gap.topic}** (${gap.severity})\n`;
        report += `   - Frequency: ${gap.frequency}\n`;
        report += `   - Confidence: ${(gap.confidence * 100).toFixed(1)}%\n`;
        report += `   - Last seen: ${gap.lastEncountered.toLocaleString()}\n`;
      });
    }
    
    return report;
  }
}
