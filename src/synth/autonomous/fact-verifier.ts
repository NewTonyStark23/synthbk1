// Fact Verifier - Cross-source validation and fact checking
// Part of Autonomous Learning System - Week 2 Web Integration
// Uses multiple free sources to verify information

import { WebResearcher, SearchResult } from './web-researcher';

export interface FactCheck {
  claim: string;
  verified: boolean;
  confidence: number;
  sources: VerificationSource[];
  contradictions: string[];
  timestamp: Date;
}

export interface VerificationSource {
  title: string;
  url: string;
  snippet: string;
  reliability: number; // 0-1
  source: string;
  timestamp?: Date;
}

export interface FactVerificationResult {
  claim: string;
  status: 'verified' | 'disputed' | 'unverified' | 'contradicted';
  confidence: number;
  evidence: VerificationSource[];
  contradictions: string[];
  explanation: string;
}

export class FactVerifier {
  private webResearcher: WebResearcher;
  private verifiedFacts: Map<string, FactCheck> = new Map();
  
  // Source reliability scores (0-1)
  private readonly SOURCE_RELIABILITY: Record<string, number> = {
    'wikipedia': 0.85,
    'duckduckgo': 0.70,
    'academic': 0.95,
    'government': 0.90,
    'news': 0.75,
    'blog': 0.50,
    'forum': 0.40
  };

  constructor() {
    this.webResearcher = new WebResearcher();
  }

  /**
   * Verify a claim by searching multiple sources
   */
  async verify(claim: string): Promise<FactVerificationResult> {
    console.log(`[FactVerifier] Verifying claim: ${claim}`);
    
    // Check cache first
    const cached = this.verifiedFacts.get(claim);
    if (cached && Date.now() - cached.timestamp.getTime() < 24 * 60 * 60 * 1000) {
      console.log('[FactVerifier] Using cached verification');
      return this.formatCachedResult(cached);
    }
    
    // Search for information
    const research = await this.webResearcher.research(claim, 15);
    
    if (research.results.length === 0) {
      return {
        claim,
        status: 'unverified',
        confidence: 0,
        evidence: [],
        contradictions: [],
        explanation: 'No sources found to verify this claim'
      };
    }
    
    // Analyze sources
    const sources = this.analyzeSources(research.results);
    
    // Check for contradictions
    const contradictions = this.detectContradictions(sources);
    
    // Calculate overall confidence
    const confidence = this.calculateConfidence(sources, contradictions);
    
    // Determine status
    const status = this.determineStatus(confidence, contradictions);
    
    // Generate explanation
    const explanation = this.generateExplanation(claim, status, confidence, sources, contradictions);
    
    // Cache result
    const factCheck: FactCheck = {
      claim,
      verified: status === 'verified',
      confidence,
      sources,
      contradictions,
      timestamp: new Date()
    };
    
    this.verifiedFacts.set(claim, factCheck);
    
    return {
      claim,
      status,
      confidence,
      evidence: sources,
      contradictions,
      explanation
    };
  }

  /**
   * Analyze sources and assign reliability scores
   */
  private analyzeSources(results: SearchResult[]): VerificationSource[] {
    return results.map(result => {
      const sourceType = this.classifySource(result);
      const reliability = this.SOURCE_RELIABILITY[sourceType] || 0.5;
      
      return {
        title: result.title,
        url: result.url,
        snippet: result.snippet,
        reliability,
        source: sourceType
      };
    });
  }

  /**
   * Classify source type based on URL and content
   */
  private classifySource(result: SearchResult): string {
    const url = result.url.toLowerCase();
    
    if (url.includes('wikipedia.org')) return 'wikipedia';
    if (url.includes('.edu') || url.includes('academic')) return 'academic';
    if (url.includes('.gov') || url.includes('government')) return 'government';
    if (url.includes('news') || url.includes('times') || url.includes('post')) return 'news';
    if (url.includes('blog') || url.includes('medium')) return 'blog';
    if (url.includes('reddit') || url.includes('forum') || url.includes('stack')) return 'forum';
    
    return 'duckduckgo';
  }

  /**
   * Detect contradictions between sources
   */
  private detectContradictions(sources: VerificationSource[]): string[] {
    const contradictions: string[] = [];
    
    // Simple contradiction detection based on key terms
    const keyTerms = this.extractKeyTerms(sources.map(s => s.snippet));
    
    for (const term of keyTerms) {
      const mentions = sources.filter(s => 
        s.snippet.toLowerCase().includes(term.toLowerCase())
      );
      
      if (mentions.length >= 2) {
        // Check if mentions have conflicting context
        const contexts = mentions.map(m => m.snippet.toLowerCase());
        if (this.hasContradictoryContext(contexts)) {
          contradictions.push(`Conflicting information about: ${term}`);
        }
      }
    }
    
    return contradictions;
  }

  /**
   * Extract key terms from snippets
   */
  private extractKeyTerms(snippets: string[]): string[] {
    const words = new Map<string, number>();
    
    for (const snippet of snippets) {
      const tokens = snippet.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 4);
      
      for (const token of tokens) {
        words.set(token, (words.get(token) || 0) + 1);
      }
    }
    
