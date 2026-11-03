// Universal Capability - Items 21.1-21.10
// "It just works" for anything

import { Utils } from './utils';

// ============================================
// ITEM 21.1: Universal Intent Classifier
// Classify ANY intent, even novel ones
// ============================================
export class UniversalIntentClassifier {
  private intentPatterns: Map<string, { patterns: RegExp[]; confidence: number }> = new Map();
  private novelIntents: Map<string, number> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.intentPatterns.set('question', {
      patterns: [/^(what|who|where|when|why|how)\b/i, /\?$/],
      confidence: 0.85
    });

    this.intentPatterns.set('command', {
      patterns: [/\b(build|create|make|generate|write|code)\b/i],
      confidence: 0.8
    });

    this.intentPatterns.set('greeting', {
      patterns: [/^(hi|hello|hey|greetings)\b/i],
      confidence: 0.9
    });

    this.intentPatterns.set('math', {
      patterns: [/^[\d\s\+\-\*\/\^\(\)]+$/],
      confidence: 0.95
    });

    this.intentPatterns.set('modification', {
      patterns: [/\b(change|modify|update|edit|fix)\b/i],
      confidence: 0.75
    });

    this.intentPatterns.set('explanation', {
      patterns: [/\b(explain|describe|tell me about|what is)\b/i],
      confidence: 0.8
    });

    this.intentPatterns.set('comparison', {
      patterns: [/\b(compare|difference|versus|vs|better|worse)\b/i],
      confidence: 0.75
    });

