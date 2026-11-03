// Update Scheduler - Automatic triggers for system updates
// Part of Autonomous Learning System - Week 4 Self-Update System

import { KnowledgeGapDetector, KnowledgeGap } from './knowledge-gap-detector';
import { MetricsTracker } from './metrics-tracker';
import { logger } from './logging-system';

export interface SchedulerConfig {
  // Time-based triggers
  updateInterval: number; // milliseconds between checks
  maxUpdatesPerDay: number;
  
  // Gap-based triggers
  criticalGapThreshold: number; // trigger if critical gaps > threshold
  highGapThreshold: number; // trigger if high gaps > threshold
  
  // Performance-based triggers
  confidenceDropThreshold: number; // trigger if confidence drops below this
  errorRateThreshold: number; // trigger if error rate exceeds this
  
  // Resource constraints
  maxConcurrentUpdates: number;
  minTimeBetweenUpdates: number; // milliseconds
}

export interface UpdateTrigger {
  type: 'scheduled' | 'gap' | 'performance' | 'manual';
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  data?: any;
}

export class UpdateScheduler {
  private config: SchedulerConfig;
  private gapDetector: KnowledgeGapDetector;
  private metricsTracker: MetricsTracker;
  
  private lastUpdateTime: number = 0;
  private updatesToday: number = 0;
  private lastDayReset: number = Date.now();
  
  private pendingTriggers: UpdateTrigger[] = [];
  private isRunning: boolean = false;
  private checkInterval: any = null;

  constructor(
    gapDetector: KnowledgeGapDetector,
    metricsTracker: MetricsTracker,
    config?: Partial<SchedulerConfig>
  ) {
    this.gapDetector = gapDetector;
    this.metricsTracker = metricsTracker;
    
    this.config = {
      updateInterval: 60 * 60 * 1000, // 1 hour
      maxUpdatesPerDay: 10,
      criticalGapThreshold: 3,
      highGapThreshold: 5,
      confidenceDropThreshold: 0.7,
      errorRateThreshold: 0.1,
      maxConcurrentUpdates: 1,
      minTimeBetweenUpdates: 30 * 60 * 1000, // 30 minutes
      ...config
    };
    
    logger.info('UpdateScheduler', 'Initialized', this.config);
  }

  /**
   * Start the scheduler
   */
  start(): void {
    if (this.isRunning) {
      logger.warn('UpdateScheduler', 'Already running');
      return;
    }
    
    this.isRunning = true;
    logger.info('UpdateScheduler', 'Started');
    
    // Check for triggers periodically
    this.checkInterval = setInterval(() => {
      this.checkForTriggers();
    }, this.config.updateInterval);
    
    // Initial check
    this.checkForTriggers();
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    if (!this.isRunning) {
      logger.warn('UpdateScheduler', 'Not running');
      return;
    }
    
    this.isRunning = false;
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    logger.info('UpdateScheduler', 'Stopped');
  }

  /**
   * Check for update triggers
   */
  private checkForTriggers(): void {
    logger.debug('UpdateScheduler', 'Checking for triggers');
    
    // Reset daily counter if needed
    this.resetDailyCounterIfNeeded();
    
    // Check if we can run an update
    if (!this.canRunUpdate()) {
      logger.debug('UpdateScheduler', 'Cannot run update (constraints)');
      return;
    }
    
    // Check for gap-based triggers
    const gapTrigger = this.checkGapTriggers();
    if (gapTrigger) {
      this.addTrigger(gapTrigger);
    }
    
    // Check for performance-based triggers
    const perfTrigger = this.checkPerformanceTriggers();
    if (perfTrigger) {
      this.addTrigger(perfTrigger);
    }
    
    // Check for scheduled trigger
    const scheduledTrigger = this.checkScheduledTrigger();
    if (scheduledTrigger) {
      this.addTrigger(scheduledTrigger);
    }
    
    // Process pending triggers
    this.processTriggers();
  }

  /**
   * Check if we can run an update
   */
  private canRunUpdate(): boolean {
    const now = Date.now();
    
    // Check daily limit
    if (this.updatesToday >= this.config.maxUpdatesPerDay) {
      logger.debug('UpdateScheduler', 'Daily update limit reached');
      return false;
    }
    
    // Check minimum time between updates
    if (now - this.lastUpdateTime < this.config.minTimeBetweenUpdates) {
      logger.debug('UpdateScheduler', 'Too soon since last update');
      return false;
    }
    
    return true;
  }

  /**
   * Check for gap-based triggers
   */
  private checkGapTriggers(): UpdateTrigger | null {
    const gaps = this.gapDetector.detectGaps();
    const criticalGaps = gaps.filter(g => g.severity === 'critical');
    const highGaps = gaps.filter(g => g.severity === 'high');
    
    // Critical gaps trigger
    if (criticalGaps.length >= this.config.criticalGapThreshold) {
      logger.info('UpdateScheduler', `Critical gaps detected: ${criticalGaps.length}`);
      return {
        type: 'gap',
        reason: `${criticalGaps.length} critical knowledge gaps detected`,
        priority: 'critical',
        timestamp: new Date(),
        data: { gaps: criticalGaps }
      };
    }
    
    // High gaps trigger
    if (highGaps.length >= this.config.highGapThreshold) {
      logger.info('UpdateScheduler', `High gaps detected: ${highGaps.length}`);
      return {
        type: 'gap',
        reason: `${highGaps.length} high-priority knowledge gaps detected`,
        priority: 'high',
        timestamp: new Date(),
        data: { gaps: highGaps }
      };
    }
    
    return null;
  }

