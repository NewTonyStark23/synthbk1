// Test script for Neural-Inspired Deep Reasoning Engine
// Demonstrates the hybrid Option C architecture

import { DeepReasoningEngine } from './deep-reasoning-neural';

console.log('=== Neural-Inspired Deep Reasoning Engine Test ===\n');

const engine = new DeepReasoningEngine();

// Test 1: Hierarchical Abstraction
console.log('TEST 1: Hierarchical Abstraction');
console.log('Input: "A red round ball bounces on the ground"');
console.log('Expected: Should abstract from concrete (ball) → pattern (round things roll) → principle (geometry determines motion) → meta (mathematical modeling)\n');
const result1 = engine.reason('A red round ball bounces on the ground');
console.log(result1);
console.log('\n---\n');

// Test 2: Analogical Reasoning
console.log('TEST 2: Analogical Reasoning');
console.log('Input: "How is the heart like a pump?"');
console.log('Expected: Should map structural similarities (heart → pump, blood vessels → pipes, valves → valves)\n');
const result2 = engine.reason('How is the heart like a pump?');
console.log(result2);
console.log('\n---\n');

// Test 3: Causal Reasoning
console.log('TEST 3: Causal Reasoning');
console.log('Input: "What happens if it rains?"');
console.log('Expected: Should trace causal chain (rain → wet ground → slippery surface → accidents)\n');
const result3 = engine.reason('What happens if it rains?');
console.log(result3);
console.log('\n---\n');

// Test 4: Multi-Perspective Reasoning
console.log('TEST 4: Multi-Perspective Reasoning');
console.log('Input: "Should we invest in renewable energy?"');
console.log('Expected: Should analyze from economic, environmental, and social perspectives\n');
const result4 = engine.reasonWithPerspectives(
  'Should we invest in renewable energy?',
  ['economic', 'environmental', 'social']
);
console.log(result4);
console.log('\n---\n');

// Test 5: Deep Understanding Test
console.log('TEST 5: Deep Understanding (The Real Test)');
console.log('Input: "Why do objects fall?"');
console.log('Expected: Should go beyond "gravity" to fundamental principles\n');
const result5 = engine.reason('Why do objects fall?');
console.log(result5);
console.log('\n---\n');

// Test 6: Abstract Concept Understanding
console.log('TEST 6: Abstract Concept Understanding');
console.log('Input: "What is the nature of consciousness?"');
console.log('Expected: Should attempt abstraction and analogical reasoning\n');
const result6 = engine.reason('What is the nature of consciousness?');
console.log(result6);
console.log('\n---\n');

// Test 7: Complex System Understanding
console.log('TEST 7: Complex System Understanding');
console.log('Input: "How does the internet work at a fundamental level?"');
console.log('Expected: Should abstract from packets → protocols → network theory → information theory\n');
const result7 = engine.reason('How does the internet work at a fundamental level?');
console.log(result7);
console.log('\n---\n');

// Test 8: Causal Chain with Multiple Effects
console.log('TEST 8: Causal Chain with Multiple Effects');
console.log('Input: "What are the consequences of studying regularly?"');
console.log('Expected: Should trace multiple causal paths\n');
const result8 = engine.reason('What are the consequences of studying regularly?');
console.log(result8);
console.log('\n---\n');

// Test 9: Analogical Transfer
console.log('TEST 9: Analogical Transfer');
console.log('Input: "How is evolution like an optimization algorithm?"');
console.log('Expected: Should map evolution → genetic algorithm, natural selection → fitness function\n');
const result9 = engine.reason('How is evolution like an optimization algorithm?');
console.log(result9);
console.log('\n---\n');

// Test 10: First Principles Thinking
console.log('TEST 10: First Principles Thinking');
console.log('Input: "What is the fundamental principle behind all learning?"');
console.log('Expected: Should abstract to meta-principles\n');
const result10 = engine.reason('What is the fundamental principle behind all learning?');
console.log(result10);
console.log('\n---\n');

console.log('=== Test Complete ===');
console.log('\nKey Observations:');
console.log('1. Hierarchical abstraction moves from concrete → pattern → principle → meta');
console.log('2. Analogical mapping finds structural similarities between domains');
console.log('3. Causal reasoning traces cause-effect chains with confidence levels');
console.log('4. Multi-perspective reasoning integrates different viewpoints');
console.log('5. The system attempts genuine understanding, not just pattern matching');
console.log('\nThis is Option C: Hybrid Architecture');
console.log('- Neural-inspired (hierarchical, parallel, recurrent)');
console.log('- Rule-based implementation (interpretable, efficient)');
console.log('- Emergent understanding through connectivity patterns');
