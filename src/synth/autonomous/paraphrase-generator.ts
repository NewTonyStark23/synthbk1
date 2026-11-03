// Paraphrase Generator - Create question variations
// Part of Autonomous Learning System - Week 3 Training Automation

import { TrainingExample } from './training-data-generator';

export class ParaphraseGenerator {
  private paraphraseTemplates: Map<string, string[]> = new Map();
  
  constructor() {
    this.initializeTemplates();
  }

  /**
   * Initialize paraphrase templates for different question types
   */
  private initializeTemplates(): void {
    // What questions
    this.paraphraseTemplates.set('what', [
      'what is {topic}',
      'can you tell me about {topic}',
      'explain {topic}',
      'describe {topic}',
      'i want to know about {topic}',
      'what does {topic} mean',
      'define {topic}',
      'give me information on {topic}',
      'tell me about {topic}',
      'what are {topic}'
    ]);

    // How questions
    this.paraphraseTemplates.set('how', [
      'how does {topic} work',
      'explain how {topic} works',
      'what is the process of {topic}',
      'how to {topic}',
      'can you explain {topic}',
      'walk me through {topic}',
      'what are the steps for {topic}',
      'how is {topic} done',
      'describe how {topic} works',
      'teach me about {topic}'
    ]);

    // Why questions
    this.paraphraseTemplates.set('why', [
      'why is {topic}',
      'what is the reason for {topic}',
      'explain why {topic}',
      'what causes {topic}',
      'why does {topic} happen',
      'what is the purpose of {topic}',
      'why do we need {topic}',
      'what makes {topic} important',
      'why is {topic} necessary',
      'what is the significance of {topic}'
    ]);

    // When questions
    this.paraphraseTemplates.set('when', [
      'when is {topic}',
      'what time is {topic}',
      'when does {topic} happen',
      'what is the timing of {topic}',
      'when should i {topic}',
      'what is the schedule for {topic}',
      'when was {topic} created',
      'when will {topic} occur',
      'what is the date of {topic}',
      'when did {topic} start'
    ]);

    // Where questions
    this.paraphraseTemplates.set('where', [
      'where is {topic}',
      'what is the location of {topic}',
      'where can i find {topic}',
      'where does {topic} exist',
      'what place is {topic}',
      'where should i go for {topic}',
      'where is {topic} located',
      'what area is {topic}',
      'where can {topic} be found',
      'where does {topic} happen'
    ]);

    // Who questions
    this.paraphraseTemplates.set('who', [
      'who is {topic}',
      'who created {topic}',
      'who invented {topic}',
      'who uses {topic}',
      'who is responsible for {topic}',
      'who knows about {topic}',
      'who can help with {topic}',
      'who founded {topic}',
      'who developed {topic}',
      'who is involved in {topic}'
    ]);

    // General/Conversational
    this.paraphraseTemplates.set('general', [
      'i\'m curious about {topic}',
      'can you help me understand {topic}',
      'i need information on {topic}',
      'let\'s discuss {topic}',
      'i want to learn about {topic}',
      'tell me more about {topic}',
      'i\'m interested in {topic}',
      'can we talk about {topic}',
      'i\'d like to know about {topic}',
      'help me with {topic}'
    ]);
  }

  /**
   * Generate paraphrases for a question
   */
  generateParaphrases(question: string, count: number = 5): string[] {
    const topic = this.extractTopic(question);
    const questionType = this.detectQuestionType(question);
    const templates = this.paraphraseTemplates.get(questionType) || 
                     this.paraphraseTemplates.get('general')!;
    
    const paraphrases: string[] = [];
    const usedTemplates = new Set<number>();
    
    // Generate unique paraphrases
    while (paraphrases.length < count && usedTemplates.size < templates.length) {
      const index = Math.floor(Math.random() * templates.length);
      
      if (!usedTemplates.has(index)) {
        usedTemplates.add(index);
        const paraphrase = templates[index].replace('{topic}', topic);
        
        // Avoid duplicates
        if (!paraphrases.includes(paraphrase) && paraphrase !== question) {
          paraphrases.push(paraphrase);
        }
      }
    }
    
    return paraphrases;
  }

