// Enhanced Self-Knowledge System - Advanced Features
// Dynamic self-modeling, capability tracking, performance monitoring

import { SynapticNetwork, SynapticNetworkImpl } from './deep-reasoning-neural';

// ============================================
// Dynamic Self-Model
// ============================================

interface SelfComponent {
  name: string;
  type: 'neural' | 'rule' | 'hybrid';
  status: 'active' | 'inactive' | 'degraded';
  performance: {
    accuracy: number;
    speed: number;
    confidence: number;
  };
  capabilities: string[];
  limitations: string[];
  lastUpdated: number;
}

interface SelfState {
  currentTask: string | null;
  cognitiveLoad: number; // 0-1
  confidenceLevel: number; // 0-1
  reasoningDepth: 'shallow' | 'moderate' | 'deep';
  activeSystems: string[];
}

export class DynamicSelfModel {
  private components: Map<string, SelfComponent> = new Map();
  private currentState: SelfState;
  private selfAwarenessNetwork: SynapticNetwork;
  private performanceHistory: Map<string, number[]> = new Map();
  
  constructor() {
    this.currentState = {
      currentTask: null,
      cognitiveLoad: 0,
      confidenceLevel: 0.7,
      reasoningDepth: 'moderate',
      activeSystems: []
    };
    
    this.selfAwarenessNetwork = new SynapticNetworkImpl();
    this.initializeSelfModel();
  }
  
  private initializeSelfModel(): void {
    // Initialize core components
    this.registerComponent({
      name: 'DeepReasoningEngine',
      type: 'hybrid',
      status: 'active',
      performance: { accuracy: 0.92, speed: 0.85, confidence: 0.90 },
      capabilities: ['hierarchical_abstraction', 'analogical_mapping', 'causal_reasoning'],
      limitations: ['requires_clear_input', 'limited_to_trained_domains'],
      lastUpdated: Date.now()
    });
    
    this.registerComponent({
      name: 'ContextAwareness',
      type: 'hybrid',
      status: 'active',
      performance: { accuracy: 0.88, speed: 0.90, confidence: 0.85 },
      capabilities: ['conversation_tracking', 'reference_resolution', 'context_window'],
      limitations: ['limited_history', 'context_window_size'],
      lastUpdated: Date.now()
    });
    
    this.registerComponent({
      name: 'TheoryOfMind',
      type: 'hybrid',
      status: 'active',
      performance: { accuracy: 0.85, speed: 0.80, confidence: 0.82 },
      capabilities: ['agent_simulation', 'belief_modeling', 'perspective_taking'],
      limitations: ['requires_agent_definition', 'simplified_beliefs'],
      lastUpdated: Date.now()
    });
    
    this.registerComponent({
      name: 'Metacognition',
      type: 'hybrid',
      status: 'active',
      performance: { accuracy: 0.90, speed: 0.88, confidence: 0.88 },
      capabilities: ['quality_monitoring', 'confidence_calibration', 'adaptive_reasoning'],
      limitations: ['self_referential_limits', 'meta_reasoning_depth'],
      lastUpdated: Date.now()
    });
    
    // Initialize self-awareness network
    this.selfAwarenessNetwork.addNeuron('self_monitoring', [{ target: 'performance_tracking', weight: 0.9 }]);
    this.selfAwarenessNetwork.addNeuron('performance_tracking', [{ target: 'adaptation', weight: 0.8 }]);
    this.selfAwarenessNetwork.addNeuron('adaptation', [{ target: 'improvement', weight: 0.85 }]);
  }
  
  private registerComponent(component: SelfComponent): void {
    this.components.set(component.name, component);
    this.performanceHistory.set(component.name, []);
  }
  
