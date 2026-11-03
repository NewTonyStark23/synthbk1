// Enhanced Metacognition System - Advanced Features
// Sophisticated quality assessment, adaptive reasoning, self-improvement

import { SynapticNetwork, SynapticNetworkImpl } from './deep-reasoning-neural';

// ============================================
// Multi-Dimensional Quality Assessment
// ============================================

interface QualityDimension {
  name: string;
  score: number; // 0-1
  weight: number; // 0-1
  factors: string[];
}

interface QualityAssessment {
  overall: number;
  dimensions: QualityDimension[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  timestamp: number;
}

export class MultiDimensionalQualityAssessment {
  private assessmentHistory: QualityAssessment[] = [];
  private qualityNetwork: SynapticNetwork;
  
  constructor() {
    this.qualityNetwork = new SynapticNetworkImpl();
    this.initializeQualityMetrics();
  }
  
  private initializeQualityMetrics(): void {
    this.qualityNetwork.addNeuron('depth', [{ target: 'overall', weight: 0.2 }]);
    this.qualityNetwork.addNeuron('coherence', [{ target: 'overall', weight: 0.2 }]);
    this.qualityNetwork.addNeuron('relevance', [{ target: 'overall', weight: 0.2 }]);
    this.qualityNetwork.addNeuron('clarity', [{ target: 'overall', weight: 0.15 }]);
    this.qualityNetwork.addNeuron('completeness', [{ target: 'overall', weight: 0.15 }]);
    this.qualityNetwork.addNeuron('accuracy', [{ target: 'overall', weight: 0.1 }]);
  }
  
  assessQuality(
    response: string,
    question: string,
    context: string[] = []
  ): QualityAssessment {
    const dimensions: QualityDimension[] = [];
    
    // 1. Depth Assessment
    const depthScore = this.assessDepth(response);
    dimensions.push({
      name: 'depth',
      score: depthScore,
      weight: 0.2,
      factors: this.getDepthFactors(response)
    });
    
    // 2. Coherence Assessment
    const coherenceScore = this.assessCoherence(response);
    dimensions.push({
      name: 'coherence',
      score: coherenceScore,
      weight: 0.2,
      factors: this.getCoherenceFactors(response)
    });
    
    // 3. Relevance Assessment
    const relevanceScore = this.assessRelevance(response, question);
    dimensions.push({
      name: 'relevance',
      score: relevanceScore,
      weight: 0.2,
      factors: this.getRelevanceFactors(response, question)
    });
    
    // 4. Clarity Assessment
    const clarityScore = this.assessClarity(response);
    dimensions.push({
      name: 'clarity',
      score: clarityScore,
      weight: 0.15,
      factors: this.getClarityFactors(response)
    });
    
    // 5. Completeness Assessment
    const completenessScore = this.assessCompleteness(response, question);
    dimensions.push({
      name: 'completeness',
      score: completenessScore,
      weight: 0.15,
      factors: this.getCompletenessFactors(response, question)
    });
    
    // 6. Accuracy Assessment
    const accuracyScore = this.assessAccuracy(response, context);
    dimensions.push({
      name: 'accuracy',
      score: accuracyScore,
      weight: 0.1,
      factors: this.getAccuracyFactors(response, context)
    });
    
    // Calculate overall score
    const overall = dimensions.reduce((sum, dim) => sum + dim.score * dim.weight, 0);
    
    // Identify strengths and weaknesses
    const strengths = dimensions
      .filter(dim => dim.score >= 0.8)
      .map(dim => `${dim.name} (${(dim.score * 100).toFixed(0)}%)`);
    
    const weaknesses = dimensions
      .filter(dim => dim.score < 0.6)
      .map(dim => `${dim.name} (${(dim.score * 100).toFixed(0)}%)`);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(dimensions);
    
    const assessment: QualityAssessment = {
      overall,
      dimensions,
      strengths,
      weaknesses,
      recommendations,
      timestamp: Date.now()
    };
    
    this.assessmentHistory.push(assessment);
    
    return assessment;
  }
  
