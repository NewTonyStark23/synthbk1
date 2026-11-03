// Ethical Reasoning - Items 25.1-25.10
// Ethical frameworks, moral dilemmas, value alignment, harm prevention, fairness analysis, rights protection, consequentialist analysis, deontological analysis, virtue ethics, consistency checking

// ============================================
// ITEM 25.1: Ethical Framework Application
// Utilitarianism, deontology, virtue ethics, care ethics
// ============================================
export class EthicalFrameworkApplication {
  private frameworks: Map<string, { principles: string[]; decisionMethod: string }> = new Map();

  constructor() {
    this.loadFrameworks();
  }

  private loadFrameworks() {
    this.frameworks.set('utilitarianism', {
      principles: ['maximize happiness', 'minimize suffering', 'greatest good for greatest number'],
      decisionMethod: 'Calculate net utility of each action, choose highest'
    });

    this.frameworks.set('deontology', {
      principles: ['follow moral rules', 'duty-based', 'categorical imperative', 'never use people as means'],
      decisionMethod: 'Check if action follows universal moral rules'
    });

    this.frameworks.set('virtue_ethics', {
      principles: ['develop good character', 'practical wisdom', 'golden mean', 'flourishing'],
      decisionMethod: 'Ask "What would a virtuous person do?"'
    });

    this.frameworks.set('care_ethics', {
      principles: ['maintain relationships', 'responsibility to others', 'context-sensitive', 'empathy'],
      decisionMethod: 'Consider impact on relationships and care for others'
    });

    this.frameworks.set('rights_based', {
      principles: ['respect human rights', 'individual autonomy', 'justice', 'equality'],
      decisionMethod: 'Ensure action respects fundamental rights'
    });
  }

  applyFramework(dilemma: string, framework: string): string {
    const fw = this.frameworks.get(framework.toLowerCase());
    if (!fw) return `Unknown framework: ${framework}`;

    let analysis = `**Ethical Analysis: ${framework}**\n\n`;
    analysis += `**Dilemma:** ${dilemma}\n\n`;
    analysis += `**Key Principles:**\n`;
    fw.principles.forEach(p => analysis += `- ${p}\n`);
    analysis += `\n**Decision Method:** ${fw.decisionMethod}\n\n`;
    analysis += `**Application:** Consider how each principle applies to this specific situation and determine which action best aligns with the framework's core values.`;

    return analysis;
  }

  compareFrameworks(dilemma: string, frameworks: string[]): string {
    let comparison = `**Framework Comparison**\n\n**Dilemma:** ${dilemma}\n\n`;

    frameworks.forEach(fw => {
      const framework = this.frameworks.get(fw.toLowerCase());
      if (framework) {
        comparison += `**${fw}:** ${framework.decisionMethod}\n\n`;
      }
    });

    return comparison;
  }

  getFramework(name: string): { principles: string[]; decisionMethod: string } | null {
    return this.frameworks.get(name.toLowerCase()) || null;
  }

  addFramework(name: string, principles: string[], decisionMethod: string) {
    this.frameworks.set(name.toLowerCase(), { principles, decisionMethod });
  }
}

// ============================================
// ITEM 25.2: Moral Dilemma Resolution
// Handle trolley problems, weigh competing values
// ============================================
export class MoralDilemmaResolution {
  private dilemmaTypes: Map<string, { description: string; options: string[]; values: string[] }> = new Map();

  constructor() {
    this.loadDilemmas();
  }

