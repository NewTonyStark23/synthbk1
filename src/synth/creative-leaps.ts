// Creative Leaps - Items 17.1-17.10
// Connect unrelated domains, produce novel ideas

import { Utils } from './utils';

// ============================================
// ITEM 17.1: Forced Connections Engine
// Force connection between unrelated concepts
// ============================================
export class ForcedConnectionsEngine {
  private conceptAttributes: Map<string, string[]> = new Map();

  constructor() {
    this.loadConcepts();
  }

  private loadConcepts() {
    const conceptData: Record<string, string[]> = {
      'mushroom': ['network', 'underground', 'connected', 'organic', 'decomposition', 'growth'],
      'database': ['storage', 'organized', 'query', 'structured', 'persistent', 'retrieval'],
      'jazz': ['improvisation', 'rhythm', 'harmony', 'spontaneous', 'collaboration', 'expression'],
      'business': ['strategy', 'profit', 'organization', 'planning', 'competition', 'growth'],
      'spider': ['web', 'pattern', 'trap', 'silk', 'geometry', 'patient'],
      'internet': ['network', 'connected', 'global', 'information', 'communication', 'distributed'],
      'chess': ['strategy', 'pattern', 'planning', 'competition', 'logic', 'foresight'],
      'cooking': ['recipe', 'ingredients', 'technique', 'creativity', 'transformation', 'flavor'],
      'programming': ['logic', 'structure', 'algorithm', 'problem-solving', 'creativity', 'precision'],
    };

    Object.entries(conceptData).forEach(([concept, attributes]) => {
      this.conceptAttributes.set(concept, attributes);
    });
  }

  connect(concept1: string, concept2: string): { 
    connection: string; 
    sharedAttributes: string[]; 
    novelty: number;
    plausibility: number;
  } {
    const attrs1 = this.conceptAttributes.get(concept1) || [];
    const attrs2 = this.conceptAttributes.get(concept2) || [];

    // Find shared attributes
    const shared = attrs1.filter(a => attrs2.includes(a));
    
    // Calculate novelty (fewer shared = more novel)
    const novelty = 1 - (shared.length / Math.max(attrs1.length, attrs2.length));
    
    // Calculate plausibility (some shared = more plausible)
    const plausibility = shared.length > 0 ? 0.5 + (shared.length * 0.1) : 0.2;

    // Generate connection description
    let connection = '';
    if (shared.length > 0) {
      connection = `Both ${concept1} and ${concept2} involve ${shared.join(', ')}. `;
      connection += `This suggests ${concept1} could inform ${concept2} through these shared characteristics.`;
    } else {
      connection = `While ${concept1} and ${concept2} seem unrelated, we can draw parallels through their underlying structures and processes.`;
    }

    return {
      connection,
      sharedAttributes: shared,
      novelty: Math.min(1, novelty),
      plausibility: Math.min(1, plausibility)
    };
  }

  addConcept(concept: string, attributes: string[]) {
    this.conceptAttributes.set(concept, attributes);
  }
}

// ============================================
// ITEM 17.2: Random Concept Injection
// Inject random concept into reasoning
// ============================================
export class RandomConceptInjector {
  private concepts: string[] = [];

  constructor() {
    this.loadConcepts();
  }

  private loadConcepts() {
    this.concepts = [
      'octopus', 'volcano', 'symphony', 'chess', 'butterfly',
      'glacier', 'jazz', 'coral', 'thunderstorm', 'origami',
      'lighthouse', 'mushroom', 'carousel', 'aurora', 'honeybee',
      'kaleidoscope', 'tornado', 'crystal', 'waterfall', 'nebula'
    ];
  }

