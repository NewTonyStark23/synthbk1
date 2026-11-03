// Example Validator - Check quality and remove duplicates
// Part of Autonomous Learning System - Week 3 Training Automation

import { TrainingExample } from './training-data-generator';

export interface ValidationResult {
  valid: boolean;
  issues: string[];
  qualityScore: number; // 0-1
}

export class ExampleValidator {
  private seenExamples: Map<string, TrainingExample> = new Map();
  
  /**
   * Validate a single training example
   */
  validate(example: TrainingExample): ValidationResult {
    const issues: string[] = [];
    let qualityScore = 1.0;
    
    // Check input length
    if (example.input.length < 5) {
      issues.push('Input too short');
      qualityScore -= 0.3;
    }
    
    // Check output length
    if (example.output.length < 10) {
      issues.push('Output too short');
      qualityScore -= 0.3;
    }
    
    // Check for empty fields
    if (!example.input.trim() || !example.output.trim()) {
      issues.push('Empty input or output');
      qualityScore -= 0.5;
    }
    
    // Check confidence
    if (example.confidence < 0.5) {
      issues.push('Low confidence');
      qualityScore -= 0.2;
    }
    
    // Check for duplicates
    const key = this.generateKey(example);
    if (this.seenExamples.has(key)) {
      issues.push('Duplicate example');
      qualityScore -= 0.4;
    }
    
    // Check category
    if (!example.category || example.category.trim() === '') {
      issues.push('Missing category');
      qualityScore -= 0.1;
    }
    
    // Check source
    if (!example.source || example.source.trim() === '') {
      issues.push('Missing source');
      qualityScore -= 0.1;
    }
    
    // Check for quality indicators
    if (example.output.includes('I don\'t know') || 
        example.output.includes('I\'m not sure') ||
        example.output.includes('undefined')) {
      issues.push('Low quality output');
      qualityScore -= 0.3;
    }
    
    return {
      valid: issues.length === 0 || qualityScore >= 0.6,
      issues,
      qualityScore: Math.max(0, qualityScore)
    };
  }

  /**
   * Validate multiple examples
   */
  validateBatch(examples: TrainingExample[]): {
    valid: TrainingExample[];
    invalid: TrainingExample[];
    stats: {
      total: number;
      validCount: number;
      invalidCount: number;
      avgQuality: number;
      duplicatesRemoved: number;
    };
  } {
    const valid: TrainingExample[] = [];
    const invalid: TrainingExample[] = [];
    let totalQuality = 0;
    let duplicatesRemoved = 0;
    
    for (const example of examples) {
      const result = this.validate(example);
      
      if (result.valid) {
        valid.push(example);
        totalQuality += result.qualityScore;
        
        // Track for duplicate detection
        const key = this.generateKey(example);
        this.seenExamples.set(key, example);
      } else {
        invalid.push(example);
        
        // Count duplicates
        if (result.issues.includes('Duplicate example')) {
          duplicatesRemoved++;
        }
      }
    }
    
    return {
      valid,
      invalid,
      stats: {
        total: examples.length,
        validCount: valid.length,
        invalidCount: invalid.length,
        avgQuality: valid.length > 0 ? totalQuality / valid.length : 0,
        duplicatesRemoved
      }
    };
  }

  /**
   * Remove duplicates from examples
   */
  removeDuplicates(examples: TrainingExample[]): TrainingExample[] {
    const unique: TrainingExample[] = [];
    const seen = new Set<string>();
    
    for (const example of examples) {
      const key = this.generateKey(example);
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(example);
      }
    }
    
    return unique;
  }

  /**
   * Filter examples by quality threshold
   */
  filterByQuality(examples: TrainingExample[], minQuality: number = 0.7): TrainingExample[] {
    return examples.filter(example => {
      const result = this.validate(example);
      return result.qualityScore >= minQuality;
    });
  }

  /**
   * Filter examples by category
   */
  filterByCategory(examples: TrainingExample[], category: string): TrainingExample[] {
    return examples.filter(example => example.category === category);
  }

  /**
   * Get examples by confidence range
   */
  filterByConfidence(
    examples: TrainingExample[], 
    minConfidence: number = 0.5, 
    maxConfidence: number = 1.0
  ): TrainingExample[] {
    return examples.filter(example => 
      example.confidence >= minConfidence && example.confidence <= maxConfidence
    );
  }

  /**
   * Generate unique key for duplicate detection
   */
  private generateKey(example: TrainingExample): string {
    // Normalize input and output for comparison
    const normalizedInput = example.input.toLowerCase().trim();
    const normalizedOutput = example.output.toLowerCase().trim().substring(0, 100);
    
    return `${example.category}:${normalizedInput}:${normalizedOutput}`;
  }

  /**
   * Get validation statistics
   */
  getStats(): {
    totalSeen: number;
    categories: Map<string, number>;
    avgConfidence: number;
  } {
    const categories = new Map<string, number>();
    let totalConfidence = 0;
    
    this.seenExamples.forEach(example => {
      categories.set(
        example.category, 
        (categories.get(example.category) || 0) + 1
      );
      totalConfidence += example.confidence;
    });
    
    return {
      totalSeen: this.seenExamples.size,
      categories,
      avgConfidence: this.seenExamples.size > 0 
        ? totalConfidence / this.seenExamples.size 
        : 0
    };
  }

  /**
   * Clear seen examples (reset duplicate tracking)
   */
  clear(): void {
    this.seenExamples.clear();
  }

  /**
   * Generate validation report
   */
  generateReport(examples: TrainingExample[]): string {
    const result = this.validateBatch(examples);
    
    let report = '**Training Data Validation Report**\n\n';
    report += `**Total Examples:** ${result.stats.total}\n`;
    report += `**Valid:** ${result.stats.validCount} (${((result.stats.validCount / result.stats.total) * 100).toFixed(1)}%)\n`;
    report += `**Invalid:** ${result.stats.invalidCount} (${((result.stats.invalidCount / result.stats.total) * 100).toFixed(1)}%)\n`;
    report += `**Average Quality:** ${(result.stats.avgQuality * 100).toFixed(1)}%\n`;
    report += `**Duplicates Removed:** ${result.stats.duplicatesRemoved}\n\n`;
    
    // Category breakdown
    report += '**Category Breakdown:**\n';
    const categoryCounts = new Map<string, number>();
    result.valid.forEach(example => {
      categoryCounts.set(
        example.category,
        (categoryCounts.get(example.category) || 0) + 1
      );
    });
    
    categoryCounts.forEach((count, category) => {
      report += `- ${category}: ${count} examples\n`;
    });
    
    // Common issues
    if (result.invalid.length > 0) {
      report += '\n**Common Issues:**\n';
      const issueCounts = new Map<string, number>();
      
      result.invalid.forEach(example => {
        const validation = this.validate(example);
        validation.issues.forEach(issue => {
          issueCounts.set(issue, (issueCounts.get(issue) || 0) + 1);
        });
      });
      
      issueCounts.forEach((count, issue) => {
        report += `- ${issue}: ${count} examples\n`;
      });
    }
    
    return report;
  }
}

export const exampleValidator = new ExampleValidator();