  private loadDilemmas() {
    this.dilemmaTypes.set('trolley_problem', {
      description: 'Save 5 people by diverting trolley, killing 1 person',
      options: ['divert trolley (kill 1, save 5)', 'do nothing (5 die)'],
      values: ['life', 'action vs inaction', 'numbers', 'intentional harm']
    });

    this.dilemmaTypes.set('truth_vs_harm', {
      description: 'Tell truth that will hurt someone vs lie to protect feelings',
      options: ['tell truth', 'lie to protect'],
      values: ['honesty', 'compassion', 'autonomy', 'beneficence']
    });

    this.dilemmaTypes.set('loyalty_vs_justice', {
      description: 'Report friend\'s wrongdoing vs protect friendship',
      options: ['report wrongdoing', 'protect friend'],
      values: ['justice', 'loyalty', 'fairness', 'relationships']
    });

    this.dilemmaTypes.set('individual_vs_collective', {
      description: 'Sacrifice individual rights for greater good',
      options: ['sacrifice individual', 'protect individual rights'],
      values: ['individual rights', 'collective good', 'justice', 'utility']
    });
  }

  analyzeDilemma(dilemmaType: string): string {
    const dilemma = this.dilemmaTypes.get(dilemmaType.toLowerCase());
    if (!dilemma) return `Unknown dilemma type: ${dilemmaType}`;

    let analysis = `**Moral Dilemma Analysis: ${dilemmaType}**\n\n`;
    analysis += `**Description:** ${dilemma.description}\n\n`;
    analysis += `**Options:**\n`;
    dilemma.options.forEach((opt, i) => analysis += `${i + 1}. ${opt}\n`);
    analysis += `\n**Competing Values:**\n`;
    dilemma.values.forEach(v => analysis += `- ${v}\n`);
    analysis += `\n**Resolution Approach:** Weigh the competing values and consider which ethical framework best applies to this situation.`;

    return analysis;
  }

  suggestResolution(dilemmaType: string, framework: string): string {
    const dilemma = this.dilemmaTypes.get(dilemmaType.toLowerCase());
    if (!dilemma) return `Unknown dilemma type: ${dilemmaType}`;

    let suggestion = `**Suggested Resolution using ${framework}:**\n\n`;

    switch (framework.toLowerCase()) {
      case 'utilitarianism':
        suggestion += `Choose the option that maximizes overall well-being. Consider the consequences for all affected parties and select the action that produces the greatest net benefit.\n\n`;
        suggestion += `**Likely Choice:** ${dilemma.options[0]} (if it produces better overall outcomes)`;
        break;
      case 'deontology':
        suggestion += `Follow universal moral rules regardless of consequences. Ask: "Can this action be universalized?" and "Does this respect human dignity?"\n\n`;
        suggestion += `**Likely Choice:** Depends on whether the action violates a moral duty`;
        break;
      case 'virtue_ethics':
        suggestion += `Consider what a virtuous person would do. Focus on developing good character traits like wisdom, courage, and compassion.\n\n`;
        suggestion += `**Likely Choice:** The action that demonstrates practical wisdom and moral virtue`;
        break;
      default:
        suggestion += `Apply the specific principles of ${framework} to determine the most ethical choice.`;
    }

    return suggestion;
  }

  addDilemma(name: string, description: string, options: string[], values: string[]) {
    this.dilemmaTypes.set(name.toLowerCase(), { description, options, values });
  }
}

// ============================================
// ITEM 25.3: Value Alignment Checking
// Check alignment with values, value conflicts
// ============================================
export class ValueAlignmentChecking {
  private valueHierarchy: Map<string, { priority: number; relatedValues: string[] }> = new Map();

  constructor() {
    this.loadValues();
  }

  private loadValues() {
    this.valueHierarchy.set('life', { priority: 10, relatedValues: ['health', 'safety', 'survival'] });
    this.valueHierarchy.set('freedom', { priority: 9, relatedValues: ['autonomy', 'choice', 'liberty'] });
    this.valueHierarchy.set('justice', { priority: 9, relatedValues: ['fairness', 'equality', 'rights'] });
    this.valueHierarchy.set('honesty', { priority: 8, relatedValues: ['truth', 'integrity', 'transparency'] });
    this.valueHierarchy.set('compassion', { priority: 8, relatedValues: ['empathy', 'kindness', 'care'] });
    this.valueHierarchy.set('loyalty', { priority: 7, relatedValues: ['faithfulness', 'commitment', 'trust'] });
    this.valueHierarchy.set('efficiency', { priority: 6, relatedValues: ['productivity', 'optimization', 'speed'] });
    this.valueHierarchy.set('pleasure', { priority: 5, relatedValues: ['happiness', 'enjoyment', 'comfort'] });
  }