  inject(query: string): { injectedConcept: string; perspective: string } {
    const randomConcept = this.concepts[Math.floor(Math.random() * this.concepts.length)];
    
    const perspectives: Record<string, string> = {
      'octopus': 'How would an octopus approach this problem with its multiple arms and adaptive intelligence?',
      'volcano': 'What if this situation had the explosive potential and gradual buildup of a volcano?',
      'symphony': 'How could we orchestrate this like a symphony with different sections working in harmony?',
      'chess': 'What would a chess grandmaster see in this situation? What are the strategic moves?',
      'butterfly': 'How might the butterfly effect apply here? What small changes could have large impacts?',
      'glacier': 'What if we approached this with the slow, persistent power of a glacier?',
      'jazz': 'How could we improvise on this like a jazz musician, finding unexpected harmonies?',
      'coral': 'What if this grew organically like coral, building complexity through small additions?',
      'thunderstorm': 'What are the building tensions here? When will they release?',
      'origami': 'How could we fold and transform this simple starting point into something complex?',
    };

    const perspective = perspectives[randomConcept] || 
      `How might the characteristics of ${randomConcept} inform our approach to this?`;

    return { injectedConcept: randomConcept, perspective };
  }

  addConcept(concept: string) {
    this.concepts.push(concept);
  }
}

// ============================================
// ITEM 17.3: Cross-Domain Analogy Mapping
// Map entire domain structures
// ============================================
export class CrossDomainAnalogyMapper {
  private domainMappings: Map<string, Map<string, string>> = new Map();

  constructor() {
    this.loadMappings();
  }

  private loadMappings() {
    // Biology → Software Engineering
    const bioToSoftware = new Map<string, string>([
      ['cell', 'function'],
      ['dna', 'code'],
      ['organ', 'module'],
      ['organism', 'application'],
      ['evolution', 'iteration'],
      ['mutation', 'bug fix'],
      ['adaptation', 'optimization'],
      ['ecosystem', 'system architecture'],
      ['symbiosis', 'integration'],
      ['metabolism', 'processing'],
    ]);
    this.domainMappings.set('biology_to_software', bioToSoftware);

    // Cooking → Programming
    const cookingToProgramming = new Map<string, string>([
      ['recipe', 'algorithm'],
      ['ingredient', 'variable'],
      ['cook', 'execute'],
      ['taste', 'test'],
      ['chef', 'programmer'],
      ['kitchen', 'development environment'],
      ['spice', 'library'],
      ['meal', 'output'],
      ['prep', 'setup'],
      ['serving', 'deployment'],
    ]);
    this.domainMappings.set('cooking_to_programming', cookingToProgramming);

    // Music → Business
    const musicToBusiness = new Map<string, string>([
      ['melody', 'core product'],
      ['harmony', 'team collaboration'],
      ['rhythm', 'process cadence'],
      ['conductor', 'manager'],
      ['orchestra', 'organization'],
      ['composition', 'business plan'],
      ['performance', 'execution'],
      ['audience', 'customers'],
      ['rehearsal', 'planning'],
      ['improvisation', 'innovation'],
    ]);
    this.domainMappings.set('music_to_business', musicToBusiness);
  }

  map(concept: string, fromDomain: string, toDomain: string): string {
    const mappingKey = `${fromDomain}_to_${toDomain}`;
    const mapping = this.domainMappings.get(mappingKey);
    
    if (!mapping) return concept;
    
    return mapping.get(concept.toLowerCase()) || concept;
  }

  mapEntireDomain(fromDomain: string, toDomain: string): Array<{ original: string; mapped: string }> {
    const mappingKey = `${fromDomain}_to_${toDomain}`;
    const mapping = this.domainMappings.get(mappingKey);
    
    if (!mapping) return [];
    
    return Array.from(mapping.entries()).map(([original, mapped]) => ({
      original,
      mapped
    }));
  }

  addMapping(fromDomain: string, toDomain: string, mappings: Map<string, string>) {
    const key = `${fromDomain}_to_${toDomain}`;
    this.domainMappings.set(key, mappings);
  }
}

// ============================================
// ITEM 17.4: Bisociation Engine
// Connect two unrelated frames of reference (Koestler's theory)
// ============================================
export class BisociationEngine {
  private frames: Map<string, { elements: string[]; rules: string[] }> = new Map();

