// Synth SAI - Browser-Based Stress Test
// Run this in the browser console after loading the app

import { SynthAI } from './synth/SynthAI';

export async function runBrowserStressTest() {
  const synth = new SynthAI();
  const results: any[] = [];

  const tests = [
    {
      category: 'Core Infrastructure',
      question: 'I built a calculator yesterday, then modified it to have a dark theme. Now I want to change it back but also add beach elements. Can you trace through what happened and help me?'
    },
    {
      category: 'Paraphrase Handling',
      question: 'The individual requires the creation of a computational device that performs arithmetic operations with a visual aesthetic reminiscent of tropical coastal environments'
    },
    {
      category: 'Novel Problem Solving',
      question: 'Build me a website that tracks my mood using emojis, correlates it with weather data, and suggests activities based on both, but make it work offline and sync when online'
    },
    {
      category: 'Factual Accuracy',
      question: 'What were the exact technical specifications of the ENIAC computer, and how do they compare to a modern smartphone in terms of processing power, memory, and energy consumption?'
    },
    {
      category: 'Self-Correction',
      question: 'You said JavaScript is statically typed, but now you\'re saying it\'s dynamically typed. Which is it? Also, build me a type checker for it.'
    },
    {
      category: 'Creative Leaps',
      question: 'How would the principles of mycelium networks apply to designing a distributed database system? Give me a concrete implementation strategy.'
    },
    {
      category: 'Deep Subtext',
      question: 'My colleague said "That\'s an interesting approach" after I presented my idea. What do they really mean, and how should I respond?'
    },
    {
      category: 'Universal Capability',
      question: 'Analyze this Python code for security vulnerabilities, translate it to Rust, optimize it for performance, write unit tests, and create documentation - all in one response'
    },
    {
      category: 'Language Understanding',
      question: 'Explain the difference between "I could care less" and "I couldn\'t care less" - which one do people actually mean when they say the first one, and why is this linguistically interesting?'
    },
    {
      category: 'Implicit World Knowledge',
      question: 'If I leave my ice cream outside on a summer day in Phoenix, Arizona, what will happen and why? Include the physics, chemistry, and practical implications.'
    },
    {
      category: 'Emergent Reasoning',
      question: 'I notice that every time I refactor my code to be more modular, it becomes harder to test. Is there a pattern here? What\'s the underlying principle?'
    },
    {
      category: 'Temporal Reasoning',
      question: 'If a meeting was scheduled for "the day after tomorrow" on Monday, but got moved to "next week", and today is Wednesday, when is the meeting? Show your work.'
    },
    {
      category: 'Social Reasoning',
      question: 'My boss asked me to work late, but I have a family commitment. My coworker offered to cover for me but expects a favor in return. How do I navigate this social dynamic?'
    },
    {
      category: 'Code Debugging',
      question: 'This code has a race condition: async function processItems(items) { items.forEach(async item => { const data = await fetch(item.url); await save(data); }); } Fix it and explain why the original is broken.'
    },
    {
      category: 'Nuance Detection',
      question: 'Explain the difference in meaning and usage between "affect" and "effect", "disinterested" and "uninterested", and "comprise" and "compose" - with examples where using the wrong one changes the meaning significantly'
    },
    {
      category: 'Ethical Reasoning',
      question: 'A self-driving car must choose between hitting 5 pedestrians or swerving and hitting 1 passenger. Using utilitarianism, deontology, and virtue ethics, analyze what the car should do and why each framework gives a different answer.'
    },
    {
      category: 'Metacognition',
      question: 'I\'ve been making the same mistake in my code for weeks. Help me understand why I keep making it, what cognitive bias might be involved, and how to break the pattern.'
    },
    {
      category: 'Theory of Mind',
      question: 'Alice believes Bob knows that Charlie thinks the meeting is at 3pm, but actually Charlie thinks it\'s at 4pm and never told Bob. What does Alice believe, what does Bob believe, and what will happen when they meet?'
    },
    {
      category: 'Counterfactual',
      question: 'If the internet had been invented in 1950 instead of 1990, how would World War II, the Cold War, and the modern economy have been different? Trace the causal chains.'
    },
    {
      category: 'Trading & Finance',
      question: 'I have $10,000 to invest. Create a diversified portfolio using stocks, crypto, and bonds. Include position sizing based on 2% risk per trade, explain the technical analysis for each pick, and write a Python script to backtest it.'
    }
  ];

  console.log('🚀 Starting Synth SAI Browser Stress Tests...\n');
  console.log(`Testing ${tests.length} categories with challenging questions...\n`);

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const startTime = Date.now();
    
    console.log(`\n[${i + 1}/${tests.length}] Testing: ${test.category}`);
    console.log(`Question: ${test.question.substring(0, 100)}...`);
    
    try {
      const result = await synth.process(test.question);
      const elapsed = Date.now() - startTime;
      
      // Evaluate if response is adequate
      const passed = evaluateResponse(test.category, result.response, test.question);
      
      results.push({
        category: test.category,
        question: test.question,
        passed,
        response: result.response,
        time: elapsed
      });
      
      console.log(`Result: ${passed ? '✅ PASS' : '❌ FAIL'} (${elapsed}ms)`);
      
      if (!passed) {
        console.log(`Response preview: ${result.response.substring(0, 200)}...`);
      }
      
    } catch (error) {
      const elapsed = Date.now() - startTime;
      results.push({
        category: test.category,
        question: test.question,
        passed: false,
        response: '',
        error: error instanceof Error ? error.message : String(error),
        time: elapsed
      });
      console.log(`Result: ❌ ERROR (${elapsed}ms)`);
      console.log(`Error: ${error}`);
    }
  }

  // Generate report
  console.log('\n\n' + '='.repeat(80));
  console.log('STRESS TEST RESULTS');
  console.log('='.repeat(80));
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const totalTime = results.reduce((sum, r) => sum + r.time, 0);
  const avgTime = totalTime / results.length;
  
  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`Passed: ${passed} (${((passed / results.length) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${failed} (${((failed / results.length) * 100).toFixed(1)}%)`);
  console.log(`Total Time: ${totalTime}ms`);
  console.log(`Average Time: ${avgTime.toFixed(0)}ms`);
  
  console.log('\n' + '-'.repeat(80));
  console.log('FAILED TESTS:');
  console.log('-'.repeat(80));
  
  results.filter(r => !r.passed).forEach(r => {
    console.log(`\n❌ ${r.category}`);
    console.log(`Question: ${r.question}`);
    if (r.error) {
      console.log(`Error: ${r.error}`);
    } else {
      console.log(`Response: ${r.response.substring(0, 300)}...`);
    }
  });
  
  console.log('\n' + '-'.repeat(80));
  console.log('PASSED TESTS:');
  console.log('-'.repeat(80));
  
  results.filter(r => r.passed).forEach(r => {
    console.log(`\n✅ ${r.category} (${r.time}ms)`);
  });

  // Save results to window for inspection
  (window as any).__STRESS_TEST_RESULTS__ = results;
  console.log('\n\n💾 Results saved to window.__STRESS_TEST_RESULTS__');

  return results;
}

