// Enhanced Theory of Mind System - Advanced Features
// Sophisticated agent simulation, recursive belief modeling, social dynamics

import { SynapticNetwork, SynapticNetworkImpl } from './deep-reasoning-neural';

// ============================================
// Sophisticated Agent Model
// ============================================

interface Belief {
  proposition: string;
  confidence: number;
  source: 'perception' | 'inference' | 'testimony' | 'memory';
  timestamp: number;
  evidence: string[];
}

interface Desire {
  goal: string;
  priority: number; // 0-1
  urgency: number; // 0-1
  achievable: boolean;
}

interface Intention {
  action: string;
  motivation: string;
  expectedOutcome: string;
  confidence: number;
}

interface Emotion {
  type: 'happy' | 'sad' | 'angry' | 'fearful' | 'surprised' | 'disgusted' | 'neutral';
  intensity: number; // 0-1
  cause: string;
  duration: number; // seconds
}

interface Agent {
  id: string;
  name: string;
  beliefs: Map<string, Belief>;
  desires: Desire[];
  intentions: Intention[];
  emotions: Emotion[];
  personality: {
    openness: number; // 0-1
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  knowledge: Set<string>;
  relationships: Map<string, number>; // agentId -> relationship strength
}

export class SophisticatedAgentModel {
  private agents: Map<string, Agent> = new Map();
  private beliefNetwork: SynapticNetwork;
  
  constructor() {
    this.beliefNetwork = new SynapticNetworkImpl();
    this.initializeBeliefPropagation();
  }
  
  private initializeBeliefPropagation(): void {
    this.beliefNetwork.addNeuron('perception', [{ target: 'belief', weight: 0.9 }]);
    this.beliefNetwork.addNeuron('inference', [{ target: 'belief', weight: 0.7 }]);
    this.beliefNetwork.addNeuron('testimony', [{ target: 'belief', weight: 0.6 }]);
    this.beliefNetwork.addNeuron('belief', [{ target: 'desire', weight: 0.8 }]);
    this.beliefNetwork.addNeuron('desire', [{ target: 'intention', weight: 0.85 }]);
    this.beliefNetwork.addNeuron('intention', [{ target: 'action', weight: 0.9 }]);
  }
  
  createAgent(
    id: string,
    name: string,
    personality: Partial<Agent['personality']> = {}
  ): Agent {
    const defaultPersonality = {
      openness: 0.5,
      conscientiousness: 0.5,
      extraversion: 0.5,
      agreeableness: 0.5,
      neuroticism: 0.5
    };
    
    const agent: Agent = {
      id,
      name,
      beliefs: new Map(),
      desires: [],
      intentions: [],
      emotions: [],
      personality: { ...defaultPersonality, ...personality },
      knowledge: new Set(),
      relationships: new Map()
    };
    
    this.agents.set(id, agent);
    return agent;
  }
  
  addBelief(agentId: string, proposition: string, confidence: number, source: Belief['source'] = 'perception', evidence: string[] = []): void {
    const agent = this.agents.get(agentId);
    if (!agent) return;
    
    agent.beliefs.set(proposition, {
      proposition,
      confidence,
      source,
      timestamp: Date.now(),
      evidence
    });
    
    agent.knowledge.add(proposition);
  }
  
  addDesire(agentId: string, goal: string, priority: number, urgency: number = 0.5): void {
    const agent = this.agents.get(agentId);
    if (!agent) return;
    
    agent.desires.push({
      goal,
      priority,
      urgency,
      achievable: true
    });
  }
  
  addIntention(agentId: string, action: string, motivation: string, expectedOutcome: string, confidence: number): void {
    const agent = this.agents.get(agentId);
    if (!agent) return;
    
    agent.intentions.push({
      action,
      motivation,
      expectedOutcome,
      confidence
    });
  }
  
  addEmotion(agentId: string, type: Emotion['type'], intensity: number, cause: string, duration: number = 60): void {
    const agent = this.agents.get(agentId);
    if (!agent) return;
    
    agent.emotions.push({
      type,
      intensity,
      cause,
      duration
    });
  }
  
  setRelationship(agentId1: string, agentId2: string, strength: number): void {
    const agent1 = this.agents.get(agentId1);
    const agent2 = this.agents.get(agentId2);
    
    if (agent1 && agent2) {
      agent1.relationships.set(agentId2, strength);
      agent2.relationships.set(agentId1, strength);
    }
  }
  