    this.intentPatterns.set('recommendation', {
      patterns: [/\b(recommend|suggest|best|should i|which)\b/i],
      confidence: 0.7
    });
  }

  classify(text: string): Array<{ intent: string; confidence: number }> {
    const textLower = text.toLowerCase();
    const results: Array<{ intent: string; confidence: number }> = [];

    // Check known patterns
    for (const [intent, data] of this.intentPatterns.entries()) {
      const matchedPatterns = data.patterns.filter(p => p.test(textLower)).length;
      if (matchedPatterns > 0) {
        results.push({
          intent,
          confidence: data.confidence * (matchedPatterns / data.patterns.length)
        });
      }
    }

    // If no known intent matches, try to infer novel intent
    if (results.length === 0) {
      const novelIntent = this.inferNovelIntent(text);
      if (novelIntent) {
        results.push({ intent: novelIntent, confidence: 0.5 });
      }
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  private inferNovelIntent(text: string): string | null {
    const keywords = Utils.extractKeywords(text);
    
    if (keywords.length === 0) return null;

    // Try to categorize based on keywords
    const keywordStr = keywords.join(' ').toLowerCase();
    
    if (keywordStr.includes('how') || keywordStr.includes('why')) {
      return 'explanation';
    }
    if (keywordStr.includes('help') || keywordStr.includes('assist')) {
      return 'request_help';
    }
    if (keywordStr.includes('opinion') || keywordStr.includes('think')) {
      return 'seek_opinion';
    }

    // Store as novel intent
    const novelKey = `novel_${Date.now()}`;
    this.novelIntents.set(novelKey, 1);
    
    return 'unknown';
  }

  getTopIntent(text: string): { intent: string; confidence: number } | null {
    const results = this.classify(text);
    return results.length > 0 ? results[0] : null;
  }

  addIntent(intent: string, patterns: RegExp[], confidence: number) {
    this.intentPatterns.set(intent, { patterns, confidence });
  }

  getNovelIntents(): Map<string, number> {
    return new Map(this.novelIntents);
  }
}

// ============================================
// ITEM 21.2: Multi-Task Routing
// Route to appropriate handler, combine capabilities
// ============================================
export class MultiTaskRouter {
  private handlers: Map<string, (input: string) => Promise<string>> = new Map();
  private capabilities: Map<string, string[]> = new Map();

  registerHandler(task: string, handler: (input: string) => Promise<string>, requiredCapabilities: string[]) {
    this.handlers.set(task, handler);
    this.capabilities.set(task, requiredCapabilities);
  }

  async route(input: string, availableCapabilities: string[]): Promise<{ 
    task: string; 
    result: string; 
    combined: boolean 
  } | null> {
    // Find tasks that match available capabilities
    const matchingTasks: Array<{ task: string; matchScore: number }> = [];

    for (const [task, required] of this.capabilities.entries()) {
      const matchCount = required.filter(cap => availableCapabilities.includes(cap)).length;
      const matchScore = matchCount / required.length;
      
      if (matchScore > 0.5) {
        matchingTasks.push({ task, matchScore });
      }
    }

    if (matchingTasks.length === 0) return null;

    // Sort by match score
    matchingTasks.sort((a, b) => b.matchScore - a.matchScore);

    // Execute best matching task
    const bestTask = matchingTasks[0];
    const handler = this.handlers.get(bestTask.task);
    
    if (!handler) return null;

    const result = await handler(input);

    return {
      task: bestTask.task,
      result,
      combined: bestTask.matchScore < 1.0
    };
  }

  getAvailableTasks(): string[] {
    return Array.from(this.handlers.keys());
  }

  getTaskCapabilities(task: string): string[] {
    return this.capabilities.get(task) || [];
  }
}

// ============================================
// ITEM 21.3: Capability Detection
// Detect what capabilities are needed
// ============================================
export class CapabilityDetector {
  private capabilityPatterns: Map<string, RegExp[]> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.capabilityPatterns.set('code_generation', [
      /\b(build|create|make|generate|code|program)\b/i,
      /\b(website|app|calculator|timer|game)\b/i
    ]);

    this.capabilityPatterns.set('math', [
      /^[\d\s\+\-\*\/\^\(\)]+$/,
      /\b(calculate|solve|compute)\b/i
    ]);

    this.capabilityPatterns.set('explanation', [
      /\b(explain|describe|what is|how does)\b/i,
      /\b(understand|learn|teach)\b/i
    ]);

    this.capabilityPatterns.set('modification', [
      /\b(change|modify|update|edit|fix|improve)\b/i
    ]);

    this.capabilityPatterns.set('analysis', [
      /\b(analyze|compare|evaluate|assess)\b/i,
      /\b(pros|cons|advantages|disadvantages)\b/i
    ]);

    this.capabilityPatterns.set('recommendation', [
      /\b(recommend|suggest|best|should|which)\b/i
    ]);

    this.capabilityPatterns.set('translation', [
      /\b(translate|convert|change language)\b/i
    ]);

    this.capabilityPatterns.set('summarization', [
      /\b(summarize|summary|brief|overview)\b/i
    ]);
  }

  detect(text: string): string[] {
    const textLower = text.toLowerCase();
    const detected: string[] = [];

    for (const [capability, patterns] of this.capabilityPatterns.entries()) {
      const matched = patterns.some(p => p.test(textLower));
      if (matched) {
        detected.push(capability);
      }
    }

    return detected;
  }

  getRequiredCapabilities(text: string): { capabilities: string[]; confidence: number } {
    const detected = this.detect(text);
    const confidence = detected.length > 0 ? 0.8 : 0.3;
    
    return { capabilities: detected, confidence };
  }

  addCapability(capability: string, patterns: RegExp[]) {
    this.capabilityPatterns.set(capability, patterns);
  }
}

// ============================================
// ITEM 21.4: Fallback Chain
// Primary fails → try next, chain of fallbacks
// ============================================
export class FallbackChain {
  private chain: Array<{ 
    name: string; 
    attempt: () => Promise<string>; 
    shouldFallback: (result: string) => boolean 
  }> = [];

  addStep(name: string, attempt: () => Promise<string>, shouldFallback: (result: string) => boolean) {
    this.chain.push({ name, attempt, shouldFallback });
  }

  async execute(): Promise<{ result: string; usedStep: string; fallbacks: string[] }> {
    const fallbacks: string[] = [];

    for (const step of this.chain) {
      try {
        const result = await step.attempt();
        
        if (!step.shouldFallback(result)) {
          return { result, usedStep: step.name, fallbacks };
        }
        
        fallbacks.push(step.name);
      } catch (error) {
        fallbacks.push(`${step.name} (error)`);
      }
    }

    return {
      result: 'All fallback attempts failed',
      usedStep: 'none',
      fallbacks
    };
  }

