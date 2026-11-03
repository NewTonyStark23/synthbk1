// Social Reasoning Part 2 - Items 24.3-24.10
// Group behavior, conflict resolution, norms, relationships, influence, cooperation, identity, etiquette

import { Utils } from './utils';

// ============================================
// ITEM 24.3: Group Behavior Prediction
// Predict groupthink, social loafing, conformity
// ============================================
export class GroupBehaviorPredictor {
  private groupFactors: Map<string, { size: number; cohesion: number; leadership: string }> = new Map();

  setGroupFactors(group: string, size: number, cohesion: number, leadership: string) {
    this.groupFactors.set(group.toLowerCase(), { size, cohesion, leadership });
  }

  predictBehavior(group: string): { 
    groupthink: boolean; 
    socialLoafing: boolean; 
    conformity: boolean;
    prediction: string 
  } {
    const factors = this.groupFactors.get(group.toLowerCase());
    
    if (!factors) {
      return {
        groupthink: false,
        socialLoafing: false,
        conformity: false,
        prediction: 'Insufficient data to predict group behavior'
      };
    }

    const groupthink = factors.cohesion > 0.7 && factors.leadership === 'directive';
    const socialLoafing = factors.size > 5 && factors.cohesion < 0.5;
    const conformity = factors.cohesion > 0.6;

    let prediction = `**Group Behavior Prediction for ${group}:**\n\n`;
    prediction += `- Group Size: ${factors.size}\n`;
    prediction += `- Cohesion: ${(factors.cohesion * 100).toFixed(0)}%\n`;
    prediction += `- Leadership Style: ${factors.leadership}\n\n`;

    if (groupthink) {
      prediction += '**Risk of Groupthink:** High\n';
      prediction += 'The group may suppress dissenting opinions to maintain harmony.\n\n';
    }

    if (socialLoafing) {
      prediction += '**Risk of Social Loafing:** High\n';
      prediction += 'Individual effort may decrease as group size increases.\n\n';
    }

    if (conformity) {
      prediction += '**Conformity Pressure:** High\n';
      prediction += 'Members likely to conform to group norms.\n';
    }

    return { groupthink, socialLoafing, conformity, prediction };
  }

  suggestMitigation(group: string): string {
    const { groupthink, socialLoafing } = this.predictBehavior(group);
    
    let suggestions = '**Mitigation Strategies:**\n\n';

    if (groupthink) {
      suggestions += '- Encourage devil\'s advocate\n';
      suggestions += '- Invite outside perspectives\n';
      suggestions += '- Leader should withhold opinion initially\n\n';
    }

    if (socialLoafing) {
      suggestions += '- Assign individual responsibilities\n';
      suggestions += '- Make individual contributions visible\n';
      suggestions += '- Keep group size manageable\n\n';
    }

    if (!groupthink && !socialLoafing) {
      suggestions += 'No significant risks detected. Continue monitoring group dynamics.';
    }

    return suggestions;
  }

  clear() {
    this.groupFactors.clear();
  }
}

// ============================================
// ITEM 24.4: Conflict Resolution
// Mediate conflicts, find compromise, negotiation
// ============================================
export class ConflictResolution {
  private conflicts: Map<string, { parties: string[]; issues: string[]; positions: Map<string, string> }> = new Map();

  registerConflict(id: string, parties: string[], issues: string[], positions: Record<string, string>) {
    this.conflicts.set(id, {
      parties,
      issues,
      positions: new Map(Object.entries(positions))
    });
  }