  simulateDecision(agentId: string, situation: string): {
    action: string;
    reasoning: string;
    confidence: number;
  } {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return { action: 'Unknown', reasoning: 'Agent not found', confidence: 0 };
    }
    
    let reasoning = `**Simulating ${agent.name}'s Decision**\n\n`;
    reasoning += `**Situation:** ${situation}\n\n`;
    
    // Analyze beliefs relevant to situation
    const relevantBeliefs = Array.from(agent.beliefs.values())
      .filter(b => situation.toLowerCase().includes(b.proposition.toLowerCase().split(' ')[0]))
      .sort((a, b) => b.confidence - a.confidence);
    
    reasoning += '**Relevant Beliefs:**\n';
    relevantBeliefs.slice(0, 5).forEach(belief => {
      reasoning += `- ${belief.proposition} (confidence: ${(belief.confidence * 100).toFixed(0)}%, source: ${belief.source})\n`;
    });
    reasoning += '\n';
    
    // Analyze desires
    const sortedDesires = [...agent.desires].sort((a, b) => b.priority - a.priority);
    
    reasoning += '**Current Desires:**\n';
    sortedDesires.slice(0, 3).forEach(desire => {
      reasoning += `- ${desire.goal} (priority: ${(desire.priority * 100).toFixed(0)}%, urgency: ${(desire.urgency * 100).toFixed(0)}%)\n`;
    });
    reasoning += '\n';
    
    // Analyze emotions
    const currentEmotions = agent.emotions.filter(e => e.intensity > 0.3);
    
    if (currentEmotions.length > 0) {
      reasoning += '**Emotional State:**\n';
      currentEmotions.forEach(emotion => {
        reasoning += `- ${emotion.type} (intensity: ${(emotion.intensity * 100).toFixed(0)}%, cause: ${emotion.cause})\n`;
      });
      reasoning += '\n';
    }
    
    // Determine action based on personality and context
    const action = this.determineAction(agent, situation, relevantBeliefs, sortedDesires);
    const confidence = this.calculateDecisionConfidence(agent, relevantBeliefs, sortedDesires);
    
    reasoning += `**Personality Factors:**\n`;
    reasoning += `- Openness: ${(agent.personality.openness * 100).toFixed(0)}%\n`;
    reasoning += `- Conscientiousness: ${(agent.personality.conscientiousness * 100).toFixed(0)}%\n`;
    reasoning += `- Agreeableness: ${(agent.personality.agreeableness * 100).toFixed(0)}%\n\n`;
    
    reasoning += `**Predicted Action:** ${action}\n`;
    reasoning += `**Decision Confidence:** ${(confidence * 100).toFixed(0)}%\n`;
    
    return { action, reasoning, confidence };
  }
  
  private determineAction(
    agent: Agent,
    situation: string,
    beliefs: Belief[],
    desires: Desire[]
  ): string {
    // Simple decision logic based on beliefs and desires
    if (desires.length === 0) {
      return 'No clear action - no active desires';
    }
    
    const topDesire = desires[0];
    
    // Check if agent has beliefs that support achieving the desire
    const supportingBeliefs = beliefs.filter(b => 
      b.confidence > 0.6 && 
      (situation.toLowerCase().includes(topDesire.goal.toLowerCase().split(' ')[0]) ||
       b.proposition.toLowerCase().includes(topDesire.goal.toLowerCase().split(' ')[0]))
    );
    
    if (supportingBeliefs.length > 0) {
      return `Pursue goal: ${topDesire.goal} (supported by ${supportingBeliefs.length} beliefs)`;
    }
    
    // Personality-based fallback
    if (agent.personality.conscientiousness > 0.7) {
      return 'Carefully evaluate options before acting';
    } else if (agent.personality.openness > 0.7) {
      return 'Explore creative solutions';
    } else if (agent.personality.agreeableness > 0.7) {
      return 'Seek consensus with others';
    }
    
    return `Consider pursuing: ${topDesire.goal}`;
  }
  
  private calculateDecisionConfidence(agent: Agent, beliefs: Belief[], desires: Desire[]): number {
    if (beliefs.length === 0 || desires.length === 0) return 0.3;
    
    const avgBeliefConfidence = beliefs.reduce((sum, b) => sum + b.confidence, 0) / beliefs.length;
    const topDesirePriority = desires[0].priority;
    
    // Personality affects confidence
    const personalityFactor = (
      agent.personality.conscientiousness * 0.3 +
      (1 - agent.personality.neuroticism) * 0.2
    );
    
    return Math.min(1, (avgBeliefConfidence * 0.4 + topDesirePriority * 0.4 + personalityFactor * 0.2));
  }
  
  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }
  
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
}