  constructor() {
    this.loadFrames();
  }

  private loadFrames() {
    this.frames.set('business', {
      elements: ['profit', 'strategy', 'competition', 'market', 'growth'],
      rules: ['maximize value', 'minimize risk', 'outperform competitors']
    });

    this.frames.set('jazz', {
      elements: ['improvisation', 'rhythm', 'harmony', 'collaboration', 'expression'],
      rules: ['follow the flow', 'listen and respond', 'create in the moment']
    });

    this.frames.set('game', {
      elements: ['rules', 'players', 'score', 'strategy', 'winning'],
      rules: ['follow rules', 'compete fairly', 'achieve objectives']
    });

    this.frames.set('art', {
      elements: ['creativity', 'expression', 'aesthetics', 'meaning', 'technique'],
      rules: ['express vision', 'evoke emotion', 'communicate ideas']
    });

    this.frames.set('science', {
      elements: ['hypothesis', 'experiment', 'data', 'analysis', 'conclusion'],
      rules: ['test hypotheses', 'gather evidence', 'draw conclusions']
    });
  }

  bisociate(frame1: string, frame2: string): { 
    blended: string; 
    insights: string[]; 
    novelty: number 
  } {
    const f1 = this.frames.get(frame1);
    const f2 = this.frames.get(frame2);

    if (!f1 || !f2) {
      return { blended: '', insights: [], novelty: 0 };
    }

    // Create blended frame
    const blendedElements = [...new Set([...f1.elements, ...f2.elements])];
    const blendedRules = [...new Set([...f1.rules, ...f2.rules])];

    // Generate insights from collision
    const insights: string[] = [];
    
    // Insight 1: Apply rules from one frame to elements of another
    insights.push(`What if we applied ${frame1} rules (${f1.rules[0]}) to ${frame2} elements?`);
    
    // Insight 2: Find unexpected connections
    insights.push(`The intersection of ${frame1} and ${frame2} suggests new approaches to both.`);
    
    // Insight 3: Generate novel concept
    insights.push(`Combining ${f1.elements[0]} with ${f2.elements[0]} creates a new paradigm.`);

    // Calculate novelty
    const overlap = f1.elements.filter(e => f2.elements.includes(e)).length;
    const novelty = 1 - (overlap / Math.max(f1.elements.length, f2.elements.length));

    return {
      blended: `${frame1}-${frame2}`,
      insights,
      novelty: Math.min(1, novelty)
    };
  }

  addFrame(name: string, elements: string[], rules: string[]) {
    this.frames.set(name, { elements, rules });
  }
}

// ============================================
// ITEM 17.5: Conceptual Blending System
// Blend two concepts into new one
// ============================================
export class ConceptualBlendingSystem {
  private conceptProperties: Map<string, { properties: string[]; functions: string[] }> = new Map();

  constructor() {
    this.loadConcepts();
  }

  private loadConcepts() {
    this.conceptProperties.set('car', {
      properties: ['fast', 'mobile', 'transport', 'metal', 'engine'],
      functions: ['drive', 'transport', 'travel']
    });

    this.conceptProperties.set('house', {
      properties: ['stationary', 'shelter', 'living', 'rooms', 'structure'],
      functions: ['live', 'shelter', 'store']
    });

    this.conceptProperties.set('phone', {
      properties: ['portable', 'communication', 'screen', 'battery', 'smart'],
      functions: ['call', 'message', 'browse']
    });

    this.conceptProperties.set('book', {
      properties: ['information', 'pages', 'portable', 'knowledge', 'static'],
      functions: ['read', 'learn', 'reference']
    });
  }