  analyzeConflict(id: string): { 
    commonGround: string[]; 
    disagreements: string[]; 
    compromise: string 
  } {
    const conflict = this.conflicts.get(id);
    
    if (!conflict) {
      return {
        commonGround: [],
        disagreements: [],
        compromise: 'No conflict registered'
      };
    }

    const positions = Array.from(conflict.positions.values());
    const commonGround: string[] = [];
    const disagreements: string[] = [];

    conflict.issues.forEach(issue => {
      const mentioned = positions.filter(p => p.toLowerCase().includes(issue.toLowerCase()));
      if (mentioned.length === positions.length) {
        commonGround.push(issue);
      } else if (mentioned.length > 0) {
        disagreements.push(issue);
      }
    });

    let compromise = '';
    if (commonGround.length > 0) {
      compromise = `Focus on shared interests: ${commonGround.join(', ')}. `;
      compromise += `For disagreements on ${disagreements.join(', ')}, consider splitting differences or finding creative solutions.`;
    } else {
      compromise = 'No obvious common ground. Consider mediation or third-party facilitation.';
    }

    return { commonGround, disagreements, compromise };
  }

  suggestResolution(id: string): string {
    const { commonGround, disagreements, compromise } = this.analyzeConflict(id);
    
    let suggestion = '**Conflict Resolution Strategy:**\n\n';
    
    if (commonGround.length > 0) {
      suggestion += '**Common Ground:**\n';
      commonGround.forEach(c => suggestion += `- ${c}\n`);
      suggestion += '\n';
    }
    
    if (disagreements.length > 0) {
      suggestion += '**Areas of Disagreement:**\n';
      disagreements.forEach(d => suggestion += `- ${d}\n`);
      suggestion += '\n';
    }
    
    suggestion += `**Recommended Approach:** ${compromise}`;

    return suggestion;
  }

  clear() {
    this.conflicts.clear();
  }
}

// ============================================
// ITEM 24.5: Social Norm Enforcement
// Detect norm violations, cultural/professional norms
// ============================================
export class SocialNormEnforcement {
  private norms: Map<string, { context: string; expectation: string; violation: string }> = new Map();

  constructor() {
    this.loadNorms();
  }

  private loadNorms() {
    this.norms.set('meeting_punctuality', {
      context: 'professional meeting',
      expectation: 'Arrive on time or 5 minutes early',
      violation: 'Arriving late without notice'
    });

    this.norms.set('email_response', {
      context: 'professional email',
      expectation: 'Respond within 24 hours',
      violation: 'Ignoring emails for days'
    });

    this.norms.set('conversation_turn', {
      context: 'group conversation',
      expectation: 'Take turns speaking, don\'t interrupt',
      violation: 'Constantly interrupting others'
    });

    this.norms.set('personal_space', {
      context: 'social interaction',
      expectation: 'Maintain appropriate physical distance',
      violation: 'Standing too close or touching without permission'
    });

    this.norms.set('gift_reciprocity', {
      context: 'social gathering',
      expectation: 'Reciprocate gifts of similar value',
      violation: 'Giving significantly less or more'
    });
  }

  checkNormViolation(context: string, behavior: string): { violated: boolean; norm?: string; explanation?: string } {
    const contextLower = context.toLowerCase();
    const behaviorLower = behavior.toLowerCase();

    for (const [normId, norm] of this.norms.entries()) {
      if (contextLower.includes(norm.context.toLowerCase())) {
        if (behaviorLower.includes(norm.violation.toLowerCase().split(' ')[0])) {
          return {
            violated: true,
            norm: normId,
            explanation: `Violation of ${norm.context} norm: ${norm.violation}`
          };
        }
      }
    }

    return { violated: false };
  }

  describeNorm(normId: string): string {
    const norm = this.norms.get(normId);
    
    if (!norm) {
      return `No information available for norm: ${normId}`;
    }

    return `**Social Norm: ${normId}**\n\n` +
           `**Context:** ${norm.context}\n` +
           `**Expectation:** ${norm.expectation}\n` +
           `**Violation:** ${norm.violation}`;
  }

  addNorm(id: string, context: string, expectation: string, violation: string) {
    this.norms.set(id, { context, expectation, violation });
  }
}

// ============================================
// ITEM 24.6: Relationship Tracking
// Track relationships between entities
// ============================================
export class RelationshipTracker {
  private relationships: Map<string, Map<string, { type: string; strength: number; since: number }>> = new Map();

