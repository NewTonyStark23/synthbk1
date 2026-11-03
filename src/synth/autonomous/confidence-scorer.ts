// Confidence Scorer - Rate source reliability and information confidence
// Part of Autonomous Learning System - Week 2 Web Integration
// Uses multiple signals to calculate confidence scores

import { VerificationSource } from './fact-verifier';
import { ExtractedContent, ContentAnalysis } from './content-extractor';

export interface ConfidenceScore {
  overall: number; // 0-1
  sourceReliability: number;
  contentQuality: number;
  corroboration: number;
  recency: number;
  authority: number;
  factors: ConfidenceFactor[];
}

export interface ConfidenceFactor {
  name: string;
  score: number; // 0-1
  weight: number; // 0-1
  explanation: string;
}

export class ConfidenceScorer {
  // Domain reliability scores
  private readonly DOMAIN_RELIABILITY: Record<string, number> = {
    // Academic/Government (highest)
    '.edu': 0.95,
    '.gov': 0.95,
    'edu.': 0.95,
    'gov.': 0.95,
    
    // Encyclopedias (high)
    'wikipedia.org': 0.85,
    'britannica.com': 0.90,
    'scholar.google': 0.90,
    
    // Major news (good)
    'reuters.com': 0.80,
    'apnews.com': 0.80,
    'bbc.com': 0.80,
    'nytimes.com': 0.75,
    'washingtonpost.com': 0.75,
    'theguardian.com': 0.75,
    
    // Tech sites (moderate)
    'github.com': 0.75,
    'stackoverflow.com': 0.70,
    'medium.com': 0.60,
    'dev.to': 0.60,
    
    // Blogs/Forums (lower)
    'reddit.com': 0.50,
    'quora.com': 0.45,
    'blogspot.com': 0.40,
    'wordpress.com': 0.40,
    
    // Unknown (default)
    'default': 0.50
  };

  /**
   * Calculate overall confidence score for a claim
   */
  calculateConfidence(
    sources: VerificationSource[],
    content?: ExtractedContent[],
    analysis?: ContentAnalysis[]
  ): ConfidenceScore {
    const factors: ConfidenceFactor[] = [];
    
    // Factor 1: Source Reliability
    const sourceReliability = this.calculateSourceReliability(sources);
    factors.push({
      name: 'Source Reliability',
      score: sourceReliability,
      weight: 0.30,
      explanation: `Average reliability of ${sources.length} sources`
    });
    
    // Factor 2: Content Quality
    const contentQuality = content && analysis 
      ? this.calculateContentQuality(content, analysis)
      : 0.5; // Default if no content
    factors.push({
      name: 'Content Quality',
      score: contentQuality,
      weight: 0.25,
      explanation: content 
        ? `Quality score based on ${content.length} articles`
        : 'No content available for quality assessment'
    });
    
    // Factor 3: Corroboration
    const corroboration = this.calculateCorroboration(sources);
    factors.push({
      name: 'Corroboration',
      score: corroboration,
      weight: 0.20,
      explanation: sources.length > 1 
        ? `${sources.length} sources corroborate the information`
        : 'Only one source available'
    });
    
    // Factor 4: Recency
    const recency = this.calculateRecency(sources);
    factors.push({
      name: 'Recency',
      score: recency,
      weight: 0.15,
      explanation: 'Based on how recent the sources are'
    });
    
    // Factor 5: Authority
    const authority = this.calculateAuthority(sources);
    factors.push({
      name: 'Authority',
      score: authority,
      weight: 0.10,
      explanation: 'Based on authoritative nature of sources'
    });
    
    // Calculate weighted overall score
    const overall = factors.reduce((sum, f) => sum + (f.score * f.weight), 0);
    
    return {
      overall,
      sourceReliability,
      contentQuality,
      corroboration,
      recency,
      authority,
      factors
    };
  }

  /**
   * Calculate source reliability score
   */
  private calculateSourceReliability(sources: VerificationSource[]): number {
    if (sources.length === 0) return 0;
    
    const reliabilities = sources.map(source => {
      const url = source.url.toLowerCase();
      
      // Check domain-specific reliability
      for (const [domain, score] of Object.entries(this.DOMAIN_RELIABILITY)) {
        if (url.includes(domain)) {
          return score;
        }
      }
      
      // Use source's own reliability if provided
      return source.reliability || this.DOMAIN_RELIABILITY['default'];
    });
    
    return reliabilities.reduce((sum, r) => sum + r, 0) / reliabilities.length;
  }

  /**
   * Calculate content quality score
   */
  private calculateContentQuality(
    content: ExtractedContent[],
    analysis: ContentAnalysis[]
  ): number {
    if (content.length === 0 || analysis.length === 0) return 0.5;
    
    let qualityScore = 0;
    
    for (let i = 0; i < content.length; i++) {
      const c = content[i];
      const a = analysis[i];
      
      // Factor 1: Length (longer = more detailed)
      const lengthScore = Math.min(1, c.wordCount / 500);
      
      // Factor 2: Readability
      const readabilityScore = a.readability / 100;
      
      // Factor 3: Has keywords (shows relevance)
      const keywordScore = c.keywords.length > 0 ? 0.8 : 0.3;
      
      // Factor 4: Has summary (shows structure)
      const summaryScore = c.summary.length > 50 ? 0.9 : 0.4;
      
      // Combine factors
      const articleQuality = (
        lengthScore * 0.25 +
        readabilityScore * 0.25 +
        keywordScore * 0.25 +
        summaryScore * 0.25
      );
      
      qualityScore += articleQuality;
    }
    
    return qualityScore / content.length;
  }

