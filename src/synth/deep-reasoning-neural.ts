// Deep Reasoning - Neural-Inspired Hybrid Architecture
// Implements hierarchical abstraction, analogical mapping, causal reasoning
// Uses activation spreading instead of literal neurons for efficiency

// ============================================
// Core Neural-Inspired Infrastructure
// ============================================

interface SyntheticNeuron {
  id: string;
  activation: number;
  connections: Array<{ target: string; weight: number }>;
}

interface SynapticNetwork {
  neurons: Map<string, SyntheticNeuron>;
  
  addNeuron(id: string, connections?: Array<{ target: string; weight: number }>): void;
  activate(neuronId: string, strength: number): void;
  propagate(): void;
  getActivation(neuronId: string): number;
  reset(): void;
  getTopActivated(count?: number): Array<{ id: string; activation: number }>;
}

class SynapticNetworkImpl implements SynapticNetwork {
  neurons: Map<string, SyntheticNeuron> = new Map();
  
  addNeuron(id: string, connections: Array<{ target: string; weight: number }> = []): void {
    this.neurons.set(id, { id, activation: 0, connections });
  }
  
  activate(neuronId: string, strength: number): void {
    const neuron = this.neurons.get(neuronId);
    if (neuron) {
      neuron.activation = Math.min(1, neuron.activation + strength);
    }
  }
  
  propagate(): void {
    const newActivations = new Map<string, number>();
    
    // Spread activation to connected neurons
    this.neurons.forEach((neuron, id) => {
      if (neuron.activation > 0.1) {
        neuron.connections.forEach(conn => {
          const target = this.neurons.get(conn.target);
          if (target) {
            const current = newActivations.get(conn.target) || 0;
            const spread = neuron.activation * conn.weight;
            newActivations.set(conn.target, Math.min(1, current + spread));
          }
        });
      }
    });
    
    // Apply new activations
    newActivations.forEach((activation, id) => {
      const neuron = this.neurons.get(id);
      if (neuron) {
        neuron.activation = activation;
      }
    });
  }
  
  getActivation(neuronId: string): number {
    return this.neurons.get(neuronId)?.activation || 0;
  }
  
  reset(): void {
    this.neurons.forEach(neuron => neuron.activation = 0);
  }
  
  getTopActivated(count: number = 5): Array<{ id: string; activation: number }> {
    return Array.from(this.neurons.entries())
      .map(([id, neuron]) => ({ id, activation: neuron.activation }))
      .sort((a, b) => b.activation - a.activation)
      .slice(0, count);
  }
}

// ============================================
// Abstraction Hierarchy Network
// ============================================

interface AbstractionLayer {
  name: string;
  network: SynapticNetwork;
  level: number;  // 0=concrete, 1=pattern, 2=principle, 3=meta
}

class AbstractionHierarchy {
  layers: AbstractionLayer[] = [];
  
  constructor() {
    // Create 4-layer hierarchy like fly brain
    this.layers = [
      { name: 'concrete', network: new SynapticNetworkImpl(), level: 0 },
      { name: 'pattern', network: new SynapticNetworkImpl(), level: 1 },
      { name: 'principle', network: new SynapticNetworkImpl(), level: 2 },
      { name: 'meta', network: new SynapticNetworkImpl(), level: 3 }
    ];
    
    this.initializeLayers();
  }
  