  private assessDepth(response: string): number {
    let score = 0.5;
    
    // Check for hierarchical abstraction indicators
    const abstractionIndicators = [
      'fundamental', 'principle', 'underlying', 'core', 'essential',
      'meta', 'abstract', 'conceptual', 'theoretical', 'foundational'
    ];
    
    const abstractionCount = abstractionIndicators.filter(ind => 
      response.toLowerCase().includes(ind)
    ).length;
    
    score += Math.min(0.3, abstractionCount * 0.05);
    
    // Check for multiple levels of analysis
    const levelIndicators = ['concrete', 'specific', 'general', 'abstract', 'meta'];
    const levelCount = levelIndicators.filter(ind => 
      response.toLowerCase().includes(ind)
    ).length;
    
    score += Math.min(0.2, levelCount * 0.05);
    
    // Check for explanation of "why"
    if (response.toLowerCase().includes('because') || 
        response.toLowerCase().includes('due to') ||
        response.toLowerCase().includes('reason')) {
      score += 0.1;
    }
    
    return Math.min(1, score);
  }
  
  private getDepthFactors(response: string): string[] {
    const factors: string[] = [];
    
    if (response.toLowerCase().includes('fundamental')) factors.push('Addresses fundamental concepts');
    if (response.toLowerCase().includes('principle')) factors.push('Discusses underlying principles');
    if (response.toLowerCase().includes('meta')) factors.push('Includes meta-level analysis');
    if (response.toLowerCase().includes('because')) factors.push('Provides causal explanations');
    
    return factors;
  }
  
  private assessCoherence(response: string): number {
    let score = 0.7;
    
    // Check for logical structure
    const structureIndicators = ['first', 'second', 'third', 'finally', 'therefore', 'thus', 'consequently'];
    const structureCount = structureIndicators.filter(ind => 
      response.toLowerCase().includes(ind)
    ).length;
    
    score += Math.min(0.15, structureCount * 0.03);
    
    // Check for formatting
    if (response.includes('**') || response.includes('-') || response.includes('1.')) {
      score += 0.1;
    }
    
    // Check for contradictions (simple heuristic)
    const sentences = response.split(/[.!?]+/);
    let contradictionDetected = false;
    
    for (let i = 0; i < sentences.length - 1; i++) {
      const current = sentences[i].toLowerCase();
      const next = sentences[i + 1].toLowerCase();
      
      // Check for negation patterns
      if ((current.includes('is') && next.includes('is not')) ||
          (current.includes('are') && next.includes('are not'))) {
        contradictionDetected = true;
        break;
      }
    }
    
    if (contradictionDetected) {
      score -= 0.2;
    }
    
    return Math.max(0, Math.min(1, score));
  }
  
  private getCoherenceFactors(response: string): string[] {
    const factors: string[] = [];
    
    if (response.includes('**')) factors.push('Uses clear formatting');
    if (response.toLowerCase().includes('therefore')) factors.push('Logical flow present');
    if (response.toLowerCase().includes('first')) factors.push('Structured presentation');
    
    return factors;
  }
  
  private assessRelevance(response: string, question: string): number {
    let score = 0.5;
    
    // Extract key terms from question
    const questionTerms = question.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3)
      .slice(0, 10);
    
    // Check how many question terms appear in response
    const responseLower = response.toLowerCase();
    const matchedTerms = questionTerms.filter(term => responseLower.includes(term));
    
    score += (matchedTerms.length / questionTerms.length) * 0.4;
    
    // Check if response directly addresses question type
    if (question.toLowerCase().startsWith('why') && 
        (response.toLowerCase().includes('because') || 
         response.toLowerCase().includes('reason'))) {
      score += 0.1;
    }
    
    if (question.toLowerCase().startsWith('how') && 
        (response.toLowerCase().includes('step') || 
         response.toLowerCase().includes('process') ||
         response.toLowerCase().includes('method'))) {
      score += 0.1;
    }
    
    return Math.min(1, score);
  }
  