  getChain(): string[] {
    return this.chain.map(s => s.name);
  }

  clear() {
    this.chain = [];
  }
}

// ============================================
// ITEM 21.5: Progressive Enhancement
// Start basic, enhance, layer complexity
// ============================================
export class ProgressiveEnhancer {
  private layers: Array<{ 
    level: number; 
    content: string; 
    requirements: string[] 
  }> = [];

  addLayer(level: number, content: string, requirements: string[]) {
    this.layers.push({ level, content, requirements });
    this.layers.sort((a, b) => a.level - b.level);
  }

  enhance(availableCapabilities: string[]): { 
    content: string; 
    level: number; 
    enhanced: boolean 
  } {
    let bestLevel = 0;
    let bestContent = '';

    for (const layer of this.layers) {
      const meetsRequirements = layer.requirements.every(req => 
        availableCapabilities.includes(req)
      );

      if (meetsRequirements && layer.level > bestLevel) {
        bestLevel = layer.level;
        bestContent = layer.content;
      }
    }

    return {
      content: bestContent,
      level: bestLevel,
      enhanced: bestLevel > 1
    };
  }

  getAvailableLayers(): Array<{ level: number; requirements: string[] }> {
    return this.layers.map(l => ({ level: l.level, requirements: l.requirements }));
  }
}

// ============================================
// ITEM 21.6: Adaptive Complexity
// Adjust complexity to user's needs
// ============================================
export class AdaptiveComplexity {
  private complexityLevels: Map<string, { 
    keywords: string[]; 
    adjustment: 'simplify' | 'elaborate' | 'none' 
  }> = new Map();

  constructor() {
    this.loadLevels();
  }

  private loadLevels() {
    this.complexityLevels.set('beginner', {
      keywords: ['what is', 'basic', 'simple', 'explain', 'how do i', 'new to'],
      adjustment: 'simplify'
    });

    this.complexityLevels.set('intermediate', {
      keywords: ['how to', 'optimize', 'best practice', 'efficient'],
      adjustment: 'none'
    });

    this.complexityLevels.set('advanced', {
      keywords: ['architecture', 'scale', 'distributed', 'complex', 'advanced'],
      adjustment: 'elaborate'
    });

    this.complexityLevels.set('expert', {
      keywords: ['internals', 'implementation', 'low-level', 'cutting-edge', 'research'],
      adjustment: 'elaborate'
    });
  }

  detectLevel(text: string): { level: string; adjustment: string } {
    const textLower = text.toLowerCase();
    let bestLevel = 'intermediate';
    let bestAdjustment = 'none';
    let maxMatches = 0;

    for (const [level, data] of this.complexityLevels.entries()) {
      const matches = data.keywords.filter(kw => textLower.includes(kw)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestLevel = level;
        bestAdjustment = data.adjustment;
      }
    }

    return { level: bestLevel, adjustment: bestAdjustment };
  }

  adapt(content: string, level: string): string {
    const { adjustment } = this.detectLevel(level);

    switch (adjustment) {
      case 'simplify':
        return this.simplify(content);
      case 'elaborate':
        return this.elaborate(content);
      default:
        return content;
    }
  }

  private simplify(content: string): string {
    // Break long sentences
    const sentences = content.split(/(?<=[.!?])\s+/);
    const simplified = sentences.map(s => {
      if (s.length > 100) {
        return s.replace(/,\s*(and|or|but|which|that)\s+/gi, '. $1 ');
      }
      return s;
    });

    return `**Simplified Explanation:**\n\n${simplified.join(' ')}\n\n_Let me know if you need more clarification!_`;
  }

  private elaborate(content: string): string {
    return `${content}\n\n**Technical Details:**\n\nThis involves several advanced considerations including implementation specifics, edge cases, and optimization strategies. The underlying mechanisms operate at a lower level of abstraction, requiring understanding of the core principles and their interactions.`;
  }
}

// ============================================
// ITEM 21.7: Context-Aware Dispatch
// Dispatch based on full context, holistic decision
// ============================================
export class ContextAwareDispatcher {
  private contextRules: Map<string, { 
    contextIndicators: string[]; 
    action: string 
  }> = new Map();

