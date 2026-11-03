// Related Question Generator - Expand topic coverage
// Part of Autonomous Learning System - Week 3 Training Automation

import { TrainingExample } from './training-data-generator';

export class RelatedQuestionGenerator {
  private questionPatterns: Map<string, string[]> = new Map();
  
  constructor() {
    this.initializePatterns();
  }

  /**
   * Initialize question patterns for generating related questions
   */
  private initializePatterns(): void {
    // Benefits/Advantages
    this.questionPatterns.set('benefits', [
      'what are the benefits of {topic}',
      'what are the advantages of {topic}',
      'why is {topic} useful',
      'what makes {topic} valuable',
      'why should i use {topic}',
      'what are the pros of {topic}'
    ]);

    // Drawbacks/Disadvantages
    this.questionPatterns.set('drawbacks', [
      'what are the drawbacks of {topic}',
      'what are the disadvantages of {topic}',
      'what are the cons of {topic}',
      'what are the limitations of {topic}',
      'why is {topic} bad',
      'what are the problems with {topic}'
    ]);

    // Comparison
    this.questionPatterns.set('comparison', [
      'how is {topic} different from alternatives',
      'what is the difference between {topic} and similar concepts',
      'how does {topic} compare to other options',
      'what makes {topic} unique',
      'why choose {topic} over alternatives',
      'what are the differences between {topic} and related concepts'
    ]);

    // Use Cases
    this.questionPatterns.set('usecases', [
      'what are common use cases for {topic}',
      'when should i use {topic}',
      'what is {topic} used for',
      'what are applications of {topic}',
      'where is {topic} commonly used',
      'what scenarios benefit from {topic}'
    ]);

    // Implementation
    this.questionPatterns.set('implementation', [
      'how to implement {topic}',
      'how to use {topic} in practice',
      'how to get started with {topic}',
      'how to apply {topic}',
      'how to work with {topic}',
      'how to build with {topic}'
    ]);

    // Best Practices
    this.questionPatterns.set('bestpractices', [
      'what are best practices for {topic}',
      'how to use {topic} effectively',
      'what are tips for {topic}',
      'how to optimize {topic}',
      'what are recommended approaches for {topic}',
      'how to get the most out of {topic}'
    ]);

    // Common Mistakes
    this.questionPatterns.set('mistakes', [
      'what are common mistakes with {topic}',
      'what should i avoid when using {topic}',
      'what are pitfalls of {topic}',
      'what are errors to avoid with {topic}',
      'what not to do with {topic}',
      'what are warnings about {topic}'
    ]);

    // Future/Trends
    this.questionPatterns.set('future', [
      'what is the future of {topic}',
      'where is {topic} heading',
      'what are trends in {topic}',
      'what is next for {topic}',
      'how will {topic} evolve',
      'what are predictions for {topic}'
    ]);

    // History/Background
    this.questionPatterns.set('history', [
      'what is the history of {topic}',
      'how did {topic} originate',
      'when was {topic} created',
      'who invented {topic}',
      'what is the background of {topic}',
      'how did {topic} develop'
    ]);

    // Examples
    this.questionPatterns.set('examples', [
      'give me examples of {topic}',
      'what are some examples of {topic}',
      'show me examples of {topic}',
      'what does {topic} look like in practice',
      'can you demonstrate {topic}',
      'what are real-world examples of {topic}'
    ]);
  }

  /**
   * Generate related questions for a topic
   */
  generateRelatedQuestions(topic: string, count: number = 10): string[] {
    const questions: string[] = [];
    const categories = Array.from(this.questionPatterns.keys());
    
    // Shuffle categories for variety
    const shuffledCategories = categories.sort(() => Math.random() - 0.5);
    
    // Generate questions from different categories
    for (const category of shuffledCategories) {
      if (questions.length >= count) break;
      
      const templates = this.questionPatterns.get(category)!;
      const template = templates[Math.floor(Math.random() * templates.length)];
      const question = template.replace('{topic}', topic);
      
      if (!questions.includes(question)) {
        questions.push(question);
      }
    }
    
    return questions;
  }

  /**
   * Generate related training examples
   */
  generateRelatedExamples(
    baseExample: TrainingExample,
    count: number = 5
  ): TrainingExample[] {
    const topic = this.extractTopic(baseExample.input);
    const questions = this.generateRelatedQuestions(topic, count);
    
    return questions.map(question => {
      const newExample: TrainingExample = {
        input: question,
        output: this.generateRelatedAnswer(baseExample, question),
        category: baseExample.category,
        confidence: baseExample.confidence * 0.9, // Slightly lower confidence
        source: baseExample.source,
        timestamp: new Date()
      };
      
      // Copy metadata if it exists
      if (baseExample.metadata) {
        newExample.metadata = {
          ...baseExample.metadata,
          type: 'related',
          originalInput: baseExample.input
        };
      } else {
        newExample.metadata = {
          type: 'related',
          originalInput: baseExample.input
        };
      }
      
      return newExample;
    });
  }

