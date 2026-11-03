// Implicit World Knowledge - Items 15.2-15.10
// "Know" things without being told

import { Utils } from './utils';

// ============================================
// ITEM 15.2: Physical World Simulator
// Simulate physical interactions
// ============================================
export class PhysicalWorldSimulator {
  private physicalRules: Map<string, (params: any) => any> = new Map();

  constructor() {
    this.loadRules();
  }

  private loadRules() {
    // Gravity
    this.physicalRules.set('gravity', (params: { mass: number; height: number }) => {
      const g = 9.81; // m/s²
      const velocity = Math.sqrt(2 * g * params.height);
      const time = Math.sqrt(2 * params.height / g);
      return { velocity, time, force: params.mass * g };
    });

    // Temperature conversion
    this.physicalRules.set('temperature', (params: { value: number; from: string; to: string }) => {
      let celsius = params.value;
      if (params.from === 'fahrenheit') celsius = (params.value - 32) * 5 / 9;
      else if (params.from === 'kelvin') celsius = params.value - 273.15;

      if (params.to === 'fahrenheit') return celsius * 9 / 5 + 32;
      if (params.to === 'kelvin') return celsius + 273.15;
      return celsius;
    });

    // Water state
    this.physicalRules.set('water_state', (params: { temperature: number; pressure?: number }) => {
      const pressure = params.pressure || 1; // atm
      if (params.temperature <= 0) return 'solid';
      if (params.temperature >= 100 && pressure === 1) return 'gas';
      return 'liquid';
    });

    // Distance calculation
    this.physicalRules.set('distance', (params: { speed: number; time: number }) => {
      return params.speed * params.time;
    });

    // Volume
    this.physicalRules.set('volume', (params: { shape: string; dimensions: any }) => {
      switch (params.shape) {
        case 'cube': return Math.pow(params.dimensions.side, 3);
        case 'sphere': return (4 / 3) * Math.PI * Math.pow(params.dimensions.radius, 3);
        case 'cylinder': return Math.PI * Math.pow(params.dimensions.radius, 2) * params.dimensions.height;
        default: return 0;
      }
    });
  }

  simulate(rule: string, params: any): any {
    const ruleFunc = this.physicalRules.get(rule);
    if (!ruleFunc) return null;
    return ruleFunc(params);
  }

  predictOutcome(action: string, context: any): string {
    // Common physical predictions
    if (action.includes('drop') && context.object) {
      return `${context.object} will fall down due to gravity`;
    }
    if (action.includes('heat') && context.substance === 'water') {
      if (context.temperature >= 100) return 'Water will boil and turn to steam';
      return 'Water temperature will increase';
    }
    if (action.includes('freeze') && context.substance === 'water') {
      if (context.temperature <= 0) return 'Water will freeze into ice';
      return 'Water temperature will decrease';
    }
    if (action.includes('mix') && context.substances) {
      return `${context.substances.join(' and ')} will combine`;
    }
    return 'Outcome depends on specific conditions';
  }

  addRule(name: string, ruleFunc: (params: any) => any) {
    this.physicalRules.set(name, ruleFunc);
  }
}

// ============================================
// ITEM 15.3: Causal Reasoning Graph
// Build causal chains
// ============================================
export class CausalReasoningGraph {
  private causes: Map<string, string[]> = new Map();
  private effects: Map<string, string[]> = new Map();

  constructor() {
    this.loadCausalRelations();
  }

  private loadCausalRelations() {
    const relations: Record<string, string[]> = {
      'server crash': ['users cannot login', 'service unavailable', 'revenue loss'],
      'power outage': ['lights off', 'computers shutdown', 'data loss risk'],
      'delete file': ['file no longer accessible', 'data lost', 'storage freed'],
      'no backup': ['cannot recover data', 'permanent data loss'],
      'rain': ['ground wet', 'plants grow', 'umbrella needed'],
      'fire': ['heat generated', 'smoke produced', 'damage occurs'],
      'exercise': ['calories burned', 'muscles strengthened', 'health improved'],
      'study': ['knowledge gained', 'skills improved', 'grades better'],
      'investment': ['money grows', 'risk taken', 'returns expected'],
      'marketing': ['awareness increased', 'customers attracted', 'sales boost'],
    };

    Object.entries(relations).forEach(([cause, effects]) => {
      this.causes.set(cause, effects);
      effects.forEach(effect => {
        if (!this.effects.has(effect)) {
          this.effects.set(effect, []);
        }
        this.effects.get(effect)!.push(cause);
      });
    });
  }