  constructor() {
    this.loadRules();
  }

  private loadRules() {
    this.contextRules.set('urgent_technical', {
      contextIndicators: ['urgent', 'asap', 'error', 'broken', 'critical'],
      action: 'provide_immediate_solution'
    });

    this.contextRules.set('learning_context', {
      contextIndicators: ['learning', 'tutorial', 'how to', 'explain', 'beginner'],
      action: 'provide_educational_response'
    });

    this.contextRules.set('creative_context', {
      contextIndicators: ['creative', 'design', 'brainstorm', 'ideas', 'imagine'],
      action: 'provide_creative_options'
    });

    this.contextRules.set('analytical_context', {
      contextIndicators: ['analyze', 'compare', 'evaluate', 'pros', 'cons'],
      action: 'provide_analytical_breakdown'
    });
  }

  dispatch(text: string, conversationHistory: string[]): { 
    action: string; 
    confidence: number; 
    context: string 
  } {
    const fullContext = `${text} ${conversationHistory.join(' ')}`.toLowerCase();
    let bestAction = 'general_response';
    let bestContext = 'unknown';
    let maxMatches = 0;

    for (const [context, data] of this.contextRules.entries()) {
      const matches = data.contextIndicators.filter(ind => fullContext.includes(ind)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestAction = data.action;
        bestContext = context;
      }
    }

    const confidence = maxMatches > 0 ? Math.min(1, maxMatches * 0.3) : 0.3;

    return { action: bestAction, confidence, context: bestContext };
  }

  addRule(context: string, indicators: string[], action: string) {
    this.contextRules.set(context, { contextIndicators: indicators, action });
  }
}

// ============================================
// ITEM 21.8: Polymorphic Response Generation
// Generate in appropriate form: text, code, diagram, table, list
// ============================================
export class PolymorphicResponseGenerator {
  private formIndicators: Map<string, RegExp[]> = new Map();

  constructor() {
    this.loadIndicators();
  }

  private loadIndicators() {
    this.formIndicators.set('code', [
      /\b(code|function|class|variable|implement)\b/i,
      /\b(python|javascript|typescript|java|cpp)\b/i
    ]);

    this.formIndicators.set('table', [
      /\b(table|compare|data|spreadsheet)\b/i,
      /\b(columns|rows|grid)\b/i
    ]);

    this.formIndicators.set('list', [
      /\b(list|steps|items|points)\b/i,
      /\b(bullet|numbered|ordered)\b/i
    ]);

    this.formIndicators.set('diagram', [
      /\b(diagram|flowchart|visual|chart)\b/i,
      /\b(graph|plot|figure)\b/i
    ]);

    this.formIndicators.set('text', [
      /\b(explain|describe|tell)\b/i,
      /\b(what|why|how)\b/i
    ]);
  }

  detectForm(text: string): string {
    const textLower = text.toLowerCase();
    let bestForm = 'text';
    let maxMatches = 0;

    for (const [form, patterns] of this.formIndicators.entries()) {
      const matches = patterns.filter(p => p.test(textLower)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestForm = form;
      }
    }

    return bestForm;
  }

  generate(content: any, form: string): string {
    switch (form) {
      case 'code':
        return this.generateCode(content);
      case 'table':
        return this.generateTable(content);
      case 'list':
        return this.generateList(content);
      case 'diagram':
        return this.generateDiagram(content);
      default:
        return this.generateText(content);
    }
  }

  private generateCode(content: any): string {
    return `\`\`\`\n${content}\n\`\`\``;
  }

  private generateTable(content: any): string {
    if (Array.isArray(content)) {
      const headers = Object.keys(content[0] || {});
      const headerRow = '| ' + headers.join(' | ') + ' |';
      const separator = '| ' + headers.map(() => '---').join(' | ') + ' |';
      const rows = content.map(row => 
        '| ' + headers.map(h => row[h] || '').join(' | ') + ' |'
      );
      return [headerRow, separator, ...rows].join('\n');
    }
    return String(content);
  }

  private generateList(content: any): string {
    if (Array.isArray(content)) {
      return content.map((item, i) => `${i + 1}. ${item}`).join('\n');
    }
    return `1. ${content}`;
  }

