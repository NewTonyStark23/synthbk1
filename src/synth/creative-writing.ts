// Creative Writing - Items 6.1-6.10
// Generate original content: stories, poems, dialogue, narratives

import { Utils } from './utils';

// ============================================
// ITEM 6.1: Markov Chain Text Generator
// Learn style from examples, generate new text
// ============================================
export class MarkovChainGenerator {
  private chains: Map<string, Map<string, number>> = new Map();
  private order: number = 2;

  train(text: string) {
    const words = text.split(/\s+/);
    
    for (let i = 0; i < words.length - this.order; i++) {
      const key = words.slice(i, i + this.order).join(' ');
      const nextWord = words[i + this.order];
      
      if (!this.chains.has(key)) {
        this.chains.set(key, new Map());
      }
      
      const transitions = this.chains.get(key)!;
      transitions.set(nextWord, (transitions.get(nextWord) || 0) + 1);
    }
  }

  generate(length: number = 50, seed?: string): string {
    if (this.chains.size === 0) return '';
    
    const keys = Array.from(this.chains.keys());
    let currentKey = seed || keys[Math.floor(Math.random() * keys.length)];
    const result = currentKey.split(' ');
    
    for (let i = 0; i < length; i++) {
      const transitions = this.chains.get(currentKey);
      if (!transitions || transitions.size === 0) break;
      
      // Weighted random selection
      const total = Array.from(transitions.values()).reduce((a, b) => a + b, 0);
      let random = Math.random() * total;
      let nextWord = '';
      
      for (const [word, count] of transitions.entries()) {
        random -= count;
        if (random <= 0) {
          nextWord = word;
          break;
        }
      }
      
      if (!nextWord) break;
      
      result.push(nextWord);
      const words = currentKey.split(' ');
      currentKey = [...words.slice(1), nextWord].join(' ');
    }
    
    return result.join(' ');
  }

  setOrder(order: number) {
    this.order = Math.max(1, order);
  }

  clear() {
    this.chains.clear();
  }
}

// ============================================
// ITEM 6.2: Template Composition
// Combine sentence templates in novel ways
// ============================================
export class TemplateComposer {
  private templates: Map<string, string[]> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates() {
    this.templates.set('opening', [
      'In the beginning, {subject} {action}.',
      'It was a {adjective} day when {subject} {action}.',
      'Nobody expected {subject} to {action}.'
    ]);
    
    this.templates.set('middle', [
      'As {subject} {action}, {consequence}.',
      'Meanwhile, {subject} {action} while {event}.',
      'Despite {obstacle}, {subject} {action}.'
    ]);
    
    this.templates.set('ending', [
      'In the end, {resolution}.',
      'And so, {conclusion}.',
      'Thus, {finalThought}.'
    ]);
  }

  compose(theme: string, elements: Record<string, string>): string {
    const openings = this.templates.get('opening') || [];
    const middles = this.templates.get('middle') || [];
    const endings = this.templates.get('ending') || [];
    
    const opening = this.fillTemplate(openings[Math.floor(Math.random() * openings.length)], elements);
    const middle = this.fillTemplate(middles[Math.floor(Math.random() * middles.length)], elements);
    const ending = this.fillTemplate(endings[Math.floor(Math.random() * endings.length)], elements);
    
    return `${opening}\n\n${middle}\n\n${ending}`;
  }

  private fillTemplate(template: string, elements: Record<string, string>): string {
    let filled = template;
    Object.entries(elements).forEach(([key, value]) => {
      filled = filled.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });
    return filled;
  }

  addTemplate(category: string, templates: string[]) {
    this.templates.set(category, templates);
  }
}

// ============================================
// ITEM 6.3: Style Transfer Engine
// Apply writing styles (formal, casual, poetic, technical)
// ============================================
export class StyleTransferEngine {
  private styleRules: Map<string, { vocabulary: string[]; sentenceStructure: string; tone: string }> = new Map();

  constructor() {
    this.loadStyles();
  }

  private loadStyles() {
    this.styleRules.set('formal', {
      vocabulary: ['furthermore', 'consequently', 'nevertheless', 'thus', 'hence'],
      sentenceStructure: 'complex',
      tone: 'professional'
    });
    
    this.styleRules.set('casual', {
      vocabulary: ['gonna', 'wanna', 'cool', 'awesome', 'yeah'],
      sentenceStructure: 'simple',
      tone: 'friendly'
    });
    
    this.styleRules.set('poetic', {
      vocabulary: ['ethereal', 'luminous', 'whisper', 'dance', 'embrace'],
      sentenceStructure: 'lyrical',
      tone: 'artistic'
    });
    
    this.styleRules.set('technical', {
      vocabulary: ['implement', 'optimize', 'utilize', 'leverage', 'facilitate'],
      sentenceStructure: 'precise',
      tone: 'analytical'
    });
  }