// ============================================
// Recursive Belief Modeling
// ============================================

interface BeliefLevel {
  level: number;
  holder: string;
  belief: string;
  confidence: number;
}

export class RecursiveBeliefModeler {
  private agentModel: SophisticatedAgentModel;
  
  constructor(agentModel: SophisticatedAgentModel) {
    this.agentModel = agentModel;
  }
  
  modelRecursiveBeliefs(
    agent1Id: string,
    agent2Id: string,
    proposition: string,
    maxDepth: number = 3
  ): { chain: BeliefLevel[]; analysis: string } {
    const chain: BeliefLevel[] = [];
    let analysis = '**Recursive Belief Analysis**\n\n';
    
    const agent1 = this.agentModel.getAgent(agent1Id);
    const agent2 = this.agentModel.getAgent(agent2Id);
    
    if (!agent1 || !agent2) {
      return { chain: [], analysis: 'One or both agents not found' };
    }
    
    analysis += `**Agents:** ${agent1.name} and ${agent2.name}\n`;
    analysis += `**Proposition:** ${proposition}\n`;
    analysis += `**Maximum Depth:** ${maxDepth}\n\n`;
    
    // Level 0: Agent1's belief about proposition
    const level0Belief = agent1.beliefs.get(proposition);
    if (level0Belief) {
      chain.push({
        level: 0,
        holder: agent1.name,
        belief: proposition,
        confidence: level0Belief.confidence
      });
    }
    
    // Level 1: Agent1's belief about Agent2's belief
    if (maxDepth >= 1) {
      const level1Belief = `${agent2.name} believes ${proposition}`;
      const level1 = agent1.beliefs.get(level1Belief);
      
      if (level1) {
        chain.push({
          level: 1,
          holder: agent1.name,
          belief: level1Belief,
          confidence: level1.confidence
        });
      } else {
        // Infer from agent2's actual belief
        const agent2Belief = agent2.beliefs.get(proposition);
        if (agent2Belief) {
          chain.push({
            level: 1,
            holder: agent1.name,
            belief: `${agent2.name} believes ${proposition}`,
            confidence: agent2Belief.confidence * 0.8 // Slightly lower confidence
          });
        }
      }
    }
    
    // Level 2: Agent1's belief about Agent2's belief about Agent1's belief
    if (maxDepth >= 2) {
      const level2Belief = `${agent2.name} believes ${agent1.name} believes ${proposition}`;
      const level2 = agent1.beliefs.get(level2Belief);
      
      if (level2) {
        chain.push({
          level: 2,
          holder: agent1.name,
          belief: level2Belief,
          confidence: level2.confidence
        });
      }
    }
    
    // Level 3: Even deeper recursion
    if (maxDepth >= 3) {
      const level3Belief = `${agent2.name} believes ${agent1.name} believes ${agent2.name} believes ${proposition}`;
      const level3 = agent1.beliefs.get(level3Belief);
      
      if (level3) {
        chain.push({
          level: 3,
          holder: agent1.name,
          belief: level3Belief,
          confidence: level3.confidence
        });
      }
    }
    
    // Generate analysis
    analysis += '**Belief Chain:**\n';
    chain.forEach(level => {
      const indent = '  '.repeat(level.level);
      analysis += `${indent}Level ${level.level}: ${level.holder} ${level.level === 0 ? 'believes' : `believes that...`} "${level.belief}" (confidence: ${(level.confidence * 100).toFixed(0)}%)\n`;
    });
    
    analysis += '\n**Implications:**\n';
    if (chain.length >= 2) {
      analysis += `- Common knowledge potential: ${chain.length >= 3 ? 'High' : 'Medium'}\n`;
      analysis += `- Misalignment risk: ${this.calculateMisalignmentRisk(chain)}\n`;
      analysis += `- Communication complexity: ${chain.length > 2 ? 'High' : 'Moderate'}\n`;
    }
    
    return { chain, analysis };
  }
  
  private calculateMisalignmentRisk(chain: BeliefLevel[]): string {
    if (chain.length < 2) return 'Low';
    
    const confidences = chain.map(c => c.confidence);
    const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
    const variance = confidences.reduce((sum, c) => sum + Math.pow(c - avgConfidence, 2), 0) / confidences.length;
    
    if (variance > 0.1) return 'High';
    if (variance > 0.05) return 'Medium';
    return 'Low';
  }
  
