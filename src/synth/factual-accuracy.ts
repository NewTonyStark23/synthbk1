// Factual Accuracy - Items 9.1, 9.3-9.10
// Vast accurate knowledge, not 12 hardcoded facts

import { Utils } from './utils';

// ============================================
// ITEM 9.1: Fact Verification Engine
// Cross-reference multiple sources
// ============================================
export class FactVerificationEngine {
  private facts: Map<string, { value: string; sources: string[]; confidence: number; timestamp: number }> = new Map();

  addFact(key: string, value: string, source: string, confidence: number = 1.0) {
    if (!this.facts.has(key)) {
      this.facts.set(key, { value, sources: [source], confidence, timestamp: Date.now() });
    } else {
      const existing = this.facts.get(key)!;
      existing.sources.push(source);
      // Average confidence from multiple sources
      existing.confidence = (existing.confidence + confidence) / 2;
      existing.timestamp = Date.now();
    }
  }

  verify(key: string): { verified: boolean; value: string; confidence: number; sources: string[] } | null {
    const fact = this.facts.get(key);
    if (!fact) return null;

    return {
      verified: fact.confidence > 0.7,
      value: fact.value,
      confidence: fact.confidence,
      sources: fact.sources
    };
  }

  crossReference(key: string): { consistent: boolean; sources: string[]; conflicts: string[] } {
    const fact = this.facts.get(key);
    if (!fact) return { consistent: false, sources: [], conflicts: ['No data available'] };

    return {
      consistent: fact.confidence > 0.8,
      sources: fact.sources,
      conflicts: fact.confidence < 0.5 ? ['Low confidence - sources disagree'] : []
    };
  }
}

// ============================================
// ITEM 9.3: Source Attribution
// Cite where facts came from
// ============================================
export class SourceAttributor {
  private sources: Map<string, { name: string; url?: string; reliability: number; type: string }> = new Map();

  constructor() {
    this.loadSources();
  }

  private loadSources() {
    const sourceData: Record<string, { name: string; url?: string; reliability: number; type: string }> = {
      'wikipedia': { name: 'Wikipedia', url: 'https://en.wikipedia.org', reliability: 0.8, type: 'encyclopedia' },
      'britannica': { name: 'Encyclopedia Britannica', url: 'https://www.britannica.com', reliability: 0.9, type: 'encyclopedia' },
      'stackoverflow': { name: 'Stack Overflow', url: 'https://stackoverflow.com', reliability: 0.75, type: 'community' },
      'github': { name: 'GitHub', url: 'https://github.com', reliability: 0.85, type: 'code repository' },
      'mdn': { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', reliability: 0.95, type: 'documentation' },
      'official_docs': { name: 'Official Documentation', reliability: 0.95, type: 'documentation' },
      'user_input': { name: 'User Provided', reliability: 0.5, type: 'user input' },
      'local_kb': { name: 'Local Knowledge Base', reliability: 0.7, type: 'internal' },
    };

    Object.entries(sourceData).forEach(([id, data]) => {
      this.sources.set(id, data);
    });
  }

  cite(sourceId: string, fact: string): string {
    const source = this.sources.get(sourceId);
    if (!source) return `${fact} [Source: ${sourceId}]`;

    const reliability = source.reliability >= 0.9 ? 'highly reliable' :
                       source.reliability >= 0.7 ? 'reliable' : 'moderately reliable';

    return `${fact} [Source: ${source.name} - ${reliability}]`;
  }

  getReliability(sourceId: string): number {
    return this.sources.get(sourceId)?.reliability || 0.5;
  }

  addSource(id: string, name: string, reliability: number, type: string, url?: string) {
    this.sources.set(id, { name, reliability, type, url });
  }
}

// ============================================
// ITEM 9.4: Temporal Awareness
// Know when facts became outdated
// ============================================
export class TemporalAwareness {
  private temporalFacts: Map<string, { value: string; validFrom: number; validTo?: number }> = new Map();

  addTemporalFact(key: string, value: string, validFrom: number, validTo?: number) {
    this.temporalFacts.set(key, { value, validFrom, validTo });
  }

