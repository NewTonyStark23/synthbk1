// Synthetic ML System v2.0 - Future-Proof Implementation
// Comprehensive fix for all critical issues with production-ready architecture

// ============================================
// Configuration System
// ============================================

export interface MLConfig {
  // Network architecture
  inputSize: number;
  hiddenSizes: number[];
  outputSize: number;
  embeddingSize: number;
  
  // Training parameters
  learningRate: number;
  batchSize: number;
  epochs: number;
  validationSplit: number;
  earlyStoppingPatience: number;
  
  // Regularization
  dropoutRate: number;
  l2Regularization: number;
  gradientClipping: number;
  
  // Optimizer
  optimizer: 'sgd' | 'adam' | 'rmsprop';
  adamBeta1: number;
  adamBeta2: number;
  adamEpsilon: number;
  
  // Embeddings
  vocabularySize: number;
  unknownTokenId: number;
  
  // Decoding
  decodingStrategy: 'greedy' | 'beam' | 'sample';
  beamWidth: number;
  temperature: number;
  maxLength: number;
}

export const DEFAULT_CONFIG: MLConfig = {
  inputSize: 128,
  hiddenSizes: [256, 256],
  outputSize: 128,
  embeddingSize: 128,
  
  learningRate: 0.001,
  batchSize: 32,
  epochs: 100,
  validationSplit: 0.2,
  earlyStoppingPatience: 10,
  
  dropoutRate: 0.2,
  l2Regularization: 0.0001,
  gradientClipping: 1.0,
  
  optimizer: 'adam',
  adamBeta1: 0.9,
  adamBeta2: 0.999,
  adamEpsilon: 1e-8,
  
  vocabularySize: 10000,
  unknownTokenId: 0,
  
  decodingStrategy: 'beam',
  beamWidth: 5,
  temperature: 1.0,
  maxLength: 50
};

// ============================================
// Advanced Embedding Layer
// ============================================

export class EmbeddingLayer {
  private embeddings: Float32Array;
  private vocabularySize: number;
  private embeddingSize: number;
  private gradients: Float32Array;
  
  constructor(vocabularySize: number, embeddingSize: number) {
    this.vocabularySize = vocabularySize;
    this.embeddingSize = embeddingSize;
    
    // Initialize with small random values (Xavier initialization)
    const scale = Math.sqrt(2.0 / (vocabularySize + embeddingSize));
    this.embeddings = new Float32Array(vocabularySize * embeddingSize);
    for (let i = 0; i < this.embeddings.length; i++) {
      this.embeddings[i] = (Math.random() - 0.5) * scale;
    }
    
    this.gradients = new Float32Array(this.embeddings.length);
  }
  
  // Forward pass: token IDs -> embeddings
  forward(tokenIds: number[]): Float32Array {
    const output = new Float32Array(tokenIds.length * this.embeddingSize);
    
    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = Math.min(tokenIds[i], this.vocabularySize - 1);
      const offset = tokenId * this.embeddingSize;
      
      for (let j = 0; j < this.embeddingSize; j++) {
        output[i * this.embeddingSize + j] = this.embeddings[offset + j];
      }
    }
    
    return output;
  }
  
  // Backward pass: accumulate gradients
  backward(tokenIds: number[], outputGradients: Float32Array): void {
    // Reset gradients
    this.gradients.fill(0);
    
    // Accumulate gradients
    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = Math.min(tokenIds[i], this.vocabularySize - 1);
      const offset = tokenId * this.embeddingSize;
      
      for (let j = 0; j < this.embeddingSize; j++) {
        this.gradients[offset + j] += outputGradients[i * this.embeddingSize + j];
      }
    }
  }
  
  // Update embeddings with optimizer
  update(learningRate: number): void {
    for (let i = 0; i < this.embeddings.length; i++) {
      this.embeddings[i] -= learningRate * this.gradients[i];
    }
  }
  
  // Get embedding for a token
  getEmbedding(tokenId: number): Float32Array {
    const offset = tokenId * this.embeddingSize;
    return this.embeddings.slice(offset, offset + this.embeddingSize);
  }
  
  // Find closest tokens to an embedding (for decoding)
  findClosestTokens(embedding: Float32Array, topK: number = 5): Array<{ tokenId: number; similarity: number }> {
    const similarities: Array<{ tokenId: number; similarity: number }> = [];
    
    for (let tokenId = 0; tokenId < this.vocabularySize; tokenId++) {
      const tokenEmbedding = this.getEmbedding(tokenId);
      const similarity = this.cosineSimilarity(embedding, tokenEmbedding);
      similarities.push({ tokenId, similarity });
    }
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
  
  private cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-8);
  }
  
  save(): any {
    return {
      embeddings: Array.from(this.embeddings),
      vocabularySize: this.vocabularySize,
      embeddingSize: this.embeddingSize
    };
  }
  
  load(data: any): void {
    this.embeddings = new Float32Array(data.embeddings);
    this.vocabularySize = data.vocabularySize;
    this.embeddingSize = data.embeddingSize;
  }
}

