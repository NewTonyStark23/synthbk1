// Change Detector - Detects when the system needs to be updated
// Part of Autonomous Learning System - Week 4 Self-Update System

import { KnowledgeGapDetector, KnowledgeGap } from './knowledge-gap-detector';
import { MetricsTracker } from './metrics-tracker';
import { logger } from './logging-system';

export interface ChangeDetection {
  hasChanges: boolean;
  reasons: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  data: {
    newGaps: KnowledgeGap[];
    performanceDrop: boolean;
    outdatedInfo: boolean;
    userRequests: number;
  };
}

export class ChangeDetector {
  private gapDetector: KnowledgeGapDetector;
  private metricsTracker: MetricsTracker;
  
  private lastDetection: Date | null = null;
  private baselineConfidence: number = 0.8;
  private baselineGaps: number = 0;
  
  // Configuration
  private readonly CONFIDENCE_DROP_THRESHOLD = 0.1; // 10% drop triggers update
  private readonly GAP_INCREASE_THRESHOLD = 3; // 3 new gaps triggers update
  private readonly USER_REQUEST_THRESHOLD = 10; // 10 requests on same topic triggers update

  constructor(gapDetector: KnowledgeGapDetector, metricsTracker: MetricsTracker) {
    this.gapDetector = gapDetector;
    this.metricsTracker = metricsTracker;
    
    logger.info('ChangeDetector', 'Initialized');
  }

  /**
   * Detect if changes are needed
   */
  detectChanges(): ChangeDetection {
    logger.debug('ChangeDetector', 'Detecting changes');
    
    const reasons: string[] = [];
    let priority: ChangeDetection['priority'] = 'low';
    
    // Check for new knowledge gaps
    const currentGaps = this.gapDetector.detectGaps();
    const newGaps = this.detectNewGaps(currentGaps);
    
    if (newGaps.length >= this.GAP_INCREASE_THRESHOLD) {
      reasons.push(`${newGaps.length} new knowledge gaps detected`);
      priority = this.escalatePriority(priority, 'high');
    }
    
    // Check for critical gaps
    const criticalGaps = currentGaps.filter(g => g.severity === 'critical');
    if (criticalGaps.length > 0) {
      reasons.push(`${criticalGaps.length} critical knowledge gaps`);
      priority = 'critical';
    }
    
    // Check for performance drop
    const performanceDrop = this.detectPerformanceDrop();
    if (performanceDrop) {
      reasons.push('Performance degradation detected');
      priority = this.escalatePriority(priority, 'high');
    }
    
    // Check for outdated information
    const outdatedInfo = this.detectOutdatedInfo();
    if (outdatedInfo) {
      reasons.push('Outdated information detected');
      priority = this.escalatePriority(priority, 'medium');
    }
    
    // Check for user request patterns
    const userRequests = this.detectUserRequestPatterns();
    if (userRequests >= this.USER_REQUEST_THRESHOLD) {
      reasons.push(`${userRequests} user requests on same topic`);
      priority = this.escalatePriority(priority, 'medium');
    }
    
    const hasChanges = reasons.length > 0;
    
    const detection: ChangeDetection = {
      hasChanges,
      reasons,
      priority,
      timestamp: new Date(),
      data: {
        newGaps,
        performanceDrop,
        outdatedInfo,
        userRequests
      }
    };
    
    this.lastDetection = detection.timestamp;
    
    if (hasChanges) {
      logger.info('ChangeDetector', `Changes detected: ${reasons.join(', ')}`, { priority });
    } else {
      logger.debug('ChangeDetector', 'No changes detected');
    }
    
    return detection;
  }

  /**
   * Detect new knowledge gaps since last check
   */
  private detectNewGaps(currentGaps: KnowledgeGap[]): KnowledgeGap[] {
    const currentGapTopics = new Set(currentGaps.map(g => g.topic));
    const previousGapTopics = new Set(this.gapDetector.getAllGaps().map(g => g.topic));
    
    // Find gaps that are in current but not in previous
    const newGaps = currentGaps.filter(g => !previousGapTopics.has(g.topic));
    
    // Update baseline
    this.baselineGaps = currentGaps.length;
    
    return newGaps;
  }