  private getRelevanceFactors(response: string, question: string): string[] {
    const factors: string[] = [];
    
    const questionTerms = question.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matchedTerms = questionTerms.filter(term => response.toLowerCase().includes(term));
    
    if (matchedTerms.length > questionTerms.length * 0.5) {
      factors.push('Addresses key question terms');
    }
    
    if (question.toLowerCase().startsWith('why') && response.toLowerCase().includes('because')) {
      factors.push('Provides causal explanation');
    }
    
    return factors;
  }
  
  private assessClarity(response: string): number {
    let score = 0.6;
    
    // Check sentence length
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / Math.max(1, sentences.length);
    
    if (avgLength < 50) score += 0.15;
    else if (avgLength > 100) score -= 0.1;
    
    // Check for jargon without explanation
    const technicalTerms = ['algorithm', 'neural', 'quantum', 'metaphysical', 'epistemological'];
    const hasUnexplainedJargon = technicalTerms.some(term => 
      response.toLowerCase().includes(term) && 
      !response.toLowerCase().includes('means') &&
      !response.toLowerCase().includes('refers to')
    );
    
    if (hasUnexplainedJargon) score -= 0.1;
    
    // Check for examples
    if (response.toLowerCase().includes('example') || 
        response.toLowerCase().includes('for instance') ||
        response.toLowerCase().includes('such as')) {
      score += 0.1;
    }
    
    // Check for formatting
    if (response.includes('**') || response.includes('-') || response.includes('1.')) {
      score += 0.1;
    }
    
    return Math.max(0, Math.min(1, score));
  }
  
  private getClarityFactors(response: string): string[] {
    const factors: string[] = [];
    
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / Math.max(1, sentences.length);
    
    if (avgLength < 50) factors.push('Concise sentences');
    if (response.toLowerCase().includes('example')) factors.push('Includes examples');
    if (response.includes('**')) factors.push('Uses formatting for emphasis');
    
    return factors;
  }
  
  private assessCompleteness(response: string, question: string): number {
    let score = 0.5;
    
    // Check response length relative to question complexity
    const questionComplexity = this.assessQuestionComplexity(question);
    
    if (response.length > questionComplexity * 50) {
      score += 0.2;
    }
    
    // Check for multiple aspects covered
    const aspects = this.identifyQuestionAspects(question);
    const coveredAspects = aspects.filter(aspect => 
      response.toLowerCase().includes(aspect.toLowerCase())
    );
    
    score += (coveredAspects.length / Math.max(1, aspects.length)) * 0.3;
    
    // Check for comprehensive indicators
    if (response.toLowerCase().includes('comprehensive') ||
        response.toLowerCase().includes('complete') ||
        response.toLowerCase().includes('thorough')) {
      score += 0.1;
    }
    
    return Math.min(1, score);
  }
  
  private assessQuestionComplexity(question: string): number {
    let complexity = 1;
    
    // Multiple questions
    const questionMarks = (question.match(/\?/g) || []).length;
    complexity += questionMarks - 1;
    
    // Multiple aspects
    const aspects = this.identifyQuestionAspects(question);
    complexity += aspects.length - 1;
    
    // Abstract concepts
    const abstractTerms = ['consciousness', 'meaning', 'purpose', 'fundamental', 'ultimate'];
    complexity += abstractTerms.filter(term => question.toLowerCase().includes(term)).length * 0.5;
    
    return complexity;
  }
  
  private identifyQuestionAspects(question: string): string[] {
    const aspects: string[] = [];
    
    // Extract key concepts
    const words = question.toLowerCase().split(/\s+/);
    const nouns = words.filter(w => w.length > 4 && !['what', 'when', 'where', 'which', 'there', 'their'].includes(w));
    
    aspects.push(...nouns.slice(0, 5));
    
    return aspects;
  }
  
  private getCompletenessFactors(response: string, question: string): string[] {
    const factors: string[] = [];
    
    const aspects = this.identifyQuestionAspects(question);
    const coveredAspects = aspects.filter(aspect => 
      response.toLowerCase().includes(aspect.toLowerCase())
    );
    
    if (coveredAspects.length === aspects.length) {
      factors.push('Addresses all question aspects');
    }
    
    if (response.length > 500) {
      factors.push('Comprehensive coverage');
    }
    
    return factors;
  }
  
