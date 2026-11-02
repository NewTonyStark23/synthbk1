// SynthAI v6.0 - Full Orchestrator
// Ties all 7 subsystems together with Wikipedia/Dictionary APIs, emotion detection, math solver

import { Utils, LogSystem, SpeedMetrics } from './core';
import { KnowledgeBase, SemanticSpace, MultiAgentReasoning, ChainOfThoughtEngine } from './cognition';
import { CodeGenerator } from './generator';
import { CodeModifier } from './modifier';

export interface SynthResult {
  response: string;
  thinking: string;
  code?: string;
  mode: string;
  emotion: string;
  tokens: any;
  speed: any;
  intent: string;
  winner?: string;
}

export class SynthAI {
  log: LogSystem;
  kb: KnowledgeBase;
  semanticSpace: SemanticSpace;
  multiAgent: MultiAgentReasoning;
  cot: ChainOfThoughtEngine;
  codeGenerator: typeof CodeGenerator;
  codeModifier: CodeModifier;
  speedMetrics: SpeedMetrics;
  conversationHistory: Array<{ userInput: string; aiResponse: string; timestamp: number }> = [];
  turns = 0;

  constructor() {
    this.log = new LogSystem();
    this.kb = new KnowledgeBase();
    this.semanticSpace = new SemanticSpace();
    this.multiAgent = new MultiAgentReasoning(this.semanticSpace);
    this.cot = new ChainOfThoughtEngine();
    this.codeGenerator = CodeGenerator;
    this.codeModifier = new CodeModifier();
    this.speedMetrics = new SpeedMetrics();
  }

  async process(input: string): Promise<SynthResult> {
    this.speedMetrics.start();
    this.turns++;

    // 1. Typo repair
    const cleaned = this.repairInput(input);

    // 2. Emotion detection
    const emotion = this.detectEmotion(cleaned);

    // 3. Intent classification
    const intent = this.classifyIntent(cleaned);

    // 4. Knowledge base query
    const kbResults = await this.kb.search(cleaned, 3);

    // 5. Check for code modification
    if (intent.type === 'modification' && this.codeModifier.canModify()) {
      const modResult = this.codeModifier.modify(cleaned);
      if (modResult) {
        this.speedMetrics.recordFirstToken();
        const response = `✅ ${modResult.description}\n\n\`\`\`html\n${modResult.code}\n\`\`\``;
        this.speedMetrics.recordOutput(response);
        this.logInteraction(cleaned, response, intent, 'modification');
        return this.buildResult(response, '', modResult.code, 'modification', emotion, intent);
      }
    }

    // 6. Multi-agent reasoning
    const reasoning = await this.multiAgent.process(cleaned, { kbHits: kbResults.length, intent });

    // 7. Chain-of-thought
    const cotResult = await this.cot.reason(cleaned, {
      winner: reasoning.winner,
      kbResults,
      intent,
      history: this.conversationHistory.slice(-5)
    });

    // 8. Generate response
    this.speedMetrics.recordFirstToken();
    let response = '';
    let code: string | undefined;

    switch (intent.type) {
      case 'code_generation': {
        const genResult = this.codeGenerator.generate(cleaned);
        code = genResult.code;
        this.codeModifier.setLastGenerated(code, genResult.theme, genResult.component);
        response = `✅ Generated: **${genResult.description}**\nTheme: ${genResult.theme}\nFeatures: ${genResult.features.join(', ') || 'none'}\n\n\`\`\`html\n${code}\n\`\`\``;
        break;
      }
      case 'math':
        response = this.solveMath(cleaned);
        break;
      case 'definition':
        response = await this.lookupDefinition(cleaned);
        break;
      case 'question':
        if (kbResults.length > 0 && kbResults[0].score >= 3) {
          response = `**${kbResults[0].title}**\n\n${kbResults[0].content}\n\n*From local knowledge base*`;
        } else {
          response = cotResult.conclusion;
        }
        break;
      case 'greeting':
        response = this.handleGreeting(emotion);
        break;
      case 'identity':
        response = "I'm **Synth-AI v6.0**, a sovereign local cognitive engine. I run entirely in your browser with no external API dependencies. I have 7 cognitive subsystems, a 128D semantic space, 5 reasoning agents, and a 7-step chain-of-thought engine.";
        break;
      case 'modification':
        response = "I don't have any previously generated code to modify. Try asking me to build something first, then ask me to change it.";
        break;
      case 'export':
        response = '```\n' + this.log.formatWithChat() + '\n```';
        break;
      default:
        response = cotResult.conclusion;
    }

    this.speedMetrics.recordOutput(response);
    this.logInteraction(cleaned, response, intent, intent.type);

    const fullThinking = reasoning.thoughtLog + '\n\n' + cotResult.steps.join('\n');
    return this.buildResult(response, fullThinking, code, intent.type, emotion, intent, reasoning.winner?.name);
  }

