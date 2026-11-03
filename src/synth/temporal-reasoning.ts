// Temporal Reasoning - Items 22.1-22.10
// Understand time, sequences, causality, tenses

import { Utils } from './utils';

// ============================================
// ITEM 22.1: Temporal Logic Engine
// Reason about time: before, after, during
// ============================================
export class TemporalLogicEngine {
  private temporalRelations: Map<string, { before: string[]; after: string[]; during: string[] }> = new Map();

  constructor() {
    this.loadRelations();
  }

  private loadRelations() {
    this.temporalRelations.set('morning', {
      before: ['dawn', 'sunrise'],
      after: ['noon', 'afternoon'],
      during: ['breakfast', 'commute']
    });

    this.temporalRelations.set('afternoon', {
      before: ['morning', 'noon'],
      after: ['evening', 'night'],
      during: ['lunch', 'meeting']
    });

    this.temporalRelations.set('evening', {
      before: ['afternoon', 'sunset'],
      after: ['night', 'midnight'],
      during: ['dinner', 'relaxation']
    });
  }

  isBefore(event1: string, event2: string): boolean {
    const rel1 = this.temporalRelations.get(event1.toLowerCase());
    const rel2 = this.temporalRelations.get(event2.toLowerCase());

    if (!rel1 || !rel2) return false;

    return rel1.after.includes(event2.toLowerCase()) || rel2.before.includes(event1.toLowerCase());
  }

  isAfter(event1: string, event2: string): boolean {
    return this.isBefore(event2, event1);
  }

  isDuring(event: string, period: string): boolean {
    const rel = this.temporalRelations.get(period.toLowerCase());
    if (!rel) return false;
    return rel.during.includes(event.toLowerCase());
  }

  getTemporalRelation(event1: string, event2: string): string {
    if (this.isBefore(event1, event2)) return 'before';
    if (this.isAfter(event1, event2)) return 'after';
    return 'unknown';
  }

  addRelation(event: string, before: string[], after: string[], during: string[]) {
    this.temporalRelations.set(event, { before, after, during });
  }
}

// ============================================
// ITEM 22.2: Event Sequence Tracker
// Track sequence of events, causal chains
// ============================================
export class EventSequenceTracker {
  private events: Array<{ event: string; timestamp: number; order: number }> = [];
  private causalLinks: Map<string, string[]> = new Map();

  addEvent(event: string, timestamp: number = Date.now()) {
    this.events.push({
      event,
      timestamp,
      order: this.events.length
    });
  }

  addCausalLink(cause: string, effect: string) {
    if (!this.causalLinks.has(cause)) {
      this.causalLinks.set(cause, []);
    }
    this.causalLinks.get(cause)!.push(effect);
  }

  getSequence(): string[] {
    return this.events
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(e => e.event);
  }

  getCausalChain(startEvent: string): string[] {
    const chain: string[] = [startEvent];
    const visited = new Set<string>();
    const queue = [startEvent];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const effects = this.causalLinks.get(current) || [];
      effects.forEach(effect => {
        chain.push(effect);
        queue.push(effect);
      });
    }

    return chain;
  }

  predictNext(cause: string): string[] {
    return this.causalLinks.get(cause) || [];
  }

  clear() {
    this.events = [];
    this.causalLinks.clear();
  }
}

// ============================================
// ITEM 22.3: Tense Understanding
// Past, present, future, perfect, continuous
// ============================================
export class TenseUnderstanding {
  private tensePatterns: Map<string, { tense: string; timeReference: string; examples: string[] }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.tensePatterns.set('past_simple', {
      tense: 'past simple',
      timeReference: 'completed action in the past',
      examples: ['I walked', 'She ate', 'They played']
    });

    this.tensePatterns.set('present_simple', {
      tense: 'present simple',
      timeReference: 'habitual action or general truth',
      examples: ['I walk', 'She eats', 'They play']
    });

    this.tensePatterns.set('future_simple', {
      tense: 'future simple',
      timeReference: 'action that will happen',
      examples: ['I will walk', 'She will eat', 'They will play']
    });

    this.tensePatterns.set('present_perfect', {
      tense: 'present perfect',
      timeReference: 'action that started in past and continues',
      examples: ['I have walked', 'She has eaten', 'They have played']
    });

