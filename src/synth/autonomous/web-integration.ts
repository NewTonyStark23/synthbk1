// Web Integration - Main orchestrator for Week 2 components
// Part of Autonomous Learning System - Week 2 Web Integration
// Combines all web research, fact checking, and confidence scoring

import { WebResearcher, SearchResult, ResearchResult } from './web-researcher';
import { FactVerifier, FactVerificationResult, VerificationSource } from './fact-verifier';
import { ContentExtractor, ExtractedContent, ContentAnalysis } from './content-extractor';
import { ConfidenceScorer, ConfidenceScore } from './confidence-scorer';

export interface WebResearchReport {
  query: string;
  timestamp: Date;
  searchResults: SearchResult[];
  extractedContent: ExtractedContent[];
  contentAnalysis: ContentAnalysis[];
  verification?: FactVerificationResult;
  confidence?: ConfidenceScore;
  summary: string;
}

export class WebIntegration {
  private researcher: WebResearcher;
  private verifier: FactVerifier;
  private extractor: ContentExtractor;
  private scorer: ConfidenceScorer;

  constructor() {
    this.researcher = new WebResearcher();
    this.verifier = new FactVerifier();
    this.extractor = new ContentExtractor();
    this.scorer = new ConfidenceScorer();
  }

  /**
   * Complete research workflow: search → extract → verify → score
   */
  async research(query: string): Promise<WebResearchReport> {
    console.log(`[WebIntegration] Starting research on: ${query}`);
    
    // Step 1: Search for information
    console.log('[WebIntegration] Step 1: Searching...');
    const searchResults = await this.researcher.research(query, 15);
    
    if (searchResults.results.length === 0) {
      return {
        query,
        timestamp: new Date(),
        searchResults: [],
        extractedContent: [],
        contentAnalysis: [],
        summary: 'No results found for this query'
      };
    }
    
    // Step 2: Extract content from top results
    console.log('[WebIntegration] Step 2: Extracting content...');
    const extractedContent = await this.extractor.extractFromResults(searchResults.results);
    
    // Step 3: Analyze content
    console.log('[WebIntegration] Step 3: Analyzing content...');
    const contentAnalysis = extractedContent.map(content => 
      this.extractor.analyze(content)
    );
    
    // Step 4: Verify facts (if claim-like query)
    let verification: FactVerificationResult | undefined;
    if (this.isClaimQuery(query)) {
      console.log('[WebIntegration] Step 4: Verifying facts...');
      verification = await this.verifier.verify(query);
    }
    
    // Step 5: Calculate confidence
    console.log('[WebIntegration] Step 5: Calculating confidence...');
    const sources: VerificationSource[] = searchResults.results.map(r => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet,
      reliability: r.source === 'wikipedia' ? 0.85 : 0.70,
      source: r.source,
      timestamp: r.timestamp
    }));
    
    const confidence = this.scorer.calculateConfidence(
      sources,
      extractedContent,
      contentAnalysis
    );
    
    // Step 6: Generate summary
    const summary = this.generateSummary(query, searchResults, extractedContent, verification, confidence);
    
    console.log('[WebIntegration] Research complete!');
    
    return {
      query,
      timestamp: new Date(),
      searchResults: searchResults.results,
      extractedContent,
      contentAnalysis,
      verification,
      confidence,
      summary
    };
  }

  /**
   * Check if query is a claim that needs verification
   */
  private isClaimQuery(query: string): boolean {
    const claimIndicators = [
      'is it true', 'is this true', 'fact check', 'verify',
      'did', 'does', 'is', 'are', 'was', 'were',
      'true or false', 'real or fake', 'legit'
    ];
    
    const lower = query.toLowerCase();
    return claimIndicators.some(indicator => lower.includes(indicator));
  }

  /**
   * Generate comprehensive summary
   */
  private generateSummary(
    query: string,
    search: ResearchResult,
    content: ExtractedContent[],
    verification?: FactVerificationResult,
    confidence?: ConfidenceScore
  ): string {
    let summary = `**Research Summary: ${query}**\n\n`;
    
    // Search results overview
    summary += `**Search Results:** Found ${search.totalResults} sources\n`;
    summary += `- Wikipedia: ${search.results.filter(r => r.source === 'wikipedia').length}\n`;
    summary += `- DuckDuckGo: ${search.results.filter(r => r.source === 'duckduckgo').length}\n\n`;
    
    // Content overview
    if (content.length > 0) {
      summary += `**Content Extracted:** ${content.length} articles\n`;
      const totalWords = content.reduce((sum, c) => sum + c.wordCount, 0);
      summary += `- Total words: ${totalWords.toLocaleString()}\n`;
      summary += `- Average readability: ${(content.reduce((sum, c) => {
        const analysis = this.extractor.analyze(c);
        return sum + analysis.readability;
      }, 0) / content.length).toFixed(0)}/100\n\n`;
    }
    
    // Verification results
    if (verification) {
      summary += `**Fact Verification:**\n`;
      summary += `- Status: ${verification.status.toUpperCase()}\n`;
      summary += `- Confidence: ${(verification.confidence * 100).toFixed(1)}%\n`;
      summary += `- Evidence: ${verification.evidence.length} sources\n`;
      if (verification.contradictions.length > 0) {
        summary += `- Contradictions: ${verification.contradictions.length}\n`;
      }
      summary += `\n${verification.explanation}\n\n`;
    }
    
    // Confidence score
    if (confidence) {
      summary += `**Confidence Score:** ${(confidence.overall * 100).toFixed(1)}% (${this.scorer.getConfidenceLevel(confidence.overall)})\n`;
      summary += `- Source Reliability: ${(confidence.sourceReliability * 100).toFixed(1)}%\n`;
      summary += `- Content Quality: ${(confidence.contentQuality * 100).toFixed(1)}%\n`;
      summary += `- Corroboration: ${(confidence.corroboration * 100).toFixed(1)}%\n`;
      summary += `- Recency: ${(confidence.recency * 100).toFixed(1)}%\n`;
      summary += `- Authority: ${(confidence.authority * 100).toFixed(1)}%\n\n`;
    }
    
    // Key findings
    if (content.length > 0) {
      summary += `**Key Findings:**\n`;
      const allKeywords = content.flatMap(c => c.keywords);
      const topKeywords = this.getTopKeywords(allKeywords, 10);
      summary += `- Main topics: ${topKeywords.join(', ')}\n`;
      
      if (content[0].summary) {
        summary += `- Summary: ${content[0].summary}\n`;
      }
    }
    
    return summary;
  }

  /**
   * Get top keywords from list
   */
  private getTopKeywords(keywords: string[], maxCount: number): string[] {
    const counts = new Map<string, number>();
    
    for (const keyword of keywords) {
      counts.set(keyword, (counts.get(keyword) || 0) + 1);
    }
    
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxCount)
      .map(([keyword]) => keyword);
  }

  /**
   * Quick search without full extraction
   */
  async quickSearch(query: string, maxResults: number = 5): Promise<SearchResult[]> {
    return await this.researcher.search(query, maxResults);
  }

  /**
   * Verify a specific claim
   */
  async verifyClaim(claim: string): Promise<FactVerificationResult> {
    return await this.verifier.verify(claim);
  }

  /**
   * Extract content from a specific URL
   */
  async extractContent(url: string): Promise<ExtractedContent | null> {
    return await this.extractor.extract(url);
  }

  /**
   * Calculate confidence for sources
   */
  calculateConfidence(sources: VerificationSource[]): ConfidenceScore {
    return this.scorer.calculateConfidence(sources);
  }

  /**
   * Get component instances
   */
  getResearcher(): WebResearcher {
    return this.researcher;
  }

  getVerifier(): FactVerifier {
    return this.verifier;
  }

  getExtractor(): ContentExtractor {
    return this.extractor;
  }

  getScorer(): ConfidenceScorer {
    return this.scorer;
  }

  /**
   * Get system statistics
   */
  getStats(): {
    researcher: { size: number; entries: string[] };
    verifier: any;
    extractor: { size: number; entries: string[] };
  } {
    return {
      researcher: this.researcher.getCacheStats(),
      verifier: this.verifier.getStats(),
      extractor: this.extractor.getCacheStats()
    };
  }

  /**
   * Clear all caches
   */
  clearCaches(): void {
    this.researcher.clearCache();
    this.verifier.clearCache();
    this.extractor.clearCache();
  }
}

// Export singleton instance
export const webIntegration = new WebIntegration();
