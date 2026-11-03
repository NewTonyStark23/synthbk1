// Test Synthetic ML Learning with 100 Training Examples
// Demonstrates that Synth actually learns and improves

import { SynthAI } from './src/synth/SynthAI';
import { TRAINING_DATA } from './src/training-data';

async function testLearning() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║   SYNTHETIC ML LEARNING TEST - 100 TRAINING EXAMPLES     ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const synth = new SynthAI();

  // ============================================
  // PHASE 1: Test BEFORE Training
  // ============================================
  console.log('📊 PHASE 1: Testing BEFORE Training\n');
  console.log('Testing 5 questions to see initial performance...\n');

  const testQuestions = [
    'hello',
    'what is javascript',
    'how do i learn programming',
    'build a calculator',
    'thanks'
  ];

  const beforeResults: any[] = [];

  for (const question of testQuestions) {
    const result = await synth.process(question);
    beforeResults.push({
      question,
      response: result.response,
      confidence: result.confidence,
      intent: result.intent
    });

    console.log(`Q: "${question}"`);
    console.log(`A: ${result.response.substring(0, 100)}...`);
    console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`Intent: ${result.intent}\n`);
  }

  // ============================================
  // PHASE 2: Load Training Data
  // ============================================
  console.log('━'.repeat(60));
  console.log('📚 PHASE 2: Loading Training Data\n');
  console.log(`Loading ${TRAINING_DATA.length} training examples...\n`);

  for (let i = 0; i < TRAINING_DATA.length; i++) {
    const example = TRAINING_DATA[i];
    synth.learnFromConversation(
      example.input,
      example.output,
      example.category
    );

    if ((i + 1) % 20 === 0) {
      console.log(`  ✓ Loaded ${i + 1}/${TRAINING_DATA.length} examples`);
    }
  }

  console.log(`\n✅ All ${TRAINING_DATA.length} examples loaded!\n`);

  // ============================================
  // PHASE 3: Train Neural Network
  // ============================================
  console.log('━'.repeat(60));
  console.log('🧠 PHASE 3: Training Neural Network\n');

  const mlStats = synth.getMLStats();
  console.log(`Network Architecture:`);
  console.log(`  Layers: ${mlStats.networkInfo.layers.join(' → ')}`);
  console.log(`  Total Neurons: ${mlStats.networkInfo.totalNeurons}`);
  console.log(`  Total Weights: ${mlStats.networkInfo.totalWeights.toLocaleString()}`);
  console.log(`  Vocabulary Size: ${mlStats.vocabularySize.toLocaleString()} words`);
  console.log(`  Training Examples: ${mlStats.totalExamples}\n`);

  console.log('Training for 200 epochs...');
  const startTime = Date.now();
  const trainingResult = synth.trainML(200);
  const trainingTime = Date.now() - startTime;

  console.log(`\n✅ Training Complete!`);
  console.log(`  Time: ${trainingTime}ms`);
  console.log(`  Final Error: ${trainingResult.finalError.toFixed(6)}`);
  console.log(`  Improvements: ${trainingResult.improvements}\n`);

  // ============================================
  // PHASE 4: Test AFTER Training
  // ============================================
  console.log('━'.repeat(60));
  console.log('🧪 PHASE 4: Testing AFTER Training\n');
  console.log('Testing the same 5 questions to see improvement...\n');

  const afterResults: any[] = [];

  for (const question of testQuestions) {
    const result = await synth.process(question);
    afterResults.push({
      question,
      response: result.response,
      confidence: result.confidence,
      intent: result.intent
    });

    console.log(`Q: "${question}"`);
    console.log(`A: ${result.response.substring(0, 100)}...`);
    console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`Intent: ${result.intent}\n`);
  }

  // ============================================
  // PHASE 5: Compare Results
  // ============================================
  console.log('━'.repeat(60));
  console.log('📈 PHASE 5: Comparing Results\n');

  let totalImprovement = 0;

  for (let i = 0; i < testQuestions.length; i++) {
    const before = beforeResults[i];
    const after = afterResults[i];

    const confidenceDiff = after.confidence - before.confidence;
    const improved = confidenceDiff > 0.05;

    console.log(`Question: "${before.question}"`);
    console.log(`  Before: ${(before.confidence * 100).toFixed(1)}% confidence`);
    console.log(`  After:  ${(after.confidence * 100).toFixed(1)}% confidence`);
    console.log(`  Change: ${confidenceDiff > 0 ? '+' : ''}${(confidenceDiff * 100).toFixed(1)}%`);
    console.log(`  Status: ${improved ? '✅ IMPROVED' : '⚠️  NO CHANGE'}\n`);

    totalImprovement += confidenceDiff;
  }

  const avgImprovement = totalImprovement / testQuestions.length;

  console.log('━'.repeat(60));
  console.log('📊 SUMMARY\n');
  console.log(`Training Examples: ${TRAINING_DATA.length}`);
  console.log(`Training Time: ${trainingTime}ms`);
  console.log(`Final Error: ${trainingResult.finalError.toFixed(6)}`);
  console.log(`Average Confidence Improvement: +${(avgImprovement * 100).toFixed(1)}%`);
  console.log(`Questions Improved: ${afterResults.filter((a, i) => a.confidence > beforeResults[i].confidence + 0.05).length}/${testQuestions.length}`);

  console.log('\n' + '━'.repeat(60));

  if (avgImprovement > 0.1) {
    console.log('✅ SUCCESS: Synth learned from training data!');
    console.log('   The neural network improved response quality significantly.');
  } else if (avgImprovement > 0) {
    console.log('⚠️  PARTIAL: Some improvement detected.');
    console.log('   The network is learning but may need more data or training.');
  } else {
    console.log('❌ NO IMPROVEMENT: Training did not improve responses.');
    console.log('   May need more examples, better architecture, or different approach.');
  }

  console.log('━'.repeat(60));

  // ============================================
  // PHASE 6: Final Stats
  // ============================================
  console.log('\n📊 Final ML Statistics:\n');
  const finalStats = synth.getMLStats();
  console.log(`  Is Trained: ${finalStats.isTrained}`);
  console.log(`  Total Examples: ${finalStats.totalExamples}`);
  console.log(`  Vocabulary Size: ${finalStats.vocabularySize.toLocaleString()}`);
  console.log(`  Network Layers: ${finalStats.networkInfo.layers.join(' → ')}`);
  console.log(`  Total Neurons: ${finalStats.networkInfo.totalNeurons}`);
  console.log(`  Total Weights: ${finalStats.networkInfo.totalWeights.toLocaleString()}`);
  console.log(`  Training History (last 5):`, finalStats.trainingHistory.slice(-5).map(h => h.toFixed(6)));

  console.log('\n' + '━'.repeat(60));
  console.log('🎉 TEST COMPLETE!\n');
}

// Run the test
testLearning().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
