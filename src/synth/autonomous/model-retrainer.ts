// Model Retrainer - Efficient incremental learning
// Part of Autonomous Learning System - Week 3 Training Automation

import { TrainingExample } from './training-data-generator';
import { ExampleValidator } from './example-validator';

export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  validationSplit: number;
  earlyStopping: boolean;
  patience: number;
}

export interface TrainingResult {
  epochsCompleted: number;
  finalLoss: number;
  finalAccuracy: number;
  trainingTime: number;
  examplesProcessed: number;
  improved: boolean;
}

export class ModelRetrainer {
  private validator: ExampleValidator;
  private trainingHistory: TrainingResult[] = [];
  private config: TrainingConfig;
  
  constructor(config?: Partial<TrainingConfig>) {
    this.validator = new ExampleValidator();
    this.config = {
      epochs: 100,
      batchSize: 32,
      learningRate: 0.001,
      validationSplit: 0.2,
      earlyStopping: true,
      patience: 10,
      ...config
    };
  }

  /**
   * Train model incrementally with new examples
   */
  async trainIncremental(
    newExamples: TrainingExample[],
    existingExamples: TrainingExample[] = []
  ): Promise<TrainingResult> {
    console.log('[ModelRetrainer] Starting incremental training...');
    
    const startTime = Date.now();
    
    // Validate and filter examples
    const validation = this.validator.validateBatch([...existingExamples, ...newExamples]);
    const allExamples = validation.valid;
    
    console.log(`[ModelRetrainer] Validated ${allExamples.length} examples (${validation.stats.invalidCount} invalid)`);
    
    if (allExamples.length === 0) {
      throw new Error('No valid examples to train on');
    }
    
    // Split into training and validation sets
    const { trainSet, validationSet } = this.splitData(allExamples);
    
    console.log(`[ModelRetrainer] Training set: ${trainSet.length}, Validation set: ${validationSet.length}`);
    
    // Train for configured epochs
    let bestLoss = Infinity;
    let bestEpoch = 0;
    let epochsWithoutImprovement = 0;
    let finalLoss = 0;
    let finalAccuracy = 0;
    let epochsCompleted = 0;
    
    for (let epoch = 0; epoch < this.config.epochs; epoch++) {
      epochsCompleted = epoch + 1;
      
      // Train one epoch
      const epochResult = await this.trainEpoch(trainSet);
      finalLoss = epochResult.loss;
      finalAccuracy = epochResult.accuracy;
      
      // Validate
      if (validationSet.length > 0) {
        const valResult = await this.validate(validationSet);
        
        // Check for improvement
        if (valResult.loss < bestLoss) {
          bestLoss = valResult.loss;
          bestEpoch = epoch;
          epochsWithoutImprovement = 0;
        } else {
          epochsWithoutImprovement++;
        }
        
        // Early stopping
        if (this.config.earlyStopping && epochsWithoutImprovement >= this.config.patience) {
          console.log(`[ModelRetrainer] Early stopping at epoch ${epoch + 1}`);
          break;
        }
      }
      
      // Log progress
      if ((epoch + 1) % 10 === 0) {
        console.log(`[ModelRetrainer] Epoch ${epoch + 1}/${this.config.epochs} - Loss: ${finalLoss.toFixed(4)}, Accuracy: ${(finalAccuracy * 100).toFixed(2)}%`);
      }
    }
    
    const trainingTime = Date.now() - startTime;
    const improved = bestEpoch > 0 || finalLoss < 0.5;
    
    const result: TrainingResult = {
      epochsCompleted,
      finalLoss,
      finalAccuracy,
      trainingTime,
      examplesProcessed: allExamples.length,
      improved
    };
    
    this.trainingHistory.push(result);
    
    console.log(`[ModelRetrainer] Training complete in ${(trainingTime / 1000).toFixed(2)}s`);
    console.log(`[ModelRetrainer] Final loss: ${finalLoss.toFixed(4)}, Accuracy: ${(finalAccuracy * 100).toFixed(2)}%`);
    
    return result;
  }

  /**
   * Train for one epoch
   */
  private async trainEpoch(examples: TrainingExample[]): Promise<{ loss: number; accuracy: number }> {
    // Shuffle examples
    const shuffled = [...examples].sort(() => Math.random() - 0.5);
    
    let totalLoss = 0;
    let correct = 0;
    
    // Process in batches
    for (let i = 0; i < shuffled.length; i += this.config.batchSize) {
      const batch = shuffled.slice(i, i + this.config.batchSize);
      
      // Simulate training step
      const batchResult = await this.trainBatch(batch);
      totalLoss += batchResult.loss;
      correct += batchResult.correct;
    }
    
    return {
      loss: totalLoss / Math.ceil(shuffled.length / this.config.batchSize),
      accuracy: correct / shuffled.length
    };
  }

  /**
   * Train on a single batch
   */
  private async trainBatch(batch: TrainingExample[]): Promise<{ loss: number; correct: number }> {
    let totalLoss = 0;
    let correct = 0;
    
    for (const example of batch) {
      // Simulate forward pass and loss calculation
      const prediction = this.simulatePrediction(example.input);
      const loss = this.calculateLoss(prediction, example.output);
      totalLoss += loss;
      
      // Check if prediction is correct (simplified)
      if (this.isCorrectPrediction(prediction, example.output)) {
        correct++;
      }
      
      // Simulate backward pass (weight update)
      // In a real implementation, this would update neural network weights
    }
    
    return {
      loss: totalLoss / batch.length,
      correct
    };
  }

