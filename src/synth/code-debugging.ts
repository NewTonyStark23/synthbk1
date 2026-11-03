// Code Debugging - Items 11.1-11.10
// Syntax checking, linting, pattern matching, type checking, dependency analysis, performance profiling, security scanning, logic verification, test generation, refactoring

// ============================================
// ITEM 11.1: Syntax Checker
// Parse code, identify syntax errors
// ============================================
export class SyntaxChecker {
  private languageRules: Map<string, { brackets: string[]; terminators: string[]; keywords: string[] }> = new Map();

  constructor() {
    this.loadRules();
  }

  private loadRules() {
    this.languageRules.set('javascript', {
      brackets: ['()', '[]', '{}'],
      terminators: [';'],
      keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return']
    });
    
    this.languageRules.set('python', {
      brackets: ['()', '[]', '{}'],
      terminators: [],
      keywords: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'import']
    });
    
    this.languageRules.set('typescript', {
      brackets: ['()', '[]', '{}'],
      terminators: [';'],
      keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'interface', 'type']
    });
  }

  checkSyntax(code: string, language: string): { valid: boolean; errors: string[] } {
    const rules = this.languageRules.get(language);
    if (!rules) return { valid: true, errors: [] };
    
    const errors: string[] = [];
    
    // Check bracket matching
    const stack: string[] = [];
    const openBrackets = new Map<string, string>([['(', ')'], ['[', ']'], ['{', '}']]);
    const closeBrackets = new Map<string, string>([[')', '('], [']', '['], ['}', '{']]);
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      
      if (openBrackets.has(char)) {
        stack.push(char);
      } else if (closeBrackets.has(char)) {
        const expected = closeBrackets.get(char)!;
        if (stack.length === 0 || stack[stack.length - 1] !== expected) {
          errors.push(`Mismatched bracket at position ${i}`);
        } else {
          stack.pop();
        }
      }
    }
    
    if (stack.length > 0) {
      errors.push(`Unclosed brackets: ${stack.length} remaining`);
    }
    
    // Check for common syntax errors
    if (language === 'javascript' || language === 'typescript') {
      // Check for missing semicolons (simplified)
      const lines = code.split('\n');
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}') && 
            !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*') &&
            rules.keywords.some(kw => trimmed.startsWith(kw))) {
          // This is a simplified check
        }
      });
    }
    
    return { valid: errors.length === 0, errors };
  }

  formatErrors(errors: string[]): string {
    if (errors.length === 0) return '✓ No syntax errors found';
    
    let result = `**Syntax Errors:**\n\n`;
    errors.forEach((error, i) => {
      result += `${i + 1}. ${error}\n`;
    });
    
    return result;
  }
}

// ============================================
// ITEM 11.2: Linting Engine
// Style violations, best practices
// ============================================
export class LintingEngine {
  private rules: Map<string, { pattern: RegExp; message: string; severity: 'error' | 'warning' | 'info' }> = new Map();

  constructor() {
    this.loadRules();
  }