  getEffects(cause: string): string[] {
    return this.causes.get(cause) || [];
  }

  getCauses(effect: string): string[] {
    return this.effects.get(effect) || [];
  }

  traceChain(startCause: string, depth: number = 2): Array<{ event: string; depth: number }> {
    const chain: Array<{ event: string; depth: number }> = [];
    const visited = new Set<string>();
    const queue: Array<{ event: string; depth: number }> = [{ event: startCause, depth: 0 }];

    while (queue.length > 0) {
      const { event, depth: currentDepth } = queue.shift()!;
      
      if (visited.has(event) || currentDepth > depth) continue;
      visited.add(event);
      chain.push({ event, depth: currentDepth });

      if (currentDepth < depth) {
        const effects = this.getEffects(event);
        effects.forEach(effect => {
          if (!visited.has(effect)) {
            queue.push({ event: effect, depth: currentDepth + 1 });
          }
        });
      }
    }

    return chain;
  }

  addCausalRelation(cause: string, effects: string[]) {
    this.causes.set(cause, effects);
    effects.forEach(effect => {
      if (!this.effects.has(effect)) {
        this.effects.set(effect, []);
      }
      this.effects.get(effect)!.push(cause);
    });
  }
}

// ============================================
// ITEM 15.4: Social Norm Database
// Cultural norms, professional norms, etc.
// ============================================
export class SocialNormDatabase {
  private norms: Map<string, { norm: string; context: string; culture: string }> = new Map();

  constructor() {
    this.loadNorms();
  }

  private loadNorms() {
    const normData: Record<string, { norm: string; context: string; culture: string }> = {
      'greeting_stranger': { norm: 'Say hello and introduce yourself', context: 'meeting someone new', culture: 'western' },
      'greeting_elder': { norm: 'Show respect, use formal language', context: 'meeting elderly person', culture: 'asian' },
      'gift_receiving': { norm: 'Thank the giver, open gift in front of them', context: 'receiving a gift', culture: 'western' },
      'gift_receiving_asian': { norm: 'Decline gift 2-3 times before accepting', context: 'receiving a gift', culture: 'asian' },
      'meeting_start': { norm: 'Arrive 5 minutes early', context: 'professional meeting', culture: 'western' },
      'meeting_start_latam': { norm: 'Arrive 15-30 minutes late is acceptable', context: 'social meeting', culture: 'latin_american' },
      'email_formal': { norm: 'Use formal greeting, clear subject, professional tone', context: 'business email', culture: 'western' },
      'dining_western': { norm: 'Wait for host to start eating', context: 'formal dinner', culture: 'western' },
      'dining_asian': { norm: 'Slurping noodles is acceptable', context: 'eating noodles', culture: 'asian' },
      'personal_space_western': { norm: 'Maintain arms length distance', context: 'conversation', culture: 'western' },
      'personal_space_latam': { norm: 'Closer distance is normal', context: 'conversation', culture: 'latin_american' },
      'queue_behavior': { norm: 'Wait your turn, dont cut in line', context: 'waiting in line', culture: 'universal' },
    };

    Object.entries(normData).forEach(([key, data]) => {
      this.norms.set(key, data);
    });
  }

  getNorm(situation: string, culture: string = 'western'): { norm: string; context: string } | null {
    // Find matching norm
    for (const [key, data] of this.norms.entries()) {
      if (key.includes(situation) && (data.culture === culture || data.culture === 'universal')) {
        return { norm: data.norm, context: data.context };
      }
    }
    return null;
  }

  getAllNorms(context: string): Array<{ norm: string; culture: string }> {
    const results: Array<{ norm: string; culture: string }> = [];
    
    this.norms.forEach(data => {
      if (data.context.includes(context)) {
        results.push({ norm: data.norm, culture: data.culture });
      }
    });

    return results;
  }

  addNorm(key: string, norm: string, context: string, culture: string) {
    this.norms.set(key, { norm, context, culture });
  }
}

