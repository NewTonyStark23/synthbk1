// Training Automation Orchestrator - Week 3 Complete System
// Coordinates all training automation components

import { WebIntegration, WebResearchReport } from './web-integration';
import { TrainingDataGenerator, TrainingExample } from './training-data-generator';
import { ExampleValidator } from './example-validator';
import { ParaphraseGenerator } from './paraphrase-generator';
import { RelatedQuestionGenerator } from './related-question-generator';
import { ModelRetrainer, TrainingResult } from './model-retrainer';

export interface TrainingAutomationConfig {
  paraphrasesPerExample: number;
  relatedQuestionsPerExample: number;
  minQuality: number;
  trainingConfig?: {
    epochs?: number;
    batchSize?: number;
    learningRate?: number;
  };
}

export class TrainingAutomation {
  private webIntegration: WebIntegration;
  private dataGenerator: TrainingDataGenerator;
  private validator: ExampleValidator;
  private paraphraseGenerator: ParaphraseGenerator;
  private relatedQuestionGenerator: RelatedQuestionGenerator;
  private modelRetrainer: ModelRetrainer;
  private config: TrainingAutomationConfig;
  
  // Accumulated training data
  private trainingData: TrainingExample[] = [];
  
  constructor(config?: Partial<TrainingAutomationConfig>) {
    this.webIntegration = new WebIntegration();
    this.dataGenerator = new TrainingDataGenerator();
    this.validator = new ExampleValidator();
    this.paraphraseGenerator = new ParaphraseGenerator();
    this.relatedQuestionGenerator = new RelatedQuestionGenerator();
    this.modelRetrainer = new ModelRetrainer();
    
    this.config = {
      paraphrasesPerExample: 3,
      relatedQuestionsPerExample: 5,
      minQuality: 0.7,
      ...config
    };
  }