    this.tensePatterns.set('past_continuous', {
      tense: 'past continuous',
      timeReference: 'ongoing action in the past',
      examples: ['I was walking', 'She was eating', 'They were playing']
    });
  }

  detectTense(text: string): { tense: string; timeReference: string; confidence: number } {
    const textLower = text.toLowerCase();

    // Check for tense indicators
    if (/\b(was|were)\s+\w+ing\b/i.test(text)) {
      return { tense: 'past continuous', timeReference: 'ongoing action in the past', confidence: 0.9 };
    }

    if (/\b(have|has)\s+\w+ed\b/i.test(text) || /\b(have|has)\s+\w+en\b/i.test(text)) {
      return { tense: 'present perfect', timeReference: 'action that started in past and continues', confidence: 0.9 };
    }

    if (/\bwill\s+\w+\b/i.test(text)) {
      return { tense: 'future simple', timeReference: 'action that will happen', confidence: 0.9 };
    }

    if (/\b(yesterday|last week|last year|ago)\b/i.test(text)) {
      return { tense: 'past simple', timeReference: 'completed action in the past', confidence: 0.8 };
    }

    if (/\b(tomorrow|next week|next year|soon)\b/i.test(text)) {
      return { tense: 'future simple', timeReference: 'action that will happen', confidence: 0.8 };
    }

    if (/\b(always|never|every day|usually)\b/i.test(text)) {
      return { tense: 'present simple', timeReference: 'habitual action or general truth', confidence: 0.8 };
    }

    return { tense: 'unknown', timeReference: 'unknown', confidence: 0.3 };
  }

  describeTense(tense: string): string {
    const pattern = this.tensePatterns.get(tense);
    
    if (!pattern) {
      return `No information available for tense: ${tense}`;
    }

    let description = `**Tense: ${pattern.tense}**\n\n`;
    description += `**Time Reference:** ${pattern.timeReference}\n\n`;
    description += `**Examples:**\n`;
    pattern.examples.forEach(ex => description += `- ${ex}\n`);

    return description;
  }

  addPattern(tense: string, timeReference: string, examples: string[]) {
    this.tensePatterns.set(tense, { tense, timeReference, examples });
  }
}

// ============================================
// ITEM 22.4: Duration Reasoning
// Understand durations, estimate time requirements
// ============================================
export class DurationReasoning {
  private durationEstimates: Map<string, { min: number; max: number; unit: string }> = new Map();

  constructor() {
    this.loadEstimates();
  }

  private loadEstimates() {
    this.durationEstimates.set('write_email', { min: 5, max: 15, unit: 'minutes' });
    this.durationEstimates.set('read_chapter', { min: 20, max: 40, unit: 'minutes' });
    this.durationEstimates.set('cook_meal', { min: 30, max: 90, unit: 'minutes' });
    this.durationEstimates.set('drive_commute', { min: 15, max: 60, unit: 'minutes' });
    this.durationEstimates.set('exercise_workout', { min: 30, max: 60, unit: 'minutes' });
    this.durationEstimates.set('attend_meeting', { min: 30, max: 120, unit: 'minutes' });
    this.durationEstimates.set('write_report', { min: 2, max: 8, unit: 'hours' });
    this.durationEstimates.set('learn_topic', { min: 10, max: 40, unit: 'hours' });
  }

  estimateDuration(task: string): { min: number; max: number; unit: string } | null {
    return this.durationEstimates.get(task.toLowerCase().replace(/\s+/g, '_')) || null;
  }

  compareDurations(task1: string, task2: string): string {
    const est1 = this.estimateDuration(task1);
    const est2 = this.estimateDuration(task2);

    if (!est1 || !est2) {
      return `Cannot compare durations: missing data for ${!est1 ? task1 : task2}`;
    }

    // Convert to minutes for comparison
    const min1 = est1.unit === 'hours' ? est1.min * 60 : est1.min;
    const max1 = est1.unit === 'hours' ? est1.max * 60 : est1.max;
    const min2 = est2.unit === 'hours' ? est2.min * 60 : est2.min;
    const max2 = est2.unit === 'hours' ? est2.max * 60 : est2.max;

    const avg1 = (min1 + max1) / 2;
    const avg2 = (min2 + max2) / 2;

    if (avg1 > avg2 * 1.5) {
      return `${task1} takes significantly longer than ${task2}`;
    } else if (avg2 > avg1 * 1.5) {
      return `${task2} takes significantly longer than ${task1}`;
    } else {
      return `${task1} and ${task2} take similar amounts of time`;
    }
  }