  addRelationship(person1: string, person2: string, type: string, strength: number = 0.5) {
    const p1 = person1.toLowerCase();
    const p2 = person2.toLowerCase();

    if (!this.relationships.has(p1)) {
      this.relationships.set(p1, new Map());
    }
    this.relationships.get(p1)!.set(p2, { type, strength, since: Date.now() });

    if (!this.relationships.has(p2)) {
      this.relationships.set(p2, new Map());
    }
    this.relationships.get(p2)!.set(p1, { type, strength, since: Date.now() });
  }

  getRelationship(person1: string, person2: string): { type: string; strength: number; since: number } | null {
    const p1 = person1.toLowerCase();
    const p2 = person2.toLowerCase();

    return this.relationships.get(p1)?.get(p2) || null;
  }

  getAllRelationships(person: string): Array<{ person: string; type: string; strength: number }> {
    const p = person.toLowerCase();
    const rels = this.relationships.get(p);
    
    if (!rels) return [];

    return Array.from(rels.entries()).map(([other, data]) => ({
      person: other,
      type: data.type,
      strength: data.strength
    }));
  }

  describeRelationship(person1: string, person2: string): string {
    const rel = this.getRelationship(person1, person2);
    
    if (!rel) {
      return `No known relationship between ${person1} and ${person2}.`;
    }

    let description = `**Relationship: ${person1} ↔ ${person2}**\n\n`;
    description += `- **Type:** ${rel.type}\n`;
    description += `- **Strength:** ${(rel.strength * 100).toFixed(0)}%\n`;
    description += `- **Since:** ${new Date(rel.since).toLocaleDateString()}`;

    return description;
  }

  clear() {
    this.relationships.clear();
  }
}

// ============================================
// ITEM 24.7: Influence Analysis
// Analyze influence patterns, persuasion
// ============================================
export class InfluenceAnalyzer {
  private influenceNetwork: Map<string, { influencers: string[]; followers: string[]; persuasionTechniques: string[] }> = new Map();

  setInfluencePattern(person: string, influencers: string[], followers: string[], techniques: string[]) {
    this.influenceNetwork.set(person.toLowerCase(), {
      influencers,
      followers,
      persuasionTechniques: techniques
    });
  }

  getInfluencePattern(person: string): { influencers: string[]; followers: string[]; persuasionTechniques: string[] } | null {
    return this.influenceNetwork.get(person.toLowerCase()) || null;
  }

  canInfluence(influencer: string, target: string): boolean {
    const pattern = this.getInfluencePattern(influencer);
    if (!pattern) return false;
    return pattern.followers.includes(target.toLowerCase());
  }

  getInfluencers(person: string): string[] {
    const pattern = this.getInfluencePattern(person);
    return pattern?.influencers || [];
  }

  describeInfluence(person: string): string {
    const pattern = this.getInfluencePattern(person);
    
    if (!pattern) {
      return `No influence data available for ${person}.`;
    }

    let description = `**Influence Analysis: ${person}**\n\n`;
    
    if (pattern.influencers.length > 0) {
      description += '**Influenced by:**\n';
      pattern.influencers.forEach(i => description += `- ${i}\n`);
      description += '\n';
    }
    
    if (pattern.followers.length > 0) {
      description += '**Influences:**\n';
      pattern.followers.forEach(f => description += `- ${f}\n`);
      description += '\n';
    }
    
    if (pattern.persuasionTechniques.length > 0) {
      description += '**Persuasion Techniques:**\n';
      pattern.persuasionTechniques.forEach(t => description += `- ${t}\n`);
    }

    return description;
  }

  clear() {
    this.influenceNetwork.clear();
  }
}

// ============================================
// ITEM 24.8: Cooperation Facilitation
// Facilitate cooperation, coordination
// ============================================
export class CooperationFacilitator {
  private cooperationGoals: Map<string, { participants: string[]; sharedGoal: string; individualGoals: Map<string, string> }> = new Map();

