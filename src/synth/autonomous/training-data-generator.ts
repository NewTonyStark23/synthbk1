// Training Data Generator - Convert research to training examples
// Part of Autonomous Learning System - Week 3 Training Automation

import { WebResearchReport } from './web-integration';
import { ExtractedContent } from './content-extractor';

export interface TrainingExample {
  input: string;
  output: string;
  category: string;
  confidence: number;
  source: string;
  timestamp: Date;
  metadata?: {
    keywords?: string[];
    complexity?: 'simple' | 'moderate' | 'complex';
    type?: 'qa' | 'explanation' | 'instruction' | 'conversation' | 'paraphrase' | 'related';
    originalInput?: string;
  };
}

export class TrainingDataGenerator {
  /**
   * Generate training examples from web research
   */
  generateFromResearch(research: WebResearchReport): TrainingExample[] {
    const examples: TrainingExample[] = [];
    
    // Generate Q&A pairs from extracted content
    examples.push(...this.generateQAPairs(research));
    
    // Generate explanations from summaries
    examples.push(...this.generateExplanations(research));
    
    // Generate conversational examples
    examples.push(...this.generateConversations(research));
    
    // Generate instruction-based examples
    examples.push(...this.generateInstructions(research));
    
    return examples;
  }

  /**
   * Generate Q&A pairs from research content
   */
  private generateQAPairs(research: WebResearchReport): TrainingExample[] {
    const examples: TrainingExample[] = [];
    
    for (const content of research.extractedContent) {
      // Generate questions from keywords
      if (content.keywords && content.keywords.length > 0) {
        for (const keyword of content.keywords.slice(0, 3)) {
          examples.push({
            input: `what is ${keyword}`,
            output: this.extractRelevantContent(content, keyword),
            category: 'qa',
            confidence: research.confidence?.overall || 0.7,
            source: content.url,
            timestamp: new Date(),
            metadata: {
              keywords: [keyword],
              complexity: 'simple',
              type: 'qa'
            }
          });
        }
      }
      
      // Generate questions from title
      if (content.title) {
        examples.push({
          input: `tell me about ${content.title}`,
          output: content.summary || content.content.substring(0, 500),
          category: 'qa',
          confidence: research.confidence?.overall || 0.7,
          source: content.url,
          timestamp: new Date(),
          metadata: {
            keywords: content.keywords,
            complexity: 'moderate',
            type: 'qa'
          }
        });
      }
    }
    
    return examples;
  }

  /**
   * Generate explanations from content
   */
  private generateExplanations(research: WebResearchReport): TrainingExample[] {
    const examples: TrainingExample[] = [];
    
    for (const content of research.extractedContent) {
      if (content.summary && content.summary.length > 50) {
        // Generate "explain" questions
        examples.push({
          input: `explain ${research.query}`,
          output: content.summary,
          category: 'explanation',
          confidence: research.confidence?.overall || 0.7,
          source: content.url,
          timestamp: new Date(),
          metadata: {
            keywords: content.keywords,
            complexity: 'moderate',
            type: 'explanation'
          }
        });
        
        // Generate "how does" questions
        examples.push({
          input: `how does ${research.query} work`,
          output: this.generateHowItWorks(content),
          category: 'explanation',
          confidence: research.confidence?.overall || 0.7,
          source: content.url,
          timestamp: new Date(),
          metadata: {
            keywords: content.keywords,
            complexity: 'complex',
            type: 'explanation'
          }
        });
      }
    }
    
    return examples;
  }

  /**
   * Generate conversational examples
   */
  private generateConversations(research: WebResearchReport): TrainingExample[] {
    const examples: TrainingExample[] = [];
    
    // Generate casual conversation starters
    const casualStarters = [
      `hey, can you tell me about ${research.query}?`,
      `i'm curious about ${research.query}`,
      `what do you know about ${research.query}?`,
      `can you explain ${research.query} to me?`
    ];
    
    for (const content of research.extractedContent.slice(0, 2)) {
      for (const starter of casualStarters) {
        examples.push({
          input: starter,
          output: content.summary || `Based on my research, ${research.query} is ${content.content.substring(0, 200)}...`,
          category: 'conversation',
          confidence: research.confidence?.overall || 0.6,
          source: content.url,
          timestamp: new Date(),
          metadata: {
            keywords: content.keywords,
            complexity: 'simple',
            type: 'conversation'
          }
        });
      }
    }
    
    return examples;
  }