  detectFalseBeliefs(agentId: string, reality: Map<string, boolean>): {
    falseBeliefs: string[];
    analysis: string;
  } {
    const agent = this.agentModel.getAgent(agentId);
    if (!agent) {
      return { falseBeliefs: [], analysis: 'Agent not found' };
    }
    
    const falseBeliefs: string[] = [];
    let analysis = `**False Belief Detection for ${agent.name}**\n\n`;
    
    agent.beliefs.forEach((belief, proposition) => {
      const actualState = reality.get(proposition);
      
      if (actualState !== undefined) {
        const believedState = belief.confidence > 0.5;
        
        if (believedState !== actualState) {
          falseBeliefs.push(proposition);
          analysis += `❌ **False Belief:** "${proposition}"\n`;
          analysis += `   Agent believes: ${believedState} (confidence: ${(belief.confidence * 100).toFixed(0)}%)\n`;
          analysis += `   Reality: ${actualState}\n\n`;
        }
      }
    });
    
    if (falseBeliefs.length === 0) {
      analysis += '✅ No false beliefs detected\n';
    } else {
      analysis += `**Summary:** ${falseBeliefs.length} false belief(s) detected\n`;
      analysis += `**Implications:** Agent's actions may be based on incorrect assumptions\n`;
    }
    
    return { falseBeliefs, analysis };
  }
}

// ============================================
// Social Dynamics Analyzer
// ============================================

interface SocialSituation {
  agents: string[];
  context: string;
  powerDynamics: Map<string, number>; // agentId -> power level
  relationships: Map<string, Map<string, number>>; // agentId -> (agentId -> relationship strength)
  goals: Map<string, string[]>; // agentId -> goals
}

export class SocialDynamicsAnalyzer {
  private agentModel: SophisticatedAgentModel;
  
  constructor(agentModel: SophisticatedAgentModel) {
    this.agentModel = agentModel;
  }
  
  analyzeSocialSituation(situation: SocialSituation): {
    dynamics: string;
    predictions: string[];
    recommendations: string[];
  } {
    let dynamics = '**Social Dynamics Analysis**\n\n';
    
    // Analyze power dynamics
    dynamics += '**Power Structure:**\n';
    const powerLevels = Array.from(situation.powerDynamics.entries())
      .sort((a, b) => b[1] - a[1]);
    
    powerLevels.forEach(([agentId, power]) => {
      const agent = this.agentModel.getAgent(agentId);
      if (agent) {
        dynamics += `- ${agent.name}: ${(power * 100).toFixed(0)}% power\n`;
      }
    });
    dynamics += '\n';
    
    // Analyze relationships
    dynamics += '**Relationship Network:**\n';
    situation.relationships.forEach((relationships, agentId1) => {
      const agent1 = this.agentModel.getAgent(agentId1);
      if (!agent1) return;
      
      relationships.forEach((strength, agentId2) => {
        const agent2 = this.agentModel.getAgent(agentId2);
        if (!agent2) return;
        
        const relationshipType = strength > 0.7 ? 'strong' : strength > 0.4 ? 'moderate' : 'weak';
        dynamics += `- ${agent1.name} ↔ ${agent2.name}: ${relationshipType} (${(strength * 100).toFixed(0)}%)\n`;
      });
    });
    dynamics += '\n';
    
    // Analyze goal alignment
    dynamics += '**Goal Alignment:**\n';
    const allGoals = new Map<string, number>(); // goal -> count
    situation.goals.forEach(goals => {
      goals.forEach(goal => {
        allGoals.set(goal, (allGoals.get(goal) || 0) + 1);
      });
    });
    
    allGoals.forEach((count, goal) => {
      const alignment = count / situation.agents.length;
      dynamics += `- "${goal}": ${(alignment * 100).toFixed(0)}% alignment\n`;
    });
    dynamics += '\n';
    
    // Generate predictions
    const predictions = this.generatePredictions(situation);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(situation, predictions);
    
    return { dynamics, predictions, recommendations };
  }
  