  /**
   * Check for performance-based triggers
   */
  private checkPerformanceTriggers(): UpdateTrigger | null {
    const metrics = this.metricsTracker.getPerformanceMetrics();
    
    // Check confidence drop
    if (metrics.confidence.avg < this.config.confidenceDropThreshold) {
      logger.warn('UpdateScheduler', `Confidence drop detected: ${(metrics.confidence.avg * 100).toFixed(1)}%`);
      return {
        type: 'performance',
        reason: `Average confidence dropped to ${(metrics.confidence.avg * 100).toFixed(1)}%`,
        priority: 'high',
        timestamp: new Date(),
        data: { metrics }
      };
    }
    
    // Check error rate
    if (metrics.quality.errorRate > this.config.errorRateThreshold) {
      logger.warn('UpdateScheduler', `High error rate: ${(metrics.quality.errorRate * 100).toFixed(1)}%`);
      return {
        type: 'performance',
        reason: `Error rate increased to ${(metrics.quality.errorRate * 100).toFixed(1)}%`,
        priority: 'high',
        timestamp: new Date(),
        data: { metrics }
      };
    }
    
    return null;
  }

  /**
   * Check for scheduled trigger
   */
  private checkScheduledTrigger(): UpdateTrigger | null {
    const now = Date.now();
    
    // Check if enough time has passed since last update
    if (now - this.lastUpdateTime >= this.config.updateInterval) {
      logger.info('UpdateScheduler', 'Scheduled update triggered');
      return {
        type: 'scheduled',
        reason: 'Regular scheduled update',
        priority: 'medium',
        timestamp: new Date()
      };
    }
    
    return null;
  }

  /**
   * Add a trigger to the pending queue
   */
  private addTrigger(trigger: UpdateTrigger): void {
    this.pendingTriggers.push(trigger);
    logger.info('UpdateScheduler', `Trigger added: ${trigger.type} (${trigger.priority})`);
  }

  /**
   * Process pending triggers
   */
  private processTriggers(): void {
    if (this.pendingTriggers.length === 0) {
      return;
    }
    
    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    this.pendingTriggers.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    // Process highest priority trigger
    const trigger = this.pendingTriggers.shift()!;
    
    logger.info('UpdateScheduler', `Processing trigger: ${trigger.type} - ${trigger.reason}`);
    
    // Emit event for orchestrator to handle
    this.emitTriggerEvent(trigger);
    
    // Update last update time
    this.lastUpdateTime = Date.now();
    this.updatesToday++;
  }

  /**
   * Emit trigger event
   */
  private emitTriggerEvent(trigger: UpdateTrigger): void {
    // In a real implementation, this would emit an event or call a callback
    // For now, we'll just log it
    logger.info('UpdateScheduler', 'Trigger event emitted', trigger);
  }

  /**
   * Manually trigger an update
   */
  triggerManualUpdate(reason: string = 'Manual trigger'): void {
    const trigger: UpdateTrigger = {
      type: 'manual',
      reason,
      priority: 'high',
      timestamp: new Date()
    };
    
    this.addTrigger(trigger);
    this.processTriggers();
  }

  /**
   * Reset daily counter if needed
   */
  private resetDailyCounterIfNeeded(): void {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (now - this.lastDayReset >= oneDay) {
      this.updatesToday = 0;
      this.lastDayReset = now;
      logger.debug('UpdateScheduler', 'Daily counter reset');
    }
  }

  /**
   * Get scheduler status
   */
  getStatus(): {
    isRunning: boolean;
    updatesToday: number;
    lastUpdateTime: Date | null;
    pendingTriggers: number;
    config: SchedulerConfig;
  } {
    return {
      isRunning: this.isRunning,
      updatesToday: this.updatesToday,
      lastUpdateTime: this.lastUpdateTime > 0 ? new Date(this.lastUpdateTime) : null,
      pendingTriggers: this.pendingTriggers.length,
      config: { ...this.config }
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SchedulerConfig>): void {
    this.config = { ...this.config, ...config };
    logger.info('UpdateScheduler', 'Configuration updated', this.config);
  }

  /**
   * Generate status report
   */
  generateReport(): string {
    const status = this.getStatus();
    
    let report = '**Update Scheduler Status**\n\n';
    report += `**Running:** ${status.isRunning ? 'Yes ✅' : 'No ❌'}\n`;
    report += `**Updates Today:** ${status.updatesToday} / ${status.config.maxUpdatesPerDay}\n`;
    report += `**Last Update:** ${status.lastUpdateTime ? status.lastUpdateTime.toLocaleString() : 'Never'}\n`;
    report += `**Pending Triggers:** ${status.pendingTriggers}\n\n`;
    
    report += '**Configuration:**\n';
    report += `- Update Interval: ${status.config.updateInterval / 1000 / 60} minutes\n`;
    report += `- Max Updates/Day: ${status.config.maxUpdatesPerDay}\n`;
    report += `- Critical Gap Threshold: ${status.config.criticalGapThreshold}\n`;
    report += `- High Gap Threshold: ${status.config.highGapThreshold}\n`;
    report += `- Confidence Drop Threshold: ${(status.config.confidenceDropThreshold * 100).toFixed(0)}%\n`;
    report += `- Error Rate Threshold: ${(status.config.errorRateThreshold * 100).toFixed(0)}%\n`;
    
    return report;
  }
}
