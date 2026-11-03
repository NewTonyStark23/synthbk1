// Human-like Stress Test with Typos and Meta-Question
// Testing the neural-inspired deep reasoning system

import { SynthAI } from './src/synth/SynthAI';

async function runHumanStressTest() {
  const synth = new SynthAI();
  
  console.log('=== HUMAN-LIKE STRESS TEST ===\n');
  console.log('Testing with typos and natural language...\n');
  
  // Question 1: Deep existential question with typos
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('QUESTION 1: Existential/Philosophical (with typos)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const q1 = 'why do things exist instead of nothing at all liek what is the fundemental reasion behind exsistance itslef';
  console.log(`Input: "${q1}"\n`);
  const r1 = await synth.process(q1);
  console.log('Response:');
  console.log(r1.response);
  console.log(`\nConfidence: ${(r1.confidence * 100).toFixed(0)}%`);
  console.log(`Intent: ${r1.intent}`);
  console.log(`Time: ${r1.speed.totalTime.toFixed(3)}s\n`);
  
  // Question 2: Analogical reasoning with typos
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('QUESTION 2: Analogical Reasoning (with typos)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const q2 = 'how is the human brane similar to the interneet in terms of informashun procesing and netwurk structure';
  console.log(`Input: "${q2}"\n`);
  const r2 = await synth.process(q2);
  console.log('Response:');
  console.log(r2.response);
  console.log(`\nConfidence: ${(r2.confidence * 100).toFixed(0)}%`);
  console.log(`Intent: ${r2.intent}`);
  console.log(`Time: ${r2.speed.totalTime.toFixed(3)}s\n`);
  
  // Question 3: Complex causal reasoning with typos
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('QUESTION 3: Causal Chain (with typos)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const q3 = 'if we keep using fosil fuels what will hapen to the climate and economy and soceity over the next 100 yeers';
  console.log(`Input: "${q3}"\n`);
  const r3 = await synth.process(q3);
  console.log('Response:');
  console.log(r3.response);
  console.log(`\nConfidence: ${(r3.confidence * 100).toFixed(0)}%`);
  console.log(`Intent: ${r3.intent}`);
  console.log(`Time: ${r3.speed.totalTime.toFixed(3)}s\n`);
  
  // Question 4: First principles thinking with typos
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('QUESTION 4: First Principles (with typos)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const q4 = 'what is the core principle behind all succesful busineses and startUPS liek whats the fundemental truth';
  console.log(`Input: "${q4}"\n`);
  const r4 = await synth.process(q4);
  console.log('Response:');
  console.log(r4.response);
  console.log(`\nConfidence: ${(r4.confidence * 100).toFixed(0)}%`);
  console.log(`Intent: ${r4.intent}`);
  console.log(`Time: ${r4.speed.totalTime.toFixed(3)}s\n`);
  
  // Question 5: Meta-question about the system itself
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('QUESTION 5: Meta-Question (about the system)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const q5 = 'can you explain how this fly wire project and the synthetic ai cognitive architecure we just built works togehter like how does the neural inspyred hierarchial abstracation and analogical maping create genuine understanding and does it do online researches or even undersatnd what we are talking about';
  console.log(`Input: "${q5}"\n`);
  const r5 = await synth.process(q5);
  console.log('Response:');
  console.log(r5.response);
  console.log(`\nConfidence: ${(r5.confidence * 100).toFixed(0)}%`);
  console.log(`Intent: ${r5.intent}`);
  console.log(`Time: ${r5.speed.totalTime.toFixed(3)}s\n`);
  
  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Total Questions: 5`);
  console.log(`Average Confidence: ${((r1.confidence + r2.confidence + r3.confidence + r4.confidence + r5.confidence) / 5 * 100).toFixed(1)}%`);
  console.log(`Total Time: ${(r1.speed.totalTime + r2.speed.totalTime + r3.speed.totalTime + r4.speed.totalTime + r5.speed.totalTime).toFixed(3)}s`);
  console.log(`Average Time: ${((r1.speed.totalTime + r2.speed.totalTime + r3.speed.totalTime + r4.speed.totalTime + r5.speed.totalTime) / 5).toFixed(3)}s`);
  console.log(`\nIntents Detected:`);
  console.log(`  Q1: ${r1.intent}`);
  console.log(`  Q2: ${r2.intent}`);
  console.log(`  Q3: ${r3.intent}`);
  console.log(`  Q4: ${r4.intent}`);
  console.log(`  Q5: ${r5.intent}`);
}

runHumanStressTest().catch(console.error);