// ============================================
// ITEM 15.5: Implicit Assumption Detector
// Identify unstated assumptions
// ============================================
export class ImplicitAssumptionDetector {
  private assumptionPatterns: Map<string, string[]> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.assumptionPatterns.set('resigned', ['the person had a job', 'the resignation was voluntary', 'there was a reason']);
    this.assumptionPatterns.set('bought', ['the buyer had money', 'the item was for sale', 'the transaction was completed']);
    this.assumptionPatterns.set('failed', ['there was an attempt', 'there was an expected outcome', 'the outcome was not achieved']);
    this.assumptionPatterns.set('arrived', ['there was a destination', 'there was a starting point', 'travel occurred']);
    this.assumptionPatterns.set('learned', ['there was information to learn', 'the person did not know before', 'the person knows now']);
    this.assumptionPatterns.set('fixed', ['something was broken', 'there was a problem', 'the problem is now resolved']);
  }

  detect(text: string): Array<{ trigger: string; assumptions: string[] }> {
    const textLower = text.toLowerCase();
    const detected: Array<{ trigger: string; assumptions: string[] }> = [];

    this.assumptionPatterns.forEach((assumptions, trigger) => {
      if (textLower.includes(trigger)) {
        detected.push({ trigger, assumptions });
      }
    });

    return detected;
  }

  formatAssumptions(detected: Array<{ trigger: string; assumptions: string[] }>): string {
    if (detected.length === 0) return '';

    let output = 'Implicit assumptions detected:\n\n';
    detected.forEach(({ trigger, assumptions }) => {
      output += `"${trigger}" assumes:\n`;
      assumptions.forEach(assumption => {
        output += `  • ${assumption}\n`;
      });
      output += '\n';
    });

    return output;
  }

  addPattern(trigger: string, assumptions: string[]) {
    this.assumptionPatterns.set(trigger, assumptions);
  }
}

// ============================================
// ITEM 15.6: World Model Simulation
// Internal model of how world works
// ============================================
export class WorldModel {
  private entities: Map<string, { type: string; properties: Record<string, any>; relationships: string[] }> = new Map();

  addEntity(name: string, type: string, properties: Record<string, any> = {}) {
    this.entities.set(name.toLowerCase(), {
      type,
      properties,
      relationships: []
    });
  }

  addRelationship(entity1: string, entity2: string, relationship: string) {
    const e1 = this.entities.get(entity1.toLowerCase());
    const e2 = this.entities.get(entity2.toLowerCase());

    if (e1) e1.relationships.push(`${relationship}:${entity2}`);
    if (e2) e2.relationships.push(`${relationship}:${entity1}`);
  }

  getEntity(name: string): any {
    return this.entities.get(name.toLowerCase());
  }

  getRelatedEntities(name: string): Array<{ entity: string; relationship: string }> {
    const entity = this.entities.get(name.toLowerCase());
    if (!entity) return [];

    return entity.relationships.map(rel => {
      const [relationship, entityName] = rel.split(':');
      return { entity: entityName, relationship };
    });
  }

  simulate(action: string, actor: string, target?: string): string {
    const actorEntity = this.entities.get(actor.toLowerCase());
    if (!actorEntity) return `Unknown entity: ${actor}`;

    // Common action simulations
    if (action === 'move' && target) {
      return `${actor} moves to ${target}`;
    }
    if (action === 'take' && target) {
      return `${actor} takes ${target}`;
    }
    if (action === 'give' && target) {
      return `${actor} gives something to ${target}`;
    }

    return `${actor} performs ${action}`;
  }

  updateProperty(entity: string, property: string, value: any) {
    const entityData = this.entities.get(entity.toLowerCase());
    if (entityData) {
      entityData.properties[property] = value;
    }
  }
}

// ============================================
// ITEM 15.7: Affordance Detection
// What can be done with objects/situations
// ============================================
export class AffordanceDetector {
  private affordances: Map<string, string[]> = new Map();

  constructor() {
    this.loadAffordances();
  }

  private loadAffordances() {
    const affordanceData: Record<string, string[]> = {
      'chair': ['sit on', 'stand on', 'move', 'stack'],
      'table': ['put things on', 'sit at', 'stand on', 'move'],
      'door': ['open', 'close', 'lock', 'knock on'],
      'button': ['press', 'click', 'push'],
      'cup': ['hold', 'drink from', 'fill', 'pour from'],
      'book': ['read', 'open', 'close', 'carry', 'shelve'],
      'phone': ['call', 'text', 'browse', 'take photo'],
      'computer': ['type on', 'run programs', 'browse internet', 'store files'],
      'code': ['run', 'edit', 'debug', 'test', 'deploy'],
      'api': ['call', 'integrate', 'test', 'document'],
      'database': ['query', 'insert', 'update', 'delete', 'backup'],
      'file': ['open', 'edit', 'save', 'delete', 'copy', 'move'],
    };

    Object.entries(affordanceData).forEach(([object, actions]) => {
      this.affordances.set(object.toLowerCase(), actions);
    });
  }