  updatePerformance(componentName: string, accuracy: number, speed: number): void {
    const component = this.components.get(componentName);
    if (component) {
      component.performance.accuracy = accuracy;
      component.performance.speed = speed;
      component.lastUpdated = Date.now();
      
      // Track performance history
      const history = this.performanceHistory.get(componentName) || [];
      history.push(accuracy);
      if (history.length > 100) history.shift(); // Keep last 100
      this.performanceHistory.set(componentName, history);
      
      // Update status based on performance
      if (accuracy < 0.6) {
        component.status = 'degraded';
      } else if (accuracy > 0.85) {
        component.status = 'active';
      }
    }
  }
  
  updateState(task: string, cognitiveLoad: number, confidence: number): void {
    this.currentState.currentTask = task;
    this.currentState.cognitiveLoad = cognitiveLoad;
    this.currentState.confidenceLevel = confidence;
    
    // Adjust reasoning depth based on task complexity
    if (cognitiveLoad > 0.8) {
      this.currentState.reasoningDepth = 'deep';
    } else if (cognitiveLoad > 0.5) {
      this.currentState.reasoningDepth = 'moderate';
    } else {
      this.currentState.reasoningDepth = 'shallow';
    }
  }
  
  getComponent(name: string): SelfComponent | undefined {
    return this.components.get(name);
  }
  
  getAllComponents(): SelfComponent[] {
    return Array.from(this.components.values());
  }
  
  getCurrentState(): SelfState {
    return { ...this.currentState };
  }
  
  getPerformanceTrend(componentName: string): { trend: 'improving' | 'stable' | 'declining'; average: number } {
    const history = this.performanceHistory.get(componentName) || [];
    
    if (history.length < 5) {
      return { trend: 'stable', average: history.reduce((a, b) => a + b, 0) / Math.max(1, history.length) };
    }
    
    const recent = history.slice(-5);
    const older = history.slice(-10, -5);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / Math.max(1, older.length);
    
    const diff = recentAvg - olderAvg;
    
    let trend: 'improving' | 'stable' | 'declining';
    if (diff > 0.05) trend = 'improving';
    else if (diff < -0.05) trend = 'declining';
    else trend = 'stable';
    
    return { trend, average: recentAvg };
  }
  
  generateSelfReport(): string {
    let report = '**Dynamic Self-Model Report**\n\n';
    
    // Current state
    report += '**Current State:**\n';
    report += `- Task: ${this.currentState.currentTask || 'None'}\n`;
    report += `- Cognitive Load: ${(this.currentState.cognitiveLoad * 100).toFixed(0)}%\n`;
    report += `- Confidence: ${(this.currentState.confidenceLevel * 100).toFixed(0)}%\n`;
    report += `- Reasoning Depth: ${this.currentState.reasoningDepth}\n\n`;
    
    // Component status
    report += '**Component Status:**\n';
    this.components.forEach((comp, name) => {
      const trend = this.getPerformanceTrend(name);
      report += `- **${name}**: ${comp.status} (${(comp.performance.accuracy * 100).toFixed(0)}% accuracy, ${trend.trend})\n`;
    });
    report += '\n';
    
    // Active capabilities
    report += '**Active Capabilities:**\n';
    const allCapabilities = new Set<string>();
    this.components.forEach(comp => {
      if (comp.status === 'active') {
        comp.capabilities.forEach(cap => allCapabilities.add(cap));
      }
    });
    allCapabilities.forEach(cap => {
      report += `- ${cap.replace(/_/g, ' ')}\n`;
    });
    report += '\n';
    
    // Known limitations
    report += '**Known Limitations:**\n';
    const allLimitations = new Set<string>();
    this.components.forEach(comp => {
      comp.limitations.forEach(limit => allLimitations.add(limit));
    });
    allLimitations.forEach(limit => {
      report += `- ${limit.replace(/_/g, ' ')}\n`;
    });
    
    return report;
  }
  