  transfer(text: string, targetStyle: string): string {
    const rules = this.styleRules.get(targetStyle);
    if (!rules) return text;
    
    let transferred = text;
    
    // Replace common words with style-specific vocabulary
    const commonWords = ['very', 'good', 'bad', 'big', 'small', 'fast', 'slow'];
    commonWords.forEach(word => {
      if (Math.random() > 0.7) {
        const replacement = rules.vocabulary[Math.floor(Math.random() * rules.vocabulary.length)];
        transferred = transferred.replace(new RegExp(`\\b${word}\\b`, 'gi'), replacement);
      }
    });
    
    // Adjust sentence structure based on style
    if (rules.sentenceStructure === 'complex') {
      transferred = this.makeComplex(transferred);
    } else if (rules.sentenceStructure === 'simple') {
      transferred = this.makeSimple(transferred);
    }
    
    return transferred;
  }

  private makeComplex(text: string): string {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length < 2) return text;
    
    // Combine sentences with conjunctions
    const conjunctions = ['however', 'furthermore', 'moreover', 'nevertheless'];
    let result = sentences[0];
    
    for (let i = 1; i < sentences.length; i++) {
      const conjunction = conjunctions[Math.floor(Math.random() * conjunctions.length)];
      result += `, ${conjunction}, ${sentences[i].trim()}`;
    }
    
    return result + '.';
  }

  private makeSimple(text: string): string {
    // Break long sentences into shorter ones
    return text.replace(/, (however|furthermore|moreover|nevertheless),/g, '.');
  }

  addStyle(name: string, vocabulary: string[], sentenceStructure: string, tone: string) {
    this.styleRules.set(name, { vocabulary, sentenceStructure, tone });
  }
}

// ============================================
// ITEM 6.4: Narrative Structure Engine
// Beginning-middle-end, hero's journey, three-act structure
// ============================================
export class NarrativeStructureEngine {
  private structures: Map<string, { acts: string[]; elements: string[] }> = new Map();

  constructor() {
    this.loadStructures();
  }

  private loadStructures() {
    this.structures.set('three_act', {
      acts: ['setup', 'confrontation', 'resolution'],
      elements: ['introduction', 'inciting_incident', 'rising_action', 'climax', 'falling_action', 'denouement']
    });
    
    this.structures.set('heros_journey', {
      acts: ['departure', 'initiation', 'return'],
      elements: ['ordinary_world', 'call_to_adventure', 'refusal_of_call', 'meeting_mentor', 'crossing_threshold', 'tests_allies_enemies', 'approach_to_inmost_cave', 'ordeal', 'reward', 'road_back', 'resurrection', 'return_with_elixir']
    });
    
    this.structures.set('freytags_pyramid', {
      acts: ['exposition', 'rising_action', 'climax', 'falling_action', 'denouement'],
      elements: ['introduction', 'complication', 'crisis', 'climax', 'resolution']
    });
  }

  generateOutline(structure: string, theme: string): string {
    const struct = this.structures.get(structure);
    if (!struct) return `Structure "${structure}" not found.`;
    
    let outline = `**Narrative Outline: ${structure}**\n\n`;
    outline += `**Theme:** ${theme}\n\n`;
    
    struct.acts.forEach((act, i) => {
      outline += `**Act ${i + 1}: ${act.replace(/_/g, ' ').toUpperCase()}**\n`;
      
      const actElements = struct.elements.filter(e => {
        const actIndex = struct.acts.indexOf(act);
        const elementIndex = struct.elements.indexOf(e);
        return Math.floor(elementIndex / (struct.elements.length / struct.acts.length)) === actIndex;
      });
      
      actElements.forEach(element => {
        outline += `- ${element.replace(/_/g, ' ')}\n`;
      });
      
      outline += '\n';
    });
    
    return outline;
  }

  getStructure(structure: string): { acts: string[]; elements: string[] } | null {
    return this.structures.get(structure) || null;
  }

  addStructure(name: string, acts: string[], elements: string[]) {
    this.structures.set(name, { acts, elements });
  }
}

// ============================================
// ITEM 6.5: Vocabulary Expansion
// Synonym substitution with context awareness
// ============================================
export class VocabularyExpander {
  private synonyms: Map<string, string[]> = new Map();

  constructor() {
    this.loadSynonyms();
  }