  private initializeLayers(): void {
    // Concrete layer: specific facts and observations
    const concrete = this.layers[0].network;
    concrete.addNeuron('ball_red', [{ target: 'red_things_roll', weight: 0.8 }]);
    concrete.addNeuron('ball_round', [{ target: 'round_things_roll', weight: 0.8 }]);
    concrete.addNeuron('ball_bouncy', [{ target: 'elastic_objects', weight: 0.7 }]);
    
    // Pattern layer: generalizations from concrete
    const pattern = this.layers[1].network;
    pattern.addNeuron('red_things_roll', [{ target: 'color_irrelevant_to_motion', weight: 0.6 }]);
    pattern.addNeuron('round_things_roll', [{ target: 'shape_determines_motion', weight: 0.9 }]);
    pattern.addNeuron('elastic_objects', [{ target: 'material_properties', weight: 0.7 }]);
    
    // Principle layer: abstract principles
    const principle = this.layers[2].network;
    principle.addNeuron('shape_determines_motion', [{ target: 'geometry_physics_relationship', weight: 0.9 }]);
    principle.addNeuron('material_properties', [{ target: 'physical_laws', weight: 0.8 }]);
    principle.addNeuron('color_irrelevant_to_motion', [{ target: 'distinguish_relevant_features', weight: 0.9 }]);
    
    // Meta layer: meta-principles
    const meta = this.layers[3].network;
    meta.addNeuron('geometry_physics_relationship', [{ target: 'mathematical_modeling', weight: 0.9 }]);
    meta.addNeuron('physical_laws', [{ target: 'scientific_method', weight: 0.9 }]);
    meta.addNeuron('distinguish_relevant_features', [{ target: 'abstraction_skill', weight: 0.9 }]);
  }
  
  // Feedforward: concrete → abstract
  activateUpward(concreteInput: string): void {
    // Activate concrete layer
    this.layers[0].network.activate(concreteInput, 1.0);
    
    // Propagate through layers
    for (let i = 0; i < this.layers.length - 1; i++) {
      this.layers[i].network.propagate();
      
      // Transfer activation to next layer
      const currentLayer = this.layers[i].network;
      const nextLayer = this.layers[i + 1].network;
      
      currentLayer.neurons.forEach((neuron, id) => {
        if (neuron.activation > 0.3) {
          // Find matching neurons in next layer
          neuron.connections.forEach(conn => {
            nextLayer.activate(conn.target, neuron.activation * conn.weight);
          });
        }
      });
    }
  }
  
  // Feedback: abstract → concrete
  activateDownward(abstractInput: string): void {
    // Activate meta layer
    this.layers[3].network.activate(abstractInput, 1.0);
    
    // Propagate down through layers
    for (let i = this.layers.length - 1; i > 0; i--) {
      this.layers[i].network.propagate();
      
      // Transfer activation to previous layer
      const currentLayer = this.layers[i].network;
      const prevLayer = this.layers[i - 1].network;
      
      // Reverse connections for feedback
      currentLayer.neurons.forEach((neuron, id) => {
        if (neuron.activation > 0.3) {
          prevLayer.neurons.forEach((prevNeuron, prevId) => {
            // Check if there's a connection
            const hasConnection = prevNeuron.connections.some(c => c.target === id);
            if (hasConnection) {
              prevLayer.activate(prevId, neuron.activation * 0.7);
            }
          });
        }
      });
    }
  }
  
  getAbstractionLevel(): string {
    const topActivated = this.layers[3].network.getTopActivated(1);
    if (topActivated.length > 0 && topActivated[0].activation > 0.5) {
      return 'meta-principle';
    }
    
    const principleActivated = this.layers[2].network.getTopActivated(1);
    if (principleActivated.length > 0 && principleActivated[0].activation > 0.5) {
      return 'principle';
    }
    
    const patternActivated = this.layers[1].network.getTopActivated(1);
    if (patternActivated.length > 0 && patternActivated[0].activation > 0.5) {
      return 'pattern';
    }
    
    return 'concrete';
  }
  
  getInsight(): string {
    const level = this.getAbstractionLevel();
    const topNeurons = this.layers[3].network.getTopActivated(3);
    
    if (topNeurons.length === 0) {
      return 'No deep insight generated';
    }
    
    const insights = topNeurons.map((n: { id: string; activation: number }) => n.id.replace(/_/g, ' '));
    return `Deep insight at ${level} level: ${insights.join(', ')}`;
  }
  