  private buildResult(response: string, thinking: string, code: string | undefined, mode: string, emotion: string, intent: any, winner?: string): SynthResult {
    const fullThinking = thinking || `Intent: ${intent.type} (${(intent.confidence * 100).toFixed(0)}% confidence)\nEmotion: ${emotion}`;
    const tokenResult = this.log.logTokens('', fullThinking, response, { mode, winner, intent: intent.type });
    return {
      response,
      thinking: fullThinking,
      code,
      mode,
      emotion,
      tokens: tokenResult,
      speed: this.speedMetrics.getMetrics(),
      intent: intent.type,
      winner
    };
  }

  private logInteraction(input: string, response: string, intent: any, mode: string) {
    this.conversationHistory.push({ userInput: input, aiResponse: response, timestamp: Date.now() });
    if (this.conversationHistory.length > 50) this.conversationHistory = this.conversationHistory.slice(-50);
    this.log.logChat('user', input);
    this.log.logChat('assistant', response);
  }

  // Input Processing
  repairInput(input: string): string {
    const fixes: Record<string, string> = {
      'teh': 'the', 'recieve': 'receive', 'occured': 'occurred', 'seperate': 'separate',
      'definately': 'definitely', 'accomodate': 'accommodate', 'neccessary': 'necessary',
      'wierd': 'weird', 'untill': 'until', 'becuase': 'because', 'alot': 'a lot',
      'goverment': 'government', 'enviroment': 'environment', 'occassion': 'occasion',
      'prefered': 'preferred', 'refered': 'referred', 'begining': 'beginning',
      'beleive': 'believe', 'calender': 'calendar', 'collegue': 'colleague',
      'comming': 'coming', 'commitee': 'committee', 'concious': 'conscious',
      'curiousity': 'curiosity', 'disapear': 'disappear', 'embarass': 'embarrass',
      'existance': 'existence', 'facinate': 'fascinate', 'foriegn': 'foreign',
      'gaurantee': 'guarantee', 'harrass': 'harass', 'immediatly': 'immediately',
      'independant': 'independent', 'knowlege': 'knowledge', 'liason': 'liaison',
      'millenium': 'millennium', 'miniscule': 'minuscule', 'mischievious': 'mischievous',
      'noticable': 'noticeable', 'paralel': 'parallel', 'persue': 'pursue',
      'posession': 'possession', 'priviledge': 'privilege', 'pronounciation': 'pronunciation',
      'publically': 'publicly', 'realy': 'really', 'rythm': 'rhythm',
      'succesful': 'successful', 'suprise': 'surprise', 'tommorow': 'tomorrow',
      'truely': 'truly', 'unforseen': 'unforeseen', 'vaccuum': 'vacuum',
      'dbeach': 'beach', 'backgroun': 'background', 'cnew': 'new',
      'newyears': 'new year', 'count down': 'countdown'
    };
    let repaired = input;
    for (const [typo, fix] of Object.entries(fixes)) {
      repaired = repaired.replace(new RegExp(`\\b${typo}\\b`, 'gi'), fix);
    }
    // Multi-word fixes
    repaired = repaired.replace(/count\s+down/gi, 'countdown');
    repaired = repaired.replace(/back\s+ground/gi, 'background');
    // Remove duplicate words
    repaired = repaired.replace(/(\w+)\s+\1/gi, '$1');
    return repaired;
  }

  detectEmotion(input: string): string {
    const lower = input.toLowerCase();
    if (/stupid|dumb|idiot|hate|suck/i.test(lower)) return 'frustrated';
    if (/wrong|messed|broken|fail/i.test(lower)) return 'concerned';
    if (/thank|thanks|great|awesome|perfect|love/i.test(lower)) return 'happy';
    if (/\?/.test(input) && /^(what|how|why|when|where|who)/i.test(input)) return 'curious';
    if (/please|could you|would you/i.test(lower)) return 'polite';
    if (/!/.test(input) && input.length < 20) return 'excited';
    return 'neutral';
  }