  private loadSynonyms() {
    this.synonyms.set('good', ['excellent', 'superb', 'outstanding', 'magnificent', 'wonderful']);
    this.synonyms.set('bad', ['terrible', 'awful', 'dreadful', 'horrible', 'atrocious']);
    this.synonyms.set('big', ['enormous', 'massive', 'immense', 'vast', 'colossal']);
    this.synonyms.set('small', ['tiny', 'minuscule', 'minute', 'petite', 'diminutive']);
    this.synonyms.set('fast', ['rapid', 'swift', 'quick', 'speedy', 'hasty']);
    this.synonyms.set('slow', ['sluggish', 'gradual', 'leisurely', 'unhurried', 'plodding']);
    this.synonyms.set('happy', ['joyful', 'elated', 'ecstatic', 'delighted', 'content']);
    this.synonyms.set('sad', ['sorrowful', 'melancholy', 'despondent', 'gloomy', 'dejected']);
  }

  expand(text: string, intensity: number = 0.5): string {
    let expanded = text;
    const words = text.split(/\s+/);
    
    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      const synonyms = this.synonyms.get(lowerWord);
      
      if (synonyms && Math.random() < intensity) {
        const replacement = synonyms[Math.floor(Math.random() * synonyms.length)];
        // Preserve capitalization
        if (word[0] === word[0].toUpperCase()) {
          expanded = expanded.replace(word, replacement.charAt(0).toUpperCase() + replacement.slice(1));
        } else {
          expanded = expanded.replace(word, replacement);
        }
      }
    });
    
    return expanded;
  }

  getSynonyms(word: string): string[] {
    return this.synonyms.get(word.toLowerCase()) || [];
  }

  addSynonyms(word: string, synonyms: string[]) {
    this.synonyms.set(word.toLowerCase(), synonyms);
  }
}

// ============================================
// ITEM 6.6: Sentence Variation
// Multiple ways to express same idea
// ============================================
export class SentenceVariation {
  private patterns: Map<string, string[]> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.patterns.set('statement', [
      '{subject} {verb} {object}.',
      'It is {subject} that {verb} {object}.',
      '{object} is {verb}ed by {subject}.',
      'There is {object} that {subject} {verb}.'
    ]);
    
    this.patterns.set('question', [
      'Does {subject} {verb} {object}?',
      'Is it {subject} who {verb} {object}?',
      'What {verb} {subject} {object}?',
      'Can {subject} {verb} {object}?'
    ]);
    
    this.patterns.set('exclamation', [
      '{subject} {verb} {object}!',
      'How {subject} {verb} {object}!',
      'What a {object} {subject} {verb}!',
      '{subject} really {verb} {object}!'
    ]);
  }

  vary(sentence: string, type: string = 'statement'): string[] {
    const patterns = this.patterns.get(type) || [];
    const elements = this.extractElements(sentence);
    
    return patterns.map(pattern => {
      let varied = pattern;
      Object.entries(elements).forEach(([key, value]) => {
        varied = varied.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
      });
      return varied;
    });
  }

  private extractElements(sentence: string): Record<string, string> {
    // Simple extraction - in production, use NLP
    const words = sentence.split(/\s+/);
    return {
      subject: words[0] || 'Something',
      verb: words[1] || 'does',
      object: words.slice(2).join(' ') || 'something'
    };
  }

  addPattern(type: string, patterns: string[]) {
    this.patterns.set(type, patterns);
  }
}

// ============================================
// ITEM 6.7: Metaphor Generator
// Create analogies from concept relationships
// ============================================
export class MetaphorGenerator {
  private conceptAttributes: Map<string, string[]> = new Map();

  constructor() {
    this.loadConcepts();
  }

  private loadConcepts() {
    this.conceptAttributes.set('love', ['warm', 'binding', 'nurturing', 'enduring', 'passionate']);
    this.conceptAttributes.set('fire', ['hot', 'consuming', 'bright', 'dangerous', 'transformative']);
    this.conceptAttributes.set('ocean', ['vast', 'deep', 'powerful', 'mysterious', 'ever-changing']);
    this.conceptAttributes.set('time', ['fleeting', 'relentless', 'precious', 'healing', 'cyclical']);
    this.conceptAttributes.set('life', ['journey', 'precious', 'fragile', 'meaningful', 'dynamic']);
  }

  generateMetaphor(concept1: string, concept2: string): string {
    const attrs1 = this.conceptAttributes.get(concept1) || [];
    const attrs2 = this.conceptAttributes.get(concept2) || [];
    
    const shared = attrs1.filter(a => attrs2.includes(a));
    
    if (shared.length > 0) {
      const sharedAttr = shared[Math.floor(Math.random() * shared.length)];
      return `${concept1} is like ${concept2}: both are ${sharedAttr}.`;
    }
    
    // Create metaphor from different attributes
    const attr1 = attrs1[Math.floor(Math.random() * attrs1.length)] || 'unique';
    const attr2 = attrs2[Math.floor(Math.random() * attrs2.length)] || 'distinct';
    
    return `${concept1}, with its ${attr1} nature, mirrors ${concept2} in its ${attr2} essence.`;
  }