  private assessAccuracy(response: string, context: string[]): number {
    let score = 0.7;
    
    // Check for uncertainty markers (lower accuracy)
    const uncertaintyMarkers = ['maybe', 'perhaps', 'might', 'could', 'uncertain', 'unsure', 'i think'];
    const uncertaintyCount = uncertaintyMarkers.filter(marker => 
      response.toLowerCase().includes(marker)
    ).length;
    
    score -= uncertaintyCount * 0.05;
    
    // Check for confident language (higher accuracy)
    const confidenceMarkers = ['clearly', 'definitely', 'certainly', 'obviously', 'evidently'];
    const confidenceCount = confidenceMarkers.filter(marker => 
      response.toLowerCase().includes(marker)
    ).length;
    
    score += confidenceCount * 0.05;
    
    // Check for factual claims with sources
    if (response.toLowerCase().includes('according to') ||
        response.toLowerCase().includes('research shows') ||
        response.toLowerCase().includes('studies indicate')) {
      score += 0.1;
    }
    
    // Check against context if available
    if (context.length > 0) {
      const contextTerms = context.join(' ').toLowerCase().split(/\s+/);
      const responseTerms = response.toLowerCase().split(/\s+/);
      
      const overlap = contextTerms.filter(term => responseTerms.includes(term)).length;
      score += (overlap / Math.max(1, contextTerms.length)) * 0.1;
    }
    
    return Math.max(0, Math.min(1, score));
  }
  
  private getAccuracyFactors(response: string, context: string[]): string[] {
    const factors: string[] = [];
    
    if (response.toLowerCase().includes('according to')) {
      factors.push('Cites sources');
    }
    
    if (!response.toLowerCase().includes('maybe') && !response.toLowerCase().includes('perhaps')) {
      factors.push('Confident assertions');
    }
    
    return factors;
  }
  
  private generateRecommendations(dimensions: QualityDimension[]): string[] {
    const recommendations: string[] = [];
    
    dimensions.forEach(dim => {
      if (dim.score < 0.6) {
        switch (dim.name) {
          case 'depth':
            recommendations.push('Explore underlying principles and fundamental concepts');
            recommendations.push('Move from concrete examples to abstract principles');
            break;
          case 'coherence':
            recommendations.push('Improve logical flow and structure');
            recommendations.push('Use clear transitions between ideas');
            break;
          case 'relevance':
            recommendations.push('Focus more directly on the question asked');
            recommendations.push('Address key terms and concepts from the question');
            break;
          case 'clarity':
            recommendations.push('Use shorter, clearer sentences');
            recommendations.push('Provide examples to illustrate complex points');
            break;
          case 'completeness':
            recommendations.push('Address all aspects of the question');
            recommendations.push('Provide more comprehensive coverage');
            break;
          case 'accuracy':
            recommendations.push('Verify factual claims');
            recommendations.push('Cite sources for important assertions');
            break;
        }
      }
    });
    
    return recommendations;
  }
  
  getAssessmentHistory(): QualityAssessment[] {
    return this.assessmentHistory;
  }
  
  getQualityTrend(): 'improving' | 'stable' | 'declining' {
    if (this.assessmentHistory.length < 5) return 'stable';
    
    const recent = this.assessmentHistory.slice(-5);
    const older = this.assessmentHistory.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, a) => sum + a.overall, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, a) => sum + a.overall, 0) / older.length : recentAvg;
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 0.05) return 'improving';
    if (diff < -0.05) return 'declining';
    return 'stable';
  }
  
  generateQualityReport(): string {
    if (this.assessmentHistory.length === 0) {
      return 'No quality assessments recorded yet.';
    }
    
    const latest = this.assessmentHistory[this.assessmentHistory.length - 1];
    
    let report = '**Multi-Dimensional Quality Assessment Report**\n\n';
    
    report += `**Overall Quality:** ${(latest.overall * 100).toFixed(0)}%\n`;
    report += `**Trend:** ${this.getQualityTrend()}\n\n`;
    
    report += '**Dimension Scores:**\n';
    latest.dimensions.forEach(dim => {
      report += `- **${dim.name}**: ${(dim.score * 100).toFixed(0)}% (weight: ${(dim.weight * 100).toFixed(0)}%)\n`;
      if (dim.factors.length > 0) {
        dim.factors.forEach(factor => {
          report += `  • ${factor}\n`;
        });
      }
    });
    
    if (latest.strengths.length > 0) {
      report += '\n**Strengths:**\n';
      latest.strengths.forEach(strength => {
        report += `✅ ${strength}\n`;
      });
    }
    
    if (latest.weaknesses.length > 0) {
      report += '\n**Weaknesses:**\n';
      latest.weaknesses.forEach(weakness => {
        report += `⚠️ ${weakness}\n`;
      });
    }
    
    if (latest.recommendations.length > 0) {
      report += '\n**Recommendations:**\n';
      latest.recommendations.forEach(rec => {
        report += `→ ${rec}\n`;
      });
    }
    
    return report;
  }
}