  /**
   * Generate instruction-based examples
   */
  private generateInstructions(research: WebResearchReport): TrainingExample[] {
    const examples: TrainingExample[] = [];
    
    // Generate "how to" questions
    const howToTemplates = [
      `how to learn about ${research.query}`,
      `how to understand ${research.query}`,
      `how to use ${research.query}`,
      `how to implement ${research.query}`
    ];
    
    for (const content of research.extractedContent.slice(0, 2)) {
      for (const template of howToTemplates) {
        examples.push({
          input: template,
          output: this.generateInstruction(content, research.query),
          category: 'instruction',
          confidence: research.confidence?.overall || 0.65,
          source: content.url,
          timestamp: new Date(),
          metadata: {
            keywords: content.keywords,
            complexity: 'complex',
            type: 'instruction'
          }
        });
      }
    }
    
    return examples;
  }

  /**
   * Extract relevant content for a keyword
   */
  private extractRelevantContent(content: ExtractedContent, keyword: string): string {
    // Find sentences containing the keyword
    const sentences = content.content.split(/[.!?]+/);
    const relevant = sentences.filter((s: string) => 
      s.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (relevant.length > 0) {
      return relevant.slice(0, 3).join('. ').trim() + '.';
    }
    
    // Fallback to summary
    return content.summary || content.content.substring(0, 300);
  }

  /**
   * Generate "how it works" explanation
   */
  private generateHowItWorks(content: ExtractedContent): string {
    let explanation = `${content.title} works by `;
    
    // Extract key points from content
    if (content.keywords && content.keywords.length > 0) {
      explanation += `utilizing ${content.keywords.slice(0, 3).join(', ')}. `;
    }
    
    // Add summary
    if (content.summary) {
      explanation += content.summary;
    } else {
      explanation += content.content.substring(0, 300) + '...';
    }
    
    return explanation;
  }

  /**
   * Generate instruction-based response
   */
  private generateInstruction(content: ExtractedContent, topic: string): string {
    let instruction = `To ${topic}, follow these steps:\n\n`;
    
    // Generate steps from content
    if (content.summary) {
      const sentences = content.summary.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
      sentences.forEach((sentence: string, i: number) => {
        instruction += `${i + 1}. ${sentence.trim()}\n`;
      });
    }
    
    // Add additional guidance
    instruction += `\nFor more detailed information, refer to: ${content.url}`;
    
    return instruction;
  }

  /**
   * Generate training examples from a single topic
   */
  generateFromTopic(topic: string, examples: TrainingExample[]): TrainingExample[] {
    const generated: TrainingExample[] = [];
    
    // Generate variations of existing examples
    for (const example of examples) {
      // Paraphrase the input
      generated.push({
        ...example,
        input: this.paraphraseQuestion(example.input, topic)
      });
      
      // Generate related questions
      const related = this.generateRelatedQuestions(topic, example);
      generated.push(...related);
    }
    
    return generated;
  }

  /**
   * Paraphrase a question
   */
  private paraphraseQuestion(question: string, topic: string): string {
    const templates = [
      `can you explain ${topic}?`,
      `tell me about ${topic}`,
      `what is ${topic}?`,
      `how does ${topic} work?`,
      `i want to learn about ${topic}`,
      `give me information on ${topic}`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Generate related questions
   */
  private generateRelatedQuestions(topic: string, example: TrainingExample): TrainingExample[] {
    const questions: TrainingExample[] = [];
    
    // Generate follow-up questions
    const followUps = [
      `what are the benefits of ${topic}?`,
      `what are the drawbacks of ${topic}?`,
      `how is ${topic} different from similar concepts?`,
      `what are common use cases for ${topic}?`
    ];
    
    for (const question of followUps) {
      questions.push({
        input: question,
        output: example.output,
        category: example.category,
        confidence: example.confidence * 0.9, // Slightly lower confidence
        source: example.source,
        timestamp: new Date(),
        metadata: example.metadata
      });
    }
    
    return questions;
  }

  /**
   * Estimate the number of examples that can be generated
   */
  estimateExampleCount(research: WebResearchReport): number {
    let count = 0;
    
    // Q&A pairs: ~3 per content
    count += research.extractedContent.length * 3;
    
    // Explanations: ~2 per content
    count += research.extractedContent.length * 2;
    
    // Conversations: ~4 per content (limited to 2 contents)
    count += Math.min(research.extractedContent.length, 2) * 4;
    
    // Instructions: ~4 per content (limited to 2 contents)
    count += Math.min(research.extractedContent.length, 2) * 4;
    
    return count;
  }
}

export const trainingDataGenerator = new TrainingDataGenerator();
