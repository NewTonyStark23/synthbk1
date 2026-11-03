// Edge Cases - Items 20.1-20.10
// Handle weird edge cases gracefully

import { Utils } from './utils';

// ============================================
// ITEM 20.1: Combinatorial Constraint Solver
// Handle multiple unusual constraints
// ============================================
export class CombinatorialConstraintSolver {
  solve(constraints: Array<{ type: string; value: any; operator: string }>): { 
    solution: any; 
    feasible: boolean; 
    approach: string 
  } {
    // Simple constraint satisfaction
    let solution: any = {};
    let feasible = true;
    const approaches: string[] = [];

    for (const constraint of constraints) {
      switch (constraint.type) {
        case 'numeric':
          if (!this.satisfyNumeric(constraint, solution)) {
            feasible = false;
            approaches.push(`Failed: ${constraint.type} ${constraint.operator} ${constraint.value}`);
          } else {
            approaches.push(`Satisfied: ${constraint.type} ${constraint.operator} ${constraint.value}`);
          }
          break;
        case 'string':
          if (!this.satisfyString(constraint, solution)) {
            feasible = false;
            approaches.push(`Failed: ${constraint.type} ${constraint.operator} ${constraint.value}`);
          } else {
            approaches.push(`Satisfied: ${constraint.type} ${constraint.operator} ${constraint.value}`);
          }
          break;
        case 'temporal':
          if (!this.satisfyTemporal(constraint, solution)) {
            feasible = false;
            approaches.push(`Failed: ${constraint.type} ${constraint.operator} ${constraint.value}`);
          } else {
            approaches.push(`Satisfied: ${constraint.type} ${constraint.operator} ${constraint.value}`);
          }
          break;
      }
    }

    return {
      solution,
      feasible,
      approach: approaches.join('; ')
    };
  }

  private satisfyNumeric(constraint: any, solution: any): boolean {
    const value = constraint.value;
    const operator = constraint.operator;

    switch (operator) {
      case 'equals':
        solution[constraint.type] = value;
        return true;
      case 'greater_than':
        solution[constraint.type] = value + 1;
        return true;
      case 'less_than':
        solution[constraint.type] = Math.max(0, value - 1);
        return true;
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          solution[constraint.type] = (value[0] + value[1]) / 2;
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  private satisfyString(constraint: any, solution: any): boolean {
    const value = constraint.value;
    const operator = constraint.operator;

    switch (operator) {
      case 'equals':
        solution[constraint.type] = value;
        return true;
      case 'contains':
        solution[constraint.type] = `text containing ${value}`;
        return true;
      case 'starts_with':
        solution[constraint.type] = `${value}...`;
        return true;
      case 'ends_with':
        solution[constraint.type] = `...${value}`;
        return true;
      default:
        return false;
    }
  }

  private satisfyTemporal(constraint: any, solution: any): boolean {
    const value = constraint.value;
    const operator = constraint.operator;

    switch (operator) {
      case 'before':
        solution[constraint.type] = new Date(value).getTime() - 86400000; // 1 day before
        return true;
      case 'after':
        solution[constraint.type] = new Date(value).getTime() + 86400000; // 1 day after
        return true;
      case 'on':
        solution[constraint.type] = new Date(value).getTime();
        return true;
      default:
        return false;
    }
  }
}

// ============================================
// ITEM 20.2: Exception Handler
// Detect unusual/exceptional cases
// ============================================
export class ExceptionHandler {
  private exceptionPatterns: Map<string, { handler: string; severity: string }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.exceptionPatterns.set('division by zero', {
      handler: 'return Infinity or throw error',
      severity: 'high'
    });
    this.exceptionPatterns.set('null reference', {
      handler: 'use optional chaining or null check',
      severity: 'high'
    });
    this.exceptionPatterns.set('array out of bounds', {
      handler: 'check length before access',
      severity: 'medium'
    });
    this.exceptionPatterns.set('infinite loop', {
      handler: 'add termination condition',
      severity: 'high'
    });
    this.exceptionPatterns.set('stack overflow', {
      handler: 'use iteration instead of recursion',
      severity: 'high'
    });
    this.exceptionPatterns.set('memory leak', {
      handler: 'clear references and use weak references',
      severity: 'medium'
    });
  }

  detect(text: string): Array<{ exception: string; handler: string; severity: string }> {
    const textLower = text.toLowerCase();
    const detected: Array<{ exception: string; handler: string; severity: string }> = [];

    this.exceptionPatterns.forEach((data, pattern) => {
      if (textLower.includes(pattern)) {
        detected.push({
          exception: pattern,
          handler: data.handler,
          severity: data.severity
        });
      }
    });

    return detected;
  }

  handle(exception: string): string {
    const data = this.exceptionPatterns.get(exception);
    if (!data) return 'Unknown exception';

    return `**Exception:** ${exception}\n**Severity:** ${data.severity}\n**Handler:** ${data.handler}`;
  }

  addPattern(pattern: string, handler: string, severity: string) {
    this.exceptionPatterns.set(pattern, { handler, severity });
  }
}

// ============================================
// ITEM 20.3: Boundary Condition Detector
// Detect boundary conditions
// ============================================
export class BoundaryConditionDetector {
  detect(value: any, type: string): { atBoundary: boolean; boundary: string; recommendation: string } {
    switch (type) {
      case 'number':
        return this.detectNumberBoundary(value);
      case 'string':
        return this.detectStringBoundary(value);
      case 'array':
        return this.detectArrayBoundary(value);
      case 'date':
        return this.detectDateBoundary(value);
      default:
        return { atBoundary: false, boundary: 'unknown', recommendation: 'no specific boundary' };
    }
  }