  reset(): void {
    this.layers.forEach(layer => layer.network.reset());
  }
}

// ============================================
// Analogical Mapping Engine
// ============================================

interface StructuralMapping {
  source: string;
  target: string;
  relation: string;
  confidence: number;
}

class AnalogicalMapper {
  private mappings: Map<string, StructuralMapping[]> = new Map();
  private network: SynapticNetwork;
  
  constructor() {
    this.network = new SynapticNetworkImpl();
    this.initializeMappings();
  }
  
  private initializeMappings(): void {
    // Heart → Pump analogy
    this.addMapping('heart', 'pump', 'circulates_fluid', 0.9);
    this.addMapping('blood_vessels', 'pipes', 'transport_fluid', 0.8);
    this.addMapping('heart_valves', 'pump_valves', 'prevent_backflow', 0.85);
    
    // Brain → Computer analogy
    this.addMapping('brain', 'computer', 'processes_information', 0.7);
    this.addMapping('neurons', 'transistors', 'basic_processing_unit', 0.6);
    this.addMapping('synapses', 'connections', 'information_transfer', 0.7);
    
    // Evolution → Algorithm analogy
    this.addMapping('evolution', 'genetic_algorithm', 'optimization_process', 0.8);
    this.addMapping('natural_selection', 'fitness_function', 'selection_criteria', 0.85);
    this.addMapping('mutation', 'random_variation', 'exploration_mechanism', 0.75);
    
    // Build network for activation spreading
    this.network.addNeuron('heart', [{ target: 'pump', weight: 0.9 }]);
    this.network.addNeuron('pump', [{ target: 'heart', weight: 0.9 }]);
    this.network.addNeuron('brain', [{ target: 'computer', weight: 0.7 }]);
    this.network.addNeuron('computer', [{ target: 'brain', weight: 0.7 }]);
  }
  
  private addMapping(source: string, target: string, relation: string, confidence: number): void {
    if (!this.mappings.has(source)) {
      this.mappings.set(source, []);
    }
    this.mappings.get(source)!.push({ source, target, relation, confidence });
  }
  
  findAnalogy(sourceConcept: string): StructuralMapping | null {
    const mappings = this.mappings.get(sourceConcept);
    if (!mappings || mappings.length === 0) return null;
    
    // Return highest confidence mapping
    return mappings.sort((a, b) => b.confidence - a.confidence)[0];
  }
  
  transferKnowledge(source: string, target: string, sourceKnowledge: string): string {
    const mapping = this.findAnalogy(source);
    if (!mapping || mapping.target !== target) {
      return `No strong analogy found between ${source} and ${target}`;
    }
    
    // Transfer knowledge through structural mapping
    return `Through the analogy "${source} is like ${target}" (${mapping.relation}):\n${sourceKnowledge}\n→ Applies to ${target} as well`;
  }
  
  generateInsight(source: string, target: string): string {
    const mapping = this.findAnalogy(source);
    if (!mapping) {
      return `No analogy found for ${source}`;
    }
    
    return `**Analogical Insight:**\n\n${source} is like ${target} because both ${mapping.relation.replace(/_/g, ' ')}.\n\nThis analogy helps us understand ${source} by mapping it to the more familiar ${target}.`;
  }
}

// ============================================
// Causal Reasoning Network
// ============================================

interface CausalLink {
  cause: string;
  effect: string;
  strength: number;
  delay: number;  // temporal delay
}

class CausalReasoningNetwork {
  private network: SynapticNetwork;
  private causalLinks: CausalLink[] = [];
  
  constructor() {
    this.network = new SynapticNetworkImpl();
    this.initializeCausalChains();
  }
  