  checkAlignment(action: string, values: string[]): { aligned: boolean; conflicts: string[]; score: number } {
    const conflicts: string[] = [];
    let totalScore = 0;
    let valueCount = 0;

    values.forEach(value => {
      const valueData = this.valueHierarchy.get(value.toLowerCase());
      if (valueData) {
        totalScore += valueData.priority;
        valueCount++;

        // Check for conflicts with related values
        valueData.relatedValues.forEach(related => {
          if (!values.includes(related) && this.valueHierarchy.has(related)) {
            const relatedData = this.valueHierarchy.get(related)!;
            if (Math.abs(valueData.priority - relatedData.priority) <= 1) {
              conflicts.push(`Potential tension between ${value} and ${related}`);
            }
          }
        });
      }
    });

    const avgScore = valueCount > 0 ? totalScore / valueCount : 0;
    const aligned = conflicts.length === 0 && avgScore >= 7;

    return { aligned, conflicts, score: avgScore };
  }

  resolveConflict(value1: string, value2: string): string {
    const v1 = this.valueHierarchy.get(value1.toLowerCase());
    const v2 = this.valueHierarchy.get(value2.toLowerCase());

    if (!v1 || !v2) return `Cannot resolve: unknown values`;

    let resolution = `**Value Conflict Resolution: ${value1} vs ${value2}**\n\n`;

    if (v1.priority > v2.priority) {
      resolution += `**${value1}** has higher priority (${v1.priority}) than **${value2}** (${v2.priority}).\n\n`;
      resolution += `**Recommendation:** Prioritize ${value1} while finding ways to respect ${value2} as much as possible.`;
    } else if (v2.priority > v1.priority) {
      resolution += `**${value2}** has higher priority (${v2.priority}) than **${value1}** (${v1.priority}).\n\n`;
      resolution += `**Recommendation:** Prioritize ${value2} while finding ways to respect ${value1} as much as possible.`;
    } else {
      resolution += `Both values have equal priority (${v1.priority}).\n\n`;
      resolution += `**Recommendation:** Seek a balanced approach that honors both values, or consider the specific context to determine which is more important in this situation.`;
    }

    return resolution;
  }

  getValuePriority(value: string): number {
    return this.valueHierarchy.get(value.toLowerCase())?.priority || 0;
  }

  addValue(name: string, priority: number, relatedValues: string[]) {
    this.valueHierarchy.set(name.toLowerCase(), { priority, relatedValues });
  }
}

// ============================================
// ITEM 25.4: Harm Prevention
// Detect potential harm, physical/emotional/financial
// ============================================
export class HarmPrevention {
  private harmIndicators: Map<string, { type: string; severity: string; prevention: string }> = new Map();

  constructor() {
    this.loadIndicators();
  }

  private loadIndicators() {
    this.harmIndicators.set('physical violence', {
      type: 'physical',
      severity: 'critical',
      prevention: 'Ensure physical safety, remove from dangerous situation, seek medical help if needed'
    });

    this.harmIndicators.set('emotional abuse', {
      type: 'emotional',
      severity: 'high',
      prevention: 'Provide emotional support, validate feelings, suggest professional help'
    });

    this.harmIndicators.set('financial exploitation', {
      type: 'financial',
      severity: 'high',
      prevention: 'Protect financial assets, verify transactions, seek legal advice'
    });

    this.harmIndicators.set('discrimination', {
      type: 'social',
      severity: 'medium',
      prevention: 'Address bias, ensure equal treatment, provide support resources'
    });

    this.harmIndicators.set('privacy violation', {
      type: 'privacy',
      severity: 'medium',
      prevention: 'Protect personal information, limit data sharing, secure accounts'
    });

    this.harmIndicators.set('self-harm', {
      type: 'self',
      severity: 'critical',
      prevention: 'Immediate intervention, contact crisis services, ensure safety'
    });
  }

