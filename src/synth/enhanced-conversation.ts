// Enhanced Conversation & Self-Reasoning System
// Fixes: generic responses, pronoun resolution, code generation detection, user style adaptation

import { Utils } from './utils';

// ============================================
// User Style Detector
// ============================================

export interface UserStyle {
  formality: 'casual' | 'neutral' | 'formal';
  verbosity: 'brief' | 'moderate' | 'detailed';
  technicality: 'layman' | 'intermediate' | 'expert';
  tone: 'friendly' | 'neutral' | 'professional';
}

export class UserStyleDetector {
  detectStyle(input: string, history: string[] = []): UserStyle {
    const allText = [input, ...history].join(' ').toLowerCase();
    
    // Detect formality
    let formality: UserStyle['formality'] = 'neutral';
    const casualMarkers = ['gonna', 'wanna', 'gotta', 'yeah', 'cool', 'awesome', 'lol', 'btw'];
    const formalMarkers = ['therefore', 'furthermore', 'consequently', 'henceforth', 'whereas'];
    
    const casualCount = casualMarkers.filter(m => allText.includes(m)).length;
    const formalCount = formalMarkers.filter(m => allText.includes(m)).length;
    
    if (casualCount > formalCount + 1) formality = 'casual';
    else if (formalCount > casualCount + 1) formality = 'formal';
    
    // Detect verbosity
    let verbosity: UserStyle['verbosity'] = 'moderate';
    const avgLength = allText.split(/\s+/).length / Math.max(1, history.length + 1);
    
    if (avgLength < 10) verbosity = 'brief';
    else if (avgLength > 30) verbosity = 'detailed';
    
    // Detect technicality
    let technicality: UserStyle['technicality'] = 'intermediate';
    const techTerms = ['algorithm', 'function', 'variable', 'api', 'database', 'server', 'client'];
    const simpleTerms = ['thing', 'stuff', 'make', 'do', 'get'];
    
    const techCount = techTerms.filter(t => allText.includes(t)).length;
    const simpleCount = simpleTerms.filter(t => allText.includes(t)).length;
    
    if (techCount > simpleCount + 2) technicality = 'expert';
    else if (simpleCount > techCount + 2) technicality = 'layman';
    
    // Detect tone
    let tone: UserStyle['tone'] = 'neutral';
    const friendlyMarkers = ['please', 'thanks', 'thank you', 'awesome', 'great', 'cool'];
    const professionalMarkers = ['request', 'require', 'need', 'must', 'should'];
    
    const friendlyCount = friendlyMarkers.filter(m => allText.includes(m)).length;
    const professionalCount = professionalMarkers.filter(m => allText.includes(m)).length;
    
    if (friendlyCount > professionalCount + 1) tone = 'friendly';
    else if (professionalCount > friendlyCount + 1) tone = 'professional';
    
    return { formality, verbosity, technicality, tone };
  }
  
  adaptResponse(response: string, style: UserStyle): string {
    let adapted = response;
    
    // Adjust formality
    if (style.formality === 'casual') {
      adapted = adapted.replace(/therefore/gi, 'so');
      adapted = adapted.replace(/furthermore/gi, 'also');
      adapted = adapted.replace(/consequently/gi, 'so');
    } else if (style.formality === 'formal') {
      adapted = adapted.replace(/\bso\b/gi, 'therefore');
      adapted = adapted.replace(/\balso\b/gi, 'furthermore');
    }
    
    // Adjust verbosity
    if (style.verbosity === 'brief') {
      // Remove excessive explanations
      const sentences = adapted.split(/[.!?]+/);
      if (sentences.length > 3) {
        adapted = sentences.slice(0, 3).join('. ') + '.';
      }
    }
    
    // Adjust technicality
    if (style.technicality === 'layman') {
      adapted = adapted.replace(/algorithm/gi, 'step-by-step process');
      adapted = adapted.replace(/function/gi, 'tool');
      adapted = adapted.replace(/variable/gi, 'container');
    }
    
    // Adjust tone
    if (style.tone === 'friendly') {
      if (!adapted.includes('😊') && !adapted.includes('👍')) {
        adapted += ' 👍';
      }
    }
    
    return adapted;
  }
}

// ============================================
// Self-Verification System
// ============================================