  /**
   * Generate answer for related question
   */
  private generateRelatedAnswer(baseExample: TrainingExample, question: string): string {
    const questionType = this.detectQuestionType(question);
    
    // Generate contextual answer based on question type
    switch (questionType) {
      case 'benefits':
        return `The benefits of this topic include improved efficiency, better outcomes, and enhanced capabilities. ${baseExample.output}`;
      
      case 'drawbacks':
        return `While there are some limitations to consider, the benefits often outweigh the drawbacks. ${baseExample.output}`;
      
      case 'comparison':
        return `Compared to alternatives, this approach offers unique advantages in terms of flexibility and performance. ${baseExample.output}`;
      
      case 'usecases':
        return `Common use cases include practical applications in various scenarios. ${baseExample.output}`;
      
      case 'implementation':
        return `To implement this effectively, follow these steps and best practices. ${baseExample.output}`;
      
      case 'bestpractices':
        return `Best practices include careful planning, thorough testing, and continuous improvement. ${baseExample.output}`;
      
      case 'mistakes':
        return `Common mistakes to avoid include rushing the process and skipping important steps. ${baseExample.output}`;
      
      case 'future':
        return `The future looks promising with ongoing developments and innovations. ${baseExample.output}`;
      
      case 'history':
        return `Historically, this has evolved significantly over time with many important milestones. ${baseExample.output}`;
      
      case 'examples':
        return `Here are some practical examples that demonstrate the concepts. ${baseExample.output}`;
      
      default:
        return baseExample.output;
    }
  }

  /**
   * Extract topic from question
   */
  private extractTopic(question: string): string {
    // Remove question words and common phrases
    let topic = question
      .toLowerCase()
      .replace(/^(what|how|why|when|where|who|can you|tell me|explain|describe|give me|show me)\s+/i, '')
      .replace(/\s+(work|mean|is|are|do|does|happen|created|invented|used|responsible|known|help|founded|developed|involved|located|exists|find|go|should|was|will|occur|start|necessary|important|significance|purpose|causes|reason|timing|schedule|date|time|place|area|process|steps|done|about|for|of|in|on|with|from|to|at|by|as|if|or|and|but|not|no|yes)\s*$/i, '')
      .replace(/[?!.]/g, '')
      .trim();
    
    // If topic is too short, use the whole question
    if (topic.length < 3) {
      topic = question.replace(/[?!.]/g, '').trim();
    }
    
    return topic;
  }

  /**
   * Detect question type
   */
  private detectQuestionType(question: string): string {
    const lower = question.toLowerCase();
    
    if (lower.includes('benefit') || lower.includes('advantage') || lower.includes('useful') || lower.includes('valuable')) {
      return 'benefits';
    }
    if (lower.includes('drawback') || lower.includes('disadvantage') || lower.includes('limitation') || lower.includes('problem')) {
      return 'drawbacks';
    }
    if (lower.includes('different') || lower.includes('compare') || lower.includes('unique') || lower.includes('versus')) {
      return 'comparison';
    }
    if (lower.includes('use case') || lower.includes('used for') || lower.includes('application') || lower.includes('scenario')) {
      return 'usecases';
    }
    if (lower.includes('implement') || lower.includes('get started') || lower.includes('apply') || lower.includes('build')) {
      return 'implementation';
    }
    if (lower.includes('best practice') || lower.includes('effectively') || lower.includes('tip') || lower.includes('optimize')) {
      return 'bestpractices';
    }
    if (lower.includes('mistake') || lower.includes('avoid') || lower.includes('pitfall') || lower.includes('error')) {
      return 'mistakes';
    }
    if (lower.includes('future') || lower.includes('trend') || lower.includes('evolve') || lower.includes('prediction')) {
      return 'future';
    }
    if (lower.includes('history') || lower.includes('origin') || lower.includes('created') || lower.includes('invented')) {
      return 'history';
    }
    if (lower.includes('example') || lower.includes('demonstrate') || lower.includes('show')) {
      return 'examples';
    }
    
    return 'general';
  }

  /**
   * Generate related questions for multiple examples
   */
  generateBatchRelatedQuestions(
    examples: TrainingExample[],
    questionsPerExample: number = 5
  ): TrainingExample[] {
    const allRelated: TrainingExample[] = [];
    
    for (const example of examples) {
      const related = this.generateRelatedExamples(example, questionsPerExample);
      allRelated.push(...related);
    }
    
    return allRelated;
  }

  /**
   * Get statistics about related question generation
   */
  getStats(examples: TrainingExample[], questionsPerExample: number = 5): {
    originalCount: number;
    relatedCount: number;
    totalCount: number;
    expansionFactor: number;
  } {
    const relatedCount = examples.length * questionsPerExample;
    
    return {
      originalCount: examples.length,
      relatedCount,
      totalCount: examples.length + relatedCount,
      expansionFactor: (examples.length + relatedCount) / examples.length
    };
  }

  /**
   * Generate report
   */
  generateReport(examples: TrainingExample[], questionsPerExample: number = 5): string {
    const stats = this.getStats(examples, questionsPerExample);
    
    let report = '**Related Question Generation Report**\n\n';
    report += `**Original Examples:** ${stats.originalCount}\n`;
    report += `**Related Questions Generated:** ${stats.relatedCount}\n`;
    report += `**Total Examples:** ${stats.totalCount}\n`;
    report += `**Expansion Factor:** ${stats.expansionFactor.toFixed(2)}x\n\n`;
    
    // Show sample related questions
    if (examples.length > 0) {
      report += '**Sample Related Questions:**\n\n';
      const sample = examples[0];
      const topic = this.extractTopic(sample.input);
      const related = this.generateRelatedQuestions(topic, 5);
      
      report += `Original: "${sample.input}"\n`;
      report += `Topic: "${topic}"\n`;
      report += `Related Questions:\n`;
      related.forEach((q, i) => {
        report += `  ${i + 1}. "${q}"\n`;
      });
    }
    
    return report;
  }
}

export const relatedQuestionGenerator = new RelatedQuestionGenerator();