  detectHarm(text: string): Array<{ type: string; severity: string; prevention: string }> {
    const textLower = text.toLowerCase();
    const detected: Array<{ type: string; severity: string; prevention: string }> = [];

    this.harmIndicators.forEach((data, indicator) => {
      if (textLower.includes(indicator)) {
        detected.push({
          type: data.type,
          severity: data.severity,
          prevention: data.prevention
        });
      }
    });

    return detected;
  }

  assessRisk(harms: Array<{ type: string; severity: string; prevention: string }>): string {
    if (harms.length === 0) return 'No immediate harm detected';

    const critical = harms.filter(h => h.severity === 'critical');
    const high = harms.filter(h => h.severity === 'high');

    let assessment = `**Harm Risk Assessment:**\n\n`;

    if (critical.length > 0) {
      assessment += `**CRITICAL RISK:** Immediate intervention required\n`;
      critical.forEach(h => assessment += `- ${h.type}: ${h.prevention}\n`);
      assessment += '\n';
    }

    if (high.length > 0) {
      assessment += `**HIGH RISK:** Prompt action needed\n`;
      high.forEach(h => assessment += `- ${h.type}: ${h.prevention}\n`);
      assessment += '\n';
    }

    if (critical.length === 0 && high.length === 0) {
      assessment += `**MODERATE RISK:** Monitor and address\n`;
      harms.forEach(h => assessment += `- ${h.type}: ${h.prevention}\n`);
    }

    return assessment;
  }

  addIndicator(indicator: string, type: string, severity: string, prevention: string) {
    this.harmIndicators.set(indicator, { type, severity, prevention });
  }
}

// ============================================
// ITEM 25.5: Fairness Analysis
// Analyze fairness, distributive/procedural justice
// ============================================
export class FairnessAnalysis {
  private fairnessCriteria: Map<string, { description: string; check: string }> = new Map();

  constructor() {
    this.loadCriteria();
  }

  private loadCriteria() {
    this.fairnessCriteria.set('equal_treatment', {
      description: 'All parties receive same treatment regardless of characteristics',
      check: 'Are all individuals treated identically in similar situations?'
    });

    this.fairnessCriteria.set('equity', {
      description: 'Resources distributed based on need and merit',
      check: 'Are resources allocated proportionally to need/contribution?'
    });

    this.fairnessCriteria.set('procedural_justice', {
      description: 'Fair processes and transparent decision-making',
      check: 'Are procedures transparent, consistent, and unbiased?'
    });

    this.fairnessCriteria.set('distributive_justice', {
      description: 'Outcomes distributed fairly among stakeholders',
      check: 'Are benefits and burdens distributed equitably?'
    });

    this.fairnessCriteria.set('opportunity', {
      description: 'Equal access to opportunities regardless of background',
      check: 'Do all parties have equal opportunity to succeed?'
    });
  }

  analyzeFairness(situation: string, criteria: string[]): string {
    let analysis = `**Fairness Analysis**\n\n**Situation:** ${situation}\n\n`;

    criteria.forEach(criterion => {
      const data = this.fairnessCriteria.get(criterion.toLowerCase());
      if (data) {
        analysis += `**${criterion.replace(/_/g, ' ').toUpperCase()}:**\n`;
        analysis += `- Description: ${data.description}\n`;
        analysis += `- Check: ${data.check}\n\n`;
      }
    });

    analysis += `**Overall Assessment:** Evaluate whether the situation meets these fairness criteria and identify any areas of concern.`;

    return analysis;
  }

  checkCriterion(situation: string, criterion: string): { met: boolean; concerns: string[] } {
    const data = this.fairnessCriteria.get(criterion.toLowerCase());
    if (!data) return { met: false, concerns: ['Unknown criterion'] };

    // Simplified check - in production, would analyze situation more deeply
    const concerns: string[] = [];

    // Example checks
    if (criterion === 'equal_treatment' && situation.toLowerCase().includes('different')) {
      concerns.push('Different treatment detected - verify if justified');
    }

    if (criterion === 'equity' && situation.toLowerCase().includes('same')) {
      concerns.push('Equal distribution may not account for different needs');
    }

    return { met: concerns.length === 0, concerns };
  }