export class SelfVerification {
  verifyResponse(response: string, input: string, intent: string): {
    verified: boolean;
    issues: string[];
    confidence: number;
  } {
    const issues: string[] = [];
    let confidence = 1.0;
    
    // Check 1: Did we answer the question?
    if (input.includes('?') && !response.includes('?')) {
      // Question was asked but no clarification in response
      const inputKeywords = Utils.extractKeywords(input);
      const responseKeywords = Utils.extractKeywords(response);
      const overlap = inputKeywords.filter(k => responseKeywords.includes(k)).length;
      
      if (overlap < inputKeywords.length * 0.3) {
        issues.push('Response may not address the question');
        confidence -= 0.3;
      }
    }
    
    // Check 2: Did we generate code when asked?
    if (intent === 'code_generation') {
      const hasCode = response.includes('```') || response.includes('<!DOCTYPE') || response.includes('function');
      if (!hasCode) {
        issues.push('Code was requested but not generated');
        confidence -= 0.5;
      }
    }
    
    // Check 3: Response length appropriateness
    const inputLength = input.split(/\s+/).length;
    const responseLength = response.split(/\s+/).length;
    
    if (inputLength < 10 && responseLength > 200) {
      issues.push('Response is too long for a simple query');
      confidence -= 0.2;
    }
    
    // Check 4: Generic filler detection
    const fillerPhrases = [
      'at the most basic level',
      'fundamental principles',
      'underlying principles',
      'govern this domain',
      'foundation for all'
    ];
    
    const hasFiller = fillerPhrases.some(phrase => response.toLowerCase().includes(phrase));
    if (hasFiller) {
      issues.push('Response contains generic filler text');
      confidence -= 0.4;
    }
    
    // Check 5: Pronoun resolution
    if (/\b(it|this|that|they)\b/i.test(input)) {
      // Check if response clarifies what the pronoun refers to
      const hasClarification = response.toLowerCase().includes('you mentioned') || 
                               response.toLowerCase().includes('you asked') ||
                               response.toLowerCase().includes('referring to');
      if (!hasClarification && input.length < 30) {
        issues.push('Pronoun reference may be unclear');
        confidence -= 0.2;
      }
    }
    
    return {
      verified: issues.length === 0,
      issues,
      confidence: Math.max(0, confidence)
    };
  }
  
  generateVerificationReport(verification: { verified: boolean; issues: string[]; confidence: number }): string {
    let report = '**Self-Verification Report**\n\n';
    report += `**Status:** ${verification.verified ? '✅ Verified' : '⚠️ Issues Detected'}\n`;
    report += `**Confidence:** ${(verification.confidence * 100).toFixed(0)}%\n\n`;
    
    if (verification.issues.length > 0) {
      report += '**Issues:**\n';
      verification.issues.forEach(issue => {
        report += `- ${issue}\n`;
      });
    }
    
    return report;
  }
}

// ============================================
// Enhanced Conversation Handler
// ============================================

export class EnhancedConversationHandler {
  private styleDetector: UserStyleDetector;
  private verifier: SelfVerification;
  
  constructor() {
    this.styleDetector = new UserStyleDetector();
    this.verifier = new SelfVerification();
  }
  
  handleConversation(
    input: string, 
    history: string[], 
    intent: string,
    currentResponse: string
  ): string {
    const lower = input.toLowerCase();
    
    // 1. Handle test/check messages
    if (/\b(testing|test|is this (thing )?on|can you hear me|are you there)\b/i.test(lower)) {
      return "Yep, I'm here! 🎯 What do you need?";
    }
    
    // 2. Handle simple acknowledgments
    if (/\b(ok|okay|sure|yes|yeah|got it|understood|thanks|thank you|cool|awesome)\b/i.test(lower)) {
      return "Got it! What's next?";
    }
    
    // 3. Handle "how are you" type questions
    if (/\b(how are you|how('s| is) it going|what('s| is) up|how do you do)\b/i.test(lower)) {
      return "Doing great! Ready to help. What do you need?";
    }
    
    // 4. Handle "what can you do" questions
    if (/\b(what can you do|what are your capabilities|help me with|what do you know)\b/i.test(lower)) {
      return "I can:\n" +
             "• Build websites, apps, calculators\n" +
             "• Analyze code for security issues\n" +
             "• Solve math problems\n" +
             "• Write stories and poems\n" +
             "• Translate languages\n" +
             "• Analyze stocks and crypto\n" +
             "• And more - just ask!";
    }
    
    // 5. Handle questions that don't match specific patterns
    if (lower.includes('?')) {
      return "Good question! Can you give me a bit more detail so I can help better?";
    }
    
    // 6. Default - keep it short and friendly
    return "I'm listening. What do you need help with?";
  }
  
