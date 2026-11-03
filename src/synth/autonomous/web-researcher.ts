// Web Researcher - Completely free web search using DuckDuckGo
// Part of Autonomous Learning System - Week 2 Web Integration
// NO API KEYS, NO RATE LIMITS, 100% FREE

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: 'duckduckgo' | 'wikipedia';
  timestamp?: Date;
}

export interface ResearchResult {
  query: string;
  results: SearchResult[];
  timestamp: Date;
  totalResults: number;
}

export class WebResearcher {
  private cache: Map<string, { results: SearchResult[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  /**
   * Search the web using DuckDuckGo (completely free, no API key)
   */
  async search(query: string, maxResults: number = 10): Promise<SearchResult[]> {
    // Check cache first
    const cached = this.cache.get(query);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`[WebResearcher] Using cached results for: ${query}`);
      return cached.results;
    }

    console.log(`[WebResearcher] Searching DuckDuckGo for: ${query}`);

    try {
      // Use DuckDuckGo HTML endpoint (completely free, no API key)
      const results = await this.searchDuckDuckGo(query, maxResults);
      
      // Cache results
      this.cache.set(query, { results, timestamp: Date.now() });
      
      console.log(`[WebResearcher] Found ${results.length} results`);
      return results;
    } catch (error) {
      console.error('[WebResearcher] DuckDuckGo search failed:', error);
      // Fallback to Wikipedia
      return await this.searchWikipedia(query, maxResults);
    }
  }

  /**
   * Search DuckDuckGo using their free HTML endpoint
   */
  private async searchDuckDuckGo(query: string, maxResults: number): Promise<SearchResult[]> {
    // DuckDuckGo Lite/HTML endpoint (completely free)
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
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
      return this.parseDuckDuckGoResults(html, maxResults);
    } catch (error) {
      console.warn('[WebResearcher] DuckDuckGo HTML parse failed, trying API:', error);
      // Fallback to DuckDuckGo Instant Answer API
      return await this.searchDuckDuckGoAPI(query, maxResults);
    }
  }

  /**
   * Parse DuckDuckGo HTML results
   */
  private parseDuckDuckGoResults(html: string, maxResults: number): SearchResult[] {
    const results: SearchResult[] = [];
    
    // Simple regex-based parsing (no external dependencies)
    const resultRegex = /<a rel="nofollow" class="result__a" href="([^"]+)"[^>]*>([^<]+)<\/a>.*?<a class="result__snippet"[^>]*>([^<]+)<\/a>/gs;
    
    let match;
    let count = 0;
    
    while ((match = resultRegex.exec(html)) !== null && count < maxResults) {
      const url = match[1];
      const title = match[2].trim();
      const snippet = match[3].trim();
      
      // Clean up HTML entities
      const cleanTitle = this.decodeHtmlEntities(title);
      const cleanSnippet = this.decodeHtmlEntities(snippet);
      
      results.push({
        title: cleanTitle,
        url: url,
        snippet: cleanSnippet,
        source: 'duckduckgo',
        timestamp: new Date()
      });
      
      count++;
    }

    return results;
  }

  /**
   * DuckDuckGo Instant Answer API (also free, no key)
   */
  private async searchDuckDuckGoAPI(query: string, maxResults: number): Promise<SearchResult[]> {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      const results: SearchResult[] = [];
      
      // Abstract (main answer)
      if (data.Abstract) {
        results.push({
          title: data.Heading || query,
          url: data.AbstractURL || '',
          snippet: data.Abstract,
          source: 'duckduckgo',
          timestamp: new Date()
        });
      }
      
      // Related topics
      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics.slice(0, maxResults - results.length)) {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 50),
              url: topic.FirstURL,
              snippet: topic.Text,
              source: 'duckduckgo',
              timestamp: new Date()
            });
          }
        }
      }
      
      return results.slice(0, maxResults);
    } catch (error) {
      console.error('[WebResearcher] DuckDuckGo API failed:', error);
      return [];
    }
  }

  /**
   * Search Wikipedia (completely free, no API key)
   */
  async searchWikipedia(query: string, maxResults: number = 5): Promise<SearchResult[]> {
    console.log(`[WebResearcher] Searching Wikipedia for: ${query}`);
    
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.query || !data.query.search) {
        return [];
      }
      
      return data.query.search.slice(0, maxResults).map((item: any) => ({
        title: item.title,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
        snippet: this.stripHtml(item.snippet),
        source: 'wikipedia' as const,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('[WebResearcher] Wikipedia search failed:', error);
      return [];
    }
  }

  /**
   * Get full Wikipedia article content
   */
  async getWikipediaArticle(title: string): Promise<string | null> {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&exintro=true&format=json&origin=*`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      const pages = data.query?.pages;
      if (!pages) return null;
      
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId]?.extract;
      
      return extract ? this.stripHtml(extract) : null;
    } catch (error) {
      console.error('[WebResearcher] Wikipedia article fetch failed:', error);
      return null;
    }
  }

  /**
   * Research a topic comprehensively
   */
  async research(topic: string, maxResults: number = 10): Promise<ResearchResult> {
    console.log(`[WebResearcher] Starting comprehensive research on: ${topic}`);
    
    // Search both DuckDuckGo and Wikipedia
    const [ddgResults, wikiResults] = await Promise.all([
      this.search(topic, maxResults),
      this.searchWikipedia(topic, Math.floor(maxResults / 2))
    ]);
    
    // Combine results (Wikipedia first for reliability)
    const allResults = [...wikiResults, ...ddgResults];
    
    // Remove duplicates by URL
    const uniqueResults = this.removeDuplicates(allResults);
    
    return {
      query: topic,
      results: uniqueResults,
      timestamp: new Date(),
      totalResults: uniqueResults.length
    };
  }

  /**
   * Remove duplicate results
   */
  private removeDuplicates(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>();
    return results.filter(result => {
      if (seen.has(result.url)) {
        return false;
      }
      seen.add(result.url);
      return true;
    });
  }

  /**
   * Strip HTML tags from text
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
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
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
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
}

// Export singleton instance
export const webResearcher = new WebResearcher();
