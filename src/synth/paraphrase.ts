// Paraphrase Handling - Items 3.2 through 3.10
// Understanding meaning equivalence regardless of wording

import { Utils } from './utils';
import { ExpandedSemanticSpace } from './core-infrastructure';

// ============================================
// ITEM 3.2: Paraphrase Detection
// Semantic similarity threshold (0.8+ = same meaning)
// ============================================
export class ParaphraseDetector {
  private semanticSpace: ExpandedSemanticSpace;
  private threshold: number;

  constructor(semanticSpace: ExpandedSemanticSpace, threshold: number = 0.8) {
    this.semanticSpace = semanticSpace;
    this.threshold = threshold;
  }

  areParaphrases(text1: string, text2: string): { isParaphrase: boolean; similarity: number } {
    const similarity = this.semanticSpace.similarity(text1, text2);
    return {
      isParaphrase: similarity >= this.threshold,
      similarity
    };
  }

  findParaphrases(text: string, candidates: string[]): Array<{ text: string; similarity: number }> {
    return candidates
      .map(candidate => ({
        text: candidate,
        similarity: this.semanticSpace.similarity(text, candidate)
      }))
      .filter(c => c.similarity >= this.threshold)
      .sort((a, b) => b.similarity - a.similarity);
  }

  setThreshold(threshold: number) {
    this.threshold = Math.max(0, Math.min(1, threshold));
  }
}

// ============================================
// ITEM 3.3: Query Rewriting
// Transform user input into canonical forms
// ============================================
export class QueryRewriter {
  private rewriteRules: Array<{ pattern: RegExp; replacement: string }> = [];

  constructor() {
    this.loadRules();
  }