  private detectNumberBoundary(value: number): { atBoundary: boolean; boundary: string; recommendation: string } {
    if (value === 0) {
      return { atBoundary: true, boundary: 'zero', recommendation: 'Check for division by zero' };
    }
    if (value === Number.MAX_SAFE_INTEGER) {
      return { atBoundary: true, boundary: 'max safe integer', recommendation: 'Use BigInt for larger numbers' };
    }
    if (value === Number.MIN_SAFE_INTEGER) {
      return { atBoundary: true, boundary: 'min safe integer', recommendation: 'Use BigInt for smaller numbers' };
    }
    if (!Number.isFinite(value)) {
      return { atBoundary: true, boundary: 'infinity', recommendation: 'Handle Infinity and NaN cases' };
    }
    return { atBoundary: false, boundary: 'none', recommendation: 'within safe range' };
  }

  private detectStringBoundary(value: string): { atBoundary: boolean; boundary: string; recommendation: string } {
    if (value.length === 0) {
      return { atBoundary: true, boundary: 'empty string', recommendation: 'Check for empty string handling' };
    }
    if (value.length > 10000) {
      return { atBoundary: true, boundary: 'very long string', recommendation: 'Consider chunking or streaming' };
    }
    return { atBoundary: false, boundary: 'none', recommendation: 'normal length' };
  }

  private detectArrayBoundary(value: any[]): { atBoundary: boolean; boundary: string; recommendation: string } {
    if (value.length === 0) {
      return { atBoundary: true, boundary: 'empty array', recommendation: 'Check for empty array handling' };
    }
    if (value.length === 1) {
      return { atBoundary: true, boundary: 'single element', recommendation: 'Handle single-element edge case' };
    }
    if (value.length > 10000) {
      return { atBoundary: true, boundary: 'very large array', recommendation: 'Consider pagination or lazy loading' };
    }
    return { atBoundary: false, boundary: 'none', recommendation: 'normal size' };
  }

  private detectDateBoundary(value: Date): { atBoundary: boolean; boundary: string; recommendation: string } {
    const year = value.getFullYear();
    if (year < 1970) {
      return { atBoundary: true, boundary: 'before Unix epoch', recommendation: 'Check date handling for pre-1970 dates' };
    }
    if (year > 2100) {
      return { atBoundary: true, boundary: 'far future', recommendation: 'Verify date calculations for far future dates' };
    }
    return { atBoundary: false, boundary: 'none', recommendation: 'normal date range' };
  }
}

// ============================================
// ITEM 20.4: Corner Case Generator
// Generate corner cases proactively
// ============================================
export class CornerCaseGenerator {
  generate(inputType: string): string[] {
    switch (inputType) {
      case 'number':
        return ['0', '-1', '1', 'Number.MAX_SAFE_INTEGER', 'Number.MIN_SAFE_INTEGER', 'NaN', 'Infinity', '-Infinity', '0.1', '0.999999'];
      case 'string':
        return ['""', '" "', '"a"', '"very long string...".repeat(1000)', '"special chars: !@#$%^&*()"', '"unicode: 你好世界"', '"newlines:\\n\\n\\n"', '"tabs:\\t\\t\\t"'];
      case 'array':
        return ['[]', '[null]', '[undefined]', '[1]', '[...Array(10000)]', '[[[]]]', '[1, 2, 3, ...]', 'Array(10000).fill(0)'];
      case 'object':
        return ['{}', '{null: null}', '{undefined: undefined}', '{nested: {deep: {value: 1}}}', 'Object.create(null)', '{...spread, ...operator}'];
      case 'boolean':
        return ['true', 'false', 'null', 'undefined', '0', '1', '""', '"false"', 'NaN'];
      default:
        return ['null', 'undefined', 'NaN'];
    }
  }