  blend(concept1: string, concept2: string): { 
    blended: string; 
    emergentProperties: string[]; 
    emergentFunctions: string[];
    coherence: number;
  } {
    const c1 = this.conceptProperties.get(concept1);
    const c2 = this.conceptProperties.get(concept2);

    if (!c1 || !c2) {
      return { blended: '', emergentProperties: [], emergentFunctions: [], coherence: 0 };
    }

    // Find shared properties (generic space)
    const shared = c1.properties.filter(p => c2.properties.includes(p));

    // Create emergent properties (combinations that don't exist in either)
    const emergentProperties: string[] = [];
    
    // Combine contrasting properties
    if (c1.properties.includes('mobile') && c2.properties.includes('stationary')) {
      emergentProperties.push('mobile yet stable');
    }
    if (c1.properties.includes('fast') && c2.properties.includes('shelter')) {
      emergentProperties.push('fast shelter');
    }

    // Create emergent functions
    const emergentFunctions: string[] = [];
    c1.functions.forEach(f1 => {
      c2.functions.forEach(f2 => {
        if (f1 !== f2) {
          emergentFunctions.push(`${f1} while ${f2}ing`);
        }
      });
    });

    // Calculate coherence
    const coherence = shared.length > 0 ? 0.7 + (shared.length * 0.1) : 0.4;

    return {
      blended: `${concept1}-${concept2}`,
      emergentProperties: emergentProperties.slice(0, 5),
      emergentFunctions: emergentFunctions.slice(0, 5),
      coherence: Math.min(1, coherence)
    };
  }

  addConcept(name: string, properties: string[], functions: string[]) {
    this.conceptProperties.set(name, { properties, functions });
  }
}

// ============================================
// ITEM 17.6: Divergent Thinking Modes
// Switch between convergent and divergent thinking
// ============================================
export class DivergentThinkingModes {
  private mode: 'convergent' | 'divergent' = 'convergent';

  setMode(mode: 'convergent' | 'divergent') {
    this.mode = mode;
  }

  generate(mode: 'convergent' | 'divergent', query: string): string[] {
    if (mode === 'divergent') {
      return this.divergentGenerate(query);
    } else {
      return this.convergentGenerate(query);
    }
  }

  private divergentGenerate(query: string): string[] {
    // Generate many ideas without judgment
    const ideas: string[] = [];
    const keywords = Utils.extractKeywords(query);

    // Generate variations
    ideas.push(`What if we approached ${keywords[0]} completely differently?`);
    ideas.push(`Could we combine ${keywords[0]} with something unexpected?`);
    ideas.push(`What would happen if we removed all constraints?`);
    ideas.push(`How would a child solve this?`);
    ideas.push(`What's the opposite of the obvious solution?`);
    ideas.push(`Could we use ${keywords[0]} in a completely different context?`);
    ideas.push(`What if we had unlimited resources?`);
    ideas.push(`How would nature solve this?`);

    return ideas;
  }

  private convergentGenerate(query: string): string[] {
    // Generate focused, evaluated ideas
    const ideas: string[] = [];
    const keywords = Utils.extractKeywords(query);

    ideas.push(`The most practical solution for ${keywords[0]} is...`);
    ideas.push(`Based on best practices, we should...`);
    ideas.push(`The optimal approach considering constraints is...`);

    return ideas;
  }

  alternate(query: string): { divergent: string[]; convergent: string[] } {
    return {
      divergent: this.divergentGenerate(query),
      convergent: this.convergentGenerate(query)
    };
  }

  getMode(): string {
    return this.mode;
  }
}

// ============================================
// ITEM 17.7: Lateral Thinking Triggers
// Provocation, challenge assumptions, unusual entry points
// ============================================
export class LateralThinkingTriggers {
  private triggers: Map<string, (query: string) => string> = new Map();

  constructor() {
    this.loadTriggers();
  }

