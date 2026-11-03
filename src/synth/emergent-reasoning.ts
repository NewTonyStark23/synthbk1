// Emergent Reasoning - Items 14.1-14.2
// True emergence, not just pattern matching

import { Utils } from './utils';

// ============================================
// ITEM 14.1: Recursive Self-Application Engine
// Apply reasoning to its own reasoning
// ============================================
export class RecursiveSelfApplication {
  private reasoningHistory: Array<{ step: string; confidence: number; timestamp: number }> = [];

  applyReasoning(reasoning: string): { insight: string; confidence: number } {
    // Record this reasoning step
    this.reasoningHistory.push({
      step: reasoning,
      confidence: 1.0,
      timestamp: Date.now()
    });

    // Analyze the reasoning for patterns
    const keywords = Utils.extractKeywords(reasoning);
    
    // Check for recurring themes
    const themeCounts = new Map<string, number>();
    this.reasoningHistory.forEach(entry => {
      const entryKeywords = Utils.extractKeywords(entry.step);
      entryKeywords.forEach(kw => {
        themeCounts.set(kw, (themeCounts.get(kw) || 0) + 1);
      });
    });

    // Find patterns that appear multiple times
    const recurringThemes = Array.from(themeCounts.entries())
      .filter(([_, count]) => count >= 2)
      .map(([theme]) => theme);

    if (recurringThemes.length > 0) {
      return {
        insight: `I notice I keep returning to: ${recurringThemes.join(', ')}. This suggests these are central to the problem.`,
        confidence: 0.7
      };
    }

    // Check for reasoning loops
    if (this.reasoningHistory.length >= 3) {
      const lastThree = this.reasoningHistory.slice(-3).map(e => e.step);
      if (lastThree[0] === lastThree[2]) {
        return {
          insight: 'I appear to be reasoning in a loop. Let me try a different approach.',
          confidence: 0.8
        };
      }
    }

    return {
      insight: 'No meta-patterns detected yet. Continuing reasoning.',
      confidence: 0.5
    };
  }

  getReasoningTrace(): string {
    return this.reasoningHistory
      .map((entry, i) => `${i + 1}. ${entry.step} (confidence: ${(entry.confidence * 100).toFixed(0)}%)`)
      .join('\n');
  }

  clear() {
    this.reasoningHistory = [];
  }
}

// ============================================
// ITEM 14.2: Concept Blending Engine
// Merge two unrelated concepts (Fauconnier & Turner)
// ============================================
export class ConceptBlendingEngine {
  private conceptAttributes: Map<string, string[]> = new Map();

  constructor() {
    this.loadConcepts();
  }

  private loadConcepts() {
    const conceptData: Record<string, string[]> = {
      'king': ['royal', 'male', 'ruler', 'crown', 'throne', 'power', 'kingdom'],
      'queen': ['royal', 'female', 'ruler', 'crown', 'throne', 'power', 'kingdom'],
      'man': ['male', 'adult', 'human', 'person'],
      'woman': ['female', 'adult', 'human', 'person'],
      'computer': ['machine', 'electronic', 'compute', 'program', 'digital'],
      'brain': ['organ', 'think', 'biological', 'neural', 'intelligence'],
      'network': ['connected', 'nodes', 'communication', 'distributed'],
      'tree': ['plant', 'branches', 'roots', 'grow', 'natural'],
      'river': ['water', 'flow', 'natural', 'continuous', 'channel'],
      'city': ['urban', 'buildings', 'people', 'infrastructure', 'organized'],
      'forest': ['trees', 'natural', 'ecosystem', 'dense', 'wild'],
      'library': ['books', 'knowledge', 'organized', 'quiet', 'building'],
      'internet': ['network', 'global', 'digital', 'connected', 'information'],
    };

    Object.entries(conceptData).forEach(([concept, attributes]) => {
      this.conceptAttributes.set(concept, attributes);
    });
  }

  blend(concept1: string, concept2: string): { 
    blended: string; 
    attributes: string[]; 
    emergentProperties: string[];
    coherence: number;
  } {
    const attrs1 = this.conceptAttributes.get(concept1) || [];
    const attrs2 = this.conceptAttributes.get(concept2) || [];

    // Find shared attributes (generic space)
    const shared = attrs1.filter(a => attrs2.includes(a));

    // Find unique attributes from each (input spaces)
    const unique1 = attrs1.filter(a => !attrs2.includes(a));
    const unique2 = attrs2.filter(a => !attrs1.includes(a));

    // Create blended concept name
    const blended = `${concept1}-${concept2}`;

    // Emergent properties: combinations that don't exist in either input
    const emergentProperties: string[] = [];
    
    // Combine attributes in novel ways
    unique1.slice(0, 2).forEach(attr1 => {
      unique2.slice(0, 2).forEach(attr2 => {
        emergentProperties.push(`${attr1} + ${attr2}`);
      });
    });

    // Calculate coherence (how well the blend makes sense)
    const coherence = shared.length > 0 ? 0.7 + (shared.length * 0.1) : 0.3;

    // Combined attributes
    const attributes = [...new Set([...shared, ...unique1.slice(0, 3), ...unique2.slice(0, 3)])];

    return {
      blended,
      attributes,
      emergentProperties: emergentProperties.slice(0, 5),
      coherence: Math.min(1.0, coherence)
    };
  }