  generateSimile(concept1: string, concept2: string): string {
    const attrs1 = this.conceptAttributes.get(concept1) || [];
    const attrs2 = this.conceptAttributes.get(concept2) || [];
    
    const shared = attrs1.filter(a => attrs2.includes(a));
    
    if (shared.length > 0) {
      const sharedAttr = shared[Math.floor(Math.random() * shared.length)];
      return `${concept1} is as ${sharedAttr} as ${concept2}.`;
    }
    
    return `${concept1} resembles ${concept2} in its own unique way.`;
  }

  addConcept(concept: string, attributes: string[]) {
    this.conceptAttributes.set(concept, attributes);
  }
}

// ============================================
// ITEM 6.8: Dialogue Engine
// Character conversations with personality traits
// ============================================
export class DialogueEngine {
  private characters: Map<string, { personality: string[]; speechPatterns: string[]; vocabulary: string[] }> = new Map();

  addCharacter(name: string, personality: string[], speechPatterns: string[], vocabulary: string[]) {
    this.characters.set(name.toLowerCase(), { personality, speechPatterns, vocabulary });
  }

  generateDialogue(character1: string, character2: string, topic: string, length: number = 5): string {
    const char1 = this.characters.get(character1.toLowerCase());
    const char2 = this.characters.get(character2.toLowerCase());
    
    if (!char1 || !char2) {
      return `Characters not found: ${!char1 ? character1 : ''} ${!char2 ? character2 : ''}`;
    }
    
    let dialogue = '';
    let currentSpeaker = character1;
    let currentChar = char1;
    
    for (let i = 0; i < length; i++) {
      const pattern = currentChar.speechPatterns[Math.floor(Math.random() * currentChar.speechPatterns.length)];
      const vocab = currentChar.vocabulary[Math.floor(Math.random() * currentChar.vocabulary.length)];
      
      dialogue += `**${currentSpeaker}:** ${pattern.replace('{topic}', topic).replace('{vocab}', vocab)}\n\n`;
      
      // Switch speaker
      if (currentSpeaker === character1) {
        currentSpeaker = character2;
        currentChar = char2;
      } else {
        currentSpeaker = character1;
        currentChar = char1;
      }
    }
    
    return dialogue;
  }

  describeCharacter(name: string): string {
    const char = this.characters.get(name.toLowerCase());
    if (!char) return `Character "${name}" not found.`;
    
    let description = `**Character: ${name}**\n\n`;
    description += `**Personality:** ${char.personality.join(', ')}\n`;
    description += `**Speech Patterns:** ${char.speechPatterns.join(', ')}\n`;
    description += `**Vocabulary:** ${char.vocabulary.join(', ')}`;
    
    return description;
  }
}

// ============================================
// ITEM 6.9: Poetry Generator
// Rhyme schemes, meter, haiku, sonnet structures
// ============================================
export class PoetryGenerator {
  private rhymeDictionary: Map<string, string[]> = new Map();

  constructor() {
    this.loadRhymes();
  }

  private loadRhymes() {
    this.rhymeDictionary.set('day', ['play', 'say', 'way', 'stay', 'ray']);
    this.rhymeDictionary.set('night', ['light', 'bright', 'sight', 'flight', 'right']);
    this.rhymeDictionary.set('love', ['dove', 'above', 'shove', 'glove', 'of']);
    this.rhymeDictionary.set('heart', ['start', 'part', 'art', 'smart', 'chart']);
  }

  generateHaiku(syllables: [number, number, number] = [5, 7, 5]): string {
    // Simplified - in production, use syllable counting
    const line1 = this.generateLine(syllables[0]);
    const line2 = this.generateLine(syllables[1]);
    const line3 = this.generateLine(syllables[2]);
    
    return `${line1}\n${line2}\n${line3}`;
  }

  generateLimerick(): string {
    const line1 = this.generateLine(8);
    const line2 = this.generateLine(8);
    const line3 = this.generateLine(5);
    const line4 = this.generateLine(5);
    const line5 = this.generateLine(8);
    
    return `${line1}\n${line2}\n${line3}\n${line4}\n${line5}`;
  }