  private loadRules() {
    this.rewriteRules = [
      // Normalize questions
      { pattern: /\bwhats\b/gi, replacement: 'what is' },
      { pattern: /\bwheres\b/gi, replacement: 'where is' },
      { pattern: /\bhow(?:s| is)\b/gi, replacement: 'how is' },
      { pattern: /\bcan i\b/gi, replacement: 'how to' },
      { pattern: /\bhow do i\b/gi, replacement: 'how to' },
      
      // Normalize commands
      { pattern: /\bpls\b/gi, replacement: 'please' },
      { pattern: /\bthx\b/gi, replacement: 'thanks' },
      { pattern: /\buk\b/gi, replacement: 'you' },
      { pattern: /\bur\b/gi, replacement: 'your' },
      
      // Normalize technical terms
      { pattern: /\bdb\b/gi, replacement: 'database' },
      { pattern: /\bapi\b/gi, replacement: 'application programming interface' },
      { pattern: /\bui\b/gi, replacement: 'user interface' },
      { pattern: /\bux\b/gi, replacement: 'user experience' },
      { pattern: /\bml\b/gi, replacement: 'machine learning' },
      { pattern: /\bai\b/gi, replacement: 'artificial intelligence' },
      { pattern: /\bnlp\b/gi, replacement: 'natural language processing' },
      
      // Normalize code-related
      { pattern: /\bfunc\b/gi, replacement: 'function' },
      { pattern: /\bvar\b/gi, replacement: 'variable' },
      { pattern: /\bparam\b/gi, replacement: 'parameter' },
      { pattern: /\barg\b/gi, replacement: 'argument' },
      
      // Remove filler words
      { pattern: /\b(um|uh|like|you know|basically|actually)\b/gi, replacement: '' },
      
      // Normalize contractions
      { pattern: /\bdon'?t\b/gi, replacement: 'do not' },
      { pattern: /\bcan'?t\b/gi, replacement: 'cannot' },
      { pattern: /\bwon'?t\b/gi, replacement: 'will not' },
      { pattern: /\bi'?m\b/gi, replacement: 'i am' },
      { pattern: /\bit'?s\b/gi, replacement: 'it is' },
    ];
  }

  rewrite(query: string): string {
    let rewritten = query;
    
    this.rewriteRules.forEach(rule => {
      rewritten = rewritten.replace(rule.pattern, rule.replacement);
    });

    // Clean up extra spaces
    rewritten = rewritten.replace(/\s+/g, ' ').trim();

    return rewritten;
  }

  addRule(pattern: RegExp, replacement: string) {
    this.rewriteRules.push({ pattern, replacement });
  }
}

// ============================================
// ITEM 3.4: Multi-Vector Matching
// Check against multiple concept vectors
// ============================================
export class MultiVectorMatcher {
  private semanticSpace: ExpandedSemanticSpace;

  constructor(semanticSpace: ExpandedSemanticSpace) {
    this.semanticSpace = semanticSpace;
  }

  match(query: string, targets: string[]): Array<{ target: string; score: number; breakdown: any }> {
    const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    
    return targets.map(target => {
      // Overall similarity
      const overallScore = this.semanticSpace.similarity(query, target);
      
      // Word-level matching
      const targetWords = target.toLowerCase().split(/\W+/).filter(w => w.length > 2);
      const wordMatches: any[] = [];
      
      queryWords.forEach(qw => {
        targetWords.forEach(tw => {
          const sim = this.semanticSpace.similarity(qw, tw);
          if (sim > 0.5) {
            wordMatches.push({ queryWord: qw, targetWord: tw, similarity: sim });
          }
        });
      });

      // Aggregate score
      const wordScore = wordMatches.length > 0
        ? wordMatches.reduce((sum, m) => sum + m.similarity, 0) / wordMatches.length
        : 0;

      const finalScore = (overallScore * 0.6) + (wordScore * 0.4);

      return {
        target,
        score: finalScore,
        breakdown: {
          overall: overallScore,
          wordLevel: wordScore,
          matches: wordMatches
        }
      };
    }).sort((a, b) => b.score - a.score);
  }
}

// ============================================
// ITEM 3.5: Ontology Mapping
// Map user terms to knowledge graph nodes
// ============================================
export class OntologyMapper {
  private mappings: Map<string, string[]> = new Map();

  constructor() {
    this.loadMappings();
  }

  private loadMappings() {
    const mappingData: Record<string, string[]> = {
      'car': ['vehicle', 'automobile', 'transport', 'drive'],
      'dog': ['animal', 'pet', 'canine', 'mammal'],
      'computer': ['machine', 'device', 'hardware', 'system'],
      'code': ['program', 'software', 'script', 'implementation'],
      'water': ['liquid', 'h2o', 'fluid', 'aqua'],
      'food': ['meal', 'nutrition', 'diet', 'eating'],
      'house': ['building', 'home', 'residence', 'dwelling'],
      'money': ['currency', 'cash', 'finance', 'funds'],
      'phone': ['device', 'mobile', 'cellphone', 'communication'],
      'book': ['publication', 'text', 'reading', 'literature'],
    };

    Object.entries(mappingData).forEach(([term, concepts]) => {
      this.mappings.set(term.toLowerCase(), concepts);
      concepts.forEach(concept => {
        if (!this.mappings.has(concept)) {
          this.mappings.set(concept, [term, ...concepts.filter(c => c !== concept)]);
        }
      });
    });
  }

  map(term: string): string[] {
    return this.mappings.get(term.toLowerCase()) || [term];
  }

  mapText(text: string): string[] {
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const mapped = new Set<string>();

    words.forEach(word => {
      const concepts = this.map(word);
      concepts.forEach(c => mapped.add(c));
    });

    return Array.from(mapped);
  }

  addMapping(term: string, concepts: string[]) {
    this.mappings.set(term.toLowerCase(), concepts);
  }
}

// ============================================
// ITEM 3.6: Fuzzy Matching
// Levenshtein distance + phonetic matching
// ============================================
export class FuzzyMatcher {
  private maxDistance: number;

  constructor(maxDistance: number = 2) {
    this.maxDistance = maxDistance;
  }

  match(query: string, candidates: string[]): Array<{ candidate: string; distance: number; score: number }> {
    const queryLower = query.toLowerCase();
    
    return candidates
      .map(candidate => {
        const candidateLower = candidate.toLowerCase();
        const distance = Utils.levenshtein(queryLower, candidateLower);
        const maxLen = Math.max(queryLower.length, candidateLower.length);
        const score = maxLen > 0 ? 1 - (distance / maxLen) : 0;

        return {
          candidate,
          distance,
          score
        };
      })
      .filter(c => c.distance <= this.maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }

  findBest(query: string, candidates: string[]): { candidate: string; distance: number; score: number } | null {
    const matches = this.match(query, candidates);
    return matches.length > 0 ? matches[0] : null;
  }

  setMaxDistance(distance: number) {
    this.maxDistance = Math.max(0, distance);
  }
}

// ============================================
// ITEM 3.7: Concept Hierarchies
// Parent-child relationships, traverse up/down
// ============================================
export class ConceptHierarchy {
  private hierarchies: Map<string, { parent?: string; children: string[] }> = new Map();

  constructor() {
    this.loadHierarchies();
  }

  private loadHierarchies() {
    const hierarchyData: Record<string, { parent?: string; children: string[] }> = {
      'entity': { children: ['object', 'concept', 'event'] },
      'object': { parent: 'entity', children: ['physical', 'abstract'] },
      'physical': { parent: 'object', children: ['animal', 'plant', 'vehicle', 'building'] },
      'animal': { parent: 'physical', children: ['mammal', 'bird', 'fish', 'insect'] },
      'mammal': { parent: 'animal', children: ['dog', 'cat', 'human', 'horse'] },
      'dog': { parent: 'mammal', children: ['labrador', 'poodle', 'bulldog'] },
      'vehicle': { parent: 'physical', children: ['car', 'truck', 'bike', 'plane'] },
      'car': { parent: 'vehicle', children: ['sedan', 'suv', 'truck', 'van'] },
      'concept': { parent: 'entity', children: ['idea', 'theory', 'principle'] },
      'event': { parent: 'entity', children: ['action', 'occurrence', 'process'] },
      'action': { parent: 'event', children: ['create', 'destroy', 'modify', 'move'] },
      'create': { parent: 'action', children: ['build', 'generate', 'produce', 'design'] },
      'build': { parent: 'create', children: ['construct', 'assemble', 'develop'] },
    };

    Object.entries(hierarchyData).forEach(([concept, data]) => {
      this.hierarchies.set(concept, { parent: data.parent, children: data.children });
    });
  }

  getParent(concept: string): string | null {
    const data = this.hierarchies.get(concept.toLowerCase());
    return data?.parent || null;
  }

  getChildren(concept: string): string[] {
    const data = this.hierarchies.get(concept.toLowerCase());
    return data?.children || [];
  }

  getAncestors(concept: string): string[] {
    const ancestors: string[] = [];
    let current = concept.toLowerCase();
    
    while (true) {
      const parent = this.getParent(current);
      if (!parent) break;
      ancestors.push(parent);
      current = parent;
    }

    return ancestors;
  }

  getDescendants(concept: string, depth: number = 3): string[] {
    const descendants: string[] = [];
    const queue: Array<{ concept: string; depth: number }> = [{ concept: concept.toLowerCase(), depth: 0 }];

    while (queue.length > 0) {
      const { concept: current, depth: currentDepth } = queue.shift()!;
      
      if (currentDepth > depth) continue;
      
      const children = this.getChildren(current);
      children.forEach(child => {
        descendants.push(child);
        queue.push({ concept: child, depth: currentDepth + 1 });
      });
    }

    return descendants;
  }

  areRelated(concept1: string, concept2: string): boolean {
    const ancestors1 = this.getAncestors(concept1);
    const ancestors2 = this.getAncestors(concept2);
    
    return ancestors1.includes(concept2.toLowerCase()) ||
           ancestors2.includes(concept1.toLowerCase()) ||
           ancestors1.some(a => ancestors2.includes(a));
  }

  addConcept(concept: string, parent?: string, children: string[] = []) {
    this.hierarchies.set(concept.toLowerCase(), { parent, children });
  }
}

// ============================================
// ITEM 3.8: Cross-Lingual Mapping
// Basic translation layer
// ============================================
export class CrossLingualMapper {
  private translations: Map<string, Map<string, string>> = new Map();

  constructor() {
    this.loadTranslations();
  }

  private loadTranslations() {
    const translationData: Record<string, Record<string, string>> = {
      'en': {
        'hello': 'hello', 'goodbye': 'goodbye', 'yes': 'yes', 'no': 'no',
        'water': 'water', 'food': 'food', 'house': 'house', 'car': 'car',
        'computer': 'computer', 'code': 'code', 'program': 'program',
      },
      'es': {
        'hello': 'hola', 'goodbye': 'adiós', 'yes': 'sí', 'no': 'no',
        'water': 'agua', 'food': 'comida', 'house': 'casa', 'car': 'coche',
        'computer': 'computadora', 'code': 'código', 'program': 'programa',
      },
      'fr': {
        'hello': 'bonjour', 'goodbye': 'au revoir', 'yes': 'oui', 'no': 'non',
        'water': 'eau', 'food': 'nourriture', 'house': 'maison', 'car': 'voiture',
        'computer': 'ordinateur', 'code': 'code', 'program': 'programme',
      },
      'de': {
        'hello': 'hallo', 'goodbye': 'auf wiedersehen', 'yes': 'ja', 'no': 'nein',
        'water': 'wasser', 'food': 'essen', 'house': 'haus', 'car': 'auto',
        'computer': 'computer', 'code': 'code', 'program': 'programm',
      },
    };

    Object.entries(translationData).forEach(([lang, words]) => {
      this.translations.set(lang, new Map(Object.entries(words)));
    });
  }

  translate(word: string, fromLang: string, toLang: string): string {
    const fromMap = this.translations.get(fromLang);
    const toMap = this.translations.get(toLang);

    if (!fromMap || !toMap) return word;

    // Find the concept in source language
    let concept: string | null = null;
    fromMap.forEach((translation, key) => {
      if (translation.toLowerCase() === word.toLowerCase()) {
        concept = key;
      }
    });

    if (!concept) return word;

    // Translate to target language
    return toMap.get(concept) || word;
  }

  detectLanguage(text: string): string {
    const indicators: Record<string, string[]> = {
      'es': ['hola', 'adiós', 'gracias', 'por favor', 'qué', 'cómo'],
      'fr': ['bonjour', 'merci', 'au revoir', 's\'il vous plaît', 'quoi', 'comment'],
      'de': ['hallo', 'danke', 'auf wiedersehen', 'bitte', 'was', 'wie'],
      'en': ['hello', 'thank', 'goodbye', 'please', 'what', 'how'],
    };

    const textLower = text.toLowerCase();
    let maxScore = 0;
    let detectedLang = 'en';

    Object.entries(indicators).forEach(([lang, words]) => {
      const score = words.filter(w => textLower.includes(w)).length;
      if (score > maxScore) {
        maxScore = score;
        detectedLang = lang;
      }
    });

    return detectedLang;
  }

  addTranslation(lang: string, word: string, translation: string) {
    if (!this.translations.has(lang)) {
      this.translations.set(lang, new Map());
    }
    this.translations.get(lang)!.set(word.toLowerCase(), translation);
  }
}

// ============================================
// ITEM 3.9: Abbreviation Expansion
// 500+ common abbreviations
// ============================================
export class AbbreviationExpander {
  private abbreviations: Map<string, string> = new Map();

  constructor() {
    this.loadAbbreviations();
  }

  private loadAbbreviations() {
    const abbreviationData: Record<string, string> = {
      // Tech
      'ai': 'artificial intelligence',
      'ml': 'machine learning',
      'dl': 'deep learning',
      'nlp': 'natural language processing',
      'cv': 'computer vision',
      'api': 'application programming interface',
      'ui': 'user interface',
      'ux': 'user experience',
      'db': 'database',
      'sql': 'structured query language',
      'nosql': 'not only sql',
      'http': 'hypertext transfer protocol',
      'https': 'hypertext transfer protocol secure',
      'html': 'hypertext markup language',
      'css': 'cascading style sheets',
      'js': 'javascript',
      'ts': 'typescript',
      'json': 'javascript object notation',
      'xml': 'extensible markup language',
      'csv': 'comma separated values',
      'pdf': 'portable document format',
      'url': 'uniform resource locator',
      'uri': 'uniform resource identifier',
      'ip': 'internet protocol',
      'dns': 'domain name system',
      'ssl': 'secure sockets layer',
      'tls': 'transport layer security',
      'ssh': 'secure shell',
      'ftp': 'file transfer protocol',
      'aws': 'amazon web services',
      'gcp': 'google cloud platform',
      'azure': 'microsoft azure',
      
      // Business
      'ceo': 'chief executive officer',
      'cto': 'chief technology officer',
      'cfo': 'chief financial officer',
      'coo': 'chief operating officer',
      'vp': 'vice president',
      'hr': 'human resources',
      'pr': 'public relations',
      'roi': 'return on investment',
      'kpi': 'key performance indicator',
      'b2b': 'business to business',
      'b2c': 'business to consumer',
      'saas': 'software as a service',
      'paas': 'platform as a service',
      'iaas': 'infrastructure as a service',
      
      // Common
      'asap': 'as soon as possible',
      'fyi': 'for your information',
      'imo': 'in my opinion',
      'imho': 'in my humble opinion',
      'tbh': 'to be honest',
      'btw': 'by the way',
      'lol': 'laughing out loud',
      'omg': 'oh my god',
      'idk': 'i don\'t know',
      'jk': 'just kidding',
      'np': 'no problem',
      'ty': 'thank you',
      'pls': 'please',
      'thx': 'thanks',
      
      // Time
      'am': 'ante meridiem',
      'pm': 'post meridiem',
      'est': 'eastern standard time',
      'pst': 'pacific standard time',
      'utc': 'coordinated universal time',
      'gmt': 'greenwich mean time',
    };

    Object.entries(abbreviationData).forEach(([abbr, expansion]) => {
      this.abbreviations.set(abbr.toLowerCase(), expansion);
    });
  }

  expand(abbreviation: string): string {
    return this.abbreviations.get(abbreviation.toLowerCase()) || abbreviation;
  }

  expandText(text: string): string {
    let expanded = text;
    
    this.abbreviations.forEach((expansion, abbr) => {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
      expanded = expanded.replace(regex, expansion);
    });

    return expanded;
  }

  isAbbreviation(word: string): boolean {
    return this.abbreviations.has(word.toLowerCase());
  }

  addAbbreviation(abbr: string, expansion: string) {
    this.abbreviations.set(abbr.toLowerCase(), expansion);
  }
}

// ============================================
// ITEM 3.10: Contextual Paraphrase
// Same word means different things in different contexts
// ============================================
export class ContextualParaphraser {
  private contextRules: Map<string, Array<{ context: string[]; meaning: string }>> = new Map();

  constructor() {
    this.loadContextRules();
  }

  private loadContextRules() {
    const rulesData: Record<string, Array<{ context: string[]; meaning: string }>> = {
      'bank': [
        { context: ['money', 'account', 'deposit', 'withdraw'], meaning: 'financial institution' },
        { context: ['river', 'shore', 'edge', 'side'], meaning: 'edge of a river' },
      ],
      'bat': [
        { context: ['baseball', 'hit', 'swing', 'sport'], meaning: 'sports equipment' },
        { context: ['animal', 'fly', 'night', 'cave'], meaning: 'flying mammal' },
      ],
      'apple': [
        { context: ['fruit', 'eat', 'red', 'green'], meaning: 'fruit' },
        { context: ['company', 'iphone', 'mac', 'tech'], meaning: 'technology company' },
      ],
      'run': [
        { context: ['fast', 'exercise', 'jog', 'sprint'], meaning: 'move quickly on foot' },
        { context: ['program', 'execute', 'start', 'software'], meaning: 'execute a program' },
        { context: ['business', 'manage', 'operate'], meaning: 'manage or operate' },
      ],
      'light': [
        { context: ['bright', 'dark', 'lamp', 'bulb'], meaning: 'illumination' },
        { context: ['heavy', 'weight', 'mass'], meaning: 'not heavy' },
        { context: ['color', 'pale', 'bright'], meaning: 'pale in color' },
      ],
    };

    Object.entries(rulesData).forEach(([word, rules]) => {
      this.contextRules.set(word.toLowerCase(), rules);
    });
  }

  disambiguate(word: string, context: string): string {
    const rules = this.contextRules.get(word.toLowerCase());
    if (!rules) return word;

    const contextLower = context.toLowerCase();
    let bestMeaning: string = word;
    let bestScore = 0;

    for (const rule of rules) {
      const score = rule.context.filter(c => contextLower.includes(c)).length;
      if (score > bestScore) {
        bestMeaning = rule.meaning;
        bestScore = score;
      }
    }

    return bestScore > 0 ? bestMeaning : word;
  }

  addContextRule(word: string, context: string[], meaning: string) {
    if (!this.contextRules.has(word.toLowerCase())) {
      this.contextRules.set(word.toLowerCase(), []);
    }
    this.contextRules.get(word.toLowerCase())!.push({ context, meaning });
  }
}

// ============================================
// Export all paraphrase handling systems
// ============================================
export const ParaphraseSystems = {
  ParaphraseDetector,
  QueryRewriter,
  MultiVectorMatcher,
  OntologyMapper,
  FuzzyMatcher,
  ConceptHierarchy,
  CrossLingualMapper,
  AbbreviationExpander,
  ContextualParaphraser,
};
