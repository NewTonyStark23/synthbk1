// Synthetic Neural Network - Pure TypeScript Implementation
// No external dependencies, runs anywhere, learns from experience

// ============================================
// Core Neural Network Components
// ============================================

export interface Neuron {
  weights: number[];
  bias: number;
  activation: number;
}

export interface Layer {
  neurons: Neuron[];
  size: number;
}

export interface TrainingExample {
  input: number[];
  target: number[];
}

export class SyntheticNeuralNetwork {
  private layers: Layer[] = [];
  private learningRate: number;
  private activationFunction: (x: number) => number;
  private activationDerivative: (x: number) => number;

  constructor(
    layerSizes: number[],
    learningRate: number = 0.01,
    activation: 'sigmoid' | 'relu' | 'tanh' = 'sigmoid'
  ) {
    this.learningRate = learningRate;
    
    // Set activation function
    switch (activation) {
      case 'sigmoid':
        this.activationFunction = (x) => 1 / (1 + Math.exp(-x));
        this.activationDerivative = (x) => {
          const s = this.activationFunction(x);
          return s * (1 - s);
        };
        break;
      case 'relu':
        this.activationFunction = (x) => Math.max(0, x);
        this.activationDerivative = (x) => x > 0 ? 1 : 0;
        break;
      case 'tanh':
        this.activationFunction = (x) => Math.tanh(x);
        this.activationDerivative = (x) => 1 - Math.tanh(x) ** 2;
        break;
    }

    // Initialize layers with random weights
    for (let i = 0; i < layerSizes.length - 1; i++) {
      const layer: Layer = {
        neurons: [],
        size: layerSizes[i + 1]
      };

      for (let j = 0; j < layerSizes[i + 1]; j++) {
        const neuron: Neuron = {
          weights: Array(layerSizes[i]).fill(0).map(() => (Math.random() - 0.5) * 2),
          bias: Math.random() - 0.5,
          activation: 0
        };
        layer.neurons.push(neuron);
      }

      this.layers.push(layer);
    }
  }

  // Forward pass
  forward(input: number[]): number[] {
    let current = input;

    for (const layer of this.layers) {
      const next: number[] = [];

      for (const neuron of layer.neurons) {
        let sum = neuron.bias;
        for (let i = 0; i < current.length; i++) {
          sum += current[i] * neuron.weights[i];
        }
        neuron.activation = this.activationFunction(sum);
        next.push(neuron.activation);
      }

      current = next;
    }

    return current;
  }

  // Backward pass (training)
  backward(input: number[], target: number[]): number {
    // Forward pass first
    const output = this.forward(input);

    // Calculate error
    let totalError = 0;
    const outputErrors: number[] = [];
    
    for (let i = 0; i < output.length; i++) {
      const error = target[i] - output[i];
      outputErrors.push(error);
      totalError += error * error;
    }

    // Backpropagate errors
    let currentErrors = outputErrors;

    for (let l = this.layers.length - 1; l >= 0; l--) {
      const layer = this.layers[l];
      const prevLayer = l > 0 ? this.layers[l - 1] : null;
      const prevActivations = prevLayer 
        ? prevLayer.neurons.map(n => n.activation)
        : input;

      const nextErrors: number[] = new Array(prevActivations.length).fill(0);

      for (let i = 0; i < layer.neurons.length; i++) {
        const neuron = layer.neurons[i];
        const error = currentErrors[i];
        const derivative = this.activationDerivative(neuron.activation);
        const delta = error * derivative;

        // Update weights
        for (let j = 0; j < prevActivations.length; j++) {
          neuron.weights[j] += this.learningRate * delta * prevActivations[j];
          nextErrors[j] += delta * neuron.weights[j];
        }

        // Update bias
        neuron.bias += this.learningRate * delta;
      }

      currentErrors = nextErrors;
    }

    return totalError / output.length;
  }

  // Train on dataset
  train(data: TrainingExample[], epochs: number = 100): number[] {
    const errors: number[] = [];

    for (let epoch = 0; epoch < epochs; epoch++) {
      let epochError = 0;

      // Shuffle data
      const shuffled = [...data].sort(() => Math.random() - 0.5);

      for (const example of shuffled) {
        epochError += this.backward(example.input, example.target);
      }

      errors.push(epochError / data.length);
    }

    return errors;
  }