  describeDuration(task: string): string {
    const estimate = this.estimateDuration(task);
    
    if (!estimate) {
      return `No duration estimate available for: ${task}`;
    }

    return `**Duration Estimate: ${task}**\n\n` +
           `- **Minimum:** ${estimate.min} ${estimate.unit}\n` +
           `- **Maximum:** ${estimate.max} ${estimate.unit}\n` +
           `- **Average:** ${((estimate.min + estimate.max) / 2).toFixed(1)} ${estimate.unit}`;
  }

  addEstimate(task: string, min: number, max: number, unit: string) {
    this.durationEstimates.set(task.toLowerCase().replace(/\s+/g, '_'), { min, max, unit });
  }
}

// ============================================
// ITEM 22.5: Frequency Detection
// Detect frequency patterns, periodic events
// ============================================
export class FrequencyDetector {
  private frequencyPatterns: Map<string, { frequency: string; interval: number; unit: string }> = new Map();

  constructor() {
    this.loadPatterns();
  }

  private loadPatterns() {
    this.frequencyPatterns.set('daily', { frequency: 'once per day', interval: 1, unit: 'day' });
    this.frequencyPatterns.set('weekly', { frequency: 'once per week', interval: 7, unit: 'days' });
    this.frequencyPatterns.set('monthly', { frequency: 'once per month', interval: 30, unit: 'days' });
    this.frequencyPatterns.set('yearly', { frequency: 'once per year', interval: 365, unit: 'days' });
    this.frequencyPatterns.set('hourly', { frequency: 'once per hour', interval: 1, unit: 'hour' });
    this.frequencyPatterns.set('biweekly', { frequency: 'twice per week', interval: 3.5, unit: 'days' });
  }

  detectFrequency(text: string): { frequency: string; confidence: number } {
    const textLower = text.toLowerCase();

    if (/\b(every day|daily|each day)\b/i.test(text)) {
      return { frequency: 'daily', confidence: 0.9 };
    }

    if (/\b(every week|weekly|each week)\b/i.test(text)) {
      return { frequency: 'weekly', confidence: 0.9 };
    }

    if (/\b(every month|monthly|each month)\b/i.test(text)) {
      return { frequency: 'monthly', confidence: 0.9 };
    }

    if (/\b(every year|yearly|annually|each year)\b/i.test(text)) {
      return { frequency: 'yearly', confidence: 0.9 };
    }

    if (/\b(every hour|hourly|each hour)\b/i.test(text)) {
      return { frequency: 'hourly', confidence: 0.9 };
    }

    if (/\b(twice a week|biweekly)\b/i.test(text)) {
      return { frequency: 'biweekly', confidence: 0.9 };
    }

    return { frequency: 'unknown', confidence: 0.3 };
  }

  calculateOccurrences(frequency: string, timePeriod: number, unit: string): number {
    const pattern = this.frequencyPatterns.get(frequency.toLowerCase());
    
    if (!pattern) return 0;

    // Convert time period to days
    let periodInDays = timePeriod;
    if (unit === 'hours') periodInDays = timePeriod / 24;
    if (unit === 'weeks') periodInDays = timePeriod * 7;
    if (unit === 'months') periodInDays = timePeriod * 30;
    if (unit === 'years') periodInDays = timePeriod * 365;

    // Convert frequency interval to days
    let intervalInDays = pattern.interval;
    if (pattern.unit === 'hours') intervalInDays = pattern.interval / 24;
    if (pattern.unit === 'weeks') intervalInDays = pattern.interval * 7;

    return Math.floor(periodInDays / intervalInDays);
  }

  describeFrequency(frequency: string): string {
    const pattern = this.frequencyPatterns.get(frequency.toLowerCase());
    
    if (!pattern) {
      return `No information available for frequency: ${frequency}`;
    }

    return `**Frequency: ${frequency}**\n\n` +
           `- **Description:** ${pattern.frequency}\n` +
           `- **Interval:** Every ${pattern.interval} ${pattern.unit}`;
  }

  addPattern(frequency: string, description: string, interval: number, unit: string) {
    this.frequencyPatterns.set(frequency.toLowerCase(), { frequency: description, interval, unit });
  }
}