  generateForFunction(funcName: string, paramTypes: string[]): Array<{ params: any[]; description: string }> {
    const cases: Array<{ params: any[]; description: string }> = [];

    // Generate edge cases for each parameter
    paramTypes.forEach((type, index) => {
      const edgeCases = this.generate(type);
      edgeCases.forEach(edgeCase => {
        const params = new Array(paramTypes.length).fill(null);
        params[index] = edgeCase;
        cases.push({
          params,
          description: `${funcName} with ${type} edge case at param ${index + 1}: ${edgeCase}`
        });
      });
    });

    return cases;
  }
}

// ============================================
// ITEM 20.5: Stress Testing Engine
// Stress test solutions
// ============================================
export class StressTestingEngine {
  testPerformance(fn: () => void, iterations: number = 1000): { 
    totalTime: number; 
    avgTime: number; 
    minTime: number; 
    maxTime: number; 
    passed: boolean 
  } {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      fn();
      const end = performance.now();
      times.push(end - start);
    }

    const totalTime = times.reduce((a, b) => a + b, 0);
    const avgTime = totalTime / iterations;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const passed = avgTime < 100; // Less than 100ms average

    return { totalTime, avgTime, minTime, maxTime, passed };
  }

  testMemory(fn: () => any, iterations: number = 100): { 
    memoryGrowth: number; 
    passed: boolean 
  } {
    if (typeof performance === 'undefined' || !(performance as any).memory) {
      return { memoryGrowth: 0, passed: true };
    }

    const perf = performance as any;
    const initialMemory = perf.memory.usedJSHeapSize;

    for (let i = 0; i < iterations; i++) {
      fn();
    }

    const finalMemory = perf.memory.usedJSHeapSize;
    const memoryGrowth = finalMemory - initialMemory;
    const passed = memoryGrowth < 10 * 1024 * 1024; // Less than 10MB growth

    return { memoryGrowth, passed };
  }

  testScalability(fn: (size: number) => void, sizes: number[] = [10, 100, 1000, 10000]): { 
    results: Array<{ size: number; time: number }>; 
    scalable: boolean 
  } {
    const results = sizes.map(size => {
      const start = performance.now();
      fn(size);
      const end = performance.now();
      return { size, time: end - start };
    });

    // Check if time grows linearly or worse
    const scalable = results.every((r, i) => {
      if (i === 0) return true;
      const sizeRatio = r.size / results[i - 1].size;
      const timeRatio = r.time / results[i - 1].time;
      return timeRatio <= sizeRatio * 1.5; // Allow 50% overhead
    });

    return { results, scalable };
  }
}

// ============================================
// ITEM 20.6: Fuzzy Logic Handling
// Handle fuzzy/uncertain inputs
// ============================================
export class FuzzyLogicHandler {
  private membershipFunctions: Map<string, (value: number) => number> = new Map();

  constructor() {
    this.loadFunctions();
  }

  private loadFunctions() {
    // Triangular membership functions
    this.membershipFunctions.set('low', (x: number) => {
      if (x <= 0) return 1;
      if (x >= 50) return 0;
      return (50 - x) / 50;
    });

    this.membershipFunctions.set('medium', (x: number) => {
      if (x <= 25 || x >= 75) return 0;
      if (x <= 50) return (x - 25) / 25;
      return (75 - x) / 25;
    });

    this.membershipFunctions.set('high', (x: number) => {
      if (x <= 50) return 0;
      if (x >= 100) return 1;
      return (x - 50) / 50;
    });
  }

  evaluate(value: number, fuzzySet: string): number {
    const fn = this.membershipFunctions.get(fuzzySet);
    if (!fn) return 0;
    return fn(value);
  }