  // Predict
  predict(input: number[]): number[] {
    return this.forward(input);
  }

  // Save network state
  save(): string {
    return JSON.stringify({
      layers: this.layers,
      learningRate: this.learningRate
    });
  }

  // Load network state
  load(state: string): void {
    const data = JSON.parse(state);
    this.layers = data.layers;
    this.learningRate = data.learningRate;
  }

  // Get network info
  getInfo(): { layers: number[]; totalNeurons: number; totalWeights: number } {
    const layerSizes = [
      this.layers[0].neurons[0].weights.length,
      ...this.layers.map(l => l.size)
    ];

    let totalNeurons = 0;
    let totalWeights = 0;

    for (const layer of this.layers) {
      totalNeurons += layer.neurons.length;
      for (const neuron of layer.neurons) {
        totalWeights += neuron.weights.length + 1; // +1 for bias
      }
    }

    return { layers: layerSizes, totalNeurons, totalWeights };
  }
}

// ============================================
// Synthetic Tokenizer
// ============================================

export class SyntheticTokenizer {
  private vocabulary: Map<string, number> = new Map();
  private reverseVocab: Map<number, string> = new Map();
  private embeddingSize: number;

  constructor(embeddingSize: number = 128) {
    this.embeddingSize = embeddingSize;
  }

  // Build vocabulary from text
  buildVocabulary(texts: string[]): void {
    const wordCounts = new Map<string, number>();

    for (const text of texts) {
      const words = this.tokenize(text);
      for (const word of words) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    }

    // Keep top words (by frequency)
    const sorted = Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10000); // Top 10k words

    for (const [word, _] of sorted) {
      const index = this.vocabulary.size;
      this.vocabulary.set(word, index);
      this.reverseVocab.set(index, word);
    }
  }

  // Tokenize text into words
  tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0);
  }

  // Convert text to token IDs
  encode(text: string): number[] {
    const words = this.tokenize(text);
    return words.map(w => this.vocabulary.get(w) || 0); // 0 = unknown
  }

  // Convert token IDs back to text
  decode(tokens: number[]): string {
    return tokens
      .map(t => this.reverseVocab.get(t) || '[UNK]')
      .join(' ');
  }

  // Convert text to embedding vector
  embed(text: string): number[] {
    const tokens = this.encode(text);
    const embedding = new Array(this.embeddingSize).fill(0);

    // Simple bag-of-words embedding
    for (const token of tokens) {
      // Use token as seed for deterministic random vector
      const seed = token * 1000;
      for (let i = 0; i < this.embeddingSize; i++) {
        embedding[i] += Math.sin(seed + i) * 0.1;
      }
    }

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= magnitude;
      }
    }

    return embedding;
  }

  getVocabularySize(): number {
    return this.vocabulary.size;
  }
}

// ============================================
// Synthetic Training Data Pipeline
// ============================================

export interface ConversationPair {
  input: string;
  output: string;
  category: string;
}

export class SyntheticDataPipeline {
  private conversations: ConversationPair[] = [];
  private tokenizer: SyntheticTokenizer;

  constructor() {
    this.tokenizer = new SyntheticTokenizer();
  }

  // Add conversation to training data
  addConversation(input: string, output: string, category: string): void {
    this.conversations.push({ input, output, category });
  }

  // Load conversations from storage
  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('synth_training_data');
      if (stored) {
        this.conversations = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load training data:', e);
    }
  }

  // Save conversations to storage
  saveToStorage(): void {
    try {
      localStorage.setItem('synth_training_data', JSON.stringify(this.conversations));
    } catch (e) {
      console.warn('Failed to save training data:', e);
    }
  }

  // Prepare training examples
  prepareTrainingData(): TrainingExample[] {
    // Build vocabulary
    const allTexts = this.conversations.flatMap(c => [c.input, c.output]);
    this.tokenizer.buildVocabulary(allTexts);

    // Convert to training examples
    const examples: TrainingExample[] = [];

    for (const conv of this.conversations) {
      const inputEmbedding = this.tokenizer.embed(conv.input);
      const outputEmbedding = this.tokenizer.embed(conv.output);

      examples.push({
        input: inputEmbedding,
        target: outputEmbedding
      });
    }

    return examples;
  }

  // Get statistics
  getStats(): { totalConversations: number; vocabularySize: number; avgLength: number } {
    const avgLength = this.conversations.reduce((sum, c) => sum + c.input.length + c.output.length, 0) / this.conversations.length;
    
    return {
      totalConversations: this.conversations.length,
      vocabularySize: this.tokenizer.getVocabularySize(),
      avgLength
    };
  }

  getTokenizer(): SyntheticTokenizer {
    return this.tokenizer;
  }
}