  private loadTriggers() {
    this.triggers.set('reversal', (query: string) => {
      return `What if the opposite were true? ${query}`;
    });

    this.triggers.set('challenge', (query: string) => {
      const keywords = Utils.extractKeywords(query);
      return `Why do we assume ${keywords[0]} is necessary? What if we didn't need it?`;
    });

    this.triggers.set('entry_point', (query: string) => {
      return `Let's start from an unusual place: what if we began at the end instead of the beginning?`;
    });

    this.triggers.set('fraction', (query: string) => {
      const keywords = Utils.extractKeywords(query);
      return `What if we only had 10% of ${keywords[0]}? How would that change things?`;
    });

    this.triggers.set('step', (query: string) => {
      return `Let's break the normal sequence. What if we did the last step first?`;
    });

    this.triggers.set('distort', (query: string) => {
      const keywords = Utils.extractKeywords(query);
      return `What if ${keywords[0]} was 100 times bigger? Or 100 times smaller?`;
    });

    this.triggers.set('wishful', (query: string) => {
      return `If we could wave a magic wand and have exactly what we want, what would that look like?`;
    });
  }

  trigger(triggerType: string, query: string): string {
    const trigger = this.triggers.get(triggerType);
    if (!trigger) return query;
    return trigger(query);
  }

  triggerAll(query: string): string[] {
    return Array.from(this.triggers.entries()).map(([type, fn]) => fn(query));
  }

  addTrigger(name: string, fn: (query: string) => string) {
    this.triggers.set(name, fn);
  }
}

// ============================================
// ITEM 17.8: Serendipity Engine
// Create conditions for happy accidents
// ============================================
export class SerendipityEngine {
  private elements: string[] = [];
  private discoveredConnections: Array<{ element1: string; element2: string; connection: string }> = [];

  constructor() {
    this.loadElements();
  }

  private loadElements() {
    this.elements = [
      'timing', 'chance', 'observation', 'curiosity', 'preparation',
      'openness', 'flexibility', 'intuition', 'pattern', 'connection'
    ];
  }

  createSerendipity(): { combination: string[]; insight: string } {
    // Randomly select 2-3 elements
    const numElements = Math.floor(Math.random() * 2) + 2;
    const selected: string[] = [];
    
    while (selected.length < numElements) {
      const element = this.elements[Math.floor(Math.random() * this.elements.length)];
      if (!selected.includes(element)) {
        selected.push(element);
      }
    }

    // Generate insight from combination
    const insight = this.generateInsight(selected);

    // Store discovered connection
    this.discoveredConnections.push({
      element1: selected[0],
      element2: selected[1],
      connection: insight
    });

    return { combination: selected, insight };
  }

  private generateInsight(elements: string[]): string {
    if (elements.includes('timing') && elements.includes('preparation')) {
      return "Success often comes when preparation meets opportunity.";
    }
    if (elements.includes('curiosity') && elements.includes('observation')) {
      return "Curious observation often leads to unexpected discoveries.";
    }
    if (elements.includes('chance') && elements.includes('openness')) {
      return "Being open to chance allows serendipitous discoveries.";
    }
    if (elements.includes('pattern') && elements.includes('connection')) {
      return "Seeing patterns and making connections reveals hidden insights.";
    }
    
    return `The combination of ${elements.join(' and ')} creates conditions for discovery.`;
  }

  getDiscoveredConnections(): Array<{ element1: string; element2: string; connection: string }> {
    return this.discoveredConnections;
  }

  addElement(element: string) {
    this.elements.push(element);
  }
}

// ============================================
// ITEM 17.9: Associative Chain Expansion
// Start with concept, follow associations
// ============================================
export class AssociativeChainExpander {
  private associations: Map<string, string[]> = new Map();

  constructor() {
    this.loadAssociations();
  }

  private loadAssociations() {
    this.associations.set('dog', ['pet', 'animal', 'companion', 'loyal', 'friendly']);
    this.associations.set('pet', ['companion', 'animal', 'care', 'love', 'responsibility']);
    this.associations.set('companion', ['friend', 'partner', 'loyal', 'support', 'together']);
    this.associations.set('friend', ['trust', 'loyalty', 'support', 'shared', 'bond']);
    this.associations.set('loyal', ['trust', 'faithful', 'dedicated', 'committed', 'reliable']);
    this.associations.set('trust', ['faith', 'confidence', 'reliance', 'belief', 'security']);
    this.associations.set('faith', ['belief', 'trust', 'hope', 'confidence', 'conviction']);
    this.associations.set('hope', ['optimism', 'expectation', 'desire', 'aspiration', 'dream']);
    this.associations.set('dream', ['aspiration', 'goal', 'vision', 'imagination', 'future']);
    this.associations.set('goal', ['target', 'objective', 'aim', 'purpose', 'achievement']);
  }

