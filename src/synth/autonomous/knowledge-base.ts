// Knowledge Base - Core knowledge storage and retrieval
// Part of Enhanced Knowledge Expansion v2.0

export interface KnowledgeEntry {
  concept: string;
  category: string;
  facts: string[];
  confidence: number;
  lastUpdated: Date;
  sources: string[];
}

export class KnowledgeBase {
  private entries: Map<string, KnowledgeEntry> = new Map();
  private categories: Map<string, Set<string>> = new Map();
  
  constructor() {
    this.initializeBaseKnowledge();
  }

  private initializeBaseKnowledge(): void {
    // Science
    this.addEntry('physics', 'science', [
      'Study of matter and energy',
      'Includes mechanics, thermodynamics, electromagnetism',
      'Fundamental forces: gravity, electromagnetism, strong nuclear, weak nuclear'
    ]);
    
    this.addEntry('chemistry', 'science', [
      'Study of substances and their interactions',
      'Periodic table organizes elements',
      'Chemical bonds form molecules'
    ]);
    
    this.addEntry('biology', 'science', [
      'Study of living organisms',
      'Includes genetics, ecology, evolution',
      'Cell is basic unit of life'
    ]);
    
    // Technology
    this.addEntry('computer science', 'technology', [
      'Study of computation and information',
      'Includes algorithms, data structures, AI',
      'Foundation of modern technology'
    ]);
    
    this.addEntry('artificial intelligence', 'technology', [
      'Simulation of human intelligence by machines',
      'Includes machine learning, neural networks, NLP',
      'Applications in automation, analysis, decision-making'
    ]);
    
    // History
    this.addEntry('ancient history', 'history', [
      'Period from beginning of recorded history to 5th century',
      'Includes Egyptian, Greek, Roman civilizations',
      'Development of writing, agriculture, cities'
    ]);
    
    this.addEntry('modern history', 'history', [
      'Period from 15th century to present',
      'Includes Renaissance, Industrial Revolution, World Wars',
      'Development of democracy, capitalism, globalization'
    ]);
    
    // Philosophy
    this.addEntry('ethics', 'philosophy', [
      'Study of moral principles',
      'Includes utilitarianism, deontology, virtue ethics',
      'Guides human behavior and decision-making'
    ]);
    
    this.addEntry('epistemology', 'philosophy', [
      'Study of knowledge and belief',
      'Questions: What is knowledge? How do we know?',
      'Foundation of scientific method'
    ]);
  }

  addEntry(concept: string, category: string, facts: string[], confidence: number = 0.8): void {
    const entry: KnowledgeEntry = {
      concept,
      category,
      facts,
      confidence,
      lastUpdated: new Date(),
      sources: ['internal']
    };
    
    this.entries.set(concept.toLowerCase(), entry);
    
    if (!this.categories.has(category)) {
      this.categories.set(category, new Set());
    }
    this.categories.get(category)!.add(concept.toLowerCase());
  }

  getEntry(concept: string): KnowledgeEntry | undefined {
    return this.entries.get(concept.toLowerCase());
  }

  getByCategory(category: string): KnowledgeEntry[] {
    const conceptIds = this.categories.get(category);
    if (!conceptIds) return [];
    
    return Array.from(conceptIds)
      .map(id => this.entries.get(id))
      .filter((e): e is KnowledgeEntry => e !== undefined);
  }

  updateEntry(concept: string, newFacts: string[], source: string): void {
    const entry = this.getEntry(concept);
    if (!entry) return;
    
    newFacts.forEach(fact => {
      if (!entry.facts.includes(fact)) {
        entry.facts.push(fact);
      }
    });
    
    entry.confidence = Math.min(0.95, entry.confidence + 0.1);
    entry.lastUpdated = new Date();
    
    if (!entry.sources.includes(source)) {
      entry.sources.push(source);
    }
  }

  getStats(): {
    totalEntries: number;
    categories: number;
    avgConfidence: number;
  } {
    const totalEntries = this.entries.size;
    const categories = this.categories.size;
    
    let totalConfidence = 0;
    this.entries.forEach(entry => {
      totalConfidence += entry.confidence;
    });
    
    const avgConfidence = totalEntries > 0 ? totalConfidence / totalEntries : 0;
    
    return { totalEntries, categories, avgConfidence };
  }
}

export const knowledgeBase = new KnowledgeBase();
