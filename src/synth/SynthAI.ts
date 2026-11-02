// Synth SAI - Main Orchestrator
// Integrates all core infrastructure components

import {
  HierarchicalMemory,
  KnowledgeGraph,
  ExpandedSemanticSpace,
  CodeVersioning,
  PronounResolver,
  SynonymExpander,
  ConfidenceCalibrator,
  ClarificationEngine,
  ConstraintSolver,
  CommonsenseReasoner,
  ReasoningMonitor
} from './core-infrastructure';
import { Utils } from './utils';

export interface SynthResult {
  response: string;
  thinking: string;
  code?: string;
  confidence: number;
  intent: string;
  emotion: string;
  tokens: any;
  speed: any;
}

export class SynthAI {
  // Core infrastructure
  private memory: HierarchicalMemory;
  private knowledgeGraph: KnowledgeGraph;
  private semanticSpace: ExpandedSemanticSpace;
  private codeVersioning: CodeVersioning;
  private pronounResolver: PronounResolver;
  private synonymExpander: SynonymExpander;
  private confidenceCalibrator: ConfidenceCalibrator;
  private clarificationEngine: ClarificationEngine;
  private constraintSolver: ConstraintSolver;
  private commonsenseReasoner: CommonsenseReasoner;
  private reasoningMonitor: ReasoningMonitor;

  // State
  private conversationHistory: any[] = [];
  private turns = 0;
  private startTime = 0;
  private firstTokenTime = 0;
  private tokensGenerated = 0;
  private wordsGenerated = 0;

  constructor() {
    // Initialize all core infrastructure
    this.memory = new HierarchicalMemory();
    this.knowledgeGraph = new KnowledgeGraph();
    this.semanticSpace = new ExpandedSemanticSpace();
    this.codeVersioning = new CodeVersioning();
    this.pronounResolver = new PronounResolver();
    this.synonymExpander = new SynonymExpander();
    this.confidenceCalibrator = new ConfidenceCalibrator();
    this.clarificationEngine = new ClarificationEngine();
    this.constraintSolver = new ConstraintSolver();
    this.commonsenseReasoner = new CommonsenseReasoner();
    this.reasoningMonitor = new ReasoningMonitor();

    // Load persisted data
    this.knowledgeGraph.load();
    this.codeVersioning.load();

    console.log('[SynthAI] v6.0 with 290 implementations initialized');
  }