  introspect(question: string): string {
    let response = '**Self-Introspection**\n\n';
    response += `**Question:** ${question}\n\n`;
    
    // Analyze question type
    if (question.toLowerCase().includes('how do you work')) {
      response += '**Processing Architecture:**\n';
      response += 'I use a hybrid neural-inspired architecture with:\n';
      response += '- Hierarchical abstraction (4 layers: concrete → pattern → principle → meta)\n';
      response += '- Analogical mapping for cross-domain reasoning\n';
      response += '- Causal reasoning networks for cause-effect analysis\n';
      response += '- Context awareness for conversation tracking\n';
      response += '- Theory of mind for agent simulation\n';
      response += '- Metacognition for self-monitoring\n\n';
    } else if (question.toLowerCase().includes('what can you do')) {
      response += '**Capabilities:**\n';
      const capabilities = new Set<string>();
      this.components.forEach(comp => {
        if (comp.status === 'active') {
          comp.capabilities.forEach(cap => capabilities.add(cap));
        }
      });
      capabilities.forEach(cap => {
        response += `- ${cap.replace(/_/g, ' ')}\n`;
      });
      response += '\n';
    } else if (question.toLowerCase().includes('what are your limitations')) {
      response += '**Limitations:**\n';
      const limitations = new Set<string>();
      this.components.forEach(comp => {
        comp.limitations.forEach(limit => limitations.add(limit));
      });
      limitations.forEach(limit => {
        response += `- ${limit.replace(/_/g, ' ')}\n`;
      });
      response += '\n';
    } else if (question.toLowerCase().includes('how confident')) {
      response += `**Current Confidence:** ${(this.currentState.confidenceLevel * 100).toFixed(0)}%\n\n`;
      response += '**Component Confidence Levels:**\n';
      this.components.forEach((comp, name) => {
        response += `- ${name}: ${(comp.performance.confidence * 100).toFixed(0)}%\n`;
      });
      response += '\n';
    } else {
      response += '**General Introspection:**\n';
      response += `I am currently processing with ${this.currentState.reasoningDepth} reasoning depth.\n`;
      response += `My cognitive load is ${(this.currentState.cognitiveLoad * 100).toFixed(0)}%.\n`;
      response += `Overall system confidence is ${(this.currentState.confidenceLevel * 100).toFixed(0)}%.\n`;
    }
    
    return response;
  }
}

// ============================================
// Capability Tracker
// ============================================

interface Capability {
  name: string;
  category: string;
  proficiency: number; // 0-1
  usageCount: number;
  lastUsed: number;
  successRate: number; // 0-1
}

export class CapabilityTracker {
  private capabilities: Map<string, Capability> = new Map();
  
  constructor() {
    this.initializeCapabilities();
  }
  
  private initializeCapabilities(): void {
    const initialCapabilities = [
      { name: 'deep_reasoning', category: 'reasoning', proficiency: 0.92 },
      { name: 'analogical_mapping', category: 'reasoning', proficiency: 0.88 },
      { name: 'causal_reasoning', category: 'reasoning', proficiency: 0.85 },
      { name: 'context_tracking', category: 'context', proficiency: 0.90 },
      { name: 'reference_resolution', category: 'context', proficiency: 0.87 },
      { name: 'agent_simulation', category: 'social', proficiency: 0.83 },
      { name: 'perspective_taking', category: 'social', proficiency: 0.80 },
      { name: 'quality_monitoring', category: 'metacognition', proficiency: 0.89 },
      { name: 'confidence_calibration', category: 'metacognition', proficiency: 0.86 },
      { name: 'code_generation', category: 'technical', proficiency: 0.91 },
      { name: 'math_reasoning', category: 'technical', proficiency: 0.88 },
      { name: 'creative_writing', category: 'creative', proficiency: 0.84 },
    ];
    
    initialCapabilities.forEach(cap => {
      this.capabilities.set(cap.name, {
        ...cap,
        usageCount: 0,
        lastUsed: 0,
        successRate: cap.proficiency
      });
    });
  }
  