  addConcept(concept: string, attributes: string[]) {
    this.conceptAttributes.set(concept, attributes);
  }

  findBestBlend(query: string, candidates: string[]): { concept1: string; concept2: string; coherence: number } | null {
    let best: { concept1: string; concept2: string; coherence: number } | null = null;

    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        const blend = this.blend(candidates[i], candidates[j]);
        if (!best || blend.coherence > best.coherence) {
          best = {
            concept1: candidates[i],
            concept2: candidates[j],
            coherence: blend.coherence
          };
        }
      }
    }

    return best;
  }
}

// ============================================
// ITEM 14.3: Abstraction Layer System
// Move up/down abstraction levels
// ============================================
export class AbstractionLayerSystem {
  private abstractionLevels: Map<string, { level: number; parent?: string; children: string[] }> = new Map();

  constructor() {
    this.loadLevels();
  }

  private loadLevels() {
    const levels: Record<string, { level: number; parent?: string; children: string[] }> = {
      'concrete': { level: 0, children: ['specific', 'detailed'] },
      'specific': { level: 1, parent: 'concrete', children: ['particular', 'exact'] },
      'detailed': { level: 1, parent: 'concrete', children: ['comprehensive', 'thorough'] },
      'particular': { level: 2, parent: 'specific', children: ['individual', 'single'] },
      'general': { level: 3, children: ['abstract', 'conceptual'] },
      'abstract': { level: 4, parent: 'general', children: ['theoretical', 'conceptual'] },
      'conceptual': { level: 4, parent: 'general', children: ['theoretical', 'philosophical'] },
      'theoretical': { level: 5, parent: 'abstract', children: ['philosophical', 'fundamental'] },
      'fundamental': { level: 6, parent: 'theoretical', children: ['universal', 'principles'] },
    };

    Object.entries(levels).forEach(([name, data]) => {
      this.abstractionLevels.set(name, data);
    });
  }

  moveUp(concept: string, steps: number = 1): string {
    let current = concept.toLowerCase();
    
    for (let i = 0; i < steps; i++) {
      const levelData = this.abstractionLevels.get(current);
      if (!levelData || !levelData.parent) break;
      current = levelData.parent;
    }

    return current;
  }

  moveDown(concept: string, steps: number = 1): string[] {
    let current = concept.toLowerCase();
    const results: string[] = [];

    for (let i = 0; i < steps; i++) {
      const levelData = this.abstractionLevels.get(current);
      if (!levelData || levelData.children.length === 0) break;
      
      if (i === steps - 1) {
        results.push(...levelData.children);
      } else {
        current = levelData.children[0]; // Follow first child
      }
    }

    return results;
  }

  getLevel(concept: string): number {
    const levelData = this.abstractionLevels.get(concept.toLowerCase());
    return levelData?.level || 0;
  }

  addLevel(name: string, level: number, parent?: string, children: string[] = []) {
    this.abstractionLevels.set(name, { level, parent, children });
  }
}

// ============================================
// ITEM 14.4: Analogical Chain Reasoning
// A→B→C transitively
// ============================================
export class AnalogicalChainReasoner {
  private analogies: Map<string, Map<string, number>> = new Map();

  constructor() {
    this.loadAnalogies();
  }

  private loadAnalogies() {
    // Create analogy graph
    const analogyData: Record<string, Record<string, number>> = {
      'heart': { 'pump': 0.9, 'engine': 0.7, 'computer': 0.5 },
      'pump': { 'heart': 0.9, 'engine': 0.8, 'compressor': 0.7 },
      'engine': { 'motor': 0.9, 'pump': 0.8, 'heart': 0.7 },
      'brain': { 'computer': 0.8, 'network': 0.7, 'library': 0.6 },
      'computer': { 'brain': 0.8, 'machine': 0.9, 'tool': 0.7 },
      'network': { 'web': 0.9, 'system': 0.8, 'brain': 0.7 },
      'library': { 'database': 0.8, 'brain': 0.6, 'archive': 0.9 },
      'river': { 'flow': 0.9, 'stream': 0.95, 'current': 0.85 },
      'flow': { 'river': 0.9, 'process': 0.7, 'movement': 0.8 },
    };

    Object.entries(analogyData).forEach(([source, targets]) => {
      const targetMap = new Map<string, number>();
      Object.entries(targets).forEach(([target, strength]) => {
        targetMap.set(target, strength);
      });
      this.analogies.set(source, targetMap);
    });
  }