  generateSonnet(): string {
    let sonnet = '';
    
    // Three quatrains
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        sonnet += this.generateLine(10) + '\n';
      }
      sonnet += '\n';
    }
    
    // Final couplet
    sonnet += this.generateLine(10) + '\n';
    sonnet += this.generateLine(10);
    
    return sonnet;
  }

  private generateLine(targetSyllables: number): string {
    // Simplified line generation
    const words = ['the', 'a', 'in', 'on', 'with', 'by', 'for', 'to', 'from', 'at'];
    const nouns = ['time', 'love', 'life', 'heart', 'dream', 'light', 'night', 'day', 'way', 'star'];
    const verbs = ['is', 'are', 'was', 'will', 'can', 'may', 'shall', 'must', 'should', 'would'];
    const adjectives = ['bright', 'dark', 'cold', 'warm', 'soft', 'hard', 'sweet', 'bitter', 'gentle', 'fierce'];
    
    let line = '';
    let syllableCount = 0;
    
    while (syllableCount < targetSyllables) {
      const wordType = Math.random();
      let word = '';
      
      if (wordType < 0.3) {
        word = words[Math.floor(Math.random() * words.length)];
        syllableCount += 1;
      } else if (wordType < 0.6) {
        word = nouns[Math.floor(Math.random() * nouns.length)];
        syllableCount += 1;
      } else if (wordType < 0.8) {
        word = verbs[Math.floor(Math.random() * verbs.length)];
        syllableCount += 1;
      } else {
        word = adjectives[Math.floor(Math.random() * adjectives.length)];
        syllableCount += 2;
      }
      
      line += word + ' ';
    }
    
    return line.trim();
  }

  findRhyme(word: string): string[] {
    return this.rhymeDictionary.get(word.toLowerCase()) || [];
  }

  addRhyme(word: string, rhymes: string[]) {
    this.rhymeDictionary.set(word.toLowerCase(), rhymes);
  }
}

// ============================================
// ITEM 6.10: Story Element Combinator
// Characters + settings + conflicts + resolutions
// ============================================
export class StoryElementCombinator {
  private characters: string[] = [];
  private settings: string[] = [];
  private conflicts: string[] = [];
  private resolutions: string[] = [];

  constructor() {
    this.loadElements();
  }

  private loadElements() {
    this.characters = ['hero', 'mentor', 'villain', 'sidekick', 'love_interest', 'trickster'];
    this.settings = ['forest', 'castle', 'city', 'ocean', 'mountain', 'desert'];
    this.conflicts = ['good_vs_evil', 'man_vs_nature', 'man_vs_self', 'man_vs_society', 'man_vs_man', 'man_vs_technology'];
    this.resolutions = ['triumph', 'tragedy', 'compromise', 'transformation', 'sacrifice', 'revelation'];
  }

  generateStoryPrompt(): string {
    const character = this.characters[Math.floor(Math.random() * this.characters.length)];
    const setting = this.settings[Math.floor(Math.random() * this.settings.length)];
    const conflict = this.conflicts[Math.floor(Math.random() * this.conflicts.length)];
    const resolution = this.resolutions[Math.floor(Math.random() * this.resolutions.length)];
    
    let prompt = `**Story Prompt:**\n\n`;
    prompt += `**Protagonist:** ${character.replace(/_/g, ' ')}\n`;
    prompt += `**Setting:** ${setting}\n`;
    prompt += `**Central Conflict:** ${conflict.replace(/_/g, ' ')}\n`;
    prompt += `**Resolution:** ${resolution}\n\n`;
    
    prompt += `**Prompt:** Write a story about a ${character.replace(/_/g, ' ')} in a ${setting} who faces ${conflict.replace(/_/g, ' ')} and ultimately experiences ${resolution}.`;
    
    return prompt;
  }

  generateMultiplePrompts(count: number = 5): string[] {
    const prompts: string[] = [];
    for (let i = 0; i < count; i++) {
      prompts.push(this.generateStoryPrompt());
    }
    return prompts;
  }

  addCharacters(characters: string[]) {
    this.characters.push(...characters);
  }

  addSettings(settings: string[]) {
    this.settings.push(...settings);
  }

  addConflicts(conflicts: string[]) {
    this.conflicts.push(...conflicts);
  }

  addResolutions(resolutions: string[]) {
    this.resolutions.push(...resolutions);
  }
}

// ============================================
// Export all creative writing systems
// ============================================
export const CreativeWritingSystems = {
  MarkovChainGenerator,
  TemplateComposer,
  StyleTransferEngine,
  NarrativeStructureEngine,
  VocabularyExpander,
  SentenceVariation,
  MetaphorGenerator,
  DialogueEngine,
  PoetryGenerator,
  StoryElementCombinator,
};