  private generatePredictions(situation: SocialSituation): string[] {
    const predictions: string[] = [];
    
    // Predict based on power dynamics
    const powerLevels = Array.from(situation.powerDynamics.entries())
      .sort((a, b) => b[1] - a[1]);
    
    if (powerLevels.length > 0) {
      const mostPowerful = this.agentModel.getAgent(powerLevels[0][0]);
      if (mostPowerful) {
        predictions.push(`${mostPowerful.name} will likely dominate decision-making`);
      }
    }
    
    // Predict based on goal alignment
    const allGoals = new Map<string, number>();
    situation.goals.forEach(goals => {
      goals.forEach(goal => {
        allGoals.set(goal, (allGoals.get(goal) || 0) + 1);
      });
    });
    
    const sharedGoals = Array.from(allGoals.entries())
      .filter(([_, count]) => count === situation.agents.length);
    
    if (sharedGoals.length > 0) {
      predictions.push('High cooperation expected due to shared goals');
    } else {
      predictions.push('Potential conflict due to misaligned goals');
    }
    
    // Predict based on relationships
    let totalRelationshipStrength = 0;
    let relationshipCount = 0;
    
    situation.relationships.forEach(relationships => {
      relationships.forEach(strength => {
        totalRelationshipStrength += strength;
        relationshipCount++;
      });
    });
    
    const avgRelationship = relationshipCount > 0 ? totalRelationshipStrength / relationshipCount : 0;
    
    if (avgRelationship > 0.7) {
      predictions.push('Strong relationships suggest effective collaboration');
    } else if (avgRelationship < 0.3) {
      predictions.push('Weak relationships may lead to communication breakdown');
    }
    
    return predictions;
  }
  
  private generateRecommendations(situation: SocialSituation, predictions: string[]): string[] {
    const recommendations: string[] = [];
    
    // Recommend based on predictions
    if (predictions.some(p => p.includes('dominate'))) {
      recommendations.push('Ensure all voices are heard in decision-making');
    }
    
    if (predictions.some(p => p.includes('conflict'))) {
      recommendations.push('Facilitate dialogue to align goals');
      recommendations.push('Identify common ground between parties');
    }
    
    if (predictions.some(p => p.includes('cooperation'))) {
      recommendations.push('Leverage shared goals for collaborative action');
    }
    
    if (predictions.some(p => p.includes('communication breakdown'))) {
      recommendations.push('Establish clear communication channels');
      recommendations.push('Build trust through transparent interactions');
    }
    
    // General recommendations
    recommendations.push('Monitor power dynamics to prevent imbalance');
    recommendations.push('Foster positive relationships among all parties');
    
    return recommendations;
  }
}

// ============================================
// Enhanced Theory of Mind Integration
// ============================================

export class EnhancedTheoryOfMind {
  private agentModel: SophisticatedAgentModel;
  private beliefModeler: RecursiveBeliefModeler;
  private socialAnalyzer: SocialDynamicsAnalyzer;
  
  constructor() {
    this.agentModel = new SophisticatedAgentModel();
    this.beliefModeler = new RecursiveBeliefModeler(this.agentModel);
    this.socialAnalyzer = new SocialDynamicsAnalyzer(this.agentModel);
  }
  
  createAgent(id: string, name: string, personality?: Partial<Agent['personality']>): void {
    this.agentModel.createAgent(id, name, personality);
  }
  
  addBelief(agentId: string, proposition: string, confidence: number, source?: Belief['source']): void {
    this.agentModel.addBelief(agentId, proposition, confidence, source);
  }
  
  addDesire(agentId: string, goal: string, priority: number, urgency?: number): void {
    this.agentModel.addDesire(agentId, goal, priority, urgency);
  }
  
  simulateDecision(agentId: string, situation: string): string {
    const result = this.agentModel.simulateDecision(agentId, situation);
    return result.reasoning;
  }
  
  modelRecursiveBeliefs(agent1Id: string, agent2Id: string, proposition: string, maxDepth?: number): string {
    const result = this.beliefModeler.modelRecursiveBeliefs(agent1Id, agent2Id, proposition, maxDepth);
    return result.analysis;
  }
  
  detectFalseBeliefs(agentId: string, reality: Map<string, boolean>): string {
    const result = this.beliefModeler.detectFalseBeliefs(agentId, reality);
    return result.analysis;
  }
  
  analyzeSocialSituation(situation: SocialSituation): string {
    const result = this.socialAnalyzer.analyzeSocialSituation(situation);
    
    let analysis = result.dynamics;
    analysis += '\n**Predictions:**\n';
    result.predictions.forEach(pred => {
      analysis += `- ${pred}\n`;
    });
    analysis += '\n**Recommendations:**\n';
    result.recommendations.forEach(rec => {
      analysis += `- ${rec}\n`;
    });
    
    return analysis;
  }
  
  getAgentModel(): SophisticatedAgentModel {
    return this.agentModel;
  }
}