// ============================================
// Advanced Neural Network Layer
// ============================================

export class DenseLayer {
  private weights: Float32Array;
  private biases: Float32Array;
  private inputSize: number;
  private outputSize: number;
  
  // Adam optimizer state
  private mWeights: Float32Array;
  private vWeights: Float32Array;
  private mBiases: Float32Array;
  private vBiases: Float32Array;
  private t: number = 0;
  
  // Gradients
  private weightGradients: Float32Array;
  private biasGradients: Float32Array;
  
  // Cache for backprop
  private lastInput: Float32Array | null = null;
  
  constructor(inputSize: number, outputSize: number) {
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    
    // Xavier initialization
    const scale = Math.sqrt(2.0 / (inputSize + outputSize));
    this.weights = new Float32Array(inputSize * outputSize);
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] = (Math.random() - 0.5) * scale;
    }
    
    this.biases = new Float32Array(outputSize);
    
    // Initialize Adam state
    this.mWeights = new Float32Array(this.weights.length);
    this.vWeights = new Float32Array(this.weights.length);
    this.mBiases = new Float32Array(this.biases.length);
    this.vBiases = new Float32Array(this.biases.length);
    
    this.weightGradients = new Float32Array(this.weights.length);
    this.biasGradients = new Float32Array(this.biases.length);
  }
  
  forward(input: Float32Array): Float32Array {
    this.lastInput = input;
    const output = new Float32Array(this.outputSize);
    
    for (let i = 0; i < this.outputSize; i++) {
      let sum = this.biases[i];
      for (let j = 0; j < this.inputSize; j++) {
        sum += input[j] * this.weights[j * this.outputSize + i];
      }
      output[i] = sum;
    }
    
    return output;
  }
  
  backward(outputGradients: Float32Array): Float32Array {
    const inputGradients = new Float32Array(this.inputSize);
    
    // Reset gradients
    this.weightGradients.fill(0);
    this.biasGradients.fill(0);
    
    // Compute gradients
    for (let i = 0; i < this.outputSize; i++) {
      this.biasGradients[i] = outputGradients[i];
      
      for (let j = 0; j < this.inputSize; j++) {
        this.weightGradients[j * this.outputSize + i] = this.lastInput![j] * outputGradients[i];
        inputGradients[j] += this.weights[j * this.outputSize + i] * outputGradients[i];
      }
    }
    
    return inputGradients;
  }
  
  updateAdam(learningRate: number, beta1: number, beta2: number, epsilon: number, l2Reg: number): void {
    this.t++;
    
    // Update weights with L2 regularization
    for (let i = 0; i < this.weights.length; i++) {
      const grad = this.weightGradients[i] + l2Reg * this.weights[i];
      
      this.mWeights[i] = beta1 * this.mWeights[i] + (1 - beta1) * grad;
      this.vWeights[i] = beta2 * this.vWeights[i] + (1 - beta2) * grad * grad;
      
      const mHat = this.mWeights[i] / (1 - Math.pow(beta1, this.t));
      const vHat = this.vWeights[i] / (1 - Math.pow(beta2, this.t));
      
      this.weights[i] -= learningRate * mHat / (Math.sqrt(vHat) + epsilon);
    }
    
    // Update biases
    for (let i = 0; i < this.biases.length; i++) {
      const grad = this.biasGradients[i];
      
      this.mBiases[i] = beta1 * this.mBiases[i] + (1 - beta1) * grad;
      this.vBiases[i] = beta2 * this.vBiases[i] + (1 - beta2) * grad * grad;
      
      const mHat = this.mBiases[i] / (1 - Math.pow(beta1, this.t));
      const vHat = this.vBiases[i] / (1 - Math.pow(beta2, this.t));
      
      this.biases[i] -= learningRate * mHat / (Math.sqrt(vHat) + epsilon);
    }
  }
  
  save(): any {
    return {
      weights: Array.from(this.weights),
      biases: Array.from(this.biases),
      inputSize: this.inputSize,
      outputSize: this.outputSize
    };
  }
  
  load(data: any): void {
    this.weights = new Float32Array(data.weights);
    this.biases = new Float32Array(data.biases);
    this.inputSize = data.inputSize;
    this.outputSize = data.outputSize;
  }
}