  /**
   * Detect performance degradation
   */
  private detectPerformanceDrop(): boolean {
    const metrics = this.metricsTracker.getPerformanceMetrics();
    const currentConfidence = metrics.confidence.avg;
    
    // Check if confidence dropped significantly
    const drop = this.baselineConfidence - currentConfidence;
    
    if (drop > this.CONFIDENCE_DROP_THRESHOLD) {
      logger.warn('ChangeDetector', `Confidence dropped by ${(drop * 100).toFixed(1)}%`);
      return true;
    }
    
    // Update baseline
    this.baselineConfidence = currentConfidence;
    
    return false;
  }

  /**
   * Detect outdated information
   */
  private detectOutdatedInfo(): boolean {
    // Check if last update was too long ago
    if (!this.lastDetection) {
      return false;
    }
    
    const daysSinceLastUpdate = (Date.now() - this.lastDetection.getTime()) / (1000 * 60 * 60 * 24);
    
    // If more than 7 days since last update, consider information outdated
    if (daysSinceLastUpdate > 7) {
      logger.info('ChangeDetector', `Information is ${daysSinceLastUpdate.toFixed(1)} days old`);
      return true;
    }
    
    return false;
  }

  /**
   * Detect user request patterns
   */
  private detectUserRequestPatterns(): number {
    const conversations = this.gapDetector['conversationMonitor'].getRecentConversations(100);
    
    // Count requests per topic
    const topicCounts = new Map<string, number>();
    
    for (const conv of conversations) {
      const topic = conv.topic;
      topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    }
    
    // Find most requested topic
    let maxRequests = 0;
    topicCounts.forEach(count => {
      if (count > maxRequests) maxRequests = count;
    });
    
    return maxRequests;
  }

  /**
   * Escalate priority level
   */
  private escalatePriority(current: ChangeDetection['priority'], newPriority: ChangeDetection['priority']): ChangeDetection['priority'] {
    const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
    
    if (priorityOrder[newPriority] > priorityOrder[current]) {
      return newPriority;
    }
    
    return current;
  }

  /**
   * Set baseline metrics
   */
  setBaseline(confidence: number, gaps: number): void {
    this.baselineConfidence = confidence;
    this.baselineGaps = gaps;
    logger.info('ChangeDetector', `Baseline set: confidence=${(confidence * 100).toFixed(1)}%, gaps=${gaps}`);
  }

  /**
   * Get detection status
   */
  getStatus(): {
    lastDetection: Date | null;
    baselineConfidence: number;
    baselineGaps: number;
  } {
    return {
      lastDetection: this.lastDetection,
      baselineConfidence: this.baselineConfidence,
      baselineGaps: this.baselineGaps
    };
  }

  /**
   * Generate detection report
   */
  generateReport(): string {
    const detection = this.detectChanges();
    const status = this.getStatus();
    
    let report = '**Change Detection Report**\n\n';
    report += `**Last Detection:** ${status.lastDetection ? status.lastDetection.toLocaleString() : 'Never'}\n`;
    report += `**Baseline Confidence:** ${(status.baselineConfidence * 100).toFixed(1)}%\n`;
    report += `**Baseline Gaps:** ${status.baselineGaps}\n\n`;
    
    report += `**Changes Detected:** ${detection.hasChanges ? 'Yes ⚠️' : 'No ✅'}\n`;
    report += `**Priority:** ${detection.priority.toUpperCase()}\n\n`;
    
    if (detection.reasons.length > 0) {
      report += '**Reasons:**\n';
      detection.reasons.forEach(reason => {
        report += `- ${reason}\n`;
      });
      report += '\n';
    }
    
    report += '**Data:**\n';
    report += `- New Gaps: ${detection.data.newGaps.length}\n`;
    report += `- Performance Drop: ${detection.data.performanceDrop ? 'Yes' : 'No'}\n`;
    report += `- Outdated Info: ${detection.data.outdatedInfo ? 'Yes' : 'No'}\n`;
    report += `- User Requests: ${detection.data.userRequests}\n`;
    
    return report;
  }
}