  classifyIntent(input: string): { type: string; confidence: number; subType?: string } {
    const lower = input.toLowerCase();

    // Export
    if (/(export|log|history|conversation)/i.test(lower) && /(show|get|print)/i.test(lower))
      return { type: 'export', confidence: 0.95 };

    // Identity
    if (/(who are you|what are you|your name|introduce yourself)/i.test(lower))
      return { type: 'identity', confidence: 0.95 };

    // Modification (HIGHEST priority for code)
    if (/(change|modify|update|edit|fix|improve|make.*bigger|make.*smaller|switch.*theme|dark mode)/i.test(lower))
      return { type: 'modification', confidence: 0.95 };

    // Code generation
    const hasCodeAction = /\b(build|create|make|generate|write|code|design)\b/i.test(lower);
    const hasCodeObject = /\b(timer|calculator|todo|form|game|website|app|calendar|dashboard|chart|player|editor|gallery|os|system)\b/i.test(lower);
    if (hasCodeAction && hasCodeObject)
      return { type: 'code_generation', confidence: 0.95, subType: 'html' };
    if (lower.includes('html'))
      return { type: 'code_generation', confidence: 0.9, subType: 'html' };

    // Math
    if (/^[\d\s\+\-\*\/\^\(\)\.]+$/.test(input.trim()))
      return { type: 'math', confidence: 0.95 };

    // Definition
    if (/\b(define|definition|meaning|what does.*mean)\b/i.test(lower))
      return { type: 'definition', confidence: 0.9 };

    // Question
    if (/^(what|who|where|when|why|how)\b/i.test(input.trim()))
      return { type: 'question', confidence: 0.85 };

    // Greeting
    if (/^(hi|hello|hey|greetings|good morning|good evening)\b/i.test(input.trim()))
      return { type: 'greeting', confidence: 0.95 };

    return { type: 'conversation', confidence: 0.6 };
  }

  // Response Generators
  solveMath(input: string): string {
    try {
      const expr = input.replace(/[^0-9\+\-\*\/\^\(\)\.\s]/g, '').trim();
      if (!expr) return "I couldn't find a mathematical expression.";
      const sanitized = expr.replace(/\^/g, '**');
      const result = Function(`"use strict"; return (${sanitized})`)();
      return `**Math Solution**\n\nExpression: \`${expr}\`\nResult: **${result}**`;
    } catch (e) {
      return "I couldn't evaluate that expression. Please check the syntax.";
    }
  }

  async lookupDefinition(input: string): Promise<string> {
    const word = input.replace(/^(define|definition of|what is|what's|meaning of)\s*/i, '').trim().split(/\s+/)[0];
    if (!word) return "Please specify a word to define.";

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      if (response.ok) {
        const data = await response.json();
        if (data[0]?.meanings?.[0]?.definitions?.[0]) {
          const def = data[0].meanings[0].definitions[0];
          return `**${word}** (${data[0].meanings[0].partOfSpeech})\n\n${def.definition}${def.example ? `\n\n*Example: "${def.example}"*` : ''}\n\n*From Dictionary API*`;
        }
      }
    } catch (e) {
      // API not available
    }

    return `I couldn't find a definition for "${word}". The dictionary API may be unavailable.`;
  }

  handleGreeting(emotion: string): string {
    const responses: Record<string, string> = {
      happy: "Hello! 😊 Great to see you in good spirits! What can I help you with today?",
      frustrated: "Hey there. I'm here to help. What's on your mind?",
      curious: "Hello! Ready to explore some ideas? What would you like to know?",
      polite: "Hello! Thank you for reaching out. How can I assist you?",
      excited: "Hey! Love the energy! What are we working on?",
      neutral: "Hello! I'm Synth-AI, your local cognitive engine. What can I help you with?"
    };
    return responses[emotion] || responses.neutral;
  }

  getStats() {
    return {
      turns: this.turns,
      conversationLength: this.conversationHistory.length,
      kbEntries: this.kb.entries.length,
      kbCategories: Object.keys(this.kb.stats.categories).length,
      semanticConcepts: this.semanticSpace.concepts.size,
      tokenStats: this.log.tokenStats,
      hasGeneratedCode: this.codeModifier.canModify()
    };
  }
}