// ============================================
// Adaptive Reasoning Strategy Selector
// ============================================

interface ReasoningStrategy {
  name: string;
  description: string;
 适用场景: string[];
  effectiveness: number; // 0-1
  usageCount: number;
  successCount: number;
}

export class AdaptiveReasoningStrategySelector {
  private strategies: Map<string, ReasoningStrategy> = new Map();
  private selectionNetwork: SynapticNetwork;
  
  constructor() {
    this.selectionNetwork = new SynapticNetworkImpl();
    this.initializeStrategies();
  }
  
  private initializeStrategies(): void {
    this.strategies.set('hierarchical_abstraction', {
      name: 'Hierarchical Abstraction',
      description: 'Move from concrete to abstract through multiple levels',
      适用场景: ['why questions', 'fundamental principles', 'deep understanding'],
      effectiveness: 0.9,
      usageCount: 0,
      successCount: 0
    });
    
    this.strategies.set('analogical_mapping', {
      name: 'Analogical Mapping',
      description: 'Find structural similarities between domains',
      适用场景: ['comparison questions', 'creative insights', 'cross-domain transfer'],
      effectiveness: 0.85,
      usageCount: 0,
      successCount: 0
    });
    
    this.strategies.set('causal_reasoning', {
      name: 'Causal Reasoning',
      description: 'Trace cause-effect relationships',
      适用场景: ['consequence questions', 'prediction', 'explanation'],
      effectiveness: 0.88,
      usageCount: 0,
      successCount: 0
    });
    
    this.strategies.set('multi_perspective', {
      name: 'Multi-Perspective Analysis',
      description: 'Analyze from multiple viewpoints',
      适用场景: ['complex decisions', 'ethical dilemmas', 'social situations'],
      effectiveness: 0.87,
      usageCount: 0,
      successCount: 0
    });
    
    this.strategies.set('first_principles', {
      name: 'First Principles Thinking',
      description: 'Break down to fundamental truths',
      适用场景: ['novel problems', 'innovation', 'foundational questions'],
      effectiveness: 0.92,
      usageCount: 0,
      successCount: 0
    });
    
    // Initialize selection network
    this.selectionNetwork.addNeuron('question_type', [{ target: 'strategy', weight: 0.8 }]);
    this.selectionNetwork.addNeuron('strategy', [{ target: 'effectiveness', weight: 0.9 }]);
    this.selectionNetwork.addNeuron('effectiveness', [{ target: 'selection', weight: 0.85 }]);
  }
  
  selectStrategy(question: string, context: string[] = []): ReasoningStrategy {
    const questionLower = question.toLowerCase();
    
    // Score each strategy based on question characteristics
    const scored = Array.from(this.strategies.values()).map(strategy => {
      let score = strategy.effectiveness;
      
      // Boost for matching scenarios
      strategy.适用场景.forEach(scenario => {
        if (questionLower.includes(scenario.split(' ')[0])) {
          score += 0.1;
        }
      });
      
      // Boost based on past success
      if (strategy.usageCount > 0) {
        const successRate = strategy.successCount / strategy.usageCount;
        score += successRate * 0.2;
      }
      
      return { strategy, score };
    });
    
    // Select highest scoring strategy
    scored.sort((a, b) => b.score - a.score);
    return scored[0].strategy;
  }
  