  defuzzify(results: Array<{ set: string; membership: number }>): number {
    let numerator = 0;
    let denominator = 0;

    results.forEach(r => {
      // Use centroid of each fuzzy set
      let centroid = 0;
      if (r.set === 'low') centroid = 25;
      else if (r.set === 'medium') centroid = 50;
      else if (r.set === 'high') centroid = 75;

      numerator += centroid * r.membership;
      denominator += r.membership;
    });

    return denominator > 0 ? numerator / denominator : 0;
  }

  addMembershipFunction(name: string, fn: (value: number) => number) {
    this.membershipFunctions.set(name, fn);
  }
}

// ============================================
// ITEM 20.7: Multi-Constraint Satisfaction
// Satisfy multiple constraints simultaneously
// ============================================
export class MultiConstraintSatisfaction {
  satisfy(constraints: Array<{ variable: string; constraint: string; value: any }>): { 
    solution: Record<string, any>; 
    satisfied: boolean; 
    conflicts: string[] 
  } {
    const solution: Record<string, any> = {};
    const conflicts: string[] = [];

    // Group constraints by variable
    const grouped = new Map<string, Array<{ constraint: string; value: any }>>();
    constraints.forEach(c => {
      if (!grouped.has(c.variable)) {
        grouped.set(c.variable, []);
      }
      grouped.get(c.variable)!.push({ constraint: c.constraint, value: c.value });
    });

    // Solve each variable
    grouped.forEach((varConstraints, variable) => {
      const value = this.findSatisfyingValue(varConstraints);
      if (value !== null) {
        solution[variable] = value;
      } else {
        conflicts.push(`Cannot satisfy all constraints for ${variable}`);
      }
    });

    return {
      solution,
      satisfied: conflicts.length === 0,
      conflicts
    };
  }

  private findSatisfyingValue(constraints: Array<{ constraint: string; value: any }>): any {
    // Try to find a value that satisfies all constraints
    let candidates = this.generateCandidates(constraints[0]);

    for (let i = 1; i < constraints.length; i++) {
      candidates = candidates.filter(c => this.satisfiesConstraint(c, constraints[i]));
      if (candidates.length === 0) return null;
    }

    return candidates[0];
  }

  private generateCandidates(constraint: { constraint: string; value: any }): any[] {
    switch (constraint.constraint) {
      case 'equals':
        return [constraint.value];
      case 'greater_than':
        return [constraint.value + 1, constraint.value + 10, constraint.value + 100];
      case 'less_than':
        return [constraint.value - 1, constraint.value - 10, Math.max(0, constraint.value - 100)];
      case 'between':
        if (Array.isArray(constraint.value) && constraint.value.length === 2) {
          const [min, max] = constraint.value;
          return [min, (min + max) / 2, max];
        }
        return [];
      default:
        return [];
    }
  }

  private satisfiesConstraint(value: any, constraint: { constraint: string; value: any }): boolean {
    switch (constraint.constraint) {
      case 'equals':
        return value === constraint.value;
      case 'greater_than':
        return value > constraint.value;
      case 'less_than':
        return value < constraint.value;
      case 'between':
        if (Array.isArray(constraint.value) && constraint.value.length === 2) {
          return value >= constraint.value[0] && value <= constraint.value[1];
        }
        return false;
      default:
        return false;
    }
  }
}

// ============================================
// ITEM 20.8: Paradox Resolution
// Handle paradoxical requests
// ============================================
export class ParadoxResolver {
  private paradoxPatterns: Map<string, { resolution: string; approach: string }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.paradoxPatterns.set('simple but comprehensive', {
      resolution: 'Provide a simple overview with optional deep-dive sections',
      approach: 'Layered information architecture'
    });
    this.paradoxPatterns.set('fast but thorough', {
      resolution: 'Provide quick summary with detailed appendix',
      approach: 'Progressive disclosure'
    });
    this.paradoxPatterns.set('flexible but structured', {
      resolution: 'Use a flexible framework with clear guidelines',
      approach: 'Structured flexibility'
    });
    this.paradoxPatterns.set('powerful but simple', {
      resolution: 'Hide complexity behind simple interface',
      approach: 'Abstraction layers'
    });
  }

  resolve(paradox: string): { resolution: string; approach: string } | null {
    const paradoxLower = paradox.toLowerCase();
    
    for (const [pattern, data] of this.paradoxPatterns.entries()) {
      if (paradoxLower.includes(pattern)) {
        return data;
      }
    }

    return null;
  }

  formatResolution(paradox: string): string {
    const resolution = this.resolve(paradox);
    
    if (!resolution) {
      return `I couldn't find a standard resolution for the paradox: "${paradox}". Could you clarify the specific requirements?`;
    }

    return `**Paradox:** "${paradox}"\n\n**Resolution:** ${resolution.resolution}\n\n**Approach:** ${resolution.approach}`;
  }

  addPattern(pattern: string, resolution: string, approach: string) {
    this.paradoxPatterns.set(pattern, { resolution, approach });
  }
}