  async process(input: string): Promise<SynthResult> {
    this.startTime = Date.now();
    this.firstTokenTime = 0;
    this.tokensGenerated = 0;
    this.wordsGenerated = 0;
    this.turns++;

    this.reasoningMonitor.clear();
    this.reasoningMonitor.recordStep('Starting processing', 1.0);

    // Step 1: Extract entities and resolve pronouns
    this.pronounResolver.extractEntities(input);
    const resolvedInput = this.resolvePronouns(input);
    this.reasoningMonitor.recordStep('Pronoun resolution', 0.95);

    // Step 2: Expand synonyms for better matching
    const expandedTerms = this.synonymExpander.expandText(resolvedInput);
    this.reasoningMonitor.recordStep('Synonym expansion', 0.9);

    // Step 3: Classify intent
    const intent = this.classifyIntent(resolvedInput);
    this.reasoningMonitor.recordStep('Intent classification', intent.confidence);

    // Step 4: Detect emotion
    const emotion = this.detectEmotion(resolvedInput);
    this.reasoningMonitor.recordStep('Emotion detection', 0.85);

    // Step 5: Apply commonsense reasoning
    const commonsense = this.commonsenseReasoner.reason([resolvedInput]);
    this.reasoningMonitor.recordStep('Commonsense reasoning', 0.8);

    // Step 6: Generate response based on intent
    this.firstTokenTime = Date.now();
    let response = '';
    let code: string | undefined;
    let confidence = intent.confidence;

    switch (intent.type) {
      case 'code_generation':
        const codeResult = this.generateCode(resolvedInput);
        code = codeResult.code;
        response = codeResult.description;
        confidence = 0.95;
        break;

      case 'modification':
        const modResult = this.modifyCode(resolvedInput);
        if (modResult) {
          code = modResult.code;
          response = modResult.description;
          confidence = 0.9;
        } else {
          response = "I don't have any code to modify yet. Try asking me to build something first.";
          confidence = 0.7;
        }
        break;

      case 'question':
        response = this.answerQuestion(resolvedInput, commonsense);
        confidence = 0.85;
        break;

      case 'math':
        response = this.solveMath(resolvedInput);
        confidence = 0.95;
        break;

      case 'greeting':
        response = this.handleGreeting(emotion);
        confidence = 0.95;
        break;

      case 'clarification':
        response = this.clarificationEngine.generateClarification(intent, []);
        confidence = 0.6;
        break;

      default:
        response = this.handleConversation(resolvedInput, commonsense);
        confidence = 0.7;
    }

    // Step 7: Calibrate confidence
    confidence = this.confidenceCalibrator.calibrate(confidence, []);
    this.reasoningMonitor.recordStep('Confidence calibration', confidence);

    // Step 8: Format response with confidence
    if (confidence < 0.7) {
      response = this.confidenceCalibrator.formatResponse(response, confidence);
    }

    this.wordsGenerated += response.trim().split(/\s+/).length;
    this.tokensGenerated = Utils.estimateTokens(response);

    // Step 9: Store in memory
    this.memory.add({
      role: 'user',
      content: input,
      resolved: resolvedInput,
      intent: intent.type,
      emotion,
      timestamp: Date.now()
    }, 'working');

    this.memory.add({
      role: 'assistant',
      content: response,
      code,
      confidence,
      timestamp: Date.now()
    }, 'working');

    if (code) {
      const version = this.codeVersioning.addCode(code, {
        description: response,
        intent: intent.type
      });
      this.memory.add({
        role: 'system',
        type: 'code_version',
        version,
        timestamp: Date.now()
      }, 'session');
    }

    this.conversationHistory.push({
      userInput: input,
      aiResponse: response,
      code,
      timestamp: Date.now()
    });

    this.reasoningMonitor.recordStep('Response generation complete', confidence);

    // Step 10: Build result
    const thinking = this.reasoningMonitor.getReasoningTrace();
    const totalTime = (Date.now() - this.startTime) / 1000;
    const ttfb = this.firstTokenTime > 0 ? (this.firstTokenTime - this.startTime) / 1000 : 0;

    return {
      response,
      thinking,
      code,
      confidence,
      intent: intent.type,
      emotion,
      tokens: {
        input: Utils.estimateTokens(input),
        output: this.tokensGenerated,
        total: Utils.estimateTokens(input) + this.tokensGenerated
      },
      speed: {
        totalTime,
        ttfb,
        wps: totalTime > 0 ? this.wordsGenerated / totalTime : 0,
        tps: totalTime > 0 ? this.tokensGenerated / totalTime : 0
      }
    };
  }

  private resolvePronouns(input: string): string {
    let resolved = input;

    // Replace pronouns with resolved entities
    const pronouns = ['it', 'this', 'that', 'they', 'these'];
    pronouns.forEach(pronoun => {
      const regex = new RegExp(`\\b${pronoun}\\b`, 'gi');
      const match = input.match(regex);
      if (match) {
        const entity = this.pronounResolver.resolve(pronoun, input);
        if (entity) {
          resolved = resolved.replace(regex, entity);
        }
      }
    });

    return resolved;
  }

  private classifyIntent(input: string): { type: string; confidence: number } {
    const lower = input.toLowerCase();
    const expanded = this.synonymExpander.expandText(lower);

    // Code generation
    const codeActions = ['build', 'create', 'make', 'generate', 'code', 'write', 'develop'];
    const codeObjects = ['calculator', 'timer', 'calendar', 'todo', 'form', 'game', 'website', 'dashboard', 'chart', 'player', 'editor', 'gallery', 'app'];
    
    const hasCodeAction = codeActions.some(action => expanded.includes(action));
    const hasCodeObject = codeObjects.some(obj => expanded.includes(obj));

    if (hasCodeAction && hasCodeObject) {
      return { type: 'code_generation', confidence: 0.95 };
    }

    // Modification
    const modKeywords = ['change', 'modify', 'update', 'edit', 'fix', 'improve', 'alter'];
    if (modKeywords.some(kw => expanded.includes(kw)) && this.codeVersioning.getRecentVersions(1).length > 0) {
      return { type: 'modification', confidence: 0.9 };
    }

    // Math
    if (/^[\d\s\+\-\*\/\^\(\)\.]+$/.test(input.trim())) {
      return { type: 'math', confidence: 0.95 };
    }

    // Question
    if (/^(what|who|where|when|why|how|can|could|will|would|should|is|are)\b/i.test(input.trim())) {
      return { type: 'question', confidence: 0.85 };
    }

    // Greeting
    if (/^(hi|hello|hey|greetings|good morning|good evening)\b/i.test(input.trim())) {
      return { type: 'greeting', confidence: 0.95 };
    }

    // Check if needs clarification
    const ambiguities = this.clarificationEngine.detectAmbiguity(input);
    if (ambiguities.length > 0) {
      return { type: 'clarification', confidence: 0.5 };
    }

    return { type: 'conversation', confidence: 0.6 };
  }