  private generateDiagram(content: any): string {
    return `**Diagram:**\n\`\`\`\n${content}\n\`\`\``;
  }

  private generateText(content: any): string {
    return String(content);
  }
}

// ============================================
// ITEM 21.9: Capability Composition
// Compose multiple capabilities, build complex from simple
// ============================================
export class CapabilityComposer {
  private capabilities: Map<string, { 
    inputs: string[]; 
    outputs: string[]; 
    execute: (inputs: any) => any 
  }> = new Map();

  registerCapability(
    name: string, 
    inputs: string[], 
    outputs: string[], 
    execute: (inputs: any) => any
  ) {
    this.capabilities.set(name, { inputs, outputs, execute });
  }

  compose(requiredOutput: string, availableInputs: string[]): { 
    composition: string[]; 
    feasible: boolean 
  } | null {
    // Find capabilities that produce required output
    const producers = Array.from(this.capabilities.entries())
      .filter(([_, cap]) => cap.outputs.includes(requiredOutput));

    if (producers.length === 0) return null;

    // Try to find a composition path
    for (const [producerName, producerCap] of producers) {
      const composition: string[] = [producerName];
      let feasible = true;

      // Check if all inputs are available
      for (const input of producerCap.inputs) {
        if (!availableInputs.includes(input)) {
          // Try to find capability that produces this input
          const subProducer = Array.from(this.capabilities.entries())
            .find(([_, cap]) => cap.outputs.includes(input));
          
          if (subProducer) {
            composition.unshift(subProducer[0]);
          } else {
            feasible = false;
            break;
          }
        }
      }

      if (feasible) {
        return { composition, feasible };
      }
    }

    return null;
  }

  async executeComposition(composition: string[], inputs: any): Promise<any> {
    let currentInput = inputs;

    for (const capName of composition) {
      const capability = this.capabilities.get(capName);
      if (!capability) throw new Error(`Capability ${capName} not found`);
      
      currentInput = await capability.execute(currentInput);
    }

    return currentInput;
  }

  getAvailableCapabilities(): string[] {
    return Array.from(this.capabilities.keys());
  }
}

// ============================================
// ITEM 21.10: Universal Adapter
// Adapt any capability to any context, creative capability use
// ============================================
export class UniversalAdapter {
  private adaptations: Map<string, Map<string, (input: any, context: string) => any>> = new Map();

  registerAdaptation(
    capability: string, 
    context: string, 
    adapter: (input: any, context: string) => any
  ) {
    if (!this.adaptations.has(capability)) {
      this.adaptations.set(capability, new Map());
    }
    this.adaptations.get(capability)!.set(context, adapter);
  }

  adapt(capability: string, input: any, context: string): any {
    const capabilityAdapters = this.adaptations.get(capability);
    
    if (!capabilityAdapters) {
      return input; // No adaptation available, return as-is
    }

    const adapter = capabilityAdapters.get(context);
    
    if (!adapter) {
      // Try to find closest matching context
      const contexts = Array.from(capabilityAdapters.keys());
      const bestMatch = contexts.find(ctx => context.includes(ctx) || ctx.includes(context));
      
      if (bestMatch) {
        const matchAdapter = capabilityAdapters.get(bestMatch);
        if (matchAdapter) {
          return matchAdapter(input, context);
        }
      }
      
      return input; // No suitable adaptation found
    }

    return adapter(input, context);
  }

  getAvailableAdaptations(capability: string): string[] {
    const adapters = this.adaptations.get(capability);
    return adapters ? Array.from(adapters.keys()) : [];
  }

  getAvailableCapabilities(): string[] {
    return Array.from(this.adaptations.keys());
  }
}

// ============================================
// Export all universal capability systems
// ============================================
export const UniversalCapabilitySystems = {
  UniversalIntentClassifier,
  MultiTaskRouter,
  CapabilityDetector,
  FallbackChain,
  ProgressiveEnhancer,
  AdaptiveComplexity,
  ContextAwareDispatcher,
  PolymorphicResponseGenerator,
  CapabilityComposer,
  UniversalAdapter,
};