  recordUsage(strategyName: string, success: boolean): void {
    const strategy = this.strategies.get(strategyName);
    if (strategy) {
      strategy.usageCount++;
      if (success) {
        strategy.successCount++;
      }
      
      // Update effectiveness based on success rate
      if (strategy.usageCount > 5) {
        strategy.effectiveness = strategy.successCount / strategy.usageCount;
      }
    }
  }
  
  getStrategy(name: string): ReasoningStrategy | undefined {
    return this.strategies.get(name);
  }
  
  getAllStrategies(): ReasoningStrategy[] {
    return Array.from(this.strategies.values());
  }
  
  getMostEffectiveStrategies(limit: number = 3): ReasoningStrategy[] {
    return this.getAllStrategies()
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, limit);
  }
  
  generateStrategyReport(): string {
    let report = '**Adaptive Reasoning Strategy Report**\n\n';
    
    report += '**All Strategies:**\n';
    this.getAllStrategies().forEach(strategy => {
      report += `- **${strategy.name}**: ${(strategy.effectiveness * 100).toFixed(0)}% effective`;
      if (strategy.usageCount > 0) {
        const successRate = strategy.successCount / strategy.usageCount;
        report += ` (${strategy.usageCount} uses, ${(successRate * 100).toFixed(0)}% success)`;
      }
      report += '\n';
    });
    
    report += '\n**Most Effective Strategies:**\n';
    this.getMostEffectiveStrategies(3).forEach((strategy, i) => {
      report += `${i + 1}. ${strategy.name} (${(strategy.effectiveness * 100).toFixed(0)}%)\n`;
    });
    
    return report;
  }
}

// ============================================
// Self-Improvement Engine
// ============================================

interface ImprovementArea {
  dimension: string;
  currentScore: number;
  targetScore: number;
  improvementActions: string[];
  progress: number; // 0-1
}

export class SelfImprovementEngine {
  private qualityAssessment: MultiDimensionalQualityAssessment;
  private strategySelector: AdaptiveReasoningStrategySelector;
  private improvementAreas: Map<string, ImprovementArea> = new Map();
  
  constructor() {
    this.qualityAssessment = new MultiDimensionalQualityAssessment();
    this.strategySelector = new AdaptiveReasoningStrategySelector();
  }
  
  analyzeAndImprove(response: string, question: string, context: string[] = []): {
    improvedResponse: string;
    improvements: string[];
    qualityReport: string;
  } {
    // Assess current quality
    const assessment = this.qualityAssessment.assessQuality(response, question, context);
    
    // Identify improvement areas
    const improvements: string[] = [];
    let improvedResponse = response;
    
    assessment.dimensions.forEach(dim => {
      if (dim.score < 0.7) {
        const improvement = this.generateImprovement(dim.name, response, question);
        if (improvement) {
          improvements.push(improvement.action);
          improvedResponse = improvement.improvedResponse;
        }
      }
    });
    
    // Select best strategy for this type of question
    const strategy = this.strategySelector.selectStrategy(question, context);
    
    // Generate quality report
    const qualityReport = this.qualityAssessment.generateQualityReport();
    
    return { improvedResponse, improvements, qualityReport };
  }
  
