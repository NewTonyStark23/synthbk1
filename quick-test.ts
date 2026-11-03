// Quick ML Test - Verify Learning Works
import { SynthAI } from './src/synth/SynthAI';
import { TRAINING_DATA } from './src/training-data';

async function quickTest() {
  console.log('=== QUICK ML TEST ===\n');
  
  const synth = new SynthAI();
  
  // Test 1: Check initial state
  console.log('📊 Initial State:');
  const initialStats = synth.getMLStats();
  console.log(`  Trained: ${initialStats.isTrained}`);
  console.log(`  Examples: ${initialStats.totalExamples}`);
  console.log(`  Vocabulary: ${initialStats.vocabularySize}\n`);
  
  // Test 2: Test a question before training
  console.log('🧪 Test BEFORE Training:');
  const beforeResult = await synth.process('hello');
  console.log(`  Input: "hello"`);
  console.log(`  Response: ${beforeResult.response.substring(0, 80)}...`);
  console.log(`  Confidence: ${(beforeResult.confidence * 100).toFixed(1)}%`);
  console.log(`  Intent: ${beforeResult.intent}\n`);
  
  // Test 3: Load a few training examples
  console.log('📚 Loading 10 training examples...');
  for (let i = 0; i < 10; i++) {
    const example = TRAINING_DATA[i];
    synth.learnFromConversation(example.input, example.output, example.category);
  }
  console.log(`  ✓ Loaded 10 examples\n`);
  
  // Test 4: Train
  console.log('🧠 Training for 50 epochs...');
  const startTime = Date.now();
  const trainResult = synth.trainML(50);
  const trainTime = Date.now() - startTime;
  console.log(`  ✓ Training complete in ${trainTime}ms`);
  console.log(`  Final error: ${trainResult.finalError.toFixed(6)}`);
  console.log(`  Improvements: ${trainResult.improvements}\n`);
  
  // Test 5: Check state after training
  console.log('📊 After Training:');
  const afterStats = synth.getMLStats();
  console.log(`  Trained: ${afterStats.isTrained}`);
  console.log(`  Examples: ${afterStats.totalExamples}`);
  console.log(`  Vocabulary: ${afterStats.vocabularySize}\n`);
  
  // Test 6: Test the same question after training
  console.log('🧪 Test AFTER Training:');
  const afterResult = await synth.process('hello');
  console.log(`  Input: "hello"`);
  console.log(`  Response: ${afterResult.response.substring(0, 80)}...`);
  console.log(`  Confidence: ${(afterResult.confidence * 100).toFixed(1)}%`);
  console.log(`  Intent: ${afterResult.intent}\n`);
  
  // Test 7: Compare
  console.log('📈 Comparison:');
  const confidenceDiff = afterResult.confidence - beforeResult.confidence;
  console.log(`  Before: ${(beforeResult.confidence * 100).toFixed(1)}%`);
  console.log(`  After:  ${(afterResult.confidence * 100).toFixed(1)}%`);
  console.log(`  Change: ${confidenceDiff > 0 ? '+' : ''}${(confidenceDiff * 100).toFixed(1)}%`);
  
  if (confidenceDiff > 0.05) {
    console.log(`\n✅ SUCCESS: Learning is working!`);
  } else if (confidenceDiff > 0) {
    console.log(`\n⚠️  PARTIAL: Some improvement detected`);
  } else {
    console.log(`\n❌ FAILED: No improvement detected`);
  }
}

quickTest().catch(console.error);
