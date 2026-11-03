// Realistic Human Conversation Test
// Simulates actual user behavior with typos, casual language, context references

import { SynthAI } from './src/synth/SynthAI';

async function runHumanConversationTest() {
  const synth = new SynthAI();
  
  console.log('=== REALISTIC HUMAN CONVERSATION TEST ===\n');
  console.log('Simulating casual user with typos and context references\n');
  
  const conversation = [
    // Turn 1: Casual greeting with typo
    {
      input: 'hey there u working?',
      expected: 'Should recognize as greeting, respond briefly and casually'
    },
    
    // Turn 2: Request to build something with typos
    {
      input: 'can u build me a new years countdown timer with red colors',
      expected: 'Should detect as code_generation, build HTML timer'
    },
    
    // Turn 3: Follow-up with pronoun reference
    {
      input: 'make it in html pls',
      expected: 'Should resolve "it" to countdown timer, generate HTML code'
    },
    
    // Turn 4: Casual acknowledgment
    {
      input: 'cool thanks',
      expected: 'Should respond briefly, acknowledge thanks'
    },
    
    // Turn 5: New request with context
    {
      input: 'now make a calculator but make it look fancy',
      expected: 'Should detect code_generation, build calculator'
    },
    
    // Turn 6: Vague reference
    {
      input: 'can u change the colors on that one',
      expected: 'Should resolve "that one" to calculator, modify it'
    },
    
    // Turn 7: Question about capabilities
    {
      input: 'what else can u do?',
      expected: 'Should list capabilities briefly'
    },
    
    // Turn 8: Complex request with typos
    {
      input: 'build me a todo list app that saves to local storage',
      expected: 'Should detect code_generation, build todo app'
    },
    
    // Turn 9: Follow-up question
    {
      input: 'does it work on mobile?',
      expected: 'Should resolve "it" to todo list, answer about mobile'
    },
    
    // Turn 10: Casual test
    {
      input: 'testing testing 1 2 3',
      expected: 'Should recognize as test message, respond appropriately'
    }
  ];
  
  const results: any[] = [];
  
  for (let i = 0; i < conversation.length; i++) {
    const turn = conversation[i];
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`TURN ${i + 1}: "${turn.input}"`);
    console.log(`Expected: ${turn.expected}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    try {
      const result = await synth.process(turn.input);
      
      console.log(`Response (${result.intent}, ${(result.confidence * 100).toFixed(0)}% confidence):`);
      console.log(result.response.substring(0, 300));
      if (result.response.length > 300) console.log('...');
      
      if (result.code) {
        console.log(`\n✅ Code generated: ${result.code.length} characters`);
      }
      
      // Evaluate response
      const evaluation = evaluateResponse(turn.input, result, turn.expected);
      
      results.push({
        turn: i + 1,
        input: turn.input,
        expected: turn.expected,
        intent: result.intent,
        confidence: result.confidence,
        hasCode: !!result.code,
        evaluation,
        passed: evaluation.passed
      });
      
      console.log(`\nEvaluation: ${evaluation.passed ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`Notes: ${evaluation.notes}`);
      
    } catch (error) {
      console.log(`❌ ERROR: ${error}`);
      results.push({
        turn: i + 1,
        input: turn.input,
        expected: turn.expected,
        passed: false,
        evaluation: { passed: false, notes: `Error: ${error}` }
      });
    }
  }
  
  // Summary
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log(`Total Turns: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Pass Rate: ${((passed / total) * 100).toFixed(1)}%\n`);
  
  console.log('Detailed Results:');
  results.forEach(r => {
    console.log(`\nTurn ${r.turn}: ${r.passed ? '✅' : '❌'}`);
    console.log(`  Input: "${r.input}"`);
    console.log(`  Intent: ${r.intent} (${(r.confidence * 100).toFixed(0)}%)`);
    console.log(`  Code: ${r.hasCode ? 'Yes' : 'No'}`);
    console.log(`  Notes: ${r.evaluation.notes}`);
  });
  
  return results;
}

function evaluateResponse(input: string, result: any, expected: string): { passed: boolean; notes: string } {
  const lower = input.toLowerCase();
  const response = result.response.toLowerCase();
  
  // Test 1: Greeting detection
  if (lower.includes('hey') || lower.includes('working')) {
    if (result.intent === 'greeting' && result.confidence > 0.9) {
      return { passed: true, notes: 'Correctly identified as greeting' };
    }
    return { passed: false, notes: `Expected greeting, got ${result.intent}` };
  }
  
  // Test 2: Code generation detection
  if (lower.includes('build') || lower.includes('make') || lower.includes('create')) {
    if (result.intent === 'code_generation' && result.confidence > 0.8) {
      if (result.code) {
        return { passed: true, notes: 'Correctly generated code' };
      }
      return { passed: false, notes: 'Detected code_generation but no code generated' };
    }
    return { passed: false, notes: `Expected code_generation, got ${result.intent}` };
  }
  
  // Test 3: Pronoun resolution
  if (lower.includes('it') || lower.includes('that') || lower.includes('this')) {
    if (response.includes('countdown') || response.includes('timer') || response.includes('calculator') || response.includes('todo')) {
      return { passed: true, notes: 'Correctly resolved pronoun reference' };
    }
    return { passed: false, notes: 'Failed to resolve pronoun reference' };
  }
  
  // Test 4: Acknowledgment handling
  if (lower.includes('cool') || lower.includes('thanks')) {
    if (result.intent === 'conversation' && response.length < 100) {
      return { passed: true, notes: 'Responded briefly to acknowledgment' };
    }
    return { passed: false, notes: 'Response too long for simple acknowledgment' };
  }
  
  // Test 5: Capability question
  if (lower.includes('what') && lower.includes('can') && lower.includes('do')) {
    if (response.includes('build') || response.includes('code') || response.includes('help')) {
      return { passed: true, notes: 'Listed capabilities' };
    }
    return { passed: false, notes: 'Did not list capabilities' };
  }
  
  // Test 6: Test message
  if (lower.includes('testing')) {
    if (result.intent === 'greeting' || (result.intent === 'conversation' && response.includes('here'))) {
      return { passed: true, notes: 'Recognized test message' };
    }
    return { passed: false, notes: 'Did not recognize test message' };
  }
  
  // Default: check if response is reasonable
  if (result.confidence > 0.6 && response.length > 20) {
    return { passed: true, notes: 'Reasonable response' };
  }
  
  return { passed: false, notes: 'Response quality insufficient' };
}

runHumanConversationTest().catch(console.error);