  setupCooperation(id: string, participants: string[], sharedGoal: string, individualGoals: Record<string, string>) {
    this.cooperationGoals.set(id, {
      participants,
      sharedGoal,
      individualGoals: new Map(Object.entries(individualGoals))
    });
  }

  analyzeCooperation(id: string): { 
    alignment: number; 
    conflicts: string[]; 
    suggestions: string[] 
  } {
    const cooperation = this.cooperationGoals.get(id);
    
    if (!cooperation) {
      return { alignment: 0, conflicts: ['No cooperation registered'], suggestions: [] };
    }

    const conflicts: string[] = [];
    const suggestions: string[] = [];
    let alignment = 1.0;

    const goals = Array.from(cooperation.individualGoals.values());
    
    const opposingTerms = [
      ['fast', 'slow'],
      ['cheap', 'expensive'],
      ['simple', 'complex'],
      ['short-term', 'long-term']
    ];

    opposingTerms.forEach(([term1, term2]) => {
      const hasTerm1 = goals.some(g => g.toLowerCase().includes(term1));
      const hasTerm2 = goals.some(g => g.toLowerCase().includes(term2));
      
      if (hasTerm1 && hasTerm2) {
        conflicts.push(`Conflicting priorities: ${term1} vs ${term2}`);
        alignment -= 0.2;
      }
    });

    if (conflicts.length > 0) {
      suggestions.push('Facilitate discussion to align priorities');
      suggestions.push('Find compromise solutions that address multiple goals');
    } else {
      suggestions.push('Goals appear aligned, proceed with coordination');
    }

    suggestions.push('Establish clear communication channels');
    suggestions.push('Define roles and responsibilities');

    return {
      alignment: Math.max(0, alignment),
      conflicts,
      suggestions
    };
  }

  suggestCoordination(id: string): string {
    const { alignment, conflicts, suggestions } = this.analyzeCooperation(id);
    
    let coordination = `**Cooperation Facilitation:**\n\n`;
    coordination += `**Goal Alignment:** ${(alignment * 100).toFixed(0)}%\n\n`;
    
    if (conflicts.length > 0) {
      coordination += '**Potential Conflicts:**\n';
      conflicts.forEach(c => coordination += `- ${c}\n`);
      coordination += '\n';
    }
    
    coordination += '**Coordination Suggestions:**\n';
    suggestions.forEach(s => coordination += `- ${s}\n`);

    return coordination;
  }

  clear() {
    this.cooperationGoals.clear();
  }
}

// ============================================
// ITEM 24.9: Social Identity Understanding
// Group membership, in-group/out-group
// ============================================
export class SocialIdentityUnderstanding {
  private groupMemberships: Map<string, string[]> = new Map();
  private groupCharacteristics: Map<string, { values: string[]; norms: string[]; identity: string }> = new Map();

  setGroupMembership(person: string, groups: string[]) {
    this.groupMemberships.set(person.toLowerCase(), groups.map(g => g.toLowerCase()));
  }

  setGroupCharacteristics(group: string, values: string[], norms: string[], identity: string) {
    this.groupCharacteristics.set(group.toLowerCase(), { values, norms, identity });
  }

  getGroupMemberships(person: string): string[] {
    return this.groupMemberships.get(person.toLowerCase()) || [];
  }

  getGroupCharacteristics(group: string): { values: string[]; norms: string[]; identity: string } | null {
    return this.groupCharacteristics.get(group.toLowerCase()) || null;
  }

  isInGroup(person: string, group: string): boolean {
    const memberships = this.getGroupMemberships(person);
    return memberships.includes(group.toLowerCase());
  }

  findCommonGroups(person1: string, person2: string): string[] {
    const groups1 = this.getGroupMemberships(person1);
    const groups2 = this.getGroupMemberships(person2);
    
    return groups1.filter(g => groups2.includes(g));
  }