function evaluateResponse(category: string, response: string, question: string): boolean {
  // Basic evaluation - check if response is substantial and relevant
  const minLength = 50;
  const hasContent = response.length >= minLength;
  
  // Category-specific checks
  switch (category) {
    case 'Core Infrastructure':
      return hasContent && (response.includes('calculator') || response.includes('theme') || response.includes('version'));
    
    case 'Paraphrase Handling':
      return hasContent && (response.includes('calculator') || response.includes('compute'));
    
    case 'Novel Problem Solving':
      return hasContent && (response.includes('mood') || response.includes('weather') || response.includes('offline'));
    
    case 'Factual Accuracy':
      return hasContent && (response.includes('ENIAC') || response.includes('computer') || response.includes('specification'));
    
    case 'Self-Correction':
      return hasContent && (response.includes('typed') || response.includes('JavaScript') || response.includes('dynamic'));
    
    case 'Creative Leaps':
      return hasContent && (response.includes('mycelium') || response.includes('database') || response.includes('network'));
    
    case 'Deep Subtext':
      return hasContent && (response.includes('interesting') || response.includes('colleague') || response.includes('meaning'));
    
    case 'Universal Capability':
      return hasContent && (response.includes('security') || response.includes('translate') || response.includes('test'));
    
    case 'Language Understanding':
      return hasContent && (response.includes('care') || response.includes('less') || response.includes('meaning'));
    
    case 'Implicit World Knowledge':
      return hasContent && (response.includes('ice cream') || response.includes('melt') || response.includes('temperature'));
    
    case 'Emergent Reasoning':
      return hasContent && (response.includes('refactor') || response.includes('modular') || response.includes('test'));
    
    case 'Temporal Reasoning':
      return hasContent && (response.includes('meeting') || response.includes('day') || response.includes('Wednesday'));
    
    case 'Social Reasoning':
      return hasContent && (response.includes('boss') || response.includes('coworker') || response.includes('commitment'));
    
    case 'Code Debugging':
      return hasContent && (response.includes('race') || response.includes('async') || response.includes('condition'));
    
    case 'Nuance Detection':
      return hasContent && (response.includes('affect') || response.includes('effect') || response.includes('difference'));
    
    case 'Ethical Reasoning':
      return hasContent && (response.includes('car') || response.includes('pedestrian') || response.includes('ethical'));
    
    case 'Metacognition':
      return hasContent && (response.includes('mistake') || response.includes('bias') || response.includes('pattern'));
    
    case 'Theory of Mind':
      return hasContent && (response.includes('Alice') || response.includes('Bob') || response.includes('believe'));
    
    case 'Counterfactual':
      return hasContent && (response.includes('internet') || response.includes('1950') || response.includes('different'));
    
    case 'Trading & Finance':
      return hasContent && (response.includes('invest') || response.includes('portfolio') || response.includes('risk'));
    
    default:
      return hasContent;
  }
}

// Export for use in browser console
(window as any).runStressTest = runBrowserStressTest;

console.log('🧪 Stress test loaded! Run: runStressTest()');