// ============================================
// Synthetic Learning System
// ============================================

export class SyntheticLearningSystem {
  private network: SyntheticNeuralNetwork;
  private dataPipeline: SyntheticDataPipeline;
  private isTrained: boolean = false;
  private trainingHistory: number[] = [];

  constructor() {
    // Create neural network: input(128) -> hidden(256) -> hidden(128) -> output(128)
    this.network = new SyntheticNeuralNetwork([128, 256, 128, 128], 0.01, 'sigmoid');
    this.dataPipeline = new SyntheticDataPipeline();
    
    // Load existing training data
    this.dataPipeline.loadFromStorage();
  }

  // Train on current data
  train(epochs: number = 50): { finalError: number; improvements: number } {
    const trainingData = this.dataPipeline.prepareTrainingData();
    
    if (trainingData.length === 0) {
      return { finalError: 0, improvements: 0 };
    }

    console.log(`Training on ${trainingData.length} examples for ${epochs} epochs...`);
    
    const errors = this.network.train(trainingData, epochs);
    this.trainingHistory.push(...errors);
    this.isTrained = true;

    const finalError = errors[errors.length - 1];
    const improvements = errors.filter((e, i) => i > 0 && e < errors[i - 1]).length;

    console.log(`Training complete. Final error: ${finalError.toFixed(4)}, Improvements: ${improvements}`);

    // Save network state
    this.saveNetwork();

    return { finalError, improvements };
  }

  // Learn from new conversation
  learnFromConversation(input: string, output: string, category: string): void {
    this.dataPipeline.addConversation(input, output, category);
    this.dataPipeline.saveToStorage();
    
    // Retrain periodically (every 10 conversations)
    const stats = this.dataPipeline.getStats();
    if (stats.totalConversations % 10 === 0) {
      this.train(20);
    }
  }

  // Generate response
  generate(input: string): string {
    if (!this.isTrained) {
      // Fall back to rule-based system
      return '';
    }

    const inputEmbedding = this.dataPipeline.getTokenizer().embed(input);
    const outputEmbedding = this.network.predict(inputEmbedding);
    
    // Convert embedding back to text (simplified)
    // In production, would use proper decoding
    const tokenizer = this.dataPipeline.getTokenizer();
    const tokens = this.embeddingToTokens(outputEmbedding, tokenizer);
    
    return tokenizer.decode(tokens);
  }

  // Simple embedding to tokens conversion
  private embeddingToTokens(embedding: number[], tokenizer: SyntheticTokenizer): number[] {
    // Find closest vocabulary words
    const tokens: number[] = [];
    
    for (let i = 0; i < Math.min(10, embedding.length); i++) {
      if (embedding[i] > 0.1) {
        tokens.push(i % tokenizer.getVocabularySize());
      }
    }
    
    return tokens;
  }

  // Save network to storage
  private saveNetwork(): void {
    try {
      localStorage.setItem('synth_network', this.network.save());
    } catch (e) {
      console.warn('Failed to save network:', e);
    }
  }

  // Load network from storage
  loadNetwork(): boolean {
    try {
      const state = localStorage.getItem('synth_network');
      if (state) {
        this.network.load(state);
        this.isTrained = true;
        return true;
      }
    } catch (e) {
      console.warn('Failed to load network:', e);
    }
    return false;
  }

  // Get training stats
  getStats(): {
    isTrained: boolean;
    totalExamples: number;
    vocabularySize: number;
    networkInfo: any;
    trainingHistory: number[];
  } {
    const dataStats = this.dataPipeline.getStats();
    
    return {
      isTrained: this.isTrained,
      totalExamples: dataStats.totalConversations,
      vocabularySize: dataStats.vocabularySize,
      networkInfo: this.network.getInfo(),
      trainingHistory: this.trainingHistory.slice(-10) // Last 10 epochs
    };
  }
}

// ============================================
// Export
// ============================================

export const SyntheticML = {
  SyntheticNeuralNetwork,
  SyntheticTokenizer,
  SyntheticDataPipeline,
  SyntheticLearningSystem
};