  private detectEmotion(input: string): string {
    const lower = input.toLowerCase();

    if (/stupid|dumb|idiot|hate|suck|frustrated|angry/i.test(lower)) return 'frustrated';
    if (/wrong|messed|broken|fail|error/i.test(lower)) return 'concerned';
    if (/thank|thanks|great|awesome|perfect|love|amazing/i.test(lower)) return 'happy';
    if (/\?/.test(input) && /^(what|how|why|when|where|who)/i.test(input)) return 'curious';
    if (/please|could you|would you|can you/i.test(lower)) return 'polite';
    if (/!/.test(input) && input.length < 30) return 'excited';

    return 'neutral';
  }

  private generateCode(input: string): { code: string; description: string } {
    const lower = input.toLowerCase();
    
    // Detect component type
    let component = 'generic';
    if (/calculator|calc/i.test(lower)) component = 'calculator';
    else if (/timer|countdown/i.test(lower)) component = 'timer';
    else if (/calendar|schedule/i.test(lower)) component = 'calendar';
    else if (/todo|task/i.test(lower)) component = 'todo';
    else if (/form|contact/i.test(lower)) component = 'form';
    else if (/game|snake/i.test(lower)) component = 'game';
    else if (/website|site/i.test(lower)) component = 'website';
    else if (/dashboard|panel/i.test(lower)) component = 'dashboard';
    else if (/chart|graph/i.test(lower)) component = 'chart';

    // Detect theme
    let theme = 'default';
    if (/beach|ocean|tropical/i.test(lower)) theme = 'beach';
    else if (/dark|night/i.test(lower)) theme = 'dark';
    else if (/light|bright/i.test(lower)) theme = 'light';
    else if (/colorful|vibrant/i.test(lower)) theme = 'colorful';
    else if (/minimal|simple/i.test(lower)) theme = 'minimal';
    else if (/modern|sleek/i.test(lower)) theme = 'modern';
    else if (/retro|vintage/i.test(lower)) theme = 'retro';
    else if (/futuristic|cyber/i.test(lower)) theme = 'futuristic';
    else if (/nature|forest/i.test(lower)) theme = 'nature';
    else if (/space|galaxy/i.test(lower)) theme = 'space';

    const colors = this.getThemeColors(theme);
    const code = this.buildComponent(component, colors);
    const description = `Generated ${component} with ${theme} theme`;

    return { code, description };
  }