    // Return most common words
    return Array.from(words.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Check if contexts are contradictory
   */
  private hasContradictoryContext(contexts: string[]): boolean {
    // Simple heuristic: check for negation words
    const negationWords = ['not', 'never', 'no', 'none', 'neither', 'nor'];
    
    let hasNegation = 0;
    for (const context of contexts) {
      if (negationWords.some(word => context.includes(word))) {
        hasNegation++;
      }
    }
    
    // If some contexts have negation and some don't, likely contradictory
    return hasNegation > 0 && hasNegation < contexts.length;
  }

  /**
   * Calculate overall confidence score
   */
  private calculateConfidence(sources: VerificationSource[], contradictions: string[]): number {
    if (sources.length === 0) return 0;
    
    // Base confidence from source reliability
    const avgReliability = sources.reduce((sum, s) => sum + s.reliability, 0) / sources.length;
    
    // Boost for multiple sources
    const sourceCountBoost = Math.min(0.2, sources.length * 0.02);
    
    // Penalize for contradictions
    const contradictionPenalty = contradictions.length * 0.1;
    
    // Boost for high-reliability sources
    const highReliabilityBoost = sources.filter(s => s.reliability >= 0.8).length * 0.05;
    
    const confidence = Math.max(0, Math.min(1, 
      avgReliability + sourceCountBoost - contradictionPenalty + highReliabilityBoost
    ));
    
    return confidence;
  }

  /**
   * Determine verification status
   */
  private determineStatus(confidence: number, contradictions: string[]): FactVerificationResult['status'] {
    if (contradictions.length > 2) {
      return 'contradicted';
    }
    
    if (confidence >= 0.8) {
      return 'verified';
    }
    
    if (confidence >= 0.5) {
      return contradictions.length > 0 ? 'disputed' : 'unverified';
    }
    
    return 'unverified';
  }

  /**
   * Generate human-readable explanation
   */
  private generateExplanation(
    claim: string,
    status: FactVerificationResult['status'],
    confidence: number,
    sources: VerificationSource[],
    contradictions: string[]
  ): string {
    let explanation = '';
    
    switch (status) {
      case 'verified':
        explanation = `This claim is verified with ${(confidence * 100).toFixed(0)}% confidence. `;
        explanation += `Found ${sources.length} reliable sources supporting this information.`;
        break;
        
      case 'disputed':
        explanation = `This claim is disputed with ${(confidence * 100).toFixed(0)}% confidence. `;
        explanation += `Sources provide conflicting information.`;
        break;
        
      case 'unverified':
        explanation = `This claim could not be verified (confidence: ${(confidence * 100).toFixed(0)}%). `;
        explanation += sources.length > 0 
          ? `Found ${sources.length} sources but they are not sufficiently reliable.`
          : 'No reliable sources found.';
        break;
        
      case 'contradicted':
        explanation = `This claim is contradicted by multiple sources. `;
        explanation += `Found ${contradictions.length} contradictions in the evidence.`;
        break;
    }
    
    if (contradictions.length > 0) {
      explanation += `\n\nContradictions: ${contradictions.join('; ')}`;
    }
    
    return explanation;
  }

  /**
   * Format cached result
   */
  private formatCachedResult(cached: FactCheck): FactVerificationResult {
    const status = cached.verified ? 'verified' : 
                   cached.contradictions.length > 0 ? 'contradicted' : 'unverified';
    
    return {
      claim: cached.claim,
      status,
      confidence: cached.confidence,
      evidence: cached.sources,
      contradictions: cached.contradictions,
      explanation: this.generateExplanation(
        cached.claim,
        status,
        cached.confidence,
        cached.sources,
        cached.contradictions
      )
    };
  }

  /**
   * Batch verify multiple claims
   */
  async verifyBatch(claims: string[]): Promise<FactVerificationResult[]> {
    console.log(`[FactVerifier] Verifying ${claims.length} claims`);
    
    const results = await Promise.all(
      claims.map(claim => this.verify(claim))
    );
    
    return results;
  }

  /**
   * Get verification statistics
   */
  getStats(): {
    totalVerified: number;
    verifiedCount: number;
    disputedCount: number;
    unverifiedCount: number;
    contradictedCount: number;
  } {
    const facts = Array.from(this.verifiedFacts.values());
    
    return {
      totalVerified: facts.length,
      verifiedCount: facts.filter(f => f.verified).length,
      disputedCount: facts.filter(f => f.contradictions.length > 0 && f.verified).length,
      unverifiedCount: facts.filter(f => !f.verified && f.contradictions.length === 0).length,
      contradictedCount: facts.filter(f => f.contradictions.length > 2).length
    };
  }

  /**
   * Clear verification cache
   */
  clearCache(): void {
    this.verifiedFacts.clear();
  }

  /**
   * Export verified facts
   */
  exportFacts(): FactCheck[] {
    return Array.from(this.verifiedFacts.values());
  }
}

// Export singleton instance
export const factVerifier = new FactVerifier();