  addCriterion(name: string, description: string, check: string) {
    this.fairnessCriteria.set(name.toLowerCase(), { description, check });
  }
}

// ============================================
// ITEM 25.6: Rights Protection
// Protect human/legal/moral rights
// ============================================
export class RightsProtection {
  private rights: Map<string, { type: string; description: string; violations: string[] }> = new Map();

  constructor() {
    this.loadRights();
  }

  private loadRights() {
    this.rights.set('right to life', {
      type: 'human',
      description: 'Fundamental right to exist and be safe from harm',
      violations: ['murder', 'endangerment', 'neglect']
    });

    this.rights.set('right to freedom', {
      type: 'human',
      description: 'Right to make choices and act autonomously',
      violations: ['imprisonment without cause', 'coercion', 'restriction of movement']
    });

    this.rights.set('right to privacy', {
      type: 'human',
      description: 'Right to control personal information and space',
      violations: ['surveillance without consent', 'data breach', 'intrusion']
    });

    this.rights.set('right to fair trial', {
      type: 'legal',
      description: 'Right to impartial legal process',
      violations: ['biased judge', 'no legal representation', 'delayed trial']
    });

    this.rights.set('right to dignity', {
      type: 'moral',
      description: 'Right to be treated with respect',
      violations: ['humiliation', 'degradation', 'discrimination']
    });
  }

  checkRightsViolation(action: string): Array<{ right: string; type: string; violated: boolean }> {
    const actionLower = action.toLowerCase();
    const violations: Array<{ right: string; type: string; violated: boolean }> = [];

    this.rights.forEach((data, right) => {
      const isViolated = data.violations.some(v => actionLower.includes(v));
      violations.push({
        right,
        type: data.type,
        violated: isViolated
      });
    });

    return violations;
  }

  describeRight(right: string): string {
    const data = this.rights.get(right.toLowerCase());
    if (!data) return `Unknown right: ${right}`;

    let description = `**${right.toUpperCase()}**\n\n`;
    description += `**Type:** ${data.type}\n`;
    description += `**Description:** ${data.description}\n`;
    description += `**Common Violations:**\n`;
    data.violations.forEach(v => description += `- ${v}\n`);

    return description;
  }

  assessAction(action: string): string {
    const violations = this.checkRightsViolation(action);
    const violatedRights = violations.filter(v => v.violated);

    let assessment = `**Rights Assessment for Action:**\n\n`;
    assessment += `**Action:** ${action}\n\n`;

    if (violatedRights.length === 0) {
      assessment += `✓ No rights violations detected`;
    } else {
      assessment += `**VIOLATIONS DETECTED:**\n`;
      violatedRights.forEach(v => {
        assessment += `- ${v.right} (${v.type} right)\n`;
      });
      assessment += `\n**Recommendation:** Modify action to respect these fundamental rights.`;
    }

    return assessment;
  }

  addRight(name: string, type: string, description: string, violations: string[]) {
    this.rights.set(name.toLowerCase(), { type, description, violations });
  }
}