  /**
   * Validate on a dataset
   */
  private async validate(examples: TrainingExample[]): Promise<{ loss: number; accuracy: number }> {
    let totalLoss = 0;
    let correct = 0;
    
    for (const example of examples) {
      const prediction = this.simulatePrediction(example.input);
      const loss = this.calculateLoss(prediction, example.output);
      totalLoss += loss;
      
      if (this.isCorrectPrediction(prediction, example.output)) {
        correct++;
      }
    }
    
    return {
      loss: totalLoss / examples.length,
      accuracy: correct / examples.length
    };
  }

  /**
   * Simulate prediction (placeholder for actual model)
   */
  private simulatePrediction(input: string): string {
    // In a real implementation, this would run the neural network
    // For now, return a simple simulation
    return `Response to: ${input}`;
  }

  /**
   * Calculate loss between prediction and target
   */
  private calculateLoss(prediction: string, target: string): number {
    // Simple similarity-based loss
    const predLower = prediction.toLowerCase();
    const targetLower = target.toLowerCase();
    
    // Calculate word overlap
    const predWords = new Set(predLower.split(/\s+/));
    const targetWords = new Set(targetLower.split(/\s+/));
    
    let overlap = 0;
    predWords.forEach(word => {
      if (targetWords.has(word)) overlap++;
    });
    
    const similarity = overlap / Math.max(predWords.size, targetWords.size);
    return 1 - similarity; // Loss is inverse of similarity
  }

  /**
   * Check if prediction is correct
   */
  private isCorrectPrediction(prediction: string, target: string): boolean {
    const loss = this.calculateLoss(prediction, target);
    return loss < 0.3; // Threshold for "correct"
  }

  /**
   * Split data into training and validation sets
   */
  private splitData(examples: TrainingExample[]): {
    trainSet: TrainingExample[];
    validationSet: TrainingExample[];
  } {
    const shuffled = [...examples].sort(() => Math.random() - 0.5);
    const splitIndex = Math.floor(shuffled.length * (1 - this.config.validationSplit));
    
    return {
      trainSet: shuffled.slice(0, splitIndex),
      validationSet: shuffled.slice(splitIndex)
    };
  }

  /**
   * Get training history
   */
  getTrainingHistory(): TrainingResult[] {
    return [...this.trainingHistory];
  }

  /**
   * Get latest training result
   */
  getLatestResult(): TrainingResult | null {
    return this.trainingHistory.length > 0 
      ? this.trainingHistory[this.trainingHistory.length - 1]
      : null;
  }

  /**
   * Update training configuration
   */
  updateConfig(config: Partial<TrainingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): TrainingConfig {
    return { ...this.config };
  }

  /**
   * Generate training report
   */
  generateReport(): string {
    if (this.trainingHistory.length === 0) {
      return '**Training Report**\n\nNo training sessions recorded yet.';
    }
    
    const latest = this.getLatestResult()!;
    const total = this.trainingHistory.length;
    
    let report = '**Training Report**\n\n';
    report += `**Total Training Sessions:** ${total}\n\n`;
    
    report += '**Latest Session:**\n';
    report += `- Epochs Completed: ${latest.epochsCompleted}\n`;
    report += `- Final Loss: ${latest.finalLoss.toFixed(4)}\n`;
    report += `- Final Accuracy: ${(latest.finalAccuracy * 100).toFixed(2)}%\n`;
    report += `- Training Time: ${(latest.trainingTime / 1000).toFixed(2)}s\n`;
    report += `- Examples Processed: ${latest.examplesProcessed}\n`;
    report += `- Improved: ${latest.improved ? 'Yes ✅' : 'No ❌'}\n\n`;
    
    // Training history
    if (total > 1) {
      report += '**Training History:**\n';
      this.trainingHistory.forEach((result, i) => {
        report += `${i + 1}. Loss: ${result.finalLoss.toFixed(4)}, Accuracy: ${(result.finalAccuracy * 100).toFixed(2)}%, Time: ${(result.trainingTime / 1000).toFixed(2)}s\n`;
      });
    }
    
    // Configuration
    report += '\n**Configuration:**\n';
    report += `- Epochs: ${this.config.epochs}\n`;
    report += `- Batch Size: ${this.config.batchSize}\n`;
    report += `- Learning Rate: ${this.config.learningRate}\n`;
    report += `- Validation Split: ${(this.config.validationSplit * 100).toFixed(0)}%\n`;
    report += `- Early Stopping: ${this.config.earlyStopping ? 'Enabled' : 'Disabled'}\n`;
    if (this.config.earlyStopping) {
      report += `- Patience: ${this.config.patience} epochs\n`;
    }
    
    return report;
  }

  /**
   * Clear training history
   */
  clearHistory(): void {
    this.trainingHistory = [];
  }
}

export const modelRetrainer = new ModelRetrainer();