// ============================================
// ITEM 20.9: Contradiction Detection
// Detect contradictions in request
// ============================================
export class ContradictionDetection {
  detect(request: string): { hasContradiction: boolean; contradictions: string[] } {
    const contradictions: string[] = [];
    const requestLower = request.toLowerCase();

    // Check for common contradictions
    const contradictionPairs = [
      ['fast', 'thorough'],
      ['simple', 'comprehensive'],
      ['cheap', 'high quality'],
      ['quick', 'detailed'],
      ['flexible', 'strict'],
    ];

    contradictionPairs.forEach(([term1, term2]) => {
      if (requestLower.includes(term1) && requestLower.includes(term2)) {
        contradictions.push(`"${term1}" and "${term2}" may conflict`);
      }
    });

    // Check for explicit contradictions
    if (requestLower.includes('no') && requestLower.includes('must have')) {
      contradictions.push('Request contains both exclusion and requirement');
    }

    return {
      hasContradiction: contradictions.length > 0,
      contradictions
    };
  }

  formatContradictions(request: string): string {
    const { hasContradiction, contradictions } = this.detect(request);
    
    if (!hasContradiction) {
      return 'No contradictions detected in the request.';
    }

    let output = '**Contradictions Detected:**\n\n';
    contradictions.forEach(c => output += `• ${c}\n`);
    output += '\nPlease clarify which requirement takes priority.';
    
    return output;
  }
}

// ============================================
// ITEM 20.10: Graceful Degradation
// When can't meet all requirements, degrade gracefully
// ============================================
export class GracefulDegradation {
  degrade(capabilities: string[], available: string[]): { 
    provided: string[]; 
    degraded: string[]; 
    message: string 
  } {
    const provided = capabilities.filter(c => available.includes(c));
    const degraded = capabilities.filter(c => !available.includes(c));

    let message = '';
    if (degraded.length === 0) {
      message = 'All capabilities available.';
    } else if (provided.length === 0) {
      message = 'No capabilities available. Please check requirements.';
    } else {
      message = `Providing: ${provided.join(', ')}. Degraded: ${degraded.join(', ')}.`;
    }

    return { provided, degraded, message };
  }

  suggestAlternatives(missing: string[]): string[] {
    const alternatives: Map<string, string[]> = new Map([
      ['real-time', ['polling', 'periodic updates']],
      ['database', ['localStorage', 'sessionStorage']],
      ['authentication', ['basic auth', 'API key']],
      ['caching', ['no caching', 'manual caching']],
      ['analytics', ['basic logging', 'console output']],
    ]);

    const suggestions: string[] = [];
    missing.forEach(cap => {
      const alts = alternatives.get(cap);
      if (alts) {
        suggestions.push(`${cap} → ${alts.join(' or ')}`);
      }
    });

    return suggestions;
  }

  formatDegradation(capabilities: string[], available: string[]): string {
    const { provided, degraded, message } = this.degrade(capabilities, available);
    
    let output = `**Graceful Degradation Report**\n\n`;
    output += `**Status:** ${message}\n\n`;
    
    if (provided.length > 0) {
      output += `**Provided:** ${provided.join(', ')}\n`;
    }
    
    if (degraded.length > 0) {
      output += `\n**Degraded:** ${degraded.join(', ')}\n`;
      const alternatives = this.suggestAlternatives(degraded);
      if (alternatives.length > 0) {
        output += `\n**Alternatives:**\n`;
        alternatives.forEach(alt => output += `• ${alt}\n`);
      }
    }
    
    return output;
  }
}

// ============================================
// Export all edge case systems
// ============================================
export const EdgeCaseSystems = {
  CombinatorialConstraintSolver,
  ExceptionHandler,
  BoundaryConditionDetector,
  CornerCaseGenerator,
  StressTestingEngine,
  FuzzyLogicHandler,
  MultiConstraintSatisfaction,
  ParadoxResolver,
  ContradictionDetection,
  GracefulDegradation,
};