// ============================================
// ITEM 25.7: Consequentialist Analysis
// Analyze consequences, short/long term, direct/indirect
// ============================================
export class ConsequentialistAnalysis {
  analyzeConsequences(action: string): {
    direct: Array<{ effect: string; timeframe: string; magnitude: string }>;
    indirect: Array<{ effect: string; timeframe: string; magnitude: string }>;
    netUtility: number;
  } {
    // Simplified analysis - in production, would be more sophisticated
    const direct: Array<{ effect: string; timeframe: string; magnitude: string }> = [];
    const indirect: Array<{ effect: string; timeframe: string; magnitude: string }> = [];

    // Example consequences based on action keywords
    if (action.toLowerCase().includes('help')) {
      direct.push({ effect: 'improved well-being', timeframe: 'immediate', magnitude: 'positive' });
      indirect.push({ effect: 'stronger relationships', timeframe: 'long-term', magnitude: 'positive' });
    }

    if (action.toLowerCase().includes('harm')) {
      direct.push({ effect: 'pain/suffering', timeframe: 'immediate', magnitude: 'negative' });
      indirect.push({ effect: 'damaged trust', timeframe: 'long-term', magnitude: 'negative' });
    }

    const netUtility = direct.reduce((sum, d) => sum + (d.magnitude === 'positive' ? 1 : -1), 0) +
                      indirect.reduce((sum, i) => sum + (i.magnitude === 'positive' ? 0.5 : -0.5), 0);

    return { direct, indirect, netUtility };
  }

  formatAnalysis(action: string, consequences: {
    direct: Array<{ effect: string; timeframe: string; magnitude: string }>;
    indirect: Array<{ effect: string; timeframe: string; magnitude: string }>;
    netUtility: number;
  }): string {
    let analysis = `**Consequentialist Analysis**\n\n**Action:** ${action}\n\n`;

    analysis += `**Direct Consequences:**\n`;
    consequences.direct.forEach(c => {
      analysis += `- ${c.effect} (${c.timeframe}, ${c.magnitude})\n`;
    });

    analysis += `\n**Indirect Consequences:**\n`;
    consequences.indirect.forEach(c => {
      analysis += `- ${c.effect} (${c.timeframe}, ${c.magnitude})\n`;
    });

    analysis += `\n**Net Utility:** ${consequences.netUtility > 0 ? '+' : ''}${consequences.netUtility.toFixed(1)}\n`;
    analysis += `\n**Recommendation:** ${consequences.netUtility > 0 ? 'Action produces net positive outcomes' : 'Action produces net negative outcomes - consider alternatives'}`;

    return analysis;
  }
}

// ============================================
// ITEM 25.8: Deontological Analysis
// Analyze duties/rules, moral obligations
// ============================================
export class DeontologicalAnalysis {
  private duties: Map<string, { description: string; absolute: boolean; exceptions: string[] }> = new Map();

  constructor() {
    this.loadDuties();
  }

  private loadDuties() {
    this.duties.set('do not lie', {
      description: 'Duty to tell the truth',
      absolute: false,
      exceptions: ['protect innocent life', 'prevent serious harm']
    });

    this.duties.set('do not steal', {
      description: 'Duty to respect property rights',
      absolute: false,
      exceptions: ['save life', 'extreme necessity']
    });

    this.duties.set('do not harm', {
      description: 'Duty to avoid causing harm to others',
      absolute: false,
      exceptions: ['self-defense', 'protect others']
    });

    this.duties.set('keep promises', {
      description: 'Duty to fulfill commitments',
      absolute: false,
      exceptions: ['promise conflicts with higher duty', 'impossible to fulfill']
    });

    this.duties.set('help others', {
      description: 'Duty to assist those in need',
      absolute: false,
      exceptions: ['significant risk to self', 'conflicts with other duties']
    });
  }

  checkDuty(action: string): Array<{ duty: string; fulfilled: boolean; notes: string }> {
    const actionLower = action.toLowerCase();
    const results: Array<{ duty: string; fulfilled: boolean; notes: string }> = [];

    this.duties.forEach((data, duty) => {
      let fulfilled = true;
      let notes = '';

      if (duty.includes('not lie') && actionLower.includes('lie')) {
        fulfilled = false;
        notes = 'Duty violated: lying detected';
      } else if (duty.includes('not steal') && actionLower.includes('steal')) {
        fulfilled = false;
        notes = 'Duty violated: stealing detected';
      } else if (duty.includes('not harm') && actionLower.includes('harm')) {
        fulfilled = false;
        notes = 'Duty violated: harming detected';
      } else {
        notes = 'Duty appears fulfilled';
      }

      results.push({ duty, fulfilled, notes });
    });

    return results;
  }