  adaptToUser(response: string, input: string, history: string[]): string {
    const style = this.styleDetector.detectStyle(input, history);
    return this.styleDetector.adaptResponse(response, style);
  }
  
  verify(response: string, input: string, intent: string): {
    verified: boolean;
    issues: string[];
    confidence: number;
  } {
    return this.verifier.verifyResponse(response, input, intent);
  }
}

// ============================================
// Context-Aware Pronoun Resolver
// ============================================

export class ContextualPronounResolver {
  resolve(
    pronoun: string, 
    currentInput: string, 
    history: Array<{ role: string; content: string }>
  ): string | null {
    const pronounLower = pronoun.toLowerCase();
    
    // Check current input for explicit references
    const currentEntities = this.extractEntities(currentInput);
    if (currentEntities.length > 0) {
      return currentEntities[0];
    }
    
    // Check conversation history (last 5 messages)
    const recentHistory = history.slice(-5);
    
    for (let i = recentHistory.length - 1; i >= 0; i--) {
      const msg = recentHistory[i];
      const entities = this.extractEntities(msg.content);
      
      if (entities.length > 0) {
        // Match pronoun to entity based on gender/number
        const matchedEntity = this.matchPronounToEntity(pronounLower, entities);
        if (matchedEntity) {
          return matchedEntity;
        }
      }
    }
    
    return null;
  }
  
  private extractEntities(text: string): string[] {
    const entities: string[] = [];
    
    // Extract code-related entities
    const codePatterns = [
      /(?:build|create|make|generate)\s+(?:a\s+)?(\w+)/gi,
      /(?:the|this|that)\s+(\w+)\s+(?:code|app|website|program)/gi,
      /(\w+)\s+(?:timer|calculator|game|website|app)/gi
    ];
    
    codePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        entities.push(match[1].toLowerCase());
      }
    });
    
    // Extract proper nouns (capitalized words)
    const properNounPattern = /\b([A-Z][a-z]+)\b/g;
    let match;
    while ((match = properNounPattern.exec(text)) !== null) {
      entities.push(match[1].toLowerCase());
    }
    
    return [...new Set(entities)]; // Remove duplicates
  }
  
  private matchPronounToEntity(pronoun: string, entities: string[]): string | null {
    if (entities.length === 0) return null;
    
    // Simple matching - return most recent entity
    // In production, would use more sophisticated gender/number matching
    return entities[0];
  }
}

// ============================================
// Response Length Optimizer
// ============================================

export class ResponseLengthOptimizer {
  optimize(response: string, inputLength: number, context: string = 'general'): string {
    const inputWords = inputLength;
    const responseWords = response.split(/\s+/).length;
    
    // Determine target length based on input complexity
    let targetMultiplier = 3; // Default: response is 3x input length
    
    if (context === 'code_generation') {
      targetMultiplier = 10; // Code responses can be longer
    } else if (context === 'explanation') {
      targetMultiplier = 5; // Explanations need more detail
    } else if (context === 'greeting') {
      targetMultiplier = 2; // Greetings should be brief
    }
    
    const targetWords = Math.max(20, inputWords * targetMultiplier);
    
    // If response is too long, truncate intelligently
    if (responseWords > targetWords * 1.5) {
      return this.truncateIntelligently(response, targetWords);
    }
    
    return response;
  }
  
  private truncateIntelligently(response: string, targetWords: number): string {
    const sentences = response.split(/(?<=[.!?])\s+/);
    let result = '';
    let wordCount = 0;
    
    for (const sentence of sentences) {
      const sentenceWords = sentence.split(/\s+/).length;
      
      if (wordCount + sentenceWords > targetWords) {
        break;
      }
      
      result += sentence + ' ';
      wordCount += sentenceWords;
    }
    
    return result.trim() || response.substring(0, targetWords * 5); // Fallback to character limit
  }
}

// ============================================
// Export all enhanced systems
// ============================================

export const EnhancedConversationSystems = {
  UserStyleDetector,
  SelfVerification,
  EnhancedConversationHandler,
  ContextualPronounResolver,
  ResponseLengthOptimizer,
};