// ============================================
// ITEM 22.6: Temporal Reference Resolution
// "Yesterday" → specific date, "next week" → date range
// ============================================
export class TemporalReferenceResolver {
  resolve(reference: string, currentDate: Date = new Date()): { 
    resolved: boolean; 
    date?: Date; 
    dateRange?: { start: Date; end: Date };
    explanation?: string 
  } {
    const refLower = reference.toLowerCase();

    // Relative days
    if (refLower === 'yesterday') {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - 1);
      return { resolved: true, date, explanation: 'One day before today' };
    }

    if (refLower === 'today') {
      return { resolved: true, date: currentDate, explanation: 'Current day' };
    }

    if (refLower === 'tomorrow') {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + 1);
      return { resolved: true, date, explanation: 'One day after today' };
    }

    // Relative weeks
    if (refLower === 'last week') {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - 7);
      const end = new Date(currentDate);
      return { resolved: true, dateRange: { start, end }, explanation: '7 days before today until today' };
    }

    if (refLower === 'next week') {
      const start = new Date(currentDate);
      const end = new Date(currentDate);
      end.setDate(end.getDate() + 7);
      return { resolved: true, dateRange: { start, end }, explanation: 'Today until 7 days from today' };
    }

    // Relative months
    if (refLower === 'last month') {
      const start = new Date(currentDate);
      start.setMonth(start.getMonth() - 1);
      const end = new Date(currentDate);
      return { resolved: true, dateRange: { start, end }, explanation: 'One month before today until today' };
    }

    if (refLower === 'next month') {
      const start = new Date(currentDate);
      const end = new Date(currentDate);
      end.setMonth(end.getMonth() + 1);
      return { resolved: true, dateRange: { start, end }, explanation: 'Today until one month from today' };
    }

    return { resolved: false, explanation: 'Unable to resolve temporal reference' };
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatRange(start: Date, end: Date): string {
    return `${this.formatDate(start)} to ${this.formatDate(end)}`;
  }

  describeResolution(reference: string): string {
    const result = this.resolve(reference);
    
    if (!result.resolved) {
      return `Unable to resolve: ${reference}`;
    }

    let description = `**Temporal Reference: ${reference}**\n\n`;
    
    if (result.date) {
      description += `**Resolved Date:** ${this.formatDate(result.date)}\n`;
    }
    
    if (result.dateRange) {
      description += `**Resolved Range:** ${this.formatRange(result.dateRange.start, result.dateRange.end)}\n`;
    }
    
    if (result.explanation) {
      description += `\n**Explanation:** ${result.explanation}`;
    }

    return description;
  }
}

// ============================================
// ITEM 22.7: Causal Temporal Reasoning
// Causation implies temporal order
// ============================================
export class CausalTemporalReasoning {
  private causalRelations: Map<string, { causes: string[]; causedBy: string[] }> = new Map();

  constructor() {
    this.loadRelations();
  }

  private loadRelations() {
    this.causalRelations.set('rain', {
      causes: ['wet ground', 'umbrella use', 'traffic delays'],
      causedBy: ['cloud formation', 'humidity']
    });

    this.causalRelations.set('study', {
      causes: ['better grades', 'knowledge gain', 'exam success'],
      causedBy: ['motivation', 'upcoming exam']
    });

    this.causalRelations.set('exercise', {
      causes: ['fitness improvement', 'weight loss', 'better health'],
      causedBy: ['health goals', 'doctor recommendation']
    });

    this.causalRelations.set('server_crash', {
      causes: ['service outage', 'data loss risk', 'user frustration'],
      causedBy: ['hardware failure', 'software bug', 'overload']
    });
  }

  getCauses(effect: string): string[] {
    const relation = this.causalRelations.get(effect.toLowerCase());
    return relation?.causedBy || [];
  }

  getEffects(cause: string): string[] {
    const relation = this.causalRelations.get(cause.toLowerCase());
    return relation?.causes || [];
  }

  inferTemporalOrder(event1: string, event2: string): string {
    const effects1 = this.getEffects(event1);
    const causes2 = this.getCauses(event2);

    if (effects1.includes(event2.toLowerCase())) {
      return `${event1} must occur before ${event2}`;
    }

    if (causes2.includes(event1.toLowerCase())) {
      return `${event1} must occur before ${event2}`;
    }

    const effects2 = this.getEffects(event2);
    const causes1 = this.getCauses(event1);

    if (effects2.includes(event1.toLowerCase())) {
      return `${event2} must occur before ${event1}`;
    }

    if (causes1.includes(event2.toLowerCase())) {
      return `${event2} must occur before ${event1}`;
    }

    return `No clear temporal relationship between ${event1} and ${event2}`;
  }