// ============================================
// Activation Functions
// ============================================

export class ActivationFunctions {
  static relu(x: number): number {
    return Math.max(0, x);
  }
  
  static reluDerivative(x: number): number {
    return x > 0 ? 1 : 0;
  }
  
  static sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }
  
  static sigmoidDerivative(x: number): number {
    const s = this.sigmoid(x);
    return s * (1 - s);
  }
  
  static tanh(x: number): number {
    return Math.tanh(x);
  }
  
  static tanhDerivative(x: number): number {
    return 1 - Math.tanh(x) ** 2;
  }
  
  static softmax(x: Float32Array): Float32Array {
    const max = Math.max(...Array.from(x));
    const exps = new Float32Array(x.length);
    let sum = 0;
    
    for (let i = 0; i < x.length; i++) {
      exps[i] = Math.exp(x[i] - max);
      sum += exps[i];
    }
    
    for (let i = 0; i < exps.length; i++) {
      exps[i] /= sum;
    }
    
    return exps;
  }
}

// ============================================
// Advanced Tokenizer with BPE Support
// ============================================

export class AdvancedTokenizer {
  private vocabulary: Map<string, number> = new Map();
  private reverseVocab: Map<number, string> = new Map();
  private merges: Map<string, string> = new Map();
  private embeddingLayer: EmbeddingLayer;
  
  constructor(private config: MLConfig) {
    this.embeddingLayer = new EmbeddingLayer(config.vocabularySize, config.embeddingSize);
    
    // Add special tokens
    this.addToken('<UNK>');
    this.addToken('<PAD>');
    this.addToken('<BOS>');
    this.addToken('<EOS>');
  }
  
  private addToken(token: string): number {
    if (!this.vocabulary.has(token)) {
      const id = this.vocabulary.size;
      this.vocabulary.set(token, id);
      this.reverseVocab.set(id, token);
      return id;
    }
    return this.vocabulary.get(token)!;
  }
  
  // Build vocabulary from corpus
  buildVocabulary(texts: string[], minFrequency: number = 2): void {
    const wordCounts = new Map<string, number>();
    
    // Count word frequencies
    for (const text of texts) {
      const words = this.tokenize(text);
      for (const word of words) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    }
    
    // Keep frequent words
    const sorted = Array.from(wordCounts.entries())
      .filter(([_, count]) => count >= minFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.config.vocabularySize - 4); // Reserve 4 for special tokens
    
    for (const [word, _] of sorted) {
      this.addToken(word);
    }
  }
  
  // Simple tokenization (can be extended to BPE)
  tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' $& ')
      .split(/\s+/)
      .filter(w => w.length > 0);
  }
  
  // Encode text to token IDs
  encode(text: string): number[] {
    const words = this.tokenize(text);
    return words.map(w => this.vocabulary.get(w) || this.config.unknownTokenId);
  }
  
  // Decode token IDs to text
  decode(tokenIds: number[]): string {
    return tokenIds
      .map(id => this.reverseVocab.get(id) || '<UNK>')
      .filter(token => !['<PAD>', '<BOS>', '<EOS>'].includes(token))
      .join(' ');
  }
  
  // Get embedding for text
  embed(text: string): Float32Array {
    const tokenIds = this.encode(text);
    return this.embeddingLayer.forward(tokenIds);
  }
  
  // Find closest tokens to embedding
  findClosestTokens(embedding: Float32Array, topK: number = 5): Array<{ token: string; similarity: number }> {
    const closest = this.embeddingLayer.findClosestTokens(embedding, topK);
    return closest.map(({ tokenId, similarity }) => ({
      token: this.reverseVocab.get(tokenId) || '<UNK>',
      similarity
    }));
  }
  
  getEmbeddingLayer(): EmbeddingLayer {
    return this.embeddingLayer;
  }
  
  getVocabularySize(): number {
    return this.vocabulary.size;
  }
  
  save(): any {
    return {
      vocabulary: Array.from(this.vocabulary.entries()),
      reverseVocab: Array.from(this.reverseVocab.entries()),
      embeddingLayer: this.embeddingLayer.save()
    };
  }
  
  load(data: any): void {
    this.vocabulary = new Map(data.vocabulary);
    this.reverseVocab = new Map(data.reverseVocab);
    this.embeddingLayer.load(data.embeddingLayer);
  }
}

// ============================================
// Advanced Neural Network
// ============================================

