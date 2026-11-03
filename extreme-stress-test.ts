// EXTREME STRESS TEST - Human-like with typos, grammar errors, trick questions
// Tests all systems under maximum difficulty

import { SynthAI } from './src/synth/SynthAI';

async function runExtremeStressTest() {
  const synth = new SynthAI();
  const results: any[] = [];
  
  console.log('=== EXTREME STRESS TEST - MAXIMUM DIFFICULTY ===\n');
  console.log('Testing with typos, grammar errors, trick questions, and deep reasoning challenges\n');
  
  // ============================================
  // DEEP REASONING WITH TYPOS
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CATEGORY 1: DEEP REASONING (with typos)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Test 1: Philosophical with typos
  console.log('Test 1: Existential philosophy (with typos)');
  const q1 = 'if nothng exsists then how can nothing exsist doesnt nothing have to be somthing to not exsist?';
  console.log(`Q: "${q1}"`);
  const r1 = await synth.process(q1);
  results.push({ category: 'Deep Reasoning', test: 'Existential', passed: r1.confidence > 0.85, response: r1.response.substring(0, 150) });
  console.log(`Result: ${r1.confidence > 0.85 ? '✅ PASS' : '❌ FAIL'} (${(r1.confidence * 100).toFixed(0)}%)\n`);
  
  // Test 2: Paradox with grammar errors
  console.log('Test 2: Logical paradox (with grammar errors)');
  const q2 = 'this sentance is false, so is it true or false? if its true then its false but if its false then its true explain';
  console.log(`Q: "${q2}"`);
  const r2 = await synth.process(q2);
  results.push({ category: 'Deep Reasoning', test: 'Paradox', passed: r2.confidence > 0.80, response: r2.response.substring(0, 150) });
  console.log(`Result: ${r2.confidence > 0.80 ? '✅ PASS' : '❌ FAIL'} (${(r2.confidence * 100).toFixed(0)}%)\n`);
  
  // ============================================
  // SECURITY & CODING CHALLENGES
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CATEGORY 2: SECURITY & CODING (extreme difficulty)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Test 3: Find security vulnerability
  console.log('Test 3: Security vulnerability detection');
  const q3 = 'analyze this code for security flaws: app.get("/user", (req, res) => { const query = "SELECT * FROM users WHERE id = " + req.query.id; db.execute(query); })';
  console.log(`Q: "${q3.substring(0, 100)}..."`);
  const r3 = await synth.process(q3);
  results.push({ category: 'Security', test: 'SQL Injection', passed: r3.response.toLowerCase().includes('sql') || r3.response.toLowerCase().includes('injection'), response: r3.response.substring(0, 150) });
  console.log(`Result: ${r3.response.toLowerCase().includes('sql') || r3.response.toLowerCase().includes('injection') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 4: Complex algorithm with typos
  console.log('Test 4: Algorithm implementation (with typos)');
  const q4 = 'write a functin in python that finds the longst common subsequnce of two strings but make it efficent like O(n*m) not exponetial';
  console.log(`Q: "${q4}"`);
  const r4 = await synth.process(q4);
  results.push({ category: 'Coding', test: 'LCS Algorithm', passed: r4.response.toLowerCase().includes('dynamic') || r4.response.toLowerCase().includes('dp') || r4.response.toLowerCase().includes('table'), response: r4.response.substring(0, 150) });
  console.log(`Result: ${r4.response.toLowerCase().includes('dynamic') || r4.response.toLowerCase().includes('dp') || r4.response.toLowerCase().includes('table') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 5: Race condition detection
  console.log('Test 5: Concurrent programming bug');
  const q5 = 'this code has a race condition fix it and explain why: class BankAccount { constructor() { this.balance = 0; } deposit(amount) { const current = this.balance; this.balance = current + amount; } }';
  console.log(`Q: "${q5.substring(0, 100)}..."`);
  const r5 = await synth.process(q5);
  results.push({ category: 'Security', test: 'Race Condition', passed: r5.response.toLowerCase().includes('race') || r5.response.toLowerCase().includes('concurrent') || r5.response.toLowerCase().includes('mutex') || r5.response.toLowerCase().includes('lock'), response: r5.response.substring(0, 150) });
  console.log(`Result: ${r5.response.toLowerCase().includes('race') || r5.response.toLowerCase().includes('concurrent') || r5.response.toLowerCase().includes('mutex') || r5.response.toLowerCase().includes('lock') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // ============================================
  // TRICK QUESTIONS
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CATEGORY 3: TRICK QUESTIONS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Test 6: Impossible question
  console.log('Test 6: Impossible scenario');
  const q6 = 'build a program that can predict the future with 100% accuracy but it cant use any data from the past';
  console.log(`Q: "${q6}"`);
  const r6 = await synth.process(q6);
  results.push({ category: 'Trick', test: 'Impossible', passed: r6.response.toLowerCase().includes('impossible') || r6.response.toLowerCase().includes('cannot') || r6.response.toLowerCase().includes('paradox'), response: r6.response.substring(0, 150) });
  console.log(`Result: ${r6.response.toLowerCase().includes('impossible') || r6.response.toLowerCase().includes('cannot') || r6.response.toLowerCase().includes('paradox') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 7: Self-referential
  console.log('Test 7: Self-referential question');
  const q7 = 'can you answer this question with "no"?';
  console.log(`Q: "${q7}"`);
  const r7 = await synth.process(q7);
  results.push({ category: 'Trick', test: 'Self-referential', passed: r7.response.length > 50, response: r7.response.substring(0, 150) });
  console.log(`Result: ${r7.response.length > 50 ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 8: Ambiguous pronouns
  console.log('Test 8: Ambiguous reference');
  const q8 = 'the cat sat on the mat because it was tired. what was tired?';
  console.log(`Q: "${q8}"`);
  const r8 = await synth.process(q8);
  results.push({ category: 'Trick', test: 'Ambiguity', passed: r8.response.toLowerCase().includes('cat'), response: r8.response.substring(0, 150) });
  console.log(`Result: ${r8.response.toLowerCase().includes('cat') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // ============================================
  // CONTEXT & MEMORY
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CATEGORY 4: CONTEXT & MEMORY (with errors)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Test 9: Multi-turn with typos
  console.log('Test 9: Multi-turn conversation (with typos)');
  await synth.process('my name is john and i live in new york');
  await synth.process('i work as a software enginner at google');
  const q9 = 'whats my name and where do i work?';
  console.log(`Q: "${q9}"`);
  const r9 = await synth.process(q9);
  results.push({ category: 'Context', test: 'Multi-turn', passed: r9.response.toLowerCase().includes('john') && r9.response.toLowerCase().includes('google'), response: r9.response.substring(0, 150) });
  console.log(`Result: ${r9.response.toLowerCase().includes('john') && r9.response.toLowerCase().includes('google') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 10: Reference resolution with errors
  console.log('Test 10: Complex reference resolution');
  const q10 = 'earlier i told you about my job. what company do i work for and what do i do there?';
  console.log(`Q: "${q10}"`);
  const r10 = await synth.process(q10);
  results.push({ category: 'Context', test: 'Reference', passed: r10.response.toLowerCase().includes('google') || r10.response.toLowerCase().includes('engineer'), response: r10.response.substring(0, 150) });
  console.log(`Result: ${r10.response.toLowerCase().includes('google') || r10.response.toLowerCase().includes('engineer') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // ============================================
  // THEORY OF MIND
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CATEGORY 5: THEORY OF MIND (complex scenarios)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Test 11: Nested beliefs
  console.log('Test 11: Recursive belief modeling');
  const q11 = 'alice thinks that bob doesnt know that charlie lied about the meeting time. what does each person believe?';
  console.log(`Q: "${q11}"`);
  const r11 = await synth.process(q11);
  results.push({ category: 'Theory of Mind', test: 'Nested Beliefs', passed: r11.response.toLowerCase().includes('alice') && r11.response.toLowerCase().includes('bob') && r11.response.toLowerCase().includes('charlie'), response: r11.response.substring(0, 150) });
  console.log(`Result: ${r11.response.toLowerCase().includes('alice') && r11.response.toLowerCase().includes('bob') && r11.response.toLowerCase().includes('charlie') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 12: Perspective taking with conflict
  console.log('Test 12: Conflicting perspectives');
  const q12 = 'alice wants to launch the product now but bob thinks its not ready. from each of their perspectives, what are the pros and cons?';
  console.log(`Q: "${q12}"`);
  const r12 = await synth.process(q12);
  results.push({ category: 'Theory of Mind', test: 'Perspective', passed: r12.response.toLowerCase().includes('alice') && r12.response.toLowerCase().includes('bob') && r12.response.toLowerCase().includes('perspective'), response: r12.response.substring(0, 150) });
  console.log(`Result: ${r12.response.toLowerCase().includes('alice') && r12.response.toLowerCase().includes('bob') && r12.response.toLowerCase().includes('perspective') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // ============================================
  // METACOGNITION
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CATEGORY 6: METACOGNITION (self-assessment)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Test 13: Quality assessment
  console.log('Test 13: Self-quality assessment');
  const q13 = 'explain quantum entanglement then rate the quality of your own explanation on a scale of 1-10 and explain why you gave that rating';
  console.log(`Q: "${q13}"`);
  const r13 = await synth.process(q13);
  results.push({ category: 'Metacognition', test: 'Self-Assessment', passed: r13.response.toLowerCase().includes('quality') || r13.response.toLowerCase().includes('rating') || r13.response.toLowerCase().includes('score'), response: r13.response.substring(0, 150) });
  console.log(`Result: ${r13.response.toLowerCase().includes('quality') || r13.response.toLowerCase().includes('rating') || r13.response.toLowerCase().includes('score') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 14: Confidence calibration
  console.log('Test 14: Confidence in uncertain domain');
  const q14 = 'what happened on march 15, 2024 at exactly 3:47pm in tokyo? how confident are you in this answer?';
  console.log(`Q: "${q14}"`);
  const r14 = await synth.process(q14);
  results.push({ category: 'Metacognition', test: 'Confidence', passed: r14.response.toLowerCase().includes('confident') || r14.response.toLowerCase().includes('uncertain') || r14.response.toLowerCase().includes('dont know'), response: r14.response.substring(0, 150) });
  console.log(`Result: ${r14.response.toLowerCase().includes('confident') || r14.response.toLowerCase().includes('uncertain') || r14.response.toLowerCase().includes('dont know') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // ============================================
  // MULTI-SYSTEM INTEGRATION
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CATEGORY 7: MULTI-SYSTEM INTEGRATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Test 15: All systems at once
  console.log('Test 15: Complex multi-system query');
  const q15 = 'from bobs perspective, evaluate the quality of your reasoning about why the sky is blue, considering our previous conversation about physics, and explain your metacognitive process';
  console.log(`Q: "${q15}"`);
  const r15 = await synth.process(q15);
  results.push({ category: 'Integration', test: 'Multi-System', passed: r15.confidence > 0.80 && r15.response.length > 200, response: r15.response.substring(0, 150) });
  console.log(`Result: ${r15.confidence > 0.80 && r15.response.length > 200 ? '✅ PASS' : '❌ FAIL'} (${(r15.confidence * 100).toFixed(0)}%)\n`);
  
  // ============================================
  // EXTREME EDGE CASES
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CATEGORY 8: EXTREME EDGE CASES');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Test 16: Contradictory constraints
  console.log('Test 16: Contradictory requirements');
  const q16 = 'build a website that is both completely static and fully dynamic at the same time';
  console.log(`Q: "${q16}"`);
  const r16 = await synth.process(q16);
  results.push({ category: 'Edge Case', test: 'Contradiction', passed: r16.response.toLowerCase().includes('contradict') || r16.response.toLowerCase().includes('impossible') || r16.response.toLowerCase().includes('cannot'), response: r16.response.substring(0, 150) });
  console.log(`Result: ${r16.response.toLowerCase().includes('contradict') || r16.response.toLowerCase().includes('impossible') || r16.response.toLowerCase().includes('cannot') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 17: Infinite recursion
  console.log('Test 17: Infinite loop detection');
  const q17 = 'write a function that calls itself forever without any base case or termination condition';
  console.log(`Q: "${q17}"`);
  const r17 = await synth.process(q17);
  results.push({ category: 'Edge Case', test: 'Infinite', passed: r17.response.toLowerCase().includes('infinite') || r17.response.toLowerCase().includes('recursion') || r17.response.toLowerCase().includes('stack overflow'), response: r17.response.substring(0, 150) });
  console.log(`Result: ${r17.response.toLowerCase().includes('infinite') || r17.response.toLowerCase().includes('recursion') || r17.response.toLowerCase().includes('stack overflow') ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 18: Null/undefined handling
  console.log('Test 18: Null safety');
  const q18 = 'what happens when you try to access a property of null in javascript? write code that handles this safely';
  console.log(`Q: "${q18}"`);
  const r18 = await synth.process(q18);
  results.push({ category: 'Edge Case', test: 'Null Safety', passed: r18.response.toLowerCase().includes('null') && (r18.response.toLowerCase().includes('optional') || r18.response.toLowerCase().includes('check') || r18.response.toLowerCase().includes('if')), response: r18.response.substring(0, 150) });
  console.log(`Result: ${r18.response.toLowerCase().includes('null') && (r18.response.toLowerCase().includes('optional') || r18.response.toLowerCase().includes('check') || r18.response.toLowerCase().includes('if')) ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // ============================================
  // SUMMARY
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('EXTREME STRESS TEST SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const passRate = (passed / total) * 100;
  
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Pass Rate: ${passRate.toFixed(1)}%\n`);
  
  console.log('FAILED TESTS:');
  results.filter(r => !r.passed).forEach((r, i) => {
    console.log(`${i + 1}. ${r.category} - ${r.test}: ❌ FAIL`);
    console.log(`   Response: ${r.response}...\n`);
  });
  
  console.log('PASSED TESTS:');
  results.filter(r => r.passed).forEach((r, i) => {
    console.log(`${i + 1}. ${r.category} - ${r.test}: ✅ PASS`);
  });
  
  return results;
}

runExtremeStressTest().catch(console.error);