  /**
   * Complete training automation pipeline
   */
  async runPipeline(topic: string): Promise<{
    research: WebResearchReport;
    generated: TrainingExample[];
    validated: TrainingExample[];
    expanded: TrainingExample[];
    trainingResult: TrainingResult;
    stats: PipelineStats;
  }> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`[TrainingAutomation] Starting pipeline for: ${topic}`);
    console.log('='.repeat(60));
    
    // Step 1: Research
    console.log('\n📚 Step 1: Web Research');
    const research = await this.webIntegration.research(topic);
    console.log(`   Found ${research.searchResults.length} sources`);
    console.log(`   Extracted ${research.extractedContent.length} articles`);
    
    // Step 2: Generate training data
    console.log('\n🔧 Step 2: Generate Training Data');
    const generated = this.dataGenerator.generateFromResearch(research);
    console.log(`   Generated ${generated.length} examples`);
    
    // Step 3: Validate
    console.log('\n✅ Step 3: Validate Examples');
    const validation = this.validator.validateBatch(generated);
    const validated = this.validator.filterByQuality(validation.valid, this.config.minQuality);
    console.log(`   Valid: ${validation.stats.validCount}`);
    console.log(`   Invalid: ${validation.stats.invalidCount}`);
    console.log(`   After quality filter: ${validated.length}`);
    
    // Step 4: Expand with paraphrases
    console.log('\n🔄 Step 4: Generate Paraphrases');
    const paraphrases = this.paraphraseGenerator.generateBatchParaphrases(
      validated,
      this.config.paraphrasesPerExample
    );
    console.log(`   Generated ${paraphrases.length} paraphrases`);
    
    // Step 5: Expand with related questions
    console.log('\n❓ Step 5: Generate Related Questions');
    const related = this.relatedQuestionGenerator.generateBatchRelatedQuestions(
      validated,
      this.config.relatedQuestionsPerExample
    );
    console.log(`   Generated ${related.length} related questions`);
    
    // Step 6: Combine all examples
    console.log('\n📦 Step 6: Combine Training Data');
    const expanded = [...validated, ...paraphrases, ...related];
    console.log(`   Total examples: ${expanded.length}`);
    
    // Step 7: Add to accumulated training data
    this.trainingData.push(...expanded);
    console.log(`   Accumulated total: ${this.trainingData.length}`);
    
    // Step 8: Train model
    console.log('\n🧠 Step 7: Train Model');
    const trainingResult = await this.modelRetrainer.trainIncremental(
      expanded,
      this.trainingData.filter(e => !expanded.includes(e))
    );
    
    // Step 9: Generate statistics
    const stats = this.generateStats(research, generated, validated, expanded, trainingResult);
    
    console.log('\n' + '='.repeat(60));
    console.log('[TrainingAutomation] Pipeline Complete!');
    console.log('='.repeat(60));
    
    return {
      research,
      generated,
      validated,
      expanded,
      trainingResult,
      stats
    };
  }

  /**
   * Generate pipeline statistics
   */
  private generateStats(
    research: WebResearchReport,
    generated: TrainingExample[],
    validated: TrainingExample[],
    expanded: TrainingExample[],
    trainingResult: TrainingResult
  ): PipelineStats {
    return {
      research: {
        sourcesFound: research.searchResults.length,
        contentExtracted: research.extractedContent.length,
        confidence: research.confidence?.overall || 0
      },
      generation: {
        rawExamples: generated.length,
        validatedExamples: validated.length,
        validationRate: validated.length / generated.length,
        paraphrasesGenerated: expanded.length - validated.length,
        totalExpanded: expanded.length
      },
      training: {
        epochsCompleted: trainingResult.epochsCompleted,
        finalLoss: trainingResult.finalLoss,
        finalAccuracy: trainingResult.finalAccuracy,
        trainingTime: trainingResult.trainingTime,
        improved: trainingResult.improved
      },
      accumulated: {
        totalExamples: this.trainingData.length,
        uniqueTopics: new Set(this.trainingData.map(e => e.category)).size
      }
    };
  }

  /**
   * Get accumulated training data
   */
  getTrainingData(): TrainingExample[] {
    return [...this.trainingData];
  }

  /**
   * Clear accumulated training data
   */
  clearTrainingData(): void {
    this.trainingData = [];
    this.validator.clear();
    this.modelRetrainer.clearHistory();
  }

  /**
   * Generate comprehensive report
   */
  generateReport(result?: {
    research: WebResearchReport;
    generated: TrainingExample[];
    validated: TrainingExample[];
    expanded: TrainingExample[];
    trainingResult: TrainingResult;
    stats: PipelineStats;
  }): string {
    let report = '**Training Automation Report**\n\n';
    
    if (result) {
      report += `**Topic:** ${result.research.query}\n\n`;
      
      // Research stats
      report += '**📚 Research Phase:**\n';
      report += `- Sources Found: ${result.stats.research.sourcesFound}\n`;
      report += `- Content Extracted: ${result.stats.research.contentExtracted}\n`;
      report += `- Research Confidence: ${(result.stats.research.confidence * 100).toFixed(1)}%\n\n`;
      
      // Generation stats
      report += '**🔧 Generation Phase:**\n';
      report += `- Raw Examples: ${result.stats.generation.rawExamples}\n`;
      report += `- Validated Examples: ${result.stats.generation.validatedExamples}\n`;
      report += `- Validation Rate: ${(result.stats.generation.validationRate * 100).toFixed(1)}%\n`;
      report += `- Paraphrases Generated: ${result.stats.generation.paraphrasesGenerated}\n`;
      report += `- Total Expanded: ${result.stats.generation.totalExpanded}\n\n`;
      
      // Training stats
      report += '**🧠 Training Phase:**\n';
      report += `- Epochs Completed: ${result.stats.training.epochsCompleted}\n`;
      report += `- Final Loss: ${result.stats.training.finalLoss.toFixed(4)}\n`;
      report += `- Final Accuracy: ${(result.stats.training.finalAccuracy * 100).toFixed(2)}%\n`;
      report += `- Training Time: ${(result.stats.training.trainingTime / 1000).toFixed(2)}s\n`;
      report += `- Improved: ${result.stats.training.improved ? 'Yes ✅' : 'No ❌'}\n\n`;
      
      // Accumulated stats
      report += '**📊 Accumulated Data:**\n';
      report += `- Total Examples: ${result.stats.accumulated.totalExamples}\n`;
      report += `- Unique Topics: ${result.stats.accumulated.uniqueTopics}\n\n`;
    } else {
      report += '**Overall Statistics:**\n';
      report += `- Total Training Examples: ${this.trainingData.length}\n`;
      report += `- Unique Topics: ${new Set(this.trainingData.map(e => e.category)).size}\n\n`;
      
      // Training history
      const history = this.modelRetrainer.getTrainingHistory();
      if (history.length > 0) {
        report += '**Training History:**\n';
        report += `- Sessions: ${history.length}\n`;
        const latest = history[history.length - 1];
        report += `- Latest Loss: ${latest.finalLoss.toFixed(4)}\n`;
        report += `- Latest Accuracy: ${(latest.finalAccuracy * 100).toFixed(2)}%\n\n`;
      }
    }
    
    // Configuration
    report += '**⚙️ Configuration:**\n';
    report += `- Paraphrases per Example: ${this.config.paraphrasesPerExample}\n`;
    report += `- Related Questions per Example: ${this.config.relatedQuestionsPerExample}\n`;
    report += `- Minimum Quality: ${(this.config.minQuality * 100).toFixed(0)}%\n`;
    
    const trainingConfig = this.modelRetrainer.getConfig();
    report += `- Training Epochs: ${trainingConfig.epochs}\n`;
    report += `- Batch Size: ${trainingConfig.batchSize}\n`;
    report += `- Learning Rate: ${trainingConfig.learningRate}\n`;
    
    return report;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<TrainingAutomationConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.trainingConfig) {
      this.modelRetrainer.updateConfig(config.trainingConfig);
    }
  }

  /**
   * Get component instances
   */
  getComponents() {
    return {
      webIntegration: this.webIntegration,
      dataGenerator: this.dataGenerator,
      validator: this.validator,
      paraphraseGenerator: this.paraphraseGenerator,
      relatedQuestionGenerator: this.relatedQuestionGenerator,
      modelRetrainer: this.modelRetrainer
    };
  }
}

export interface PipelineStats {
  research: {
    sourcesFound: number;
    contentExtracted: number;
    confidence: number;
  };
  generation: {
    rawExamples: number;
    validatedExamples: number;
    validationRate: number;
    paraphrasesGenerated: number;
    totalExpanded: number;
  };
  training: {
    epochsCompleted: number;
    finalLoss: number;
    finalAccuracy: number;
    trainingTime: number;
    improved: boolean;
  };
  accumulated: {
    totalExamples: number;
    uniqueTopics: number;
  };
}

export const trainingAutomation = new TrainingAutomation();