  /**
   * Generate paraphrased training examples
   */
  generateParaphrasedExamples(
    example: TrainingExample, 
    count: number = 3
  ): TrainingExample[] {
    const paraphrases = this.generateParaphrases(example.input, count);
    
    return paraphrases.map(phrase => {
      const newExample: TrainingExample = {
        input: phrase,
        output: example.output,
        category: example.category,
        confidence: example.confidence * 0.95, // Slightly lower confidence for paraphrases
        source: example.source,
        timestamp: new Date()
      };
      
      // Copy metadata if it exists
      if (example.metadata) {
        newExample.metadata = {
          ...example.metadata,
          type: 'paraphrase',
          originalInput: example.input
        };
      } else {
        newExample.metadata = {
          type: 'paraphrase',
          originalInput: example.input
        };
      }
      
      return newExample;
    });
  }

  /**
   * Extract topic from question
   */
  private extractTopic(question: string): string {
    // Remove question words and common phrases
    let topic = question
      .toLowerCase()
      .replace(/^(what|how|why|when|where|who|can you|tell me|explain|describe)\s+/i, '')
      .replace(/\s+(work|mean|is|are|do|does|happen|created|invented|used|responsible|known|help|founded|developed|involved|located|exists|find|go|should|was|will|occur|start|necessary|important|significance|purpose|causes|reason|timing|schedule|date|time|place|area|process|steps|done|about)\s*$/i, '')
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
    
    if (lower.startsWith('what')) return 'what';
    if (lower.startsWith('how')) return 'how';
    if (lower.startsWith('why')) return 'why';
    if (lower.startsWith('when')) return 'when';
    if (lower.startsWith('where')) return 'where';
    if (lower.startsWith('who')) return 'who';
    
    return 'general';
  }

  /**
   * Generate paraphrases for multiple examples
   */
  generateBatchParaphrases(
    examples: TrainingExample[], 
    paraphrasesPerExample: number = 3
  ): TrainingExample[] {
    const allParaphrases: TrainingExample[] = [];
    
    for (const example of examples) {
      const paraphrases = this.generateParaphrasedExamples(example, paraphrasesPerExample);
      allParaphrases.push(...paraphrases);
    }
    
    return allParaphrases;
  }

  /**
   * Get statistics about paraphrase generation
   */
  getStats(examples: TrainingExample[], paraphrasesPerExample: number = 3): {
    originalCount: number;
    paraphraseCount: number;
    totalCount: number;
    expansionFactor: number;
  } {
    const paraphraseCount = examples.length * paraphrasesPerExample;
    
    return {
      originalCount: examples.length,
      paraphraseCount,
      totalCount: examples.length + paraphraseCount,
      expansionFactor: (examples.length + paraphraseCount) / examples.length
    };
  }

  /**
   * Generate paraphrase report
   */
  generateReport(examples: TrainingExample[], paraphrasesPerExample: number = 3): string {
    const stats = this.getStats(examples, paraphrasesPerExample);
    
    let report = '**Paraphrase Generation Report**\n\n';
    report += `**Original Examples:** ${stats.originalCount}\n`;
    report += `**Paraphrases Generated:** ${stats.paraphraseCount}\n`;
    report += `**Total Examples:** ${stats.totalCount}\n`;
    report += `**Expansion Factor:** ${stats.expansionFactor.toFixed(2)}x\n\n`;
    
    // Show sample paraphrases
    if (examples.length > 0) {
      report += '**Sample Paraphrases:**\n\n';
      const sample = examples[0];
      const paraphrases = this.generateParaphrases(sample.input, 3);
      
      report += `Original: "${sample.input}"\n`;
      report += `Paraphrases:\n`;
      paraphrases.forEach((p, i) => {
        report += `  ${i + 1}. "${p}"\n`;
      });
    }
    
    return report;
  }
}

export const paraphraseGenerator = new ParaphraseGenerator();