  private initializeCausalChains(): void {
    // Rain → Wet ground
    this.addCausalLink('rain', 'wet_ground', 0.9, 0);
    this.addCausalLink('wet_ground', 'slippery_surface', 0.8, 1);
    this.addCausalLink('slippery_surface', 'accidents', 0.7, 2);
    
    // Study → Knowledge
    this.addCausalLink('study', 'knowledge', 0.9, 0);
    this.addCausalLink('knowledge', 'better_grades', 0.8, 1);
    this.addCausalLink('better_grades', 'career_opportunities', 0.7, 2);
    
    // Exercise → Health
    this.addCausalLink('exercise', 'fitness', 0.9, 0);
    this.addCausalLink('fitness', 'health', 0.85, 1);
    this.addCausalLink('health', 'longevity', 0.75, 2);
    
    // Build network
    this.causalLinks.forEach(link => {
      this.network.addNeuron(link.cause, [{ target: link.effect, weight: link.strength }]);
    });
  }
  
  private addCausalLink(cause: string, effect: string, strength: number, delay: number): void {
    this.causalLinks.push({ cause, effect, strength, delay });
  }
  
  traceCausalChain(initialCause: string): Array<{ event: string; confidence: number; delay: number }> {
    const chain: Array<{ event: string; confidence: number; delay: number }> = [];
    
    // Activate initial cause
    this.network.activate(initialCause, 1.0);
    
    // Propagate through causal network
    let currentConfidence = 1.0;
    let currentDelay = 0;
    let currentEvent = initialCause;
    
    chain.push({ event: currentEvent, confidence: currentConfidence, delay: currentDelay });
    
    // Follow causal links
    for (let i = 0; i < 5; i++) {  // Max chain length
      const nextLinks = this.causalLinks.filter(link => link.cause === currentEvent);
      if (nextLinks.length === 0) break;
      
      // Take strongest link
      const nextLink = nextLinks.sort((a, b) => b.strength - a.strength)[0];
      
      currentConfidence *= nextLink.strength;
      currentDelay += nextLink.delay;
      currentEvent = nextLink.effect;
      
      chain.push({ event: currentEvent, confidence: currentConfidence, delay: currentDelay });
      
      if (currentConfidence < 0.3) break;  // Stop if confidence too low
    }
    
    return chain;
  }
  
  predictConsequences(action: string): string {
    const chain = this.traceCausalChain(action);
    
    if (chain.length <= 1) {
      return `No causal chain found for: ${action}`;
    }
    
    let prediction = `**Causal Chain from "${action}":**\n\n`;
    
    chain.forEach((step, i) => {
      const indent = '  '.repeat(i);
      prediction += `${indent}${i + 1}. ${step.event.replace(/_/g, ' ')} (confidence: ${(step.confidence * 100).toFixed(0)}%, delay: ${step.delay} steps)\n`;
    });
    
    return prediction;
  }
  
  explainCausation(cause: string, effect: string): string {
    const chain = this.traceCausalChain(cause);
    const effectInChain = chain.find(step => step.event === effect);
    
    if (!effectInChain) {
      return `No causal link found between ${cause} and ${effect}`;
    }
    
    return `**Causal Explanation:**\n\n${cause} leads to ${effect} through the following chain:\n${chain.map((s, i) => `${i + 1}. ${s.event.replace(/_/g, ' ')}`).join(' → ')}\n\nConfidence: ${(effectInChain.confidence * 100).toFixed(0)}%`;
  }
}

// ============================================
// Insight Generation System
// ============================================

class InsightGenerator {
  private hierarchy: AbstractionHierarchy;
  private mapper: AnalogicalMapper;
  private causal: CausalReasoningNetwork;
  
  constructor() {
    this.hierarchy = new AbstractionHierarchy();
    this.mapper = new AnalogicalMapper();
    this.causal = new CausalReasoningNetwork();
  }
  
