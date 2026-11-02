// Core utilities for Synth-AI

export class Utils {
  static estimateTokens(text: string): number {
    if (!text) return 0;
    const words = text.trim().split(/\s+/).length;
    const chars = text.length;
    return Math.max(1, Math.round(Math.max(words * 1.3, chars / 4)));
  }

  static cosineSimilarity(v1: number[], v2: number[]): number {
    let dot = 0, mag1 = 0, mag2 = 0;
    const len = Math.min(v1.length, v2.length);
    for (let i = 0; i < len; i++) {
      dot += v1[i] * v2[i];
      mag1 += v1[i] * v1[i];
      mag2 += v2[i] * v2[i];
    }
    const denom = Math.sqrt(mag1) * Math.sqrt(mag2);
    return denom === 0 ? 0 : dot / denom;
  }

  static vectorAdd(v1: number[], v2: number[]): number[] {
    return v1.map((v, i) => v + (v2[i] || 0));
  }

  static vectorSubtract(v1: number[], v2: number[]): number[] {
    return v1.map((v, i) => v - (v2[i] || 0));
  }

  static normalize(v: number[]): number[] {
    const mag = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    return mag === 0 ? v : v.map(x => x / mag);
  }

  static softmax(scores: number[], temperature: number = 1.0): number[] {
    const max = Math.max(...scores);
    const exps = scores.map(s => Math.exp((s - max) / temperature));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
  }

  static levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i-1] === b[j-1]
          ? dp[i-1][j-1]
          : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
    return dp[m][n];
  }

  static soundex(word: string): string {
    if (!word) return '';
    const map: Record<string, number> = {B:1,F:1,P:1,V:1,C:2,G:2,J:2,K:2,Q:2,S:2,X:2,Z:2,D:3,T:3,L:4,M:5,N:5,R:6};
    word = word.toUpperCase().replace(/[^A-Z]/g, '');
    if (!word) return '';
    let result = word[0];
    let lastCode = map[word[0]] || 0;
    for (let i = 1; i < word.length && result.length < 4; i++) {
      const code = map[word[i]] || 0;
      if (code && code !== lastCode) { result += code; lastCode = code; }
      else if (!code) lastCode = 0;
    }
    while (result.length < 4) result += '0';
    return result;
  }

  static extractKeywords(text: string): string[] {
    const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','is','are','was','were','be','been','i','you','he','she','it','we','they']);
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !stopWords.has(w));
    const freq: Record<string, number> = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    return Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0, 10).map(([w]) => w);
  }
}

export class LogSystem {
  logs: Array<{ ts: number; type: string; message: string; payload?: any }> = [];
  tokenStats = { input: 0, thinking: 0, output: 0, total: 0, interactions: 0, perInteraction: [] as any[] };

  constructor() { this.load(); }

  load() {
    try {
      const logs = localStorage.getItem('synth_logs');
      const tokens = localStorage.getItem('synth_tokens');
      if (logs) this.logs = JSON.parse(logs);
      if (tokens) this.tokenStats = JSON.parse(tokens);
    } catch (e) { /* fresh start */ }
  }

  save() {
    try {
      localStorage.setItem('synth_logs', JSON.stringify(this.logs.slice(-2000)));
      localStorage.setItem('synth_tokens', JSON.stringify(this.tokenStats));
    } catch (e) { /* storage full */ }
  }

  add(type: string, message: string, payload: any = null) {
    this.logs.push({ ts: Date.now(), type, message, payload });
    if (this.logs.length > 2000) this.logs = this.logs.slice(-2000);
    this.save();
  }

  info(msg: string, payload?: any) { this.add('INFO', msg, payload); }
  warn(msg: string, payload?: any) { this.add('WARN', msg, payload); }
  error(msg: string, payload?: any) { this.add('ERROR', msg, payload); }
  debug(msg: string, payload?: any) { this.add('DEBUG', msg, payload); }

  logChat(role: string, content: string) {
    this.add('CHAT', `${role}: ${content.substring(0, 200)}`, { role, content });
  }

  logTokens(input: string, thinking: string, output: string, metadata: any = {}) {
    const inTok = Utils.estimateTokens(input);
    const thinkTok = Utils.estimateTokens(thinking);
    const outTok = Utils.estimateTokens(output);
    const total = inTok + thinkTok + outTok;

    this.tokenStats.input += inTok;
    this.tokenStats.thinking += thinkTok;
    this.tokenStats.output += outTok;
    this.tokenStats.total += total;
    this.tokenStats.interactions++;
    this.tokenStats.perInteraction.push({
      ts: Date.now(), input: inTok, thinking: thinkTok, output: outTok, total, ...metadata
    });
    if (this.tokenStats.perInteraction.length > 200) {
      this.tokenStats.perInteraction = this.tokenStats.perInteraction.slice(-200);
    }
    this.save();
    return { input: inTok, thinking: thinkTok, output: outTok, total };
  }

  getEstimatedCost(): number {
    return ((this.tokenStats.input / 1e6) * 15) +
           (((this.tokenStats.thinking + this.tokenStats.output) / 1e6) * 75);
  }

  formatWithChat(): string {
    let output = '═══ SYNTH-AI CONVERSATION LOG ═══\n\n';
    this.logs.filter(l => l.type === 'CHAT').forEach(log => {
      const time = new Date(log.ts).toLocaleString();
      output += `[${time}] ${log.message}\n`;
    });
    output += '\n═══ TOKEN STATISTICS ═══\n';
    output += `Total Interactions: ${this.tokenStats.interactions}\n`;
    output += `Input Tokens: ${this.tokenStats.input}\n`;
    output += `Thinking Tokens: ${this.tokenStats.thinking}\n`;
    output += `Output Tokens: ${this.tokenStats.output}\n`;
    output += `Total Tokens: ${this.tokenStats.total}\n`;
    output += `Estimated Cost: $${this.getEstimatedCost().toFixed(4)}\n`;
    return output;
  }

  clear() { this.logs = []; this.tokenStats = { input: 0, thinking: 0, output: 0, total: 0, interactions: 0, perInteraction: [] }; this.save(); }
}

export class SpeedMetrics {
  startTime = 0;
  firstTokenTime = 0;
  tokensGenerated = 0;
  wordsGenerated = 0;

  start() {
    this.startTime = Date.now();
    this.firstTokenTime = 0;
    this.tokensGenerated = 0;
    this.wordsGenerated = 0;
  }

  recordFirstToken() {
    if (this.firstTokenTime === 0) this.firstTokenTime = Date.now();
  }

  recordOutput(text: string) {
    this.tokensGenerated += Utils.estimateTokens(text);
    this.wordsGenerated += text.trim().split(/\s+/).length;
  }

  getMetrics(): { wps: number; tps: number; ttfb: number; totalTime: number } {
    const totalTime = (Date.now() - this.startTime) / 1000;
    const ttfb = this.firstTokenTime > 0 ? (this.firstTokenTime - this.startTime) / 1000 : 0;
    return {
      wps: totalTime > 0 ? this.wordsGenerated / totalTime : 0,
      tps: totalTime > 0 ? this.tokensGenerated / totalTime : 0,
      ttfb,
      totalTime
    };
  }
}
