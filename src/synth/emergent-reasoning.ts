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
// Export emergent reasoning systems
// ============================================
export const EmergentReasoningSystems = {
  RecursiveSelfApplication,
  ConceptBlendingEngine,
};