  private generateImprovement(
    dimension: string,
    response: string,
    question: string
  ): { action: string; improvedResponse: string } | null {
    switch (dimension) {
      case 'depth':
        if (!response.toLowerCase().includes('fundamental') && 
            !response.toLowerCase().includes('principle')) {
          return {
            action: 'Add fundamental principles and deeper analysis',
            improvedResponse: response + '\n\n**Fundamental Principles:**\nAt the most basic level, this involves understanding the underlying principles that govern this domain. These principles provide the foundation for all higher-level reasoning and decision-making.'
          };
        }
        break;
        
      case 'coherence':
        if (!response.includes('**') && !response.includes('-')) {
          return {
            action: 'Improve structure and formatting',
            improvedResponse: this.addStructure(response)
          };
        }
        break;
        
      case 'clarity':
        const sentences = response.split(/[.!?]+/);
        const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / Math.max(1, sentences.length);
        if (avgLength > 80) {
          return {
            action: 'Simplify sentence structure',
            improvedResponse: this.simplifySentences(response)
          };
        }
        break;
        
      case 'completeness':
        const aspects = this.identifyQuestionAspects(question);
        const coveredAspects = aspects.filter(aspect => 
          response.toLowerCase().includes(aspect.toLowerCase())
        );
        if (coveredAspects.length < aspects.length) {
          const missingAspects = aspects.filter(a => !coveredAspects.includes(a));
          return {
            action: `Address missing aspects: ${missingAspects.join(', ')}`,
            improvedResponse: response + `\n\n**Additional Considerations:**\n${missingAspects.map(a => `- ${a}: [Further analysis needed]`).join('\n')}`
          };
        }
        break;
    }
    
    return null;
  }
  
  private addStructure(response: string): string {
    // Add markdown structure
    let structured = '**Analysis:**\n\n';
    
    const paragraphs = response.split('\n\n');
    paragraphs.forEach((para, i) => {
      if (i === 0) {
        structured += para + '\n\n';
      } else {
        structured += `**Point ${i}:** ${para}\n\n`;
      }
    });
    
    return structured;
  }
  
  private simplifySentences(response: string): string {
    // Break long sentences into shorter ones
    const sentences = response.split(/(?<=[.!?])\s+/);
    
    const simplified = sentences.map(sentence => {
      if (sentence.length > 100) {
        // Split at conjunctions
        return sentence
          .replace(/, (and|but|or|however|therefore)/g, '. $1')
          .replace(/; (and|but|or)/g, '. $1');
      }
      return sentence;
    });
    
    return simplified.join(' ');
  }
  
  private identifyQuestionAspects(question: string): string[] {
    const aspects: string[] = [];
    
    // Extract key concepts
    const words = question.toLowerCase().split(/\s+/);
    const nouns = words.filter(w => w.length > 4 && !['what', 'when', 'where', 'which', 'there', 'their', 'about', 'would', 'could', 'should'].includes(w));
    
    aspects.push(...nouns.slice(0, 5));
    
    return aspects;
  }
  
  recordOutcome(strategyName: string, qualityScore: number): void {
    this.strategySelector.recordUsage(strategyName, qualityScore > 0.7);
  }
  
  getImprovementReport(): string {
    let report = '**Self-Improvement Report**\n\n';
    
    report += this.qualityAssessment.generateQualityReport();
    report += '\n\n';
    report += this.strategySelector.generateStrategyReport();
    
    return report;
  }
}

// ============================================
// Enhanced Metacognition Integration
// ============================================

export class EnhancedMetacognition {
  private qualityAssessment: MultiDimensionalQualityAssessment;
  private strategySelector: AdaptiveReasoningStrategySelector;
  private selfImprovement: SelfImprovementEngine;
  
  constructor() {
    this.qualityAssessment = new MultiDimensionalQualityAssessment();
    this.strategySelector = new AdaptiveReasoningStrategySelector();
    this.selfImprovement = new SelfImprovementEngine();
  }
  
  assessQuality(response: string, question: string, context?: string[]): string {
    const assessment = this.qualityAssessment.assessQuality(response, question, context);
    return this.qualityAssessment.generateQualityReport();
  }
  
  selectStrategy(question: string, context?: string[]): string {
    const strategy = this.strategySelector.selectStrategy(question, context);
    return `Selected Strategy: **${strategy.name}**\n\n${strategy.description}\n\n适用场景: ${strategy.适用场景.join(', ')}`;
  }
  
  improveResponse(response: string, question: string, context?: string[]): {
    improved: string;
    improvements: string[];
    report: string;
  } {
    const result = this.selfImprovement.analyzeAndImprove(response, question, context);
    
    return {
      improved: result.improvedResponse,
      improvements: result.improvements,
      report: result.qualityReport
    };
  }
  
  getFullReport(): string {
    return this.selfImprovement.getImprovementReport();
  }
}