  describeSocialIdentity(person: string): string {
    const groups = this.getGroupMemberships(person);
    
    if (groups.length === 0) {
      return `No group memberships recorded for ${person}.`;
    }

    let description = `**Social Identity: ${person}**\n\n`;
    description += '**Group Memberships:**\n';
    
    groups.forEach(group => {
      const characteristics = this.getGroupCharacteristics(group);
      description += `\n**${group}:**\n`;
      
      if (characteristics) {
        description += `- Identity: ${characteristics.identity}\n`;
        description += `- Values: ${characteristics.values.join(', ')}\n`;
        description += `- Norms: ${characteristics.norms.join(', ')}\n`;
      }
    });

    return description;
  }

  clear() {
    this.groupMemberships.clear();
    this.groupCharacteristics.clear();
  }
}

// ============================================
// ITEM 24.10: Etiquette Enforcement
// Cultural/professional etiquette
// ============================================
export class EtiquetteEnforcement {
  private etiquetteRules: Map<string, { context: string; rule: string; violation: string; severity: 'low' | 'medium' | 'high' }> = new Map();

  constructor() {
    this.loadRules();
  }

  private loadRules() {
    this.etiquetteRules.set('handshake', {
      context: 'business meeting',
      rule: 'Firm handshake with eye contact',
      violation: 'Weak handshake or no eye contact',
      severity: 'medium'
    });

    this.etiquetteRules.set('business_card', {
      context: 'networking event',
      rule: 'Receive with both hands, study briefly, store respectfully',
      violation: 'Stuffing card in pocket immediately',
      severity: 'high'
    });

    this.etiquetteRules.set('introduction', {
      context: 'social gathering',
      rule: 'Introduce yourself and others, use full names',
      violation: 'Using nicknames without permission',
      severity: 'medium'
    });

    this.etiquetteRules.set('phone_usage', {
      context: 'dinner meeting',
      rule: 'Keep phone silent and out of sight',
      violation: 'Checking phone during conversation',
      severity: 'high'
    });

    this.etiquetteRules.set('dress_code', {
      context: 'formal event',
      rule: 'Follow specified dress code',
      violation: 'Underdressing or overdressing significantly',
      severity: 'medium'
    });

    this.etiquetteRules.set('email_etiquette', {
      context: 'professional email',
      rule: 'Use proper greeting, clear subject, professional tone',
      violation: 'Using slang, all caps, or no subject line',
      severity: 'medium'
    });
  }

  checkEtiquette(context: string, behavior: string): { 
    violated: boolean; 
    rule?: string; 
    severity?: string; 
    explanation?: string 
  } {
    const contextLower = context.toLowerCase();
    const behaviorLower = behavior.toLowerCase();

    for (const [ruleId, rule] of this.etiquetteRules.entries()) {
      if (contextLower.includes(rule.context.toLowerCase())) {
        if (behaviorLower.includes(rule.violation.toLowerCase().split(' ')[0])) {
          return {
            violated: true,
            rule: ruleId,
            severity: rule.severity,
            explanation: `Etiquette violation in ${rule.context}: ${rule.violation}`
          };
        }
      }
    }

    return { violated: false };
  }

  describeEtiquetteRule(ruleId: string): string {
    const rule = this.etiquetteRules.get(ruleId);
    
    if (!rule) {
      return `No information available for etiquette rule: ${ruleId}`;
    }

    return `**Etiquette Rule: ${ruleId}**\n\n` +
           `**Context:** ${rule.context}\n` +
           `**Rule:** ${rule.rule}\n` +
           `**Violation:** ${rule.violation}\n` +
           `**Severity:** ${rule.severity}`;
  }

  addRule(id: string, context: string, rule: string, violation: string, severity: 'low' | 'medium' | 'high') {
    this.etiquetteRules.set(id, { context, rule, violation, severity });
  }
}

// ============================================
// Export all social reasoning systems
// ============================================
export const AllSocialReasoningSystems = {
  GroupBehaviorPredictor,
  ConflictResolution,
  SocialNormEnforcement,
  RelationshipTracker,
  InfluenceAnalyzer,
  CooperationFacilitator,
  SocialIdentityUnderstanding,
  EtiquetteEnforcement,
};