  generateInsight(problem: string): string {
    // Reset networks
    this.hierarchy.reset();
    
    // Strategy 1: Abstraction
    this.hierarchy.activateUpward(problem);
    const abstractionInsight = this.hierarchy.getInsight();
    
    // Strategy 2: Analogy
    const keywords = problem.toLowerCase().split(/\s+/);
    let analogyInsight = '';
    for (const keyword of keywords) {
      const mapping = this.mapper.findAnalogy(keyword);
      if (mapping) {
        analogyInsight = this.mapper.generateInsight(keyword, mapping.target);
        break;
      }
    }
    
    // Strategy 3: Causal reasoning
    let causalInsight = '';
    for (const keyword of keywords) {
      const chain = this.causal.traceCausalChain(keyword);
      if (chain.length > 2) {
        causalInsight = this.causal.predictConsequences(keyword);
        break;
      }
    }
    
    // Combine insights
    let combinedInsight = `**Deep Reasoning Analysis:**\n\n`;
    combinedInsight += `**Problem:** ${problem}\n\n`;
    
    if (abstractionInsight && !abstractionInsight.includes('No deep insight')) {
      combinedInsight += `**Abstraction Insight:**\n${abstractionInsight}\n\n`;
    }
    
    if (analogyInsight) {
      combinedInsight += `**Analogical Insight:**\n${analogyInsight}\n\n`;
    }
    
    if (causalInsight) {
      combinedInsight += `**Causal Insight:**\n${causalInsight}\n\n`;
    }
    
    if (!abstractionInsight && !analogyInsight && !causalInsight) {
      combinedInsight += `No deep insights generated. The problem may require domain-specific knowledge.`;
    }
    
    return combinedInsight;
  }
  
  // Multi-perspective reasoning
  reasonFromMultiplePerspectives(problem: string, perspectives: string[]): string {
    let response = `**Multi-Perspective Deep Reasoning:**\n\n`;
    response += `**Problem:** ${problem}\n\n`;
    
    perspectives.forEach(perspective => {
      response += `**${perspective} Perspective:**\n`;
      
      // Activate hierarchy with perspective context
      this.hierarchy.reset();
      this.hierarchy.activateUpward(`${perspective}: ${problem}`);
      
      const insight = this.hierarchy.getInsight();
      response += `${insight}\n\n`;
    });
    
    // Synthesize perspectives
    response += `**Synthesis:**\n`;
    response += `By examining this problem from multiple perspectives, we gain a more comprehensive understanding. `;
    response += `Each perspective reveals different aspects of the problem, leading to deeper insight.`;
    
    return response;
  }
}

// ============================================
// Main Deep Reasoning Engine
// ============================================

export class DeepReasoningEngine {
  private insightGenerator: InsightGenerator;
  
  constructor() {
    this.insightGenerator = new InsightGenerator();
  }
  
  reason(problem: string): string {
    return this.insightGenerator.generateInsight(problem);
  }
  
  reasonWithPerspectives(problem: string, perspectives: string[] = ['analytical', 'creative', 'practical']): string {
    return this.insightGenerator.reasonFromMultiplePerspectives(problem, perspectives);
  }
  
  // Test the system
  test(): void {
    console.log('=== Testing Deep Reasoning Engine ===\n');
    
    // Test 1: Abstraction
    console.log('Test 1: Abstraction Hierarchy');
    const test1 = this.reason('A red round ball bounces on the ground');
    console.log(test1);
    console.log('\n---\n');
    
    // Test 2: Analogy
    console.log('Test 2: Analogical Reasoning');
    const test2 = this.reason('How is the heart like a pump?');
    console.log(test2);
    console.log('\n---\n');
    
    // Test 3: Causal reasoning
    console.log('Test 3: Causal Reasoning');
    const test3 = this.reason('What happens if it rains?');
    console.log(test3);
    console.log('\n---\n');
    
    // Test 4: Multi-perspective
    console.log('Test 4: Multi-Perspective Reasoning');
    const test4 = this.reasonWithPerspectives(
      'Should we invest in renewable energy?',
      ['economic', 'environmental', 'social']
    );
    console.log(test4);
  }
}

// Export for use
export const deepReasoning = new DeepReasoningEngine();