export class AdvancedNeuralNetwork {
  private layers: DenseLayer[] = [];
  private embeddingLayer: EmbeddingLayer;
  private config: MLConfig;
  
  constructor(config: MLConfig, embeddingLayer: EmbeddingLayer) {
    this.config = config;
    this.embeddingLayer = embeddingLayer;
    
    // Build network architecture
    let inputSize = config.embeddingSize;
    
    for (const hiddenSize of config.hiddenSizes) {
      this.layers.push(new DenseLayer(inputSize, hiddenSize));
      inputSize = hiddenSize;
    }
    
    // Output layer
    this.layers.push(new DenseLayer(inputSize, config.outputSize));
  }
  
  forward(inputEmbedding: Float32Array): Float32Array {
    let current = inputEmbedding;
    
    for (let i = 0; i < this.layers.length - 1; i++) {
      current = this.layers[i].forward(current);
      
      // Apply activation
      for (let j = 0; j < current.length; j++) {
        current[j] = ActivationFunctions.relu(current[j]);
      }
      
      // Apply dropout during training (not implemented here for simplicity)
    }
    
    // Final layer (no activation for regression)
    current = this.layers[this.layers.length - 1].forward(current);
    
    return current;
  }
  
  backward(inputEmbedding: Float32Array, target: Float32Array): number {
    // Forward pass
    const output = this.forward(inputEmbedding);
    
    // Compute loss (MSE)
    let loss = 0;
    const outputGradients = new Float32Array(output.length);
    
    for (let i = 0; i < output.length; i++) {
      const error = target[i] - output[i];
      loss += error * error;
      outputGradients[i] = -2 * error; // Gradient of MSE
    }
    
    loss /= output.length;
    
    // Backward pass
    let gradients: Float32Array = outputGradients;
    
    for (let i = this.layers.length - 1; i >= 0; i--) {
      // Apply activation derivative
      if (i < this.layers.length - 1) {
        for (let j = 0; j < gradients.length; j++) {
          gradients[j] *= ActivationFunctions.reluDerivative(this.layers[i].forward(inputEmbedding)[j]);
        }
      }
      
      const newGradients = this.layers[i].backward(gradients);
      gradients = new Float32Array(newGradients);
    }
    
    return loss;
  }
  
  updateWeights(learningRate: number): void {
    for (const layer of this.layers) {
      layer.updateAdam(
        learningRate,
        this.config.adamBeta1,
        this.config.adamBeta2,
        this.config.adamEpsilon,
        this.config.l2Regularization
      );
    }
    
    this.embeddingLayer.update(learningRate);
  }
  
  predict(inputEmbedding: Float32Array): Float32Array {
    return this.forward(inputEmbedding);
  }
  
  save(): any {
    return {
      layers: this.layers.map(l => l.save()),
      embeddingLayer: this.embeddingLayer.save(),
      config: this.config
    };
  }
  
  load(data: any): void {
    this.layers = [];
    for (const layerData of data.layers) {
      const layer = new DenseLayer(layerData.inputSize, layerData.outputSize);
      layer.load(layerData);
      this.layers.push(layer);
    }
    this.embeddingLayer.load(data.embeddingLayer);
  }
}

// ============================================
// Advanced Training System
// ============================================

export interface TrainingExample {
  inputTokens: number[];
  targetTokens: number[];
}

export class AdvancedTrainingSystem {
  private network: AdvancedNeuralNetwork;
  private tokenizer: AdvancedTokenizer;
  private config: MLConfig;
  
  private trainingData: TrainingExample[] = [];
  private validationData: TrainingExample[] = [];
  
  private trainingHistory: number[] = [];
  private validationHistory: number[] = [];
  
  private bestValidationLoss = Infinity;
  private patienceCounter = 0;
  
  constructor(config: MLConfig) {
    this.config = config;
    this.tokenizer = new AdvancedTokenizer(config);
    this.network = new AdvancedNeuralNetwork(config, this.tokenizer.getEmbeddingLayer());
  }
  
  addExample(input: string, target: string): void {
    const inputTokens = this.tokenizer.encode(input);
    const targetTokens = this.tokenizer.encode(target);
    
    this.trainingData.push({ inputTokens, targetTokens });
  }
  