  detect(object: string): string[] {
    return this.affordances.get(object.toLowerCase()) || ['interact with'];
  }

  canDo(object: string, action: string): boolean {
    const affordances = this.detect(object);
    return affordances.some(a => a.includes(action.toLowerCase()));
  }

  addAffordance(object: string, actions: string[]) {
    this.affordances.set(object.toLowerCase(), actions);
  }
}

// ============================================
// ITEM 15.8: Consequence Prediction Engine
// Given action, predict consequences
// ============================================
export class ConsequencePredictor {
  private consequenceRules: Map<string, { direct: string[]; indirect: string[]; timeframe: string }> = new Map();

  constructor() {
    this.loadRules();
  }

  private loadRules() {
    const rulesData: Record<string, { direct: string[]; indirect: string[]; timeframe: string }> = {
      'delete file': {
        direct: ['file is gone', 'storage freed'],
        indirect: ['cannot recover data', 'may need to recreate'],
        timeframe: 'immediate'
      },
      'send email': {
        direct: ['recipient receives email'],
        indirect: ['may get reply', 'creates record'],
        timeframe: 'seconds to days'
      },
      'make purchase': {
        direct: ['money spent', 'item acquired'],
        indirect: ['bank balance decreases', 'may need budget adjustment'],
        timeframe: 'immediate'
      },
      'skip backup': {
        direct: ['no backup created'],
        indirect: ['risk of data loss', 'cannot recover if failure'],
        timeframe: 'future risk'
      },
      'deploy code': {
        direct: ['code goes live', 'users can access'],
        indirect: ['may have bugs', 'may need monitoring'],
        timeframe: 'immediate to ongoing'
      },
    };

    Object.entries(rulesData).forEach(([action, data]) => {
      this.consequenceRules.set(action.toLowerCase(), data);
    });
  }

  predict(action: string): { direct: string[]; indirect: string[]; timeframe: string } | null {
    return this.consequenceRules.get(action.toLowerCase()) || null;
  }

  formatConsequences(action: string): string {
    const consequences = this.predict(action);
    if (!consequences) return `No specific consequences known for: ${action}`;

    let output = `Consequences of "${action}":\n\n`;
    output += `Direct (timeframe: ${consequences.timeframe}):\n`;
    consequences.direct.forEach(c => output += `  • ${c}\n`);
    
    if (consequences.indirect.length > 0) {
      output += `\nIndirect:\n`;
      consequences.indirect.forEach(c => output += `  • ${c}\n`);
    }

    return output;
  }

  addRule(action: string, direct: string[], indirect: string[], timeframe: string) {
    this.consequenceRules.set(action.toLowerCase(), { direct, indirect, timeframe });
  }
}

// ============================================
// ITEM 15.9: Background Knowledge Inference
// Infer what user knows/doesn't know
// ============================================
export class BackgroundKnowledgeInference {
  private expertiseIndicators: Map<string, string[]> = new Map();

  constructor() {
    this.loadIndicators();
  }

  private loadIndicators() {
    this.expertiseIndicators.set('beginner', ['what is', 'how do i', 'basic', 'simple', 'explain', 'new to']);
    this.expertiseIndicators.set('intermediate', ['how to', 'optimize', 'best practice', 'efficient', 'improve']);
    this.expertiseIndicators.set('advanced', ['architecture', 'scale', 'distributed', 'complex', 'advanced', 'internals']);
    this.expertiseIndicators.set('expert', ['implementation details', 'source code', 'low-level', 'optimization', 'cutting-edge']);
  }

  inferLevel(text: string): { level: string; confidence: number; indicators: string[] } {
    const textLower = text.toLowerCase();
    const scores: Record<string, number> = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
      expert: 0
    };

    const foundIndicators: string[] = [];

    this.expertiseIndicators.forEach((indicators, level) => {
      indicators.forEach(indicator => {
        if (textLower.includes(indicator)) {
          scores[level]++;
          foundIndicators.push(`${level}:${indicator}`);
        }
      });
    });