  /**
   * Calculate corroboration score
   */
  private calculateCorroboration(sources: VerificationSource[]): number {
    if (sources.length === 0) return 0;
    if (sources.length === 1) return 0.5;
    
    // More sources = higher corroboration
    // But cap at 10 sources
    const sourceCount = Math.min(sources.length, 10);
    const baseScore = sourceCount / 10;
    
    // Check if sources agree (simple heuristic)
    const snippets = sources.map(s => s.snippet.toLowerCase());
    const commonWords = this.findCommonWords(snippets);
    
    // If sources share many common words, they likely agree
    const agreementScore = commonWords.length > 5 ? 1.0 : commonWords.length / 5;
    
    return (baseScore * 0.6) + (agreementScore * 0.4);
  }

  /**
   * Find common words across snippets
   */
  private findCommonWords(snippets: string[]): string[] {
    if (snippets.length === 0) return [];
    
    const wordSets = snippets.map(snippet => {
      const words = snippet.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 4);
      return new Set(words);
    });
    
    // Find words that appear in most snippets
    const wordCounts = new Map<string, number>();
    
    for (const wordSet of wordSets) {
      for (const word of wordSet) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    }
    
    // Return words that appear in at least half the snippets
    const threshold = Math.ceil(snippets.length / 2);
    return Array.from(wordCounts.entries())
      .filter(([_, count]) => count >= threshold)
      .map(([word]) => word);
  }

  /**
   * Calculate recency score
   */
  private calculateRecency(sources: VerificationSource[]): number {
    if (sources.length === 0) return 0;
    
    const now = Date.now();
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    
    const recencyScores = sources.map(source => {
      if (!source.timestamp) return 0.5; // Unknown date
      
      const age = now - source.timestamp.getTime();
      
      // Score based on age
      if (age < 30 * 24 * 60 * 60 * 1000) return 1.0; // < 1 month
      if (age < 90 * 24 * 60 * 60 * 1000) return 0.9; // < 3 months
      if (age < 180 * 24 * 60 * 60 * 1000) return 0.8; // < 6 months
      if (age < oneYear) return 0.7; // < 1 year
      if (age < 2 * oneYear) return 0.5; // < 2 years
      if (age < 5 * oneYear) return 0.3; // < 5 years
      return 0.1; // > 5 years
    });
    
    return recencyScores.reduce((sum, r) => sum + r, 0) / recencyScores.length;
  }

  /**
   * Calculate authority score
   */
  private calculateAuthority(sources: VerificationSource[]): number {
    if (sources.length === 0) return 0;
    
    const authorityScores = sources.map(source => {
      const url = source.url.toLowerCase();
      
      // Academic/Government sources
      if (url.includes('.edu') || url.includes('.gov')) return 1.0;
      
      // Major encyclopedias
      if (url.includes('wikipedia') || url.includes('britannica')) return 0.9;
      
      // Major news outlets
      if (url.includes('reuters') || url.includes('apnews') || url.includes('bbc')) return 0.8;
      
      // Tech/Professional sites
      if (url.includes('github') || url.includes('stackoverflow')) return 0.7;
      
      // Regular websites
      if (source.reliability >= 0.7) return 0.6;
      
      // Blogs/Forums
      if (url.includes('blog') || url.includes('reddit')) return 0.4;
      
      // Unknown
      return 0.5;
    });
    
    return authorityScores.reduce((sum, a) => sum + a, 0) / authorityScores.length;
  }

  /**
   * Get confidence level description
   */
  getConfidenceLevel(score: number): string {
    if (score >= 0.9) return 'Very High';
    if (score >= 0.8) return 'High';
    if (score >= 0.7) return 'Moderate-High';
    if (score >= 0.6) return 'Moderate';
    if (score >= 0.5) return 'Low-Moderate';
    if (score >= 0.4) return 'Low';
    return 'Very Low';
  }

  /**
   * Generate confidence report
   */
  generateReport(score: ConfidenceScore): string {
    let report = `**Confidence Score Report**\n\n`;
    report += `**Overall Confidence:** ${(score.overall * 100).toFixed(1)}% (${this.getConfidenceLevel(score.overall)})\n\n`;
    
    report += `**Breakdown:**\n`;
    score.factors.forEach(factor => {
      report += `- **${factor.name}:** ${(factor.score * 100).toFixed(1)}% (weight: ${(factor.weight * 100).toFixed(0)}%)\n`;
      report += `  ${factor.explanation}\n`;
    });
    
    report += `\n**Interpretation:**\n`;
    
    if (score.overall >= 0.8) {
      report += `High confidence in this information. Multiple reliable sources corroborate the claim.\n`;
    } else if (score.overall >= 0.6) {
      report += `Moderate confidence. Information appears reliable but may benefit from additional verification.\n`;
    } else if (score.overall >= 0.4) {
      report += `Low confidence. Information should be verified with additional sources before relying on it.\n`;
    } else {
      report += `Very low confidence. This information should not be relied upon without significant additional verification.\n`;
    }
    
    return report;
  }

  /**
   * Compare confidence between multiple claims
   */
  compareConfidence(claims: Array<{ claim: string; score: ConfidenceScore }>): string {
    const sorted = [...claims].sort((a, b) => b.score.overall - a.score.overall);
    
    let comparison = `**Confidence Comparison**\n\n`;
    
    sorted.forEach((item, i) => {
      comparison += `${i + 1}. **${item.claim}**\n`;
      comparison += `   Confidence: ${(item.score.overall * 100).toFixed(1)}% (${this.getConfidenceLevel(item.score.overall)})\n\n`;
    });
    
    return comparison;
  }
}

// Export singleton instance
export const confidenceScorer = new ConfidenceScorer();