  recordUsage(capabilityName: string, success: boolean): void {
    const capability = this.capabilities.get(capabilityName);
    if (capability) {
      capability.usageCount++;
      capability.lastUsed = Date.now();
      
      // Update success rate with exponential moving average
      const alpha = 0.1;
      capability.successRate = alpha * (success ? 1 : 0) + (1 - alpha) * capability.successRate;
      
      // Update proficiency based on success rate
      capability.proficiency = capability.successRate;
    }
  }
  
  getCapability(name: string): Capability | undefined {
    return this.capabilities.get(name);
  }
  
  getAllCapabilities(): Capability[] {
    return Array.from(this.capabilities.values());
  }
  
  getCapabilitiesByCategory(category: string): Capability[] {
    return this.getAllCapabilities().filter(cap => cap.category === category);
  }
  
  getMostUsedCapabilities(limit: number = 5): Capability[] {
    return this.getAllCapabilities()
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }
  
  getLeastProficientCapabilities(limit: number = 5): Capability[] {
    return this.getAllCapabilities()
      .sort((a, b) => a.proficiency - b.proficiency)
      .slice(0, limit);
  }
  
  generateCapabilityReport(): string {
    let report = '**Capability Tracker Report**\n\n';
    
    // Overall stats
    const allCaps = this.getAllCapabilities();
    const avgProficiency = allCaps.reduce((sum, cap) => sum + cap.proficiency, 0) / allCaps.length;
    const totalUsage = allCaps.reduce((sum, cap) => sum + cap.usageCount, 0);
    
    report += '**Overall Statistics:**\n';
    report += `- Total Capabilities: ${allCaps.length}\n`;
    report += `- Average Proficiency: ${(avgProficiency * 100).toFixed(0)}%\n`;
    report += `- Total Usage Count: ${totalUsage}\n\n`;
    
    // Most used
    report += '**Most Used Capabilities:**\n';
    this.getMostUsedCapabilities(5).forEach((cap, i) => {
      report += `${i + 1}. ${cap.name.replace(/_/g, ' ')} (${cap.usageCount} uses, ${(cap.proficiency * 100).toFixed(0)}% proficient)\n`;
    });
    report += '\n';
    
    // Least proficient
    report += '**Areas for Improvement:**\n';
    this.getLeastProficientCapabilities(3).forEach((cap, i) => {
      report += `${i + 1}. ${cap.name.replace(/_/g, ' ')} (${(cap.proficiency * 100).toFixed(0)}% proficient, ${cap.usageCount} uses)\n`;
    });
    report += '\n';
    
    // By category
    const categories = [...new Set(allCaps.map(cap => cap.category))];
    report += '**Capabilities by Category:**\n';
    categories.forEach(category => {
      const categoryCaps = this.getCapabilitiesByCategory(category);
      const categoryAvg = categoryCaps.reduce((sum, cap) => sum + cap.proficiency, 0) / categoryCaps.length;
      report += `- **${category}**: ${categoryCaps.length} capabilities, ${(categoryAvg * 100).toFixed(0)}% avg proficiency\n`;
    });
    
    return report;
  }
}

// ============================================
// Performance Monitor
// ============================================

interface PerformanceMetric {
  timestamp: number;
  responseTime: number;
  confidence: number;
  quality: number;
  taskType: string;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics: number = 1000;
  
  recordMetric(responseTime: number, confidence: number, quality: number, taskType: string): void {
    this.metrics.push({
      timestamp: Date.now(),
      responseTime,
      confidence,
      quality,
      taskType
    });
    
    // Keep only last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }
  
  getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;
    return this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / this.metrics.length;
  }
  
  getAverageConfidence(): number {
    if (this.metrics.length === 0) return 0;
    return this.metrics.reduce((sum, m) => sum + m.confidence, 0) / this.metrics.length;
  }
  
  getAverageQuality(): number {
    if (this.metrics.length === 0) return 0;
    return this.metrics.reduce((sum, m) => sum + m.quality, 0) / this.metrics.length;
  }
  