    // Determine level
    let maxScore = 0;
    let detectedLevel = 'intermediate'; // default

    Object.entries(scores).forEach(([level, score]) => {
      if (score > maxScore) {
        maxScore = score;
        detectedLevel = level;
      }
    });

    const totalIndicators = Object.values(scores).reduce((a, b) => a + b, 0);
    const confidence = totalIndicators > 0 ? maxScore / totalIndicators : 0.5;

    return { level: detectedLevel, confidence, indicators: foundIndicators };
  }

  adjustExplanation(explanation: string, level: string): string {
    switch (level) {
      case 'beginner':
        return `Let me explain this simply: ${explanation}\n\nFeel free to ask if you need more clarification!`;
      case 'intermediate':
        return explanation;
      case 'advanced':
        return `Here's the technical details: ${explanation}\n\nThis assumes familiarity with core concepts.`;
      case 'expert':
        return `Technical deep-dive: ${explanation}\n\nThis covers implementation-level details.`;
      default:
        return explanation;
    }
  }
}

// ============================================
// ITEM 15.10: Contextual Knowledge Activation
// Activate relevant knowledge based on context
// ============================================
export class ContextualKnowledgeActivator {
  private contextTriggers: Map<string, string[]> = new Map();

  constructor() {
    this.loadTriggers();
  }

  private loadTriggers() {
    this.contextTriggers.set('cooking', ['recipe', 'ingredients', 'cook', 'bake', 'kitchen', 'food']);
    this.contextTriggers.set('programming', ['code', 'program', 'debug', 'function', 'variable', 'algorithm']);
    this.contextTriggers.set('meeting', ['agenda', 'participants', 'minutes', 'schedule', 'discuss']);
    this.contextTriggers.set('shopping', ['buy', 'price', 'product', 'store', 'purchase', 'cart']);
    this.contextTriggers.set('travel', ['flight', 'hotel', 'destination', 'booking', 'trip', 'vacation']);
    this.contextTriggers.set('health', ['symptom', 'doctor', 'medicine', 'exercise', 'diet', 'health']);
    this.contextTriggers.set('finance', ['money', 'invest', 'budget', 'save', 'spend', 'account']);
    this.contextTriggers.set('education', ['learn', 'study', 'course', 'student', 'teacher', 'school']);
  }

  activate(text: string): { context: string; confidence: number; relatedTopics: string[] } {
    const textLower = text.toLowerCase();
    let bestContext = '';
    let maxScore = 0;

    this.contextTriggers.forEach((triggers, context) => {
      const score = triggers.filter(trigger => textLower.includes(trigger)).length;
      if (score > maxScore) {
        maxScore = score;
        bestContext = context;
      }
    });

    const confidence = maxScore > 0 ? Math.min(1, maxScore / 3) : 0;
    const relatedTopics = this.contextTriggers.get(bestContext) || [];

    return { context: bestContext, confidence, relatedTopics };
  }

  getRelatedKnowledge(context: string): string[] {
    // Return knowledge topics related to this context
    const knowledgeMap: Record<string, string[]> = {
      cooking: ['recipes', 'cooking techniques', 'ingredient substitutions', 'meal planning'],
      programming: ['algorithms', 'data structures', 'best practices', 'debugging'],
      meeting: ['meeting etiquette', 'agenda setting', 'note taking', 'follow-up'],
      shopping: ['product comparison', 'price matching', 'reviews', 'return policies'],
      travel: ['booking tips', 'packing lists', 'local customs', 'safety'],
      health: ['symptoms', 'preventive care', 'nutrition', 'exercise routines'],
      finance: ['budgeting', 'investment strategies', 'tax planning', 'savings'],
      education: ['learning techniques', 'study methods', 'resources', 'certifications'],
    };

    return knowledgeMap[context] || [];
  }

  addContext(context: string, triggers: string[]) {
    this.contextTriggers.set(context, triggers);
  }
}

// ============================================
// Export all implicit world knowledge systems
// ============================================
export const ImplicitWorldKnowledgeSystems = {
  PhysicalWorldSimulator,
  CausalReasoningGraph,
  SocialNormDatabase,
  ImplicitAssumptionDetector,
  WorldModel,
  AffordanceDetector,
  ConsequencePredictor,
  BackgroundKnowledgeInference,
  ContextualKnowledgeActivator,
};