  describeCausalChain(event: string): string {
    const causes = this.getCauses(event);
    const effects = this.getEffects(event);

    let description = `**Causal Analysis: ${event}**\n\n`;

    if (causes.length > 0) {
      description += '**Causes (must occur before):**\n';
      causes.forEach(c => description += `- ${c}\n`);
      description += '\n';
    }

    if (effects.length > 0) {
      description += '**Effects (must occur after):**\n';
      effects.forEach(e => description += `- ${e}\n`);
    }

    if (causes.length === 0 && effects.length === 0) {
      description += 'No causal relationships recorded for this event.';
    }

    return description;
  }

  addRelation(event: string, causes: string[], effects: string[]) {
    this.causalRelations.set(event.toLowerCase(), { causes: effects, causedBy: causes });
  }
}

// ============================================
// ITEM 22.8: Deadline Tracking
// Track deadlines, urgency detection
// ============================================
export class DeadlineTracker {
  private deadlines: Map<string, { date: Date; priority: 'low' | 'medium' | 'high' | 'urgent'; description: string }> = new Map();

  addDeadline(id: string, date: Date, priority: 'low' | 'medium' | 'high' | 'urgent', description: string) {
    this.deadlines.set(id, { date, priority, description });
  }

  getDeadline(id: string): { date: Date; priority: string; description: string; daysRemaining: number } | null {
    const deadline = this.deadlines.get(id);
    if (!deadline) return null;

    const now = new Date();
    const daysRemaining = Math.ceil((deadline.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      date: deadline.date,
      priority: deadline.priority,
      description: deadline.description,
      daysRemaining
    };
  }

  getUrgentDeadlines(): Array<{ id: string; date: Date; priority: string; daysRemaining: number }> {
    const urgent: Array<{ id: string; date: Date; priority: string; daysRemaining: number }> = [];
    const now = new Date();

    this.deadlines.forEach((deadline, id) => {
      const daysRemaining = Math.ceil((deadline.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (deadline.priority === 'urgent' || daysRemaining <= 3) {
        urgent.push({
          id,
          date: deadline.date,
          priority: deadline.priority,
          daysRemaining
        });
      }
    });

    return urgent.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  describeDeadline(id: string): string {
    const deadline = this.getDeadline(id);
    
    if (!deadline) {
      return `No deadline found with id: ${id}`;
    }

    let description = `**Deadline: ${id}**\n\n`;
    description += `**Description:** ${deadline.description}\n`;
    description += `**Date:** ${deadline.date.toLocaleDateString()}\n`;
    description += `**Priority:** ${deadline.priority}\n`;
    description += `**Days Remaining:** ${deadline.daysRemaining}\n\n`;

    if (deadline.daysRemaining < 0) {
      description += '**Status:** OVERDUE';
    } else if (deadline.daysRemaining === 0) {
      description += '**Status:** DUE TODAY';
    } else if (deadline.daysRemaining <= 3) {
      description += '**Status:** URGENT';
    } else {
      description += '**Status:** On track';
    }

    return description;
  }

  clear() {
    this.deadlines.clear();
  }
}

// ============================================
// ITEM 22.9: Temporal Pattern Recognition
// Recognize patterns over time
// ============================================
export class TemporalPatternRecognizer {
  private dataPoints: Map<string, Array<{ timestamp: number; value: number }>> = new Map();

  addDataPoint(series: string, timestamp: number, value: number) {
    if (!this.dataPoints.has(series)) {
      this.dataPoints.set(series, []);
    }
    this.dataPoints.get(series)!.push({ timestamp, value });
  }

  detectTrend(series: string): 'increasing' | 'decreasing' | 'stable' | 'unknown' {
    const data = this.dataPoints.get(series);
    if (!data || data.length < 3) return 'unknown';

    // Simple linear regression to detect trend
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    data.forEach((point, i) => {
      sumX += i;
      sumY += point.value;
      sumXY += i * point.value;
      sumX2 += i * i;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    if (slope > 0.1) return 'increasing';
    if (slope < -0.1) return 'decreasing';
    return 'stable';
  }

  detectSeasonality(series: string, period: number): boolean {
    const data = this.dataPoints.get(series);
    if (!data || data.length < period * 2) return false;

    // Simple autocorrelation check
    const values = data.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    
    let autocorrelation = 0;
    for (let i = 0; i < values.length - period; i++) {
      autocorrelation += (values[i] - mean) * (values[i + period] - mean);
    }

    return autocorrelation > 0;
  }

  describePattern(series: string): string {
    const trend = this.detectTrend(series);
    const hasSeasonality = this.detectSeasonality(series, 7); // Check for weekly seasonality

    let description = `**Temporal Pattern: ${series}**\n\n`;
    description += `**Trend:** ${trend}\n`;
    description += `**Seasonality:** ${hasSeasonality ? 'Detected' : 'Not detected'}\n`;

    const data = this.dataPoints.get(series);
    if (data && data.length > 0) {
      const values = data.map(d => d.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;

      description += `\n**Statistics:**\n`;
      description += `- Min: ${min.toFixed(2)}\n`;
      description += `- Max: ${max.toFixed(2)}\n`;
      description += `- Average: ${avg.toFixed(2)}\n`;
      description += `- Data points: ${data.length}`;
    }

    return description;
  }

  clear() {
    this.dataPoints.clear();
  }
}

// ============================================
// ITEM 22.10: Temporal Consistency Checking
// Detect temporal contradictions
// ============================================
export class TemporalConsistencyChecker {
  private temporalFacts: Map<string, Array<{ time: string; event: string }>> = new Map();

  addTemporalFact(entity: string, time: string, event: string) {
    if (!this.temporalFacts.has(entity)) {
      this.temporalFacts.set(entity, []);
    }
    this.temporalFacts.get(entity)!.push({ time, event });
  }

  checkConsistency(entity: string): { consistent: boolean; contradictions: string[] } {
    const facts = this.temporalFacts.get(entity);
    if (!facts || facts.length < 2) {
      return { consistent: true, contradictions: [] };
    }

    const contradictions: string[] = [];

    // Check for impossible temporal sequences
    const timeOrder = ['past', 'past', 'present', 'future', 'future'];
    
    for (let i = 0; i < facts.length - 1; i++) {
      const time1 = facts[i].time.toLowerCase();
      const time2 = facts[i + 1].time.toLowerCase();

      const idx1 = timeOrder.indexOf(time1);
      const idx2 = timeOrder.indexOf(time2);

      if (idx1 > idx2) {
        contradictions.push(
          `Temporal contradiction: "${facts[i].event}" (${time1}) cannot occur after "${facts[i + 1].event}" (${time2})`
        );
      }
    }

    // Check for contradictory events at same time
    const timeGroups = new Map<string, string[]>();
    facts.forEach(fact => {
      if (!timeGroups.has(fact.time)) {
        timeGroups.set(fact.time, []);
      }
      timeGroups.get(fact.time)!.push(fact.event);
    });

    timeGroups.forEach((events, time) => {
      if (events.length > 1) {
        // Check if events are mutually exclusive
        const exclusivePairs = [
          ['alive', 'dead'],
          ['present', 'absent'],
          ['active', 'inactive']
        ];

        exclusivePairs.forEach(([term1, term2]) => {
          const hasTerm1 = events.some(e => e.toLowerCase().includes(term1));
          const hasTerm2 = events.some(e => e.toLowerCase().includes(term2));
          
          if (hasTerm1 && hasTerm2) {
            contradictions.push(
              `Contradiction at ${time}: cannot be both ${term1} and ${term2}`
            );
          }
        });
      }
    });

    return {
      consistent: contradictions.length === 0,
      contradictions
    };
  }

  describeConsistency(entity: string): string {
    const { consistent, contradictions } = this.checkConsistency(entity);
    
    let description = `**Temporal Consistency: ${entity}**\n\n`;
    
    if (consistent) {
      description += '✓ All temporal facts are consistent.';
    } else {
      description += '✗ Contradictions detected:\n\n';
      contradictions.forEach(c => description += `- ${c}\n`);
    }

    return description;
  }

  clear() {
    this.temporalFacts.clear();
  }
}

// ============================================
// Export all temporal reasoning systems
// ============================================
export const TemporalReasoningSystems = {
  TemporalLogicEngine,
  EventSequenceTracker,
  TenseUnderstanding,
  DurationReasoning,
  FrequencyDetector,
  TemporalReferenceResolver,
  CausalTemporalReasoning,
  DeadlineTracker,
  TemporalPatternRecognizer,
  TemporalConsistencyChecker,
};