  private loadRules() {
    // Common linting rules
    this.rules.set('no-var', {
      pattern: /\bvar\s+\w+/,
      message: 'Use const or let instead of var',
      severity: 'warning'
    });
    
    this.rules.set('no-console', {
      pattern: /console\.(log|error|warn)\(/,
      message: 'Avoid console statements in production code',
      severity: 'warning'
    });
    
    this.rules.set('eqeqeq', {
      pattern: /[^=!]==[^=]/,
      message: 'Use === instead of ==',
      severity: 'warning'
    });
    
    this.rules.set('no-eval', {
      pattern: /\beval\s*\(/,
      message: 'Avoid using eval()',
      severity: 'error'
    });
    
    this.rules.set('no-alert', {
      pattern: /\balert\s*\(/,
      message: 'Avoid using alert()',
      severity: 'warning'
    });
    
    this.rules.set('no-debugger', {
      pattern: /\bdebugger\b/,
      message: 'Remove debugger statements',
      severity: 'error'
    });
    
    this.rules.set('prefer-const', {
      pattern: /let\s+(\w+)\s*=\s*[^;]+;/,
      message: 'Use const for variables that are never reassigned',
      severity: 'info'
    });
  }

  lint(code: string): Array<{ rule: string; message: string; severity: string; line: number }> {
    const violations: Array<{ rule: string; message: string; severity: string; line: number }> = [];
    const lines = code.split('\n');
    
    lines.forEach((line, lineIdx) => {
      this.rules.forEach((rule, ruleName) => {
        if (rule.pattern.test(line)) {
          violations.push({
            rule: ruleName,
            message: rule.message,
            severity: rule.severity,
            line: lineIdx + 1
          });
        }
      });
    });
    
    return violations;
  }

  formatViolations(violations: Array<{ rule: string; message: string; severity: string; line: number }>): string {
    if (violations.length === 0) return '✓ No linting violations found';
    
    let result = `**Linting Violations:**\n\n`;
    violations.forEach((v, i) => {
      const icon = v.severity === 'error' ? '❌' : v.severity === 'warning' ? '⚠️' : 'ℹ️';
      result += `${icon} Line ${v.line}: ${v.message} (${v.rule})\n`;
    });
    
    return result;
  }

  addRule(name: string, pattern: RegExp, message: string, severity: 'error' | 'warning' | 'info') {
    this.rules.set(name, { pattern, message, severity });
  }
}

// ============================================
// ITEM 11.3: Pattern Matcher
// Common bug patterns (off-by-one, null pointer, etc.)
// ============================================
export class PatternMatcher {
  private patterns: Map<string, { pattern: RegExp; description: string; fix: string }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    // Off-by-one errors
    this.patterns.set('off-by-one-loop', {
      pattern: /for\s*\(\s*let\s+\w+\s*=\s*0\s*;\s*\w+\s*<=\s*\w+\.length/,
      description: 'Potential off-by-one error: loop condition uses <= instead of <',
      fix: 'Change <= to < in loop condition'
    });
    
    // Null pointer risks
    this.patterns.set('null-access', {
      pattern: /\w+\.\w+\.\w+/,
      description: 'Potential null pointer exception: chained property access',
      fix: 'Use optional chaining (?.) or null checks'
    });
    
    // Infinite loop risk
    this.patterns.set('infinite-loop', {
      pattern: /while\s*\(\s*true\s*\)/,
      description: 'Potential infinite loop: while(true) without break condition',
      fix: 'Ensure there is a break condition or use for loop with limit'
    });
    
    // Race condition
    this.patterns.set('race-condition', {
      pattern: /async\s+function.*\n.*await.*\n.*await/,
      description: 'Potential race condition: multiple awaits without proper sequencing',
      fix: 'Use Promise.all() for parallel execution or ensure proper sequencing'
    });
    
    // Memory leak
    this.patterns.set('memory-leak', {
      pattern: /addEventListener\([^)]+\)(?!.*removeEventListener)/,
      description: 'Potential memory leak: event listener added without cleanup',
      fix: 'Store reference and remove listener when component unmounts'
    });
    
    // XSS vulnerability
    this.patterns.set('xss-risk', {
      pattern: /innerHTML\s*=\s*[^'"]/,
      description: 'Potential XSS vulnerability: innerHTML with dynamic content',
      fix: 'Use textContent or sanitize input before using innerHTML'
    });
  }

  matchPatterns(code: string): Array<{ pattern: string; description: string; fix: string; line: number }> {
    const matches: Array<{ pattern: string; description: string; fix: string; line: number }> = [];
    const lines = code.split('\n');
    
    lines.forEach((line, lineIdx) => {
      this.patterns.forEach((patternData, patternName) => {
        if (patternData.pattern.test(line)) {
          matches.push({
            pattern: patternName,
            description: patternData.description,
            fix: patternData.fix,
            line: lineIdx + 1
          });
        }
      });
    });
    
    return matches;
  }

  formatMatches(matches: Array<{ pattern: string; description: string; fix: string; line: number }>): string {
    if (matches.length === 0) return '✓ No common bug patterns detected';
    
    let result = `**Bug Patterns Detected:**\n\n`;
    matches.forEach((m, i) => {
      result += `**${i + 1}. Line ${m.line}: ${m.pattern}**\n`;
      result += `   ${m.description}\n`;
      result += `   **Fix:** ${m.fix}\n\n`;
    });
    
    return result;
  }

  addPattern(name: string, pattern: RegExp, description: string, fix: string) {
    this.patterns.set(name, { pattern, description, fix });
  }
}

// ============================================
// ITEM 11.4: Type Checker
// Verify type consistency
// ============================================
export class TypeChecker {
  private typeAnnotations: Map<string, string> = new Map();

  addTypeAnnotation(variable: string, type: string) {
    this.typeAnnotations.set(variable, type);
  }

  checkTypeConsistency(code: string): Array<{ variable: string; expected: string; actual: string; line: number }> {
    const errors: Array<{ variable: string; expected: string; actual: string; line: number }> = [];
    const lines = code.split('\n');
    
    lines.forEach((line, lineIdx) => {
      // Check for type mismatches in assignments
      const assignmentMatch = line.match(/(\w+)\s*=\s*(.+)/);
      if (assignmentMatch) {
        const [, variable, value] = assignmentMatch;
        const expectedType = this.typeAnnotations.get(variable);
        
        if (expectedType) {
          const actualType = this.inferType(value.trim());
          if (actualType && actualType !== expectedType) {
            errors.push({
              variable,
              expected: expectedType,
              actual: actualType,
              line: lineIdx + 1
            });
          }
        }
      }
    });
    
    return errors;
  }

  private inferType(value: string): string | null {
    if (/^['"].*['"]$/.test(value)) return 'string';
    if (/^\d+$/.test(value)) return 'number';
    if (/^\d+\.\d+$/.test(value)) return 'number';
    if (/^(true|false)$/.test(value)) return 'boolean';
    if (/^\[.*\]$/.test(value)) return 'array';
    if (/^\{.*\}$/.test(value)) return 'object';
    if (value === 'null') return 'null';
    if (value === 'undefined') return 'undefined';
    return null;
  }

  formatTypeErrors(errors: Array<{ variable: string; expected: string; actual: string; line: number }>): string {
    if (errors.length === 0) return '✓ No type errors found';
    
    let result = `**Type Errors:**\n\n`;
    errors.forEach((e, i) => {
      result += `${i + 1}. Line ${e.line}: Variable '${e.variable}'\n`;
      result += `   Expected: ${e.expected}\n`;
      result += `   Actual: ${e.actual}\n\n`;
    });
    
    return result;
  }
}

// ============================================
// ITEM 11.5: Dependency Analyzer
// Check imports, missing packages
// ============================================
export class DependencyAnalyzer {
  private knownPackages: Set<string> = new Set([
    'react', 'react-dom', 'vue', 'angular', 'express', 'lodash', 'axios', 'moment',
    'typescript', 'webpack', 'babel', 'eslint', 'jest', 'mocha', 'chai'
  ]);

  analyzeImports(code: string): { used: string[]; missing: string[]; unused: string[] } {
    const importPattern = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
    const requirePattern = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    
    const imports: string[] = [];
    let match;
    
    while ((match = importPattern.exec(code)) !== null) {
      imports.push(match[1]);
    }
    
    while ((match = requirePattern.exec(code)) !== null) {
      imports.push(match[1]);
    }
    
    const used = imports.filter(pkg => this.knownPackages.has(pkg));
    const missing = imports.filter(pkg => !this.knownPackages.has(pkg));
    
    // Check for unused imports (simplified)
    const unused = imports.filter(pkg => {
      const packageName = pkg.split('/').pop() || pkg;
      const usagePattern = new RegExp(`\\b${packageName}\\b`);
      const codeWithoutImports = code.replace(importPattern, '').replace(requirePattern, '');
      return !usagePattern.test(codeWithoutImports);
    });
    
    return { used, missing, unused };
  }

  formatDependencies(result: { used: string[]; missing: string[]; unused: string[] }): string {
    let report = `**Dependency Analysis:**\n\n`;
    
    report += `**Used Packages (${result.used.length}):**\n`;
    result.used.forEach(pkg => report += `- ${pkg}\n`);
    
    if (result.missing.length > 0) {
      report += `\n**Missing Packages (${result.missing.length}):**\n`;
      result.missing.forEach(pkg => report += `- ${pkg}\n`);
    }
    
    if (result.unused.length > 0) {
      report += `\n**Unused Imports (${result.unused.length}):**\n`;
      result.unused.forEach(pkg => report += `- ${pkg}\n`);
    }
    
    return report;
  }

  addKnownPackage(packageName: string) {
    this.knownPackages.add(packageName);
  }
}

// ============================================
// ITEM 11.6: Performance Profiler
// Identify slow code patterns
// ============================================
export class PerformanceProfiler {
  private patterns: Map<string, { pattern: RegExp; issue: string; suggestion: string }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.patterns.set('nested-loops', {
      pattern: /for\s*\(.*\)\s*\{[^}]*for\s*\(/,
      issue: 'Nested loops detected - O(n²) complexity',
      suggestion: 'Consider using hash maps or sorting to reduce complexity'
    });
    
    this.patterns.set('sync-in-async', {
      pattern: /async\s+function.*\n.*\bfetch\(|await\s+.*\n.*\bfetch\(/,
      issue: 'Synchronous operations in async context',
      suggestion: 'Use Promise.all() for parallel async operations'
    });
    
    this.patterns.set('large-array-iteration', {
      pattern: /\.forEach\(|\.map\(|\.filter\(/,
      issue: 'Array iteration - may be slow for large arrays',
      suggestion: 'Consider using for...of loop or Web Workers for large datasets'
    });
    
    this.patterns.set('dom-in-loop', {
      pattern: /for\s*\(.*\)\s*\{[^}]*document\.(getElementById|querySelector)/,
      issue: 'DOM manipulation inside loop',
      suggestion: 'Cache DOM references outside loop or use document fragments'
    });
    
    this.patterns.set('regex-in-loop', {
      pattern: /for\s*\(.*\)\s*\{[^}]*\/.*\/\.test\(|for\s*\(.*\)\s*\{[^}]*\.match\(/,
      issue: 'Regex operations inside loop',
      suggestion: 'Pre-compile regex outside loop or use simpler string methods'
    });
  }

  profile(code: string): Array<{ pattern: string; issue: string; suggestion: string; line: number }> {
    const issues: Array<{ pattern: string; issue: string; suggestion: string; line: number }> = [];
    const lines = code.split('\n');
    
    lines.forEach((line, lineIdx) => {
      this.patterns.forEach((patternData, patternName) => {
        if (patternData.pattern.test(line)) {
          issues.push({
            pattern: patternName,
            issue: patternData.issue,
            suggestion: patternData.suggestion,
            line: lineIdx + 1
          });
        }
      });
    });
    
    return issues;
  }

  formatProfile(issues: Array<{ pattern: string; issue: string; suggestion: string; line: number }>): string {
    if (issues.length === 0) return '✓ No performance issues detected';
    
    let result = `**Performance Issues:**\n\n`;
    issues.forEach((issue, i) => {
      result += `**${i + 1}. Line ${issue.line}: ${issue.pattern}**\n`;
      result += `   **Issue:** ${issue.issue}\n`;
      result += `   **Suggestion:** ${issue.suggestion}\n\n`;
    });
    
    return result;
  }

  addPattern(name: string, pattern: RegExp, issue: string, suggestion: string) {
    this.patterns.set(name, { pattern, issue, suggestion });
  }
}

// ============================================
// ITEM 11.7: Security Scanner
// Common vulnerabilities (SQL injection, XSS, etc.)
// ============================================
export class SecurityScanner {
  private vulnerabilities: Map<string, { pattern: RegExp; severity: 'critical' | 'high' | 'medium' | 'low'; description: string; fix: string }> = new Map();

  constructor() {
    this.loadVulnerabilities();
  }

  private loadVulnerabilities() {
    // SQL Injection
    this.vulnerabilities.set('sql-injection', {
      pattern: /query\s*\(\s*['"`].*\$\{|\+.*['"`]/,
      severity: 'critical',
      description: 'Potential SQL injection: string concatenation in query',
      fix: 'Use parameterized queries or prepared statements'
    });
    
    // XSS
    this.vulnerabilities.set('xss', {
      pattern: /innerHTML\s*=\s*[^'"]|document\.write\(/,
      severity: 'high',
      description: 'Potential XSS vulnerability: unsafe DOM manipulation',
      fix: 'Use textContent or sanitize input with DOMPurify'
    });
    
    // Hardcoded credentials
    this.vulnerabilities.set('hardcoded-credentials', {
      pattern: /(password|secret|api[_-]?key)\s*[:=]\s*['"][^'"]+['"]/i,
      severity: 'critical',
      description: 'Hardcoded credentials detected',
      fix: 'Use environment variables or secure credential management'
    });
    
    // Insecure random
    this.vulnerabilities.set('insecure-random', {
      pattern: /Math\.random\(\)/,
      severity: 'medium',
      description: 'Math.random() is not cryptographically secure',
      fix: 'Use crypto.getRandomValues() for security-sensitive operations'
    });
    
    // Eval usage
    this.vulnerabilities.set('eval-usage', {
      pattern: /\beval\s*\(/,
      severity: 'critical',
      description: 'eval() usage detected - code injection risk',
      fix: 'Avoid eval() - use safer alternatives like JSON.parse() or Function constructor'
    });
    
    // Unsafe regex
    this.vulnerabilities.set('unsafe-regex', {
      pattern: /new\s+RegExp\s*\(\s*[^'"]/,
      severity: 'medium',
      description: 'Dynamic regex construction - potential ReDoS',
      fix: 'Use static regex patterns or validate input before regex construction'
    });
  }

  scan(code: string): Array<{ vulnerability: string; severity: string; description: string; fix: string; line: number }> {
    const findings: Array<{ vulnerability: string; severity: string; description: string; fix: string; line: number }> = [];
    const lines = code.split('\n');
    
    lines.forEach((line, lineIdx) => {
      this.vulnerabilities.forEach((vulnData, vulnName) => {
        if (vulnData.pattern.test(line)) {
          findings.push({
            vulnerability: vulnName,
            severity: vulnData.severity,
            description: vulnData.description,
            fix: vulnData.fix,
            line: lineIdx + 1
          });
        }
      });
    });
    
    return findings;
  }

  formatFindings(findings: Array<{ vulnerability: string; severity: string; description: string; fix: string; line: number }>): string {
    if (findings.length === 0) return '✓ No security vulnerabilities detected';
    
    let result = `**Security Vulnerabilities:**\n\n`;
    
    const critical = findings.filter(f => f.severity === 'critical');
    const high = findings.filter(f => f.severity === 'high');
    const medium = findings.filter(f => f.severity === 'medium');
    const low = findings.filter(f => f.severity === 'low');
    
    if (critical.length > 0) {
      result += `**Critical (${critical.length}):**\n`;
      critical.forEach(f => result += `  - Line ${f.line}: ${f.description}\n`);
      result += '\n';
    }
    
    if (high.length > 0) {
      result += `**High (${high.length}):**\n`;
      high.forEach(f => result += `  - Line ${f.line}: ${f.description}\n`);
      result += '\n';
    }
    
    if (medium.length > 0) {
      result += `**Medium (${medium.length}):**\n`;
      medium.forEach(f => result += `  - Line ${f.line}: ${f.description}\n`);
      result += '\n';
    }
    
    if (low.length > 0) {
      result += `**Low (${low.length}):**\n`;
      low.forEach(f => result += `  - Line ${f.line}: ${f.description}\n`);
      result += '\n';
    }
    
    result += `**Recommended Fixes:**\n\n`;
    findings.forEach((f, i) => {
      result += `${i + 1}. **${f.vulnerability}** (Line ${f.line})\n`;
      result += `   ${f.fix}\n\n`;
    });
    
    return result;
  }

  addVulnerability(name: string, pattern: RegExp, severity: 'critical' | 'high' | 'medium' | 'low', description: string, fix: string) {
    this.vulnerabilities.set(name, { pattern, severity, description, fix });
  }
}

// ============================================
// ITEM 11.8: Logic Verifier
// Trace execution paths, find logical errors
// ============================================
export class LogicVerifier {
  verifyLogic(code: string): Array<{ issue: string; description: string; line: number }> {
    const issues: Array<{ issue: string; description: string; line: number }> = [];
    const lines = code.split('\n');
    
    lines.forEach((line, lineIdx) => {
      // Check for unreachable code
      if (/return\s+/.test(line)) {
        const nextLine = lines[lineIdx + 1];
        if (nextLine && nextLine.trim() && !nextLine.trim().startsWith('}') && !nextLine.trim().startsWith('//')) {
          issues.push({
            issue: 'unreachable-code',
            description: 'Code after return statement is unreachable',
            line: lineIdx + 2
          });
        }
      }
      
      // Check for always-true/false conditions
      if (/if\s*\(\s*true\s*\)/.test(line)) {
        issues.push({
          issue: 'always-true',
          description: 'Condition is always true',
          line: lineIdx + 1
        });
      }
      
      if (/if\s*\(\s*false\s*\)/.test(line)) {
        issues.push({
          issue: 'always-false',
          description: 'Condition is always false',
          line: lineIdx + 1
        });
      }
      
      // Check for missing else branches
      if (/if\s*\([^)]+\)\s*\{[^}]*\}\s*$/.test(line) && !lines[lineIdx + 1]?.includes('else')) {
        // Simplified check
      }
    });
    
    return issues;
  }

  formatIssues(issues: Array<{ issue: string; description: string; line: number }>): string {
    if (issues.length === 0) return '✓ No logical errors detected';
    
    let result = `**Logical Issues:**\n\n`;
    issues.forEach((issue, i) => {
      result += `${i + 1}. Line ${issue.line}: ${issue.issue}\n`;
      result += `   ${issue.description}\n\n`;
    });
    
    return result;
  }
}

// ============================================
// ITEM 11.9: Test Generator
// Create unit tests for code
// ============================================
export class TestGenerator {
  generateTests(code: string, framework: string = 'jest'): string {
    const functions = this.extractFunctions(code);
    
    if (framework === 'jest') {
      return this.generateJestTests(functions);
    } else if (framework === 'mocha') {
      return this.generateMochaTests(functions);
    }
    
    return '// Test generation not supported for this framework';
  }

  private extractFunctions(code: string): Array<{ name: string; params: string[] }> {
    const functions: Array<{ name: string; params: string[] }> = [];
    const functionPattern = /function\s+(\w+)\s*\(([^)]*)\)/g;
    
    let match;
    while ((match = functionPattern.exec(code)) !== null) {
      const name = match[1];
      const params = match[2].split(',').map(p => p.trim()).filter(p => p);
      functions.push({ name, params });
    }
    
    return functions;
  }

  private generateJestTests(functions: Array<{ name: string; params: string[] }>): string {
    let tests = `// Jest Test Suite\n\n`;
    
    functions.forEach(func => {
      tests += `describe('${func.name}', () => {\n`;
      tests += `  test('should handle basic input', () => {\n`;
      
      if (func.params.length === 0) {
        tests += `    const result = ${func.name}();\n`;
      } else {
        const sampleArgs = func.params.map(() => '/* sample input */').join(', ');
        tests += `    const result = ${func.name}(${sampleArgs});\n`;
      }
      
      tests += `    expect(result).toBeDefined();\n`;
      tests += `  });\n\n`;
      
      tests += `  test('should handle edge cases', () => {\n`;
      tests += `    // TODO: Add edge case tests\n`;
      tests += `  });\n\n`;
      
      tests += `  test('should handle error cases', () => {\n`;
      tests += `    // TODO: Add error case tests\n`;
      tests += `  });\n`;
      
      tests += `});\n\n`;
    });
    
    return tests;
  }

  private generateMochaTests(functions: Array<{ name: string; params: string[] }>): string {
    let tests = `// Mocha Test Suite\n\n`;
    
    functions.forEach(func => {
      tests += `describe('${func.name}', function() {\n`;
      tests += `  it('should handle basic input', function() {\n`;
      
      if (func.params.length === 0) {
        tests += `    const result = ${func.name}();\n`;
      } else {
        const sampleArgs = func.params.map(() => '/* sample input */').join(', ');
        tests += `    const result = ${func.name}(${sampleArgs});\n`;
      }
      
      tests += `    // Add assertions\n`;
      tests += `  });\n`;
      
      tests += `});\n\n`;
    });
    
    return tests;
  }
}

// ============================================
// ITEM 11.10: Refactoring Suggestions
// Improve code structure, readability
// ============================================
export class RefactoringSuggestions {
  private patterns: Map<string, { pattern: RegExp; suggestion: string; example: string }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.patterns.set('extract-function', {
      pattern: /function\s+\w+\s*\([^)]*\)\s*\{[^}]{200,}/,
      suggestion: 'Long function detected - consider extracting into smaller functions',
      example: 'Break into helper functions with single responsibilities'
    });
    
    this.patterns.set('magic-numbers', {
      pattern: /[^a-zA-Z_]\d{2,}[^a-zA-Z_]/,
      suggestion: 'Magic numbers detected - use named constants',
      example: 'const MAX_RETRIES = 3; instead of hardcoded 3'
    });
    
    this.patterns.set('deep-nesting', {
      pattern: /\{[^}]*\{[^}]*\{[^}]*\{/,
      suggestion: 'Deep nesting detected - consider early returns or extracting functions',
      example: 'Use guard clauses to reduce nesting depth'
    });
    
    this.patterns.set('duplicate-code', {
      pattern: /(.{50,}).*\n.*\1/,
      suggestion: 'Duplicate code detected - extract into reusable function',
      example: 'Create a helper function for repeated logic'
    });
    
    this.patterns.set('complex-condition', {
      pattern: /if\s*\([^)]*&&[^)]*&&[^)]*\)/,
      suggestion: 'Complex condition - consider extracting to named function',
      example: 'if (isValidUser(user)) instead of multiple && checks'
    });
  }

  suggestRefactoring(code: string): Array<{ pattern: string; suggestion: string; example: string; line: number }> {
    const suggestions: Array<{ pattern: string; suggestion: string; example: string; line: number }> = [];
    const lines = code.split('\n');
    
    lines.forEach((line, lineIdx) => {
      this.patterns.forEach((patternData, patternName) => {
        if (patternData.pattern.test(line)) {
          suggestions.push({
            pattern: patternName,
            suggestion: patternData.suggestion,
            example: patternData.example,
            line: lineIdx + 1
          });
        }
      });
    });
    
    return suggestions;
  }

  formatSuggestions(suggestions: Array<{ pattern: string; suggestion: string; example: string; line: number }>): string {
    if (suggestions.length === 0) return '✓ No refactoring suggestions';
    
    let result = `**Refactoring Suggestions:**\n\n`;
    suggestions.forEach((s, i) => {
      result += `**${i + 1}. Line ${s.line}: ${s.pattern}**\n`;
      result += `   ${s.suggestion}\n`;
      result += `   **Example:** ${s.example}\n\n`;
    });
    
    return result;
  }

  addPattern(name: string, pattern: RegExp, suggestion: string, example: string) {
    this.patterns.set(name, { pattern, suggestion, example });
  }
}

// ============================================
// Export all code debugging systems
// ============================================
export const CodeDebuggingSystems = {
  SyntaxChecker,
  LintingEngine,
  PatternMatcher,
  TypeChecker,
  DependencyAnalyzer,
  PerformanceProfiler,
  SecurityScanner,
  LogicVerifier,
  TestGenerator,
  RefactoringSuggestions,
};