  expand(start: string, depth: number = 3): Array<{ concept: string; depth: number; path: string[] }> {
    const results: Array<{ concept: string; depth: number; path: string[] }> = [];
    const visited = new Set<string>();
    const queue: Array<{ concept: string; depth: number; path: string[] }> = [
      { concept: start, depth: 0, path: [start] }
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (visited.has(current.concept) || current.depth > depth) continue;
      visited.add(current.concept);
      
      results.push(current);

      const associations = this.associations.get(current.concept) || [];
      associations.forEach(assoc => {
        if (!visited.has(assoc)) {
          queue.push({
            concept: assoc,
            depth: current.depth + 1,
            path: [...current.path, assoc]
          });
        }
      });
    }

    return results;
  }

  findPath(start: string, end: string, maxDepth: number = 5): string[] | null {
    const results = this.expand(start, maxDepth);
    const endResult = results.find(r => r.concept === end);
    return endResult ? endResult.path : null;
  }

  addAssociation(concept: string, associations: string[]) {
    this.associations.set(concept, associations);
  }
}

// ============================================
// ITEM 17.10: Remote Association Testing
// Find hidden connections (like RAT tests)
// ============================================
export class RemoteAssociationTester {
  private wordAssociations: Map<string, Set<string>> = new Map();

  constructor() {
    this.loadAssociations();
  }

  private loadAssociations() {
    const associations: Record<string, string[]> = {
      'cottage': ['cheese', 'house', 'industry', 'style'],
      'swiss': ['cheese', 'watch', 'army', 'roll'],
      'cake': ['cheese', 'birthday', 'piece', 'bake'],
      'blue': ['cheese', 'moon', 'ocean', 'sky'],
      'house': ['light', 'work', 'boat', 'dog'],
      'light': ['house', 'year', 'speed', 'bulb'],
      'year': ['light', 'new', 'old', 'book'],
      'new': ['year', 'york', 'idea', 'start'],
    };

    Object.entries(associations).forEach(([word, assocs]) => {
      this.wordAssociations.set(word, new Set(assocs));
    });
  }

  solve(words: string[]): { answer: string; confidence: number } | null {
    if (words.length !== 3) return null;

    // Find common association
    const [w1, w2, w3] = words;
    const assocs1 = this.wordAssociations.get(w1) || new Set();
    const assocs2 = this.wordAssociations.get(w2) || new Set();
    const assocs3 = this.wordAssociations.get(w3) || new Set();

    // Find intersection
    const common = Array.from(assocs1).filter(a => assocs2.has(a) && assocs3.has(a));

    if (common.length > 0) {
      return { answer: common[0], confidence: 0.9 };
    }

    return null;
  }

  test(words: string[]): string {
    const result = this.solve(words);
    
    if (!result) {
      return `I couldn't find a common connection between: ${words.join(', ')}`;
    }

    return `The answer is: **${result.answer}**\n\nAll three words (${words.join(', ')}) can be paired with "${result.answer}".`;
  }

  addAssociation(word: string, associations: string[]) {
    this.wordAssociations.set(word, new Set(associations));
  }
}

// ============================================
// Export all creative leap systems
// ============================================
export const CreativeLeapSystems = {
  ForcedConnectionsEngine,
  RandomConceptInjector,
  CrossDomainAnalogyMapper,
  BisociationEngine,
  ConceptualBlendingSystem,
  DivergentThinkingModes,
  LateralThinkingTriggers,
  SerendipityEngine,
  AssociativeChainExpander,
  RemoteAssociationTester,
};