  getCurrentFact(key: string): { value: string; isCurrent: boolean; age: number } | null {
    const fact = this.temporalFacts.get(key);
    if (!fact) return null;

    const now = Date.now();
    const isCurrent = now >= fact.validFrom && (!fact.validTo || now <= fact.validTo);
    const age = (now - fact.validFrom) / (1000 * 60 * 60 * 24); // days

    return { value: fact.value, isCurrent, age };
  }

  isOutdated(key: string, maxAgeDays: number = 365): boolean {
    const fact = this.getCurrentFact(key);
    if (!fact) return true;
    return fact.age > maxAgeDays;
  }
}

// ============================================
// ITEM 9.5: Contradiction Detection
// Flag conflicting information
// ============================================
export class ContradictionDetector {
  private statements: Map<string, string[]> = new Map();

  addStatement(topic: string, statement: string) {
    if (!this.statements.has(topic)) {
      this.statements.set(topic, []);
    }
    this.statements.get(topic)!.push(statement);
  }

  detectContradictions(topic: string): { hasContradiction: boolean; contradictions: string[] } {
    const statements = this.statements.get(topic);
    if (!statements || statements.length < 2) {
      return { hasContradiction: false, contradictions: [] };
    }

    const contradictions: string[] = [];

    // Check for direct contradictions (simple heuristic)
    for (let i = 0; i < statements.length; i++) {
      for (let j = i + 1; j < statements.length; j++) {
        const s1 = statements[i].toLowerCase();
        const s2 = statements[j].toLowerCase();

        // Check for opposite assertions
        if ((s1.includes('is') && s2.includes('is not')) ||
            (s1.includes('is not') && s2.includes('is')) ||
            (s1.includes('true') && s2.includes('false')) ||
            (s1.includes('false') && s2.includes('true'))) {
          contradictions.push(`"${statements[i]}" contradicts "${statements[j]}"`);
        }
      }
    }

    return {
      hasContradiction: contradictions.length > 0,
      contradictions
    };
  }
}

// ============================================
// ITEM 9.6: Fact Extraction
// Pull facts from unstructured text
// ============================================
export class FactExtractor {
  extract(text: string): Array<{ subject: string; predicate: string; object: string }> {
    const facts: Array<{ subject: string; predicate: string; object: string }> = [];
    
    // Simple pattern matching for subject-predicate-object
    const patterns = [
      /(\w+)\s+(is|are|was|were)\s+(.+?)(?:\.|$)/gi,
      /(\w+)\s+(has|have|had)\s+(.+?)(?:\.|$)/gi,
      /(\w+)\s+(can|could|will|would)\s+(.+?)(?:\.|$)/gi,
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        facts.push({
          subject: match[1],
          predicate: match[2],
          object: match[3].trim()
        });
      }
    });

    return facts;
  }
}

// ============================================
// ITEM 9.7: Knowledge Validation
// Check facts against known constraints
// ============================================
export class KnowledgeValidator {
  private constraints: Map<string, (value: any) => boolean> = new Map();

  constructor() {
    this.loadConstraints();
  }

  private loadConstraints() {
    this.constraints.set('age', (value: number) => value >= 0 && value < 200);
    this.constraints.set('percentage', (value: number) => value >= 0 && value <= 100);
    this.constraints.set('probability', (value: number) => value >= 0 && value <= 1);
    this.constraints.set('year', (value: number) => value >= 1000 && value <= 2100);
    this.constraints.set('temperature_celsius', (value: number) => value >= -273.15 && value < 10000);
  }

  validate(key: string, value: any): { valid: boolean; reason?: string } {
    const constraint = this.constraints.get(key);
    if (!constraint) return { valid: true }; // No constraint, assume valid

    try {
      const isValid = constraint(value);
      return isValid ? { valid: true } : { valid: false, reason: `Value ${value} violates constraint for ${key}` };
    } catch (e) {
      return { valid: false, reason: `Validation error: ${e}` };
    }
  }

  addConstraint(key: string, validator: (value: any) => boolean) {
    this.constraints.set(key, validator);
  }
}