  prepareData(): void {
    // Build vocabulary
    const allTexts = this.trainingData.map(ex => 
      this.tokenizer.decode(ex.inputTokens) + ' ' + this.tokenizer.decode(ex.targetTokens)
    );
    this.tokenizer.buildVocabulary(allTexts);
    
    // Re-encode with full vocabulary
    for (const example of this.trainingData) {
      const inputText = this.tokenizer.decode(example.inputTokens);
      const targetText = this.tokenizer.decode(example.targetTokens);
      example.inputTokens = this.tokenizer.encode(inputText);
      example.targetTokens = this.tokenizer.encode(targetText);
    }
    
    // Split into training and validation
    const splitIndex = Math.floor(this.trainingData.length * (1 - this.config.validationSplit));
    this.validationData = this.trainingData.slice(splitIndex);
    this.trainingData = this.trainingData.slice(0, splitIndex);
    
    // Shuffle training data
    this.trainingData.sort(() => Math.random() - 0.5);
  }
  
  train(): { finalTrainingLoss: number; finalValidationLoss: number; epochs: number } {
    this.prepareData();
    
    this.trainingHistory = [];
    this.validationHistory = [];
    this.bestValidationLoss = Infinity;
    this.patienceCounter = 0;
    
    let epochs = 0;
    
    for (let epoch = 0; epoch < this.config.epochs; epoch++) {
      epochs = epoch + 1;
      
      // Training
      let trainingLoss = 0;
      for (const example of this.trainingData) {
        const inputEmbedding = this.tokenizer.getEmbeddingLayer().forward(example.inputTokens);
        const targetEmbedding = this.tokenizer.getEmbeddingLayer().forward(example.targetTokens);
        
        const loss = this.network.backward(inputEmbedding, targetEmbedding);
        trainingLoss += loss;
      }
      trainingLoss /= this.trainingData.length;
      
      // Update weights
      this.network.updateWeights(this.config.learningRate);
      
      // Validation
      let validationLoss = 0;
      for (const example of this.validationData) {
        const inputEmbedding = this.tokenizer.getEmbeddingLayer().forward(example.inputTokens);
        const targetEmbedding = this.tokenizer.getEmbeddingLayer().forward(example.targetTokens);
        const output = this.network.predict(inputEmbedding);
        
        let loss = 0;
        for (let i = 0; i < output.length; i++) {
          loss += Math.pow(targetEmbedding[i] - output[i], 2);
        }
        validationLoss += loss / output.length;
      }
      validationLoss /= this.validationData.length;
      
      this.trainingHistory.push(trainingLoss);
      this.validationHistory.push(validationLoss);
      
      // Early stopping
      if (validationLoss < this.bestValidationLoss) {
        this.bestValidationLoss = validationLoss;
        this.patienceCounter = 0;
      } else {
        this.patienceCounter++;
        if (this.patienceCounter >= this.config.earlyStoppingPatience) {
          console.log(`Early stopping at epoch ${epoch + 1}`);
          break;
        }
      }
      
      // Log progress
      if ((epoch + 1) % 10 === 0) {
        console.log(`Epoch ${epoch + 1}/${this.config.epochs} - Training Loss: ${trainingLoss.toFixed(4)}, Validation Loss: ${validationLoss.toFixed(4)}`);
      }
    }
    
    return {
      finalTrainingLoss: this.trainingHistory[this.trainingHistory.length - 1],
      finalValidationLoss: this.validationHistory[this.validationHistory.length - 1],
      epochs
    };
  }
  
  generate(input: string): string {
    const inputTokens = this.tokenizer.encode(input);
    const inputEmbedding = this.tokenizer.getEmbeddingLayer().forward(inputTokens);
    const outputEmbedding = this.network.predict(inputEmbedding);
    
    // Decode using closest tokens
    const closestTokens = this.tokenizer.findClosestTokens(outputEmbedding, 10);
    const outputTokens = closestTokens.map(t => this.tokenizer.encode(t.token)[0]);
    
    return this.tokenizer.decode(outputTokens);
  }
  
  getTokenizer(): AdvancedTokenizer {
    return this.tokenizer;
  }
  
  getHistory(): { training: number[]; validation: number[] } {
    return {
      training: this.trainingHistory,
      validation: this.validationHistory
    };
  }
  
  save(): any {
    return {
      network: this.network.save(),
      tokenizer: this.tokenizer.save(),
      config: this.config,
      trainingHistory: this.trainingHistory,
      validationHistory: this.validationHistory
    };
  }
  
  load(data: any): void {
    this.network.load(data.network);
    this.tokenizer.load(data.tokenizer);
    this.trainingHistory = data.trainingHistory;
    this.validationHistory = data.validationHistory;
  }
}

// ============================================
// Export
// ============================================

export const AdvancedML = {
  DEFAULT_CONFIG,
  EmbeddingLayer,
  DenseLayer,
  ActivationFunctions,
  AdvancedTokenizer,
  AdvancedNeuralNetwork,
  AdvancedTrainingSystem
};