  findChain(start: string, end: string, maxLength: number = 3): { path: string[]; strength: number } | null {
    const visited = new Set<string>();
    const queue: Array<{ path: string[]; strength: number }> = [{ path: [start], strength: 1.0 }];

    while (queue.length > 0) {
      const { path, strength } = queue.shift()!;
      const current = path[path.length - 1];

      if (current === end) {
        return { path, strength };
      }

      if (path.length > maxLength || visited.has(current)) continue;
      visited.add(current);

      const connections = this.analogies.get(current);
      if (!connections) continue;

      connections.forEach((edgeStrength, target) => {
        if (!visited.has(target)) {
          queue.push({
            path: [...path, target],
            strength: strength * edgeStrength
          });
        }
      });
    }

    return null;
  }

  getAnalogyStrength(concept1: string, concept2: string): number {
    const connections = this.analogies.get(concept1);
    return connections?.get(concept2) || 0;
  }

  addAnalogy(source: string, target: string, strength: number) {
    if (!this.analogies.has(source)) {
      this.analogies.set(source, new Map());
    }
    this.analogies.get(source)!.set(target, strength);
  }
}

// ============================================
// ITEM 14.5: Novel Combination Scorer
// Generate random combinations, score for novelty + coherence
// ============================================
export class NovelCombinationScorer {
  private concepts: string[] = [];
  private combinationHistory: Array<{ concepts: string[]; score: number }> = [];

  constructor() {
    this.loadConcepts();
  }

  private loadConcepts() {
    this.concepts = [
      'time', 'space', 'energy', 'matter', 'information',
      'system', 'process', 'structure', 'pattern', 'relationship',
      'cause', 'effect', 'goal', 'method', 'tool',
      'problem', 'solution', 'challenge', 'opportunity', 'innovation'
    ];
  }

  generateCombinations(count: number = 5): Array<{ concepts: string[]; novelty: number; coherence: number; score: number }> {
    const combinations: Array<{ concepts: string[]; novelty: number; coherence: number; score: number }> = [];

    for (let i = 0; i < count; i++) {
      // Pick 2-3 random concepts
      const numConcepts = Math.floor(Math.random() * 2) + 2;
      const selected: string[] = [];
      
      while (selected.length < numConcepts) {
        const concept = this.concepts[Math.floor(Math.random() * this.concepts.length)];
        if (!selected.includes(concept)) {
          selected.push(concept);
        }
      }

      // Score novelty (how unusual is this combination?)
      const novelty = this.calculateNovelty(selected);

      // Score coherence (does this combination make sense?)
      const coherence = this.calculateCoherence(selected);

      // Combined score
      const score = (novelty * 0.6) + (coherence * 0.4);

      combinations.push({ concepts: selected, novelty, coherence, score });
    }

    // Sort by score
    combinations.sort((a, b) => b.score - a.score);

    // Store in history
    this.combinationHistory.push(...combinations.map(c => ({ concepts: c.concepts, score: c.score })));

    return combinations;
  }

  private calculateNovelty(concepts: string[]): number {
    // Check if this combination has been seen before
    const key = concepts.sort().join(',');
    const seenBefore = this.combinationHistory.some(
      c => c.concepts.sort().join(',') === key
    );

    // Novelty is higher if not seen before
    return seenBefore ? 0.3 : 0.8 + Math.random() * 0.2;
  }

  private calculateCoherence(concepts: string[]): number {
    // Simple heuristic: concepts that are semantically related have higher coherence
    // For now, use a random score with bias toward related concepts
    const relatedPairs = [
      ['time', 'space'],
      ['cause', 'effect'],
      ['problem', 'solution'],
      ['goal', 'method'],
      ['system', 'process'],
    ];

    let relatedCount = 0;
    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        if (relatedPairs.some(pair => 
          (pair[0] === concepts[i] && pair[1] === concepts[j]) ||
          (pair[1] === concepts[i] && pair[0] === concepts[j])
        )) {
          relatedCount++;
        }
      }
    }

    const maxPairs = (concepts.length * (concepts.length - 1)) / 2;
    return 0.5 + (relatedCount / maxPairs) * 0.5;
  }

  getBestCombination(): { concepts: string[]; score: number } | null {
    if (this.combinationHistory.length === 0) return null;
    
    const best = this.combinationHistory.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    );

    return best;
  }

  addConcepts(concepts: string[]) {
    this.concepts.push(...concepts);
  }
}

// ============================================
// Export emergent reasoning systems
// ============================================
export const EmergentReasoningSystems = {
  RecursiveSelfApplication,
  ConceptBlendingEngine,
  AbstractionLayerSystem,
  AnalogicalChainReasoner,
  NovelCombinationScorer,
};