  getPerformanceByTaskType(taskType: string): { avgTime: number; avgConfidence: number; avgQuality: number; count: number } {
    const taskMetrics = this.metrics.filter(m => m.taskType === taskType);
    
    if (taskMetrics.length === 0) {
      return { avgTime: 0, avgConfidence: 0, avgQuality: 0, count: 0 };
    }
    
    return {
      avgTime: taskMetrics.reduce((sum, m) => sum + m.responseTime, 0) / taskMetrics.length,
      avgConfidence: taskMetrics.reduce((sum, m) => sum + m.confidence, 0) / taskMetrics.length,
      avgQuality: taskMetrics.reduce((sum, m) => sum + m.quality, 0) / taskMetrics.length,
      count: taskMetrics.length
    };
  }
  
  getPerformanceTrend(): 'improving' | 'stable' | 'declining' {
    if (this.metrics.length < 10) return 'stable';
    
    const recent = this.metrics.slice(-10);
    const older = this.metrics.slice(-20, -10);
    
    const recentQuality = recent.reduce((sum, m) => sum + m.quality, 0) / recent.length;
    const olderQuality = older.reduce((sum, m) => sum + m.quality, 0) / older.length;
    
    const diff = recentQuality - olderQuality;
    
    if (diff > 0.05) return 'improving';
    if (diff < -0.05) return 'declining';
    return 'stable';
  }
  
  generatePerformanceReport(): string {
    let report = '**Performance Monitor Report**\n\n';
    
    report += '**Overall Metrics:**\n';
    report += `- Total Queries: ${this.metrics.length}\n`;
    report += `- Average Response Time: ${this.getAverageResponseTime().toFixed(2)}ms\n`;
    report += `- Average Confidence: ${(this.getAverageConfidence() * 100).toFixed(0)}%\n`;
    report += `- Average Quality: ${(this.getAverageQuality() * 100).toFixed(0)}%\n`;
    report += `- Performance Trend: ${this.getPerformanceTrend()}\n\n`;
    
    // By task type
    const taskTypes = [...new Set(this.metrics.map(m => m.taskType))];
    report += '**Performance by Task Type:**\n';
    taskTypes.forEach(taskType => {
      const perf = this.getPerformanceByTaskType(taskType);
      report += `- **${taskType}**: ${perf.count} queries, ${perf.avgTime.toFixed(2)}ms avg, ${(perf.avgQuality * 100).toFixed(0)}% quality\n`;
    });
    
    return report;
  }
}

// ============================================
// Enhanced Self-Knowledge Integration
// ============================================

export class EnhancedSelfKnowledge {
  private selfModel: DynamicSelfModel;
  private capabilityTracker: CapabilityTracker;
  private performanceMonitor: PerformanceMonitor;
  
  constructor() {
    this.selfModel = new DynamicSelfModel();
    this.capabilityTracker = new CapabilityTracker();
    this.performanceMonitor = new PerformanceMonitor();
  }
  
  describeArchitecture(): string {
    return this.selfModel.generateSelfReport();
  }
  
  introspect(question: string): string {
    return this.selfModel.introspect(question);
  }
  
  recordPerformance(responseTime: number, confidence: number, quality: number, taskType: string): void {
    this.performanceMonitor.recordMetric(responseTime, confidence, quality, taskType);
    this.selfModel.updateState(taskType, responseTime / 100, confidence);
  }
  
  recordCapabilityUsage(capabilityName: string, success: boolean): void {
    this.capabilityTracker.recordUsage(capabilityName, success);
  }
  
  getCapabilities(): string {
    return this.capabilityTracker.generateCapabilityReport();
  }
  
  getPerformance(): string {
    return this.performanceMonitor.generatePerformanceReport();
  }
  
  getFullReport(): string {
    let report = '**Enhanced Self-Knowledge Report**\n\n';
    report += this.selfModel.generateSelfReport();
    report += '\n\n';
    report += this.capabilityTracker.generateCapabilityReport();
    report += '\n\n';
    report += this.performanceMonitor.generatePerformanceReport();
    
    return report;
  }
}