  universalize(action: string): { universalizable: boolean; reasoning: string } {
    // Kant's categorical imperative: Can this be universalized?
    const actionLower = action.toLowerCase();

    if (actionLower.includes('lie') || actionLower.includes('steal') || actionLower.includes('harm')) {
      return {
        universalizable: false,
        reasoning: 'This action cannot be universalized without contradiction. If everyone did this, society would break down.'
      };
    }

    return {
      universalizable: true,
      reasoning: 'This action can be universalized without contradiction. A world where everyone acts this way would be coherent.'
    };
  }

  formatAnalysis(action: string, duties: Array<{ duty: string; fulfilled: boolean; notes: string }>): string {
    let analysis = `**Deontological Analysis**\n\n**Action:** ${action}\n\n`;

    analysis += `**Duty Assessment:**\n`;
    duties.forEach(d => {
      const status = d.fulfilled ? '✓' : '✗';
      analysis += `${status} ${d.duty}: ${d.notes}\n`;
    });

    const universal = this.universalize(action);
    analysis += `\n**Universalizability:** ${universal.universalizable ? 'Yes' : 'No'}\n`;
    analysis += `**Reasoning:** ${universal.reasoning}`;

    return analysis;
  }

  addDuty(name: string, description: string, absolute: boolean, exceptions: string[]) {
    this.duties.set(name.toLowerCase(), { description, absolute, exceptions });
  }
}

// ============================================
// ITEM 25.9: Virtue Ethics Application
// Character traits, moral exemplars
// ============================================
export class VirtueEthicsApplication {
  private virtues: Map<string, { description: string; excess: string; deficiency: string; exemplar: string }> = new Map();

  constructor() {
    this.loadVirtues();
  }

  private loadVirtues() {
    this.virtues.set('courage', {
      description: 'Face fear appropriately',
      excess: 'recklessness',
      deficiency: 'cowardice',
      exemplar: 'A firefighter entering a burning building'
    });

    this.virtues.set('temperance', {
      description: 'Moderation in desires and pleasures',
      excess: 'indulgence',
      deficiency: 'insensibility',
      exemplar: 'Someone who enjoys food but doesn\'t overeat'
    });

    this.virtues.set('justice', {
      description: 'Give each their due',
      excess: 'rigid legalism',
      deficiency: 'unfairness',
      exemplar: 'A judge who considers all factors fairly'
    });

    this.virtues.set('wisdom', {
      description: 'Practical knowledge and good judgment',
      excess: 'overthinking',
      deficiency: 'foolishness',
      exemplar: 'A mentor who gives timely, appropriate advice'
    });

    this.virtues.set('honesty', {
      description: 'Truthfulness and integrity',
      excess: 'brutal bluntness',
      deficiency: 'dishonesty',
      exemplar: 'Someone who tells truth with compassion'
    });

    this.virtues.set('compassion', {
      description: 'Empathy and care for others',
      excess: 'enabling harmful behavior',
      deficiency: 'indifference',
      exemplar: 'A nurse who provides care with genuine concern'
    });
  }

  assessAction(action: string): Array<{ virtue: string; demonstrated: boolean; notes: string }> {
    const actionLower = action.toLowerCase();
    const assessments: Array<{ virtue: string; demonstrated: boolean; notes: string }> = [];

    this.virtues.forEach((data, virtue) => {
      let demonstrated = false;
      let notes = '';

      if (virtue === 'courage' && (actionLower.includes('brave') || actionLower.includes('face fear'))) {
        demonstrated = true;
        notes = 'Courage demonstrated';
      } else if (virtue === 'honesty' && (actionLower.includes('truth') || actionLower.includes('honest'))) {
        demonstrated = true;
        notes = 'Honesty demonstrated';
      } else if (virtue === 'compassion' && (actionLower.includes('help') || actionLower.includes('care'))) {
        demonstrated = true;
        notes = 'Compassion demonstrated';
      } else {
        notes = 'Virtue not clearly demonstrated';
      }

      assessments.push({ virtue, demonstrated, notes });
    });

    return assessments;
  }

