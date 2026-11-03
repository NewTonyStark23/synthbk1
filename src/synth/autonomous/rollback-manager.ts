// Rollback Manager - Manages model versions and safe rollbacks
// Part of Autonomous Learning System - Week 4 Self-Update System

import { logger } from './logging-system';

export interface ModelVersion {
  id: string;
  timestamp: Date;
  performance: {
    accuracy: number;
    confidence: number;
    responseTime: number;
  };
  trainingData: {
    totalExamples: number;
    newExamples: number;
  };
  metadata: {
    description: string;
    trigger: string;
    duration: number;
  };
  isActive: boolean;
}

export class RollbackManager {
  private versions: ModelVersion[] = [];
  private currentVersionId: string | null = null;
  private maxVersions: number = 10;
  
  constructor() {
    logger.info('RollbackManager', 'Initialized');
  }

  /**
   * Save a new model version
   */
  saveVersion(
    performance: ModelVersion['performance'],
    trainingData: ModelVersion['trainingData'],
    metadata: ModelVersion['metadata']
  ): ModelVersion {
    // Deactivate current version
    if (this.currentVersionId) {
      const currentVersion = this.versions.find(v => v.id === this.currentVersionId);
      if (currentVersion) {
        currentVersion.isActive = false;
      }
    }
    
    // Create new version
    const version: ModelVersion = {
      id: this.generateVersionId(),
      timestamp: new Date(),
      performance,
      trainingData,
      metadata,
      isActive: true
    };
    
    this.versions.push(version);
    this.currentVersionId = version.id;
    
    // Keep only recent versions
    if (this.versions.length > this.maxVersions) {
      this.versions = this.versions.slice(-this.maxVersions);
    }
    
    logger.info('RollbackManager', `Saved version ${version.id}`, {
      accuracy: performance.accuracy,
      confidence: performance.confidence
    });
    
    return version;
  }

  /**
   * Rollback to previous version
   */
  rollback(versionId?: string): ModelVersion | null {
    if (this.versions.length < 2) {
      logger.warn('RollbackManager', 'Cannot rollback: not enough versions');
      return null;
    }
    
    let targetVersion: ModelVersion | undefined;
    
    if (versionId) {
      // Rollback to specific version
      targetVersion = this.versions.find(v => v.id === versionId);
      if (!targetVersion) {
        logger.error('RollbackManager', `Version ${versionId} not found`);
        return null;
      }
    } else {
      // Rollback to previous version
      const currentIndex = this.versions.findIndex(v => v.id === this.currentVersionId);
      if (currentIndex <= 0) {
        logger.warn('RollbackManager', 'Cannot rollback: already at oldest version');
        return null;
      }
      targetVersion = this.versions[currentIndex - 1];
    }
    
    // Deactivate current version
    if (this.currentVersionId) {
      const currentVersion = this.versions.find(v => v.id === this.currentVersionId);
      if (currentVersion) {
        currentVersion.isActive = false;
      }
    }
    
    // Activate target version
    targetVersion.isActive = true;
    this.currentVersionId = targetVersion.id;
    
    logger.info('RollbackManager', `Rolled back to version ${targetVersion.id}`);
    
    return targetVersion;
  }

  /**
   * Get current version
   */
  getCurrentVersion(): ModelVersion | null {
    if (!this.currentVersionId) {
      return null;
    }
    return this.versions.find(v => v.id === this.currentVersionId) || null;
  }

  /**
   * Get all versions
   */
  getAllVersions(): ModelVersion[] {
    return [...this.versions];
  }

  /**
   * Get version by ID
   */
  getVersion(versionId: string): ModelVersion | null {
    return this.versions.find(v => v.id === versionId) || null;
  }

  /**
   * Compare two versions
   */
  compareVersions(versionId1: string, versionId2: string): {
    version1: ModelVersion | null;
    version2: ModelVersion | null;
    differences: {
      accuracy: number;
      confidence: number;
      responseTime: number;
      totalExamples: number;
    };
  } | null {
    const version1 = this.getVersion(versionId1);
    const version2 = this.getVersion(versionId2);
    
    if (!version1 || !version2) {
      return null;
    }
    
    return {
      version1,
      version2,
      differences: {
        accuracy: version2.performance.accuracy - version1.performance.accuracy,
        confidence: version2.performance.confidence - version1.performance.confidence,
        responseTime: version2.performance.responseTime - version1.performance.responseTime,
        totalExamples: version2.trainingData.totalExamples - version1.trainingData.totalExamples
      }
    };
  }

  /**
   * Check if rollback is needed
   */
  shouldRollback(currentPerformance: ModelVersion['performance']): boolean {
    const previousVersion = this.getPreviousVersion();
    
    if (!previousVersion) {
      return false;
    }
    
    // Rollback if accuracy dropped significantly
    const accuracyDrop = previousVersion.performance.accuracy - currentPerformance.accuracy;
    if (accuracyDrop > 0.05) { // 5% drop
      logger.warn('RollbackManager', `Accuracy dropped by ${(accuracyDrop * 100).toFixed(1)}%`);
      return true;
    }
    
    // Rollback if confidence dropped significantly
    const confidenceDrop = previousVersion.performance.confidence - currentPerformance.confidence;
    if (confidenceDrop > 0.1) { // 10% drop
      logger.warn('RollbackManager', `Confidence dropped by ${(confidenceDrop * 100).toFixed(1)}%`);
      return true;
    }
    
    // Rollback if response time increased significantly
    const responseTimeIncrease = currentPerformance.responseTime - previousVersion.performance.responseTime;
    if (responseTimeIncrease > 100) { // 100ms increase
      logger.warn('RollbackManager', `Response time increased by ${responseTimeIncrease}ms`);
      return true;
    }
    
    return false;
  }

  /**
   * Get previous version
   */
  private getPreviousVersion(): ModelVersion | null {
    if (!this.currentVersionId) {
      return null;
    }
    
    const currentIndex = this.versions.findIndex(v => v.id === this.currentVersionId);
    if (currentIndex <= 0) {
      return null;
    }
    
    return this.versions[currentIndex - 1];
  }

  /**
   * Generate unique version ID
   */
  private generateVersionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `v${timestamp}_${random}`;
  }

  /**
   * Clear all versions
   */
  clear(): void {
    this.versions = [];
    this.currentVersionId = null;
    logger.info('RollbackManager', 'All versions cleared');
  }

  /**
   * Generate version report
   */
  generateReport(): string {
    const currentVersion = this.getCurrentVersion();
    const allVersions = this.getAllVersions();
    
    let report = '**Rollback Manager Report**\n\n';
    report += `**Total Versions:** ${allVersions.length}\n`;
    report += `**Current Version:** ${currentVersion ? currentVersion.id : 'None'}\n\n`;
    
    if (allVersions.length > 0) {
      report += '**Version History:**\n';
      allVersions.slice().reverse().forEach((version, i) => {
        const isActive = version.isActive ? ' (Active)' : '';
        report += `${i + 1}. **${version.id}**${isActive}\n`;
        report += `   - Created: ${version.timestamp.toLocaleString()}\n`;
        report += `   - Accuracy: ${(version.performance.accuracy * 100).toFixed(1)}%\n`;
        report += `   - Confidence: ${(version.performance.confidence * 100).toFixed(1)}%\n`;
        report += `   - Response Time: ${version.performance.responseTime.toFixed(2)}ms\n`;
        report += `   - Training Examples: ${version.trainingData.totalExamples}\n`;
        report += `   - Description: ${version.metadata.description}\n\n`;
      });
    }
    
    return report;
  }
}