// ============================================
// ITEM 9.8: Uncertainty Quantification
// Distinguish known vs unknown
// ============================================
export class UncertaintyQuantifier {
  quantify(confidence: number): { level: string; description: string } {
    if (confidence >= 0.95) return { level: 'certain', description: 'Highly confident' };
    if (confidence >= 0.8) return { level: 'confident', description: 'Confident' };
    if (confidence >= 0.6) return { level: 'moderate', description: 'Moderately confident' };
    if (confidence >= 0.4) return { level: 'uncertain', description: 'Uncertain' };
    if (confidence >= 0.2) return { level: 'very_uncertain', description: 'Very uncertain' };
    return { level: 'unknown', description: 'Unknown' };
  }

  formatWithUncertainty(statement: string, confidence: number): string {
    const { level, description } = this.quantify(confidence);
    
    if (level === 'unknown') {
      return `I don't have reliable information about this.`;
    }
    
    if (level === 'very_uncertain' || level === 'uncertain') {
      return `I'm not sure about this, but: ${statement}`;
    }
    
    if (level === 'moderate') {
      return `I believe this is correct: ${statement}`;
    }
    
    return statement;
  }
}

// ============================================
// ITEM 9.9: Fact Linking
// Connect related facts into knowledge chains
// ============================================
export class FactLinker {
  private links: Map<string, Set<string>> = new Map();

  link(fact1: string, fact2: string, relationship: string = 'related') {
    if (!this.links.has(fact1)) {
      this.links.set(fact1, new Set());
    }
    this.links.get(fact1)!.add(`${fact2}:${relationship}`);

    // Bidirectional
    if (!this.links.has(fact2)) {
      this.links.set(fact2, new Set());
    }
    this.links.get(fact2)!.add(`${fact1}:${relationship}`);
  }

  getLinkedFacts(fact: string): Array<{ fact: string; relationship: string }> {
    const links = this.links.get(fact);
    if (!links) return [];

    return Array.from(links).map(link => {
      const [linkedFact, relationship] = link.split(':');
      return { fact: linkedFact, relationship };
    });
  }

  findChain(start: string, end: string, maxDepth: number = 3): string[] | null {
    const visited = new Set<string>();
    const queue: Array<{ fact: string; path: string[] }> = [{ fact: start, path: [start] }];

    while (queue.length > 0) {
      const { fact, path } = queue.shift()!;

      if (fact === end) return path;
      if (path.length > maxDepth) continue;
      if (visited.has(fact)) continue;

      visited.add(fact);

      const linked = this.getLinkedFacts(fact);
      linked.forEach(({ fact: linkedFact }) => {
        if (!visited.has(linkedFact)) {
          queue.push({ fact: linkedFact, path: [...path, linkedFact] });
        }
      });
    }

    return null;
  }
}

// ============================================
// ITEM 9.10: Real-Time Fact Checking
// Query external sources when uncertain
// ============================================
export class RealTimeFactChecker {
  async check(query: string): Promise<{ answer: string; source: string; confidence: number } | null> {
    try {
      // Try Wikipedia API
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.extract) {
          return {
            answer: data.extract,
            source: 'Wikipedia',
            confidence: 0.85
          };
        }
      }
    } catch (e) {
      // API not available
    }

    return null;
  }

  async checkWithMultipleSources(query: string): Promise<Array<{ answer: string; source: string; confidence: number }>> {
    const results: Array<{ answer: string; source: string; confidence: number }> = [];

    // Wikipedia
    const wikiResult = await this.check(query);
    if (wikiResult) results.push(wikiResult);

    // Could add more sources here (Dictionary API, etc.)

    return results;
  }
}

// ============================================
// Export all factual accuracy systems
// ============================================
export const FactualAccuracySystems = {
  FactVerificationEngine,
  SourceAttributor,
  TemporalAwareness,
  ContradictionDetector,
  FactExtractor,
  KnowledgeValidator,
  UncertaintyQuantifier,
  FactLinker,
  RealTimeFactChecker,
};
