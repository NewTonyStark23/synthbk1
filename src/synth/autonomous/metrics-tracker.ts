// Metrics Tracker - Tracks system performance metrics
// Part of Autonomous Learning System - Week 1 Foundation

import { logger } from './logging-system';

export interface PerformanceMetrics {
  responseTime: {
    avg: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
  };
  confidence: {
    avg: number;
    min: number;
    max: number;
    distribution: Map<string, number>;
  };
  quality: {
    genericResponseRate: number;
    followUpRate: number;
    errorRate: number;
    successRate: number;
  };
  learning: {
    totalExamples: number;
    examplesPerDay: number;
    improvementRate: number;
    lastTrainingTime: Date | null;
  };
  system: {
    memoryUsage: number;
    cpuUsage: number;
    uptime: number;
  };
}

export class MetricsTracker {
  private responseTimes: number[] = [];
  private confidenceScores: number[] = [];
  private errorCount: number = 0;
  private successCount: number = 0;
  private startTime: number = Date.now();
  
  private maxResponseTimes: number = 1000;
  private maxConfidenceScores: number = 1000;

  constructor() {
    logger.info('MetricsTracker', 'Initialized');
  }

  /**
   * Record a response time
   */
  recordResponseTime(time: number): void {
    this.responseTimes.push(time);
    
    // Keep only recent times
    if (this.responseTimes.length > this.maxResponseTimes) {
      this.responseTimes = this.responseTimes.slice(-this.maxResponseTimes);
    }
    
    logger.debug('MetricsTracker', `Recorded response time: ${time}ms`);
  }

  /**
   * Record a confidence score
   */
  recordConfidence(confidence: number): void {
    this.confidenceScores.push(confidence);
    
    // Keep only recent scores
    if (this.confidenceScores.length > this.maxConfidenceScores) {
      this.confidenceScores = this.confidenceScores.slice(-this.maxConfidenceScores);
    }
    
    logger.debug('MetricsTracker', `Recorded confidence: ${(confidence * 100).toFixed(1)}%`);
  }

  /**
   * Record a success
   */
  recordSuccess(): void {
    this.successCount++;
  }

  /**
   * Record an error
   */
  recordError(): void {
    this.errorCount++;
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return {
      responseTime: this.getResponseTimeMetrics(),
      confidence: this.getConfidenceMetrics(),
      quality: this.getQualityMetrics(),
      learning: this.getLearningMetrics(),
      system: this.getSystemMetrics()
    };
  }

  /**
   * Get response time metrics
   */
  private getResponseTimeMetrics(): PerformanceMetrics['responseTime'] {
    if (this.responseTimes.length === 0) {
      return { avg: 0, min: 0, max: 0, p95: 0, p99: 0 };
    }
    
    const sorted = [...this.responseTimes].sort((a, b) => a - b);
    const avg = sorted.reduce((sum, t) => sum + t, 0) / sorted.length;
    
    return {
      avg,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }

  /**
   * Get confidence metrics
   */
  private getConfidenceMetrics(): PerformanceMetrics['confidence'] {
    if (this.confidenceScores.length === 0) {
      return {
        avg: 0,
        min: 0,
        max: 0,
        distribution: new Map()
      };
    }
    
    const sorted = [...this.confidenceScores].sort((a, b) => a - b);
    const avg = sorted.reduce((sum, c) => sum + c, 0) / sorted.length;
    
    // Create distribution
    const distribution = new Map<string, number>();
    const ranges = ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'];
    ranges.forEach(range => distribution.set(range, 0));
    
    for (const score of this.confidenceScores) {
      const percentage = score * 100;
      if (percentage < 20) distribution.set('0-20%', (distribution.get('0-20%') || 0) + 1);
      else if (percentage < 40) distribution.set('20-40%', (distribution.get('20-40%') || 0) + 1);
      else if (percentage < 60) distribution.set('40-60%', (distribution.get('40-60%') || 0) + 1);
      else if (percentage < 80) distribution.set('60-80%', (distribution.get('60-80%') || 0) + 1);
      else distribution.set('80-100%', (distribution.get('80-100%') || 0) + 1);
    }
    
    return {
      avg,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      distribution
    };
  }

  /**
   * Get quality metrics
   */
  private getQualityMetrics(): PerformanceMetrics['quality'] {
    const total = this.successCount + this.errorCount;
    
    return {
      genericResponseRate: 0, // Would need conversation monitor integration
      followUpRate: 0, // Would need conversation monitor integration
      errorRate: total > 0 ? this.errorCount / total : 0,
      successRate: total > 0 ? this.successCount / total : 0
    };
  }

  /**
   * Get learning metrics
   */
  private getLearningMetrics(): PerformanceMetrics['learning'] {
    return {
      totalExamples: 0, // Would need training system integration
      examplesPerDay: 0,
      improvementRate: 0,
      lastTrainingTime: null
    };
  }

  /**
   * Get system metrics
   */
  private getSystemMetrics(): PerformanceMetrics['system'] {
    return {
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: 0, // Difficult to measure in browser
      uptime: Date.now() - this.startTime
    };
  }

  /**
   * Get memory usage (browser only)
   */
  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return 0;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.responseTimes = [];
    this.confidenceScores = [];
    this.errorCount = 0;
    this.successCount = 0;
    this.startTime = Date.now();
    logger.info('MetricsTracker', 'All metrics cleared');
  }

  /**
   * Generate metrics report
   */
  generateReport(): string {
    const metrics = this.getPerformanceMetrics();
    
    let report = '**Metrics Tracker Report**\n\n';
    
    report += '**Response Time:**\n';
    report += `- Average: ${metrics.responseTime.avg.toFixed(2)}ms\n`;
    report += `- Min: ${metrics.responseTime.min.toFixed(2)}ms\n`;
    report += `- Max: ${metrics.responseTime.max.toFixed(2)}ms\n`;
    report += `- P95: ${metrics.responseTime.p95.toFixed(2)}ms\n`;
    report += `- P99: ${metrics.responseTime.p99.toFixed(2)}ms\n\n`;
    
    report += '**Confidence:**\n';
    report += `- Average: ${(metrics.confidence.avg * 100).toFixed(1)}%\n`;
    report += `- Min: ${(metrics.confidence.min * 100).toFixed(1)}%\n`;
    report += `- Max: ${(metrics.confidence.max * 100).toFixed(1)}%\n\n`;
    
    report += '**Quality:**\n';
    report += `- Error Rate: ${(metrics.quality.errorRate * 100).toFixed(1)}%\n`;
    report += `- Success Rate: ${(metrics.quality.successRate * 100).toFixed(1)}%\n\n`;
    
    report += '**System:**\n';
    report += `- Memory Usage: ${metrics.system.memoryUsage.toFixed(2)} MB\n`;
    report += `- Uptime: ${this.formatUptime(metrics.system.uptime)}\n`;
    
    return report;
  }

  /**
   * Format uptime in human-readable format
   */
  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }
}