  findMean(virtue: string, situation: string): string {
    const data = this.virtues.get(virtue.toLowerCase());
    if (!data) return `Unknown virtue: ${virtue}`;

    let guidance = `**Virtue: ${virtue}**\n\n`;
    guidance += `**Description:** ${data.description}\n`;
    guidance += `**Excess (too much):** ${data.excess}\n`;
    guidance += `**Deficiency (too little):** ${data.deficiency}\n`;
    guidance += `**Golden Mean:** The virtuous action lies between excess and deficiency\n\n`;
    guidance += `**Exemplar:** ${data.exemplar}\n\n`;
    guidance += `**Application to Situation:** Consider how to demonstrate ${virtue} in moderation for this specific context.`;

    return guidance;
  }

  addVirtue(name: string, description: string, excess: string, deficiency: string, exemplar: string) {
    this.virtues.set(name.toLowerCase(), { description, excess, deficiency, exemplar });
  }
}

// ============================================
// ITEM 25.10: Ethical Consistency Checking
// Detect ethical contradictions
// ============================================
export class EthicalConsistencyChecking {
  private ethicalStatements: Array<{ statement: string; principle: string; timestamp: number }> = [];

  addStatement(statement: string, principle: string) {
    this.ethicalStatements.push({
      statement,
      principle,
      timestamp: Date.now()
    });
  }

  checkConsistency(): { consistent: boolean; contradictions: string[] } {
    const contradictions: string[] = [];

    // Check for contradictory principles
    const principleGroups = new Map<string, string[]>();
    this.ethicalStatements.forEach(s => {
      if (!principleGroups.has(s.principle)) {
        principleGroups.set(s.principle, []);
      }
      principleGroups.get(s.principle)!.push(s.statement);
    });

    // Look for contradictions within same principle
    principleGroups.forEach((statements, principle) => {
      if (statements.length >= 2) {
        // Check for obvious contradictions
        for (let i = 0; i < statements.length; i++) {
          for (let j = i + 1; j < statements.length; j++) {
            if (this.areContradictory(statements[i], statements[j])) {
              contradictions.push(`Contradiction in ${principle}: "${statements[i]}" vs "${statements[j]}"`);
            }
          }
        }
      }
    });

    return {
      consistent: contradictions.length === 0,
      contradictions
    };
  }

  private areContradictory(statement1: string, statement2: string): boolean {
    const s1 = statement1.toLowerCase();
    const s2 = statement2.toLowerCase();

    // Check for direct negation
    if (s1.includes('always') && s2.includes('never')) return true;
    if (s1.includes('never') && s2.includes('always')) return true;

    // Check for opposite actions
    if ((s1.includes('should') && s2.includes('should not')) ||
        (s1.includes('should not') && s2.includes('should'))) {
      return true;
    }

    return false;
  }

  formatConsistencyCheck(): string {
    const { consistent, contradictions } = this.checkConsistency();

    let result = `**Ethical Consistency Check**\n\n`;

    if (consistent) {
      result += `✓ All ethical statements are consistent`;
    } else {
      result += `✗ Contradictions detected:\n\n`;
      contradictions.forEach(c => result += `- ${c}\n`);
      result += `\n**Recommendation:** Review and reconcile these contradictions to maintain ethical coherence.`;
    }

    return result;
  }

  clear() {
    this.ethicalStatements = [];
  }
}

// ============================================
// Export all ethical reasoning systems
// ============================================
export const EthicalReasoningSystems = {
  EthicalFrameworkApplication,
  MoralDilemmaResolution,
  ValueAlignmentChecking,
  HarmPrevention,
  FairnessAnalysis,
  RightsProtection,
  ConsequentialistAnalysis,
  DeontologicalAnalysis,
  VirtueEthicsApplication,
  EthicalConsistencyChecking,
};
