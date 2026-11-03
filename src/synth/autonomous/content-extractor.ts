// Content Extractor - Extract and parse web content
// Part of Autonomous Learning System - Week 2 Web Integration
// Uses completely free methods to extract content from web pages

import { WebResearcher, SearchResult } from './web-researcher';

export interface ExtractedContent {
  url: string;
  title: string;
  content: string;
  summary: string;
  keywords: string[];
  wordCount: number;
  source: string;
  timestamp: Date;
}

export interface ContentAnalysis {
  readability: number; // 0-100
  complexity: 'simple' | 'moderate' | 'complex';
  topic: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  keyPoints: string[];
}

export class ContentExtractor {
  private webResearcher: WebResearcher;
  private cache: Map<string, { content: ExtractedContent; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.webResearcher = new WebResearcher();
  }

  /**
   * Extract content from a URL
   */
  async extract(url: string): Promise<ExtractedContent | null> {
    console.log(`[ContentExtractor] Extracting content from: ${url}`);
    
    // Check cache
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('[ContentExtractor] Using cached content');
      return cached.content;
    }

    try {
      // For Wikipedia URLs, use the API
      if (url.includes('wikipedia.org')) {
        return await this.extractWikipedia(url);
      }
      
      // For other URLs, fetch and parse HTML
      return await this.extractWebPage(url);
    } catch (error) {
      console.error('[ContentExtractor] Extraction failed:', error);
      return null;
    }
  }

  /**
   * Extract content from Wikipedia
   */
  private async extractWikipedia(url: string): Promise<ExtractedContent | null> {
    // Extract title from URL
    const titleMatch = url.match(/\/wiki\/([^\/]+)/);
    if (!titleMatch) return null;
    
    const title = decodeURIComponent(titleMatch[1]).replace(/_/g, ' ');
    
    // Get article content
    const content = await this.webResearcher.getWikipediaArticle(title);
    if (!content) return null;
    
    const extracted: ExtractedContent = {
      url,
      title,
      content,
      summary: this.generateSummary(content),
      keywords: this.extractKeywords(content),
      wordCount: content.split(/\s+/).length,
      source: 'wikipedia',
      timestamp: new Date()
    };
    
    // Cache it
    this.cache.set(url, { content: extracted, timestamp: Date.now() });
    
    return extracted;
  }

  /**
   * Extract content from a web page
   */
  private async extractWebPage(url: string): Promise<ExtractedContent | null> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SynthAI/1.0; +https://github.com/synth-ai)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      
      // Extract title
      const title = this.extractTitle(html) || url;
      
      // Extract main content
      const content = this.extractMainContent(html);
      
      if (!content || content.length < 100) {
        return null;
      }
      
      const extracted: ExtractedContent = {
        url,
        title,
        content,
        summary: this.generateSummary(content),
        keywords: this.extractKeywords(content),
        wordCount: content.split(/\s+/).length,
        source: this.classifySource(url),
        timestamp: new Date()
      };
      
      // Cache it
      this.cache.set(url, { content: extracted, timestamp: Date.now() });
      
      return extracted;
    } catch (error) {
      console.error('[ContentExtractor] Web page extraction failed:', error);
      return null;
    }
  }

  /**
   * Extract title from HTML
   */
  private extractTitle(html: string): string | null {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? this.decodeHtmlEntities(titleMatch[1].trim()) : null;
  }

  /**
   * Extract main content from HTML (simplified)
   */
  private extractMainContent(html: string): string {
    // Remove script and style tags
    let content = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
    
    // Extract text from paragraphs and headings
    const textParts: string[] = [];
    
    const paragraphRegex = /<(p|h[1-6]|article|section)[^>]*>([\s\S]*?)<\/\1>/gi;
    let match;
    
    while ((match = paragraphRegex.exec(content)) !== null) {
      const text = this.stripHtml(match[2]).trim();
      if (text.length > 20) {
        textParts.push(text);
      }
    }
    
    // If no paragraphs found, try to extract all text
    if (textParts.length === 0) {
      const allText = this.stripHtml(content);
      const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 20);
      textParts.push(...sentences.slice(0, 20));
    }
    
    return textParts.join('\n\n');
  }

  /**
   * Generate a summary of content
   */
  private generateSummary(content: string, maxLength: number = 200): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length === 0) {
      return content.substring(0, maxLength);
    }
    
    // Take first few sentences
    const summary = sentences.slice(0, 3).join('. ').trim();
    
    if (summary.length > maxLength) {
      return summary.substring(0, maxLength) + '...';
    }
    
    return summary;
  }

  /**
   * Extract keywords from content
   */
  private extractKeywords(content: string, maxKeywords: number = 10): string[] {
    // Simple keyword extraction based on word frequency
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 4);
    
    // Remove common stop words
    const stopWords = new Set([
      'this', 'that', 'with', 'from', 'have', 'been', 'were', 'will', 'would',
      'could', 'should', 'there', 'their', 'they', 'them', 'then', 'than',
      'what', 'when', 'where', 'which', 'while', 'about', 'after', 'before'
    ]);
    
    const wordFreq = new Map<string, number>();
    
    for (const word of words) {
      if (!stopWords.has(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    }
    
    // Return most frequent words
    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  /**
   * Analyze content
   */
  analyze(content: ExtractedContent): ContentAnalysis {
    const readability = this.calculateReadability(content.content);
    const complexity = this.determineComplexity(readability);
    const topic = this.identifyTopic(content.keywords);
    const sentiment = this.analyzeSentiment(content.content);
    const keyPoints = this.extractKeyPoints(content.content);
    
    return {
      readability,
      complexity,
      topic,
      sentiment,
      keyPoints
    };
  }

  /**
   * Calculate readability score (0-100)
   */
  private calculateReadability(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/);
    
    if (sentences.length === 0 || words.length === 0) return 50;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    
    // Simple readability formula
    const score = 100 - (avgWordsPerSentence * 2) - (avgWordLength * 5);
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Determine complexity level
   */
  private determineComplexity(readability: number): 'simple' | 'moderate' | 'complex' {
    if (readability >= 70) return 'simple';
    if (readability >= 40) return 'moderate';
    return 'complex';
  }

  /**
   * Identify main topic from keywords
   */
  private identifyTopic(keywords: string[]): string {
    if (keywords.length === 0) return 'unknown';
    
    // Return most common keyword as topic
    return keywords[0];
  }

  /**
   * Analyze sentiment (simple heuristic)
   */
  private analyzeSentiment(content: string): 'positive' | 'negative' | 'neutral' {
    const lower = content.toLowerCase();
    
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'best', 'love', 'happy'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'sad', 'angry', 'poor'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    for (const word of positiveWords) {
      if (lower.includes(word)) positiveCount++;
    }
    
    for (const word of negativeWords) {
      if (lower.includes(word)) negativeCount++;
    }
    
    if (positiveCount > negativeCount + 1) return 'positive';
    if (negativeCount > positiveCount + 1) return 'negative';
    return 'neutral';
  }

  /**
   * Extract key points from content
   */
  private extractKeyPoints(content: string, maxPoints: number = 5): string[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
    
    // Simple key point extraction: take sentences with important words
    const importantWords = ['important', 'key', 'main', 'critical', 'essential', 'significant', 'major'];
    
    const keyPoints = sentences.filter(s => 
      importantWords.some(w => s.toLowerCase().includes(w))
    );
    
    // If not enough key points, take first few sentences
    if (keyPoints.length < maxPoints) {
      keyPoints.push(...sentences.slice(0, maxPoints - keyPoints.length));
    }
    
    return keyPoints.slice(0, maxPoints).map(s => s.trim());
  }

  /**
   * Classify source type
   */
  private classifySource(url: string): string {
    const lower = url.toLowerCase();
    
    if (lower.includes('wikipedia')) return 'encyclopedia';
    if (lower.includes('.edu')) return 'academic';
    if (lower.includes('.gov')) return 'government';
    if (lower.includes('news') || lower.includes('times')) return 'news';
    if (lower.includes('blog')) return 'blog';
    
    return 'web';
  }

  /**
   * Strip HTML tags
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Decode HTML entities
   */
  private decodeHtmlEntities(text: string): string {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }

  /**
   * Extract content from multiple search results
   */
  async extractFromResults(results: SearchResult[]): Promise<ExtractedContent[]> {
    console.log(`[ContentExtractor] Extracting from ${results.length} search results`);
    
    const extracted: ExtractedContent[] = [];
    
    for (const result of results.slice(0, 5)) { // Limit to top 5
      const content = await this.extract(result.url);
      if (content) {
        extracted.push(content);
      }
    }
    
    return extracted;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const contentExtractor = new ContentExtractor();