  private getThemeColors(theme: string): any {
    const themes: any = {
      beach: { bg: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #F4A460 100%)', card: 'rgba(255,255,255,0.9)', accent: '#4682B4', text: '#333' },
      dark: { bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', card: 'rgba(255,255,255,0.1)', accent: '#667eea', text: '#fff' },
      light: { bg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', card: '#fff', accent: '#667eea', text: '#333' },
      colorful: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', card: 'rgba(255,255,255,0.95)', accent: '#f093fb', text: '#333' },
      minimal: { bg: '#f8f9fa', card: '#fff', accent: '#000', text: '#333' },
      modern: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', card: '#fff', accent: '#667eea', text: '#333' },
      retro: { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', card: '#fff', accent: '#ff6b6b', text: '#333' },
      futuristic: { bg: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)', card: 'rgba(0,255,255,0.1)', accent: '#00ffff', text: '#fff' },
      nature: { bg: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)', card: 'rgba(255,255,255,0.9)', accent: '#2d5016', text: '#333' },
      space: { bg: 'linear-gradient(135deg, #000428 0%, #004e92 100%)', card: 'rgba(255,255,255,0.1)', accent: '#ffd700', text: '#fff' },
      default: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', card: '#fff', accent: '#667eea', text: '#333' }
    };
    return themes[theme] || themes.default;
  }

  private buildComponent(component: string, colors: any): string {
    const baseStyles = `* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Segoe UI', system-ui, sans-serif; background: ${colors.bg}; min-height: 100vh; color: ${colors.text}; }`;

    switch (component) {
      case 'calculator':
        return `<!DOCTYPE html><html><head><style>${baseStyles} .calculator { background: ${colors.card}; padding: 2rem; border-radius: 20px; max-width: 400px; margin: 50px auto; } #display { width: 100%; height: 60px; font-size: 2rem; text-align: right; padding: 1rem; background: ${colors.bg}; border: none; border-radius: 10px; margin-bottom: 1rem; } .buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; } button { padding: 1.5rem; font-size: 1.5rem; border: none; border-radius: 10px; cursor: pointer; background: ${colors.accent}20; color: ${colors.text}; } button:hover { opacity: 0.8; }</style></head><body><div class="calculator"><input type="text" id="display" readonly><div class="buttons"><button onclick="clearDisplay()">C</button><button onclick="append('(')">(</button><button onclick="append(')')">)</button><button onclick="append('/')">÷</button><button onclick="append('7')">7</button><button onclick="append('8')">8</button><button onclick="append('9')">9</button><button onclick="append('*')">×</button><button onclick="append('4')">4</button><button onclick="append('5')">5</button><button onclick="append('6')">6</button><button onclick="append('-')">−</button><button onclick="append('1')">1</button><button onclick="append('2')">2</button><button onclick="append('3')">3</button><button onclick="append('+')">+</button><button onclick="append('0')">0</button><button onclick="append('.')">.</button><button onclick="calculate()" style="grid-column: span 2; background: ${colors.accent}; color: white;">=</button></div></div><script>const display = document.getElementById('display'); function append(val) { display.value += val; } function clearDisplay() { display.value = ''; } function calculate() { try { display.value = eval(display.value); } catch(e) { display.value = 'Error'; } }</script></body></html>`;

      case 'timer':
        return `<!DOCTYPE html><html><head><style>${baseStyles} .timer { background: ${colors.card}; padding: 3rem; border-radius: 20px; max-width: 500px; margin: 50px auto; text-align: center; } #time { font-size: 4rem; font-weight: bold; color: ${colors.accent}; margin: 2rem 0; } button { padding: 1rem 2rem; font-size: 1.2rem; border: none; border-radius: 10px; cursor: pointer; background: ${colors.accent}; color: white; margin: 0.5rem; }</style></head><body><div class="timer"><h1>Timer</h1><div id="time">00:00:00</div><button onclick="startTimer()">Start</button><button onclick="stopTimer()">Stop</button><button onclick="resetTimer()">Reset</button></div><script>let interval; let seconds = 0; function updateDisplay() { const hrs = Math.floor(seconds / 3600); const mins = Math.floor((seconds % 3600) / 60); const secs = seconds % 60; document.getElementById('time').textContent = \`\${String(hrs).padStart(2,'0')}:\${String(mins).padStart(2,'0')}:\${String(secs).padStart(2,'0')}\`; } function startTimer() { interval = setInterval(() => { seconds++; updateDisplay(); }, 1000); } function stopTimer() { clearInterval(interval); } function resetTimer() { stopTimer(); seconds = 0; updateDisplay(); }</script></body></html>`;

      case 'todo':
        return `<!DOCTYPE html><html><head><style>${baseStyles} .container { background: ${colors.card}; padding: 2rem; border-radius: 20px; max-width: 500px; margin: 50px auto; } h1 { color: ${colors.accent}; margin-bottom: 1rem; } input { width: 100%; padding: 1rem; border: 2px solid ${colors.accent}40; border-radius: 10px; margin-bottom: 1rem; background: ${colors.bg}; color: ${colors.text}; } button { padding: 1rem 2rem; background: ${colors.accent}; color: white; border: none; border-radius: 10px; cursor: pointer; } .todo-item { display: flex; align-items: center; padding: 1rem; background: ${colors.bg}; border-radius: 10px; margin-bottom: 0.5rem; } .todo-item.completed { opacity: 0.5; text-decoration: line-through; }</style></head><body><div class="container"><h1>📝 Todo List</h1><input type="text" id="todoInput" placeholder="Add a task..."><button onclick="addTodo()">Add</button><div id="todoList"></div></div><script>let todos = JSON.parse(localStorage.getItem('todos') || '[]'); function render() { document.getElementById('todoList').innerHTML = todos.map((t,i) => \`<div class="todo-item \${t.done?'completed':''}" onclick="toggle(\${i})">\${t.text}</div>\`).join(''); } function addTodo() { const input = document.getElementById('todoInput'); if(input.value.trim()) { todos.push({text: input.value, done: false}); input.value = ''; localStorage.setItem('todos', JSON.stringify(todos)); render(); } } function toggle(i) { todos[i].done = !todos[i].done; localStorage.setItem('todos', JSON.stringify(todos)); render(); } render();</script></body></html>`;

      default:
        return `<!DOCTYPE html><html><head><style>${baseStyles} .container { background: ${colors.card}; padding: 3rem; border-radius: 20px; max-width: 600px; margin: 50px auto; text-align: center; } h1 { color: ${colors.accent}; margin-bottom: 1rem; }</style></head><body><div class="container"><h1>${component}</h1><p>This is a ${component} component with ${Object.keys(colors).length} theme properties.</p></div></body></html>`;
    }
  }

  private modifyCode(input: string): { code: string; description: string } | null {
    const recentVersions = this.codeVersioning.getRecentVersions(1);
    if (recentVersions.length === 0) return null;

    const lastCode = recentVersions[0].code;
    const lower = input.toLowerCase();

    // Theme change
    let newTheme: string | null = null;
    if (/beach|ocean/i.test(lower)) newTheme = 'beach';
    else if (/dark|night/i.test(lower)) newTheme = 'dark';
    else if (/light|bright/i.test(lower)) newTheme = 'light';
    else if (/futuristic|cyber/i.test(lower)) newTheme = 'futuristic';
    else if (/space|galaxy/i.test(lower)) newTheme = 'space';

    if (newTheme) {
      const oldColors = this.getThemeColors('default');
      const newColors = this.getThemeColors(newTheme);
      
      let modifiedCode = lastCode;
      modifiedCode = modifiedCode.split(oldColors.bg).join(newColors.bg);
      modifiedCode = modifiedCode.split(oldColors.card).join(newColors.card);
      modifiedCode = modifiedCode.split(oldColors.accent).join(newColors.accent);
      modifiedCode = modifiedCode.split(oldColors.text).join(newColors.text);

      return {
        code: modifiedCode,
        description: `Changed theme to ${newTheme}`
      };
    }

    return null;
  }

  private answerQuestion(input: string, commonsense: string[]): string {
    const keywords = Utils.extractKeywords(input);
    
    // Check knowledge graph
    const kgResults = this.knowledgeGraph.search(keywords.join(' '));
    if (kgResults.length > 0) {
      return `Based on my knowledge: ${kgResults[0].content || JSON.stringify(kgResults[0])}`;
    }

    // Apply commonsense reasoning
    if (commonsense.length > 0) {
      return `Based on commonsense reasoning: ${commonsense.join('. ')}`;
    }

    // Semantic search
    const similar = this.semanticSpace.findSimilar(input, 3);
    if (similar.length > 0 && similar[0].similarity > 0.7) {
      return `This relates to: ${similar.map(s => s.concept).join(', ')}. Could you provide more context?`;
    }

    return "I'm not sure about that. Could you clarify what you're asking about?";
  }

  private solveMath(input: string): string {
    try {
      const expr = input.replace(/[^0-9\+\-\*\/\^\(\)\.\s]/g, '').trim();
      if (!expr) return "I couldn't find a mathematical expression.";
      
      const sanitized = expr.replace(/\^/g, '**');
      const result = Function(`"use strict"; return (${sanitized})`)();
      
      return `**Math Solution**\n\nExpression: \`${expr}\`\nResult: **${result}**`;
    } catch (e) {
      return "I couldn't evaluate that expression. Please check the syntax.";
    }
  }

  private handleGreeting(emotion: string): string {
    const responses: Record<string, string> = {
      happy: "Hello! 😊 Great to see you in good spirits! What can I help you with today?",
      frustrated: "Hey there. I'm here to help. What's on your mind?",
      curious: "Hello! Ready to explore some ideas? What would you like to know?",
      polite: "Hello! Thank you for reaching out. How can I assist you?",
      excited: "Hey! Love the energy! What are we working on?",
      neutral: "Hello! I'm Synth-AI, your local cognitive engine with 290 implementations. What can I help you with?"
    };
    return responses[emotion] || responses.neutral;
  }

  private handleConversation(input: string, commonsense: string[]): string {
    if (commonsense.length > 0) {
      return `I understand. ${commonsense.join('. ')}. How can I help with that?`;
    }

    const similar = this.semanticSpace.findSimilar(input, 3);
    if (similar.length > 0 && similar[0].similarity > 0.6) {
      return `That relates to ${similar.map(s => s.concept).join(', ')}. Tell me more about what you need.`;
    }

    return "I'm listening. Could you tell me more about what you're looking for?";
  }

  getStats() {
    return {
      turns: this.turns,
      conversationLength: this.conversationHistory.length,
      codeVersions: this.codeVersioning.getRecentVersions(100).length,
      semanticConcepts: this.semanticSpace.concepts.size,
      reasoningSteps: this.reasoningMonitor.getReasoningTrace().split('\n').length
    };
  }
}
