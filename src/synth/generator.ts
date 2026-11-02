// Code Generator - Generates complete HTML/CSS/JS on-the-fly
// Supports 13 component types × 10 themes

export interface ThemeColors {
  bg: string; card: string; accent: string; text: string;
}

export const THEMES: Record<string, ThemeColors> = {
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

export const THEME_KEYWORDS: Record<string, string[]> = {
  beach: ['beach', 'ocean', 'sea', 'tropical', 'sand', 'wave', 'coast', 'shore', 'palm'],
  dark: ['dark', 'night', 'black', 'midnight', 'dim', 'shadow'],
  light: ['light', 'bright', 'white', 'clean', 'pale', 'airy'],
  colorful: ['colorful', 'vibrant', 'rainbow', 'neon', 'bright', 'vivid'],
  minimal: ['minimal', 'simple', 'clean', 'basic', 'plain', 'sparse'],
  modern: ['modern', 'contemporary', 'sleek', 'stylish', 'trendy', 'current'],
  retro: ['retro', 'vintage', 'classic', 'old', 'nostalgic', 'antique'],
  futuristic: ['futuristic', 'cyber', 'tech', 'sci-fi', 'holographic'],
  nature: ['nature', 'forest', 'green', 'earth', 'organic', 'natural', 'eco', 'botanical'],
  space: ['space', 'galaxy', 'star', 'cosmic', 'universe', 'astral', 'celestial']
};

export const COMPONENT_KEYWORDS: Record<string, string[]> = {
  calendar: ['calendar', 'schedule', 'date', 'event', 'month', 'year'],
  timer: ['timer', 'countdown', 'clock', 'stopwatch', 'time'],
  calculator: ['calculator', 'calc', 'math', 'compute', 'arithmetic'],
  todo: ['todo', 'task', 'list', 'checklist', 'tasks'],
  form: ['form', 'input', 'submit', 'registration', 'contact'],
  game: ['game', 'play', 'snake', 'puzzle', 'arcade'],
  website: ['website', 'site', 'page', 'landing', 'web'],
  dashboard: ['dashboard', 'panel', 'admin', 'control', 'monitor'],
  chart: ['chart', 'graph', 'plot', 'visualization', 'data'],
  player: ['player', 'audio', 'video', 'music', 'media'],
  editor: ['editor', 'text', 'code', 'write', 'document'],
  gallery: ['gallery', 'image', 'photo', 'portfolio', 'pictures'],
  os: ['os', 'system', 'linux', 'raspberry', 'pi', 'ubuntu', 'debian', 'kernel', 'driver', 'module']
};

export class CodeGenerator {
  static extractComponent(input: string): string {
    const lower = input.toLowerCase();
    for (const [component, keywords] of Object.entries(COMPONENT_KEYWORDS)) {
      if (keywords.some(kw => lower.includes(kw))) return component;
    }
    if (lower.includes('html')) return 'website';
    return 'component';
  }

  static extractTheme(input: string): string {
    const lower = input.toLowerCase();
    for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
      if (keywords.some(kw => lower.includes(kw))) return theme;
    }
    return 'default';
  }

  static extractFeatures(input: string): string[] {
    const features: string[] = [];
    const lower = input.toLowerCase();
    if (lower.includes('interactive')) features.push('interactive');
    if (lower.includes('animated') || lower.includes('animation') || lower.includes('animate')) features.push('animated');
    if (lower.includes('responsive')) features.push('responsive');
    if (lower.includes('real-time') || lower.includes('realtime') || lower.includes('real time')) features.push('realtime');
    if (lower.includes('countdown')) features.push('countdown');
    if (lower.includes('new year') || lower.includes('newyear') || lower.includes('new years')) features.push('newyear');
    if (lower.includes('drag') || lower.includes('drop') || lower.includes('draggable')) features.push('dragdrop');
    if (lower.includes('search')) features.push('search');
    if (lower.includes('filter')) features.push('filter');
    if (lower.includes('sort')) features.push('sort');
    if (lower.includes('background') || lower.includes('bg')) features.push('background');
    if (lower.includes('html')) features.push('html');
    return features;
  }

  static generate(input: string): { code: string; component: string; theme: string; features: string[]; description: string } {
    const component = this.extractComponent(input);
    const theme = this.extractTheme(input);
    const features = this.extractFeatures(input);
    const colors = THEMES[theme] || THEMES.default;

    let code = '';
    let description = '';

    switch (component) {
      case 'calendar': code = this.buildCalendar(colors, features); description = 'Interactive calendar with month navigation'; break;
      case 'timer': code = this.buildTimer(colors, features); description = features.includes('newyear') ? 'New Year countdown timer' : 'Countdown timer'; break;
      case 'calculator': code = this.buildCalculator(colors); description = 'Scientific calculator with keyboard support'; break;
      case 'todo': code = this.buildTodoList(colors); description = 'Todo list with localStorage persistence'; break;
      case 'form': code = this.buildForm(colors); description = 'Contact form with validation'; break;
      case 'game': code = this.buildGame(colors); description = 'Snake game with score tracking'; break;
      case 'website': code = this.buildWebsite(colors); description = 'Multi-section responsive website'; break;
      case 'dashboard': code = this.buildDashboard(colors); description = 'Admin dashboard with statistics'; break;
      case 'chart': code = this.buildChart(colors); description = 'Data visualization bar chart'; break;
      case 'player': code = this.buildPlayer(colors); description = 'Media player with controls'; break;
      case 'editor': code = this.buildEditor(colors); description = 'Text/code editor'; break;
      case 'gallery': code = this.buildGallery(colors); description = 'Image gallery with lightbox'; break;
      case 'os': code = this.buildOS(colors); description = 'Operating system simulation'; break;
      default: code = this.buildGeneric(component, colors); description = `Custom ${component} with ${theme} theme`;
    }

    return { code, component, theme, features, description };
  }

  private static baseStyles(colors: ThemeColors): string {
    return `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: ${colors.bg}; min-height: 100vh; color: ${colors.text}; }`;
  }

  static buildCalendar(colors: ThemeColors, features: string[]): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Interactive Calendar</title><style>
${this.baseStyles(colors)}
body { display: flex; align-items: center; justify-content: center; padding: 20px; }
.calendar { background: ${colors.card}; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); padding: 30px; width: 100%; max-width: 500px; }
.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.calendar-header h2 { font-size: 1.5rem; color: ${colors.accent}; }
.calendar-header button { background: ${colors.accent}; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 1rem; }
.calendar-header button:hover { opacity: 0.8; }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
.calendar-day-header { text-align: center; font-weight: bold; padding: 10px; color: ${colors.accent}; }
.calendar-day { text-align: center; padding: 15px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.calendar-day:hover { background: ${colors.accent}20; }
.calendar-day.today { background: ${colors.accent}; color: white; font-weight: bold; }
.calendar-day.other-month { opacity: 0.3; }
</style></head><body>
<div class="calendar">
  <div class="calendar-header">
    <button onclick="prevMonth()">←</button>
    <h2 id="monthYear"></h2>
    <button onclick="nextMonth()">→</button>
  </div>
  <div class="calendar-grid" id="calendarGrid"></div>
</div>
<script>
let currentDate = new Date();
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  document.getElementById('monthYear').textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(day => {
    const header = document.createElement('div');
    header.className = 'calendar-day-header';
    header.textContent = day;
    grid.appendChild(header);
  });
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = document.createElement('div');
    day.className = 'calendar-day other-month';
    day.textContent = daysInPrevMonth - i;
    grid.appendChild(day);
  }
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.className = 'calendar-day';
    day.textContent = i;
    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) day.classList.add('today');
    day.onclick = () => alert('Selected: ' + currentDate.toLocaleString('default', { month: 'long' }) + ' ' + i + ', ' + year);
    grid.appendChild(day);
  }
  const remainingCells = 42 - (firstDay + daysInMonth);
  for (let i = 1; i <= remainingCells; i++) {
    const day = document.createElement('div');
    day.className = 'calendar-day other-month';
    day.textContent = i;
    grid.appendChild(day);
  }
}
function prevMonth() { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); }
function nextMonth() { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); }
renderCalendar();
</script></body></html>`;
  }

  static buildTimer(colors: ThemeColors, features: string[]): string {
    const isNewYear = features.includes('newyear');
    const title = isNewYear ? 'New Year Countdown' : 'Countdown Timer';
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><style>
${this.baseStyles(colors)}
body { display: flex; flex-direction: column; align-items: center; justify-content: center; }
h1 { font-size: 2.5rem; margin-bottom: 2rem; color: ${colors.accent}; }
.countdown { display: flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap; justify-content: center; }
.time-unit { background: ${colors.card}; border-radius: 16px; padding: 2rem; text-align: center; min-width: 120px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
.time-unit .number { font-size: 4rem; font-weight: bold; color: ${colors.accent}; }
.time-unit .label { font-size: 1rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; margin-top: 0.5rem; }
.celebration { display: none; font-size: 3rem; animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
</style></head><body>
<h1>🎆 ${title} 🎆</h1>
<div class="countdown" id="countdown">
  <div class="time-unit"><div class="number" id="days">00</div><div class="label">Days</div></div>
  <div class="time-unit"><div class="number" id="hours">00</div><div class="label">Hours</div></div>
  <div class="time-unit"><div class="number" id="minutes">00</div><div class="label">Minutes</div></div>
  <div class="time-unit"><div class="number" id="seconds">00</div><div class="label">Seconds</div></div>
</div>
<div class="celebration" id="celebration">🎉 Time's Up! 🎉</div>
<script>
function updateCountdown() {
  const now = new Date();
  ${isNewYear ? 'const target = new Date(now.getFullYear() + 1, 0, 1);' : 'const target = new Date(now.getTime() + 5 * 60 * 1000);'}
  const diff = target - now;
  if (diff <= 0) {
    document.getElementById('countdown').style.display = 'none';
    document.getElementById('celebration').style.display = 'block';
    return;
  }
  document.getElementById('days').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
  document.getElementById('hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  document.getElementById('minutes').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  document.getElementById('seconds').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);
</script></body></html>`;
  }

  static buildCalculator(colors: ThemeColors): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Calculator</title><style>
${this.baseStyles(colors)}
body { display: flex; align-items: center; justify-content: center; }
.calculator { background: ${colors.card}; padding: 2rem; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
#display { width: 100%; height: 60px; font-size: 2rem; text-align: right; padding: 0 1rem; background: ${colors.bg}; border: none; border-radius: 10px; color: ${colors.text}; margin-bottom: 1rem; }
.buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
button { padding: 1.25rem; font-size: 1.25rem; border: none; border-radius: 10px; cursor: pointer; background: ${colors.accent}20; color: ${colors.text}; }
button:hover { opacity: 0.8; }
.operator { background: ${colors.accent}; color: white; }
.equals { background: ${colors.accent}; color: white; grid-row: span 2; }
.clear { background: #ef4444; color: white; }
.zero { grid-column: span 2; }
</style></head><body>
<div class="calculator">
  <input type="text" id="display" readonly>
  <div class="buttons">
    <button class="clear" onclick="clearDisplay()">C</button>
    <button class="operator" onclick="append('(')">(</button>
    <button class="operator" onclick="append(')')">)</button>
    <button class="operator" onclick="append('/')">÷</button>
    <button onclick="append('7')">7</button><button onclick="append('8')">8</button><button onclick="append('9')">9</button>
    <button class="operator" onclick="append('*')">×</button>
    <button onclick="append('4')">4</button><button onclick="append('5')">5</button><button onclick="append('6')">6</button>
    <button class="operator" onclick="append('-')">−</button>
    <button onclick="append('1')">1</button><button onclick="append('2')">2</button><button onclick="append('3')">3</button>
    <button class="operator" onclick="append('+')">+</button>
    <button class="zero" onclick="append('0')">0</button><button onclick="append('.')">.</button>
    <button class="equals" onclick="calculate()">=</button>
  </div>
</div>
<script>
const display = document.getElementById('display');
function append(val) { display.value += val; }
function clearDisplay() { display.value = ''; }
function calculate() { try { display.value = eval(display.value); } catch(e) { display.value = 'Error'; } }
document.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || '+-*/.()'.includes(e.key)) append(e.key);
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') display.value = display.value.slice(0, -1);
  else if (e.key === 'Escape') clearDisplay();
});
</script></body></html>`;
  }

  static buildTodoList(colors: ThemeColors): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Todo List</title><style>
${this.baseStyles(colors)}
body { display: flex; align-items: center; justify-content: center; padding: 20px; }
.container { background: ${colors.card}; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); width: 100%; max-width: 500px; padding: 30px; }
h1 { color: ${colors.accent}; margin-bottom: 20px; text-align: center; }
.input-group { display: flex; gap: 10px; margin-bottom: 20px; }
input { flex: 1; padding: 12px 15px; border: 2px solid ${colors.accent}40; border-radius: 10px; font-size: 16px; background: ${colors.bg}; color: ${colors.text}; }
input:focus { outline: none; border-color: ${colors.accent}; }
button { padding: 12px 25px; background: ${colors.accent}; color: white; border: none; border-radius: 10px; font-size: 16px; cursor: pointer; }
button:hover { opacity: 0.9; }
.todo-list { list-style: none; }
.todo-item { display: flex; align-items: center; padding: 15px; background: ${colors.bg}; border-radius: 10px; margin-bottom: 10px; }
.todo-item.completed { opacity: 0.6; }
.todo-item.completed .todo-text { text-decoration: line-through; }
.checkbox { width: 20px; height: 20px; margin-right: 15px; cursor: pointer; }
.todo-text { flex: 1; font-size: 16px; color: ${colors.text}; }
.delete-btn { padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; }
.stats { margin-top: 20px; padding: 15px; background: ${colors.bg}; border-radius: 10px; text-align: center; color: ${colors.text}; opacity: 0.8; }
</style></head><body>
<div class="container">
  <h1>📝 Todo List</h1>
  <div class="input-group">
    <input type="text" id="todoInput" placeholder="Add a new task..." onkeypress="if(event.key==='Enter')addTodo()">
    <button onclick="addTodo()">Add</button>
  </div>
  <ul class="todo-list" id="todoList"></ul>
  <div class="stats" id="stats">No tasks yet</div>
</div>
<script>
let todos = JSON.parse(localStorage.getItem('todos') || '[]');
function saveTodos() { localStorage.setItem('todos', JSON.stringify(todos)); updateStats(); }
function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, completed: false });
  input.value = '';
  saveTodos(); renderTodos();
}
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) { todo.completed = !todo.completed; saveTodos(); renderTodos(); }
}
function deleteTodo(id) { todos = todos.filter(t => t.id !== id); saveTodos(); renderTodos(); }
function renderTodos() {
  document.getElementById('todoList').innerHTML = todos.map(todo =>
    '<li class="todo-item' + (todo.completed ? ' completed' : '') + '">' +
    '<input type="checkbox" class="checkbox" ' + (todo.completed ? 'checked' : '') + ' onchange="toggleTodo(' + todo.id + ')">' +
    '<span class="todo-text">' + todo.text + '</span>' +
    '<button class="delete-btn" onclick="deleteTodo(' + todo.id + ')">Delete</button></li>'
  ).join('');
}
function updateStats() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  document.getElementById('stats').textContent = total === 0 ? 'No tasks yet' : total + ' total | ' + completed + ' completed | ' + (total - completed) + ' pending';
}
renderTodos(); updateStats();
</script></body></html>`;
  }

  static buildForm(colors: ThemeColors): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Contact Form</title><style>
${this.baseStyles(colors)}
body { display: flex; align-items: center; justify-content: center; padding: 20px; }
.container { background: ${colors.card}; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); width: 100%; max-width: 500px; padding: 30px; }
h1 { color: ${colors.accent}; margin-bottom: 20px; text-align: center; }
.form-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 8px; color: ${colors.text}; font-weight: 600; }
input, textarea, select { width: 100%; padding: 12px 15px; border: 2px solid ${colors.accent}40; border-radius: 10px; font-size: 16px; background: ${colors.bg}; color: ${colors.text}; }
input:focus, textarea:focus, select:focus { outline: none; border-color: ${colors.accent}; }
button { width: 100%; padding: 15px; background: ${colors.accent}; color: white; border: none; border-radius: 10px; font-size: 16px; cursor: pointer; }
button:hover { opacity: 0.9; }
.success-message { background: #d4edda; color: #155724; padding: 15px; border-radius: 10px; margin-top: 20px; display: none; }
.success-message.show { display: block; }
</style></head><body>
<div class="container">
  <h1>📝 Contact Form</h1>
  <form id="contactForm" onsubmit="handleSubmit(event)">
    <div class="form-group"><label>Name</label><input type="text" required placeholder="Your name"></div>
    <div class="form-group"><label>Email</label><input type="email" required placeholder="your@email.com"></div>
    <div class="form-group"><label>Subject</label><select required><option value="">Select a subject</option><option>General Inquiry</option><option>Support</option><option>Feedback</option></select></div>
    <div class="form-group"><label>Message</label><textarea rows="5" required placeholder="Enter your message"></textarea></div>
    <button type="submit">Submit</button>
  </form>
  <div class="success-message" id="successMessage">✓ Form submitted successfully!</div>
</div>
<script>
function handleSubmit(event) {
  event.preventDefault();
  document.getElementById('successMessage').classList.add('show');
  document.getElementById('contactForm').reset();
  setTimeout(() => document.getElementById('successMessage').classList.remove('show'), 3000);
}
</script></body></html>`;
  }

  static buildGame(colors: ThemeColors): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Snake Game</title><style>
${this.baseStyles(colors)}
body { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
h1 { margin-bottom: 20px; color: ${colors.accent}; }
.game-container { background: ${colors.card}; border-radius: 20px; padding: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
canvas { border: 3px solid ${colors.accent}; border-radius: 10px; display: block; }
.score { margin-top: 15px; text-align: center; font-size: 24px; font-weight: bold; color: ${colors.text}; }
.controls { margin-top: 15px; text-align: center; opacity: 0.7; color: ${colors.text}; }
button { margin-top: 15px; padding: 12px 30px; background: ${colors.accent}; color: white; border: none; border-radius: 10px; font-size: 16px; cursor: pointer; }
</style></head><body>
<h1>🐍 Snake Game</h1>
<div class="game-container">
  <canvas id="gameCanvas" width="400" height="400"></canvas>
  <div class="score">Score: <span id="score">0</span></div>
  <div class="controls">Use arrow keys to move</div>
  <button onclick="resetGame()">New Game</button>
</div>
<script>
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0, dy = 0, score = 0, gameLoop;
function drawGame() {
  moveSnake();
  if (checkCollision()) { clearInterval(gameLoop); alert('Game Over! Score: ' + score); return; }
  ctx.fillStyle = '${colors.bg}';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#dc3545';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? '#28a745' : '#20c997';
    ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize - 2, gridSize - 2);
  });
  document.getElementById('score').textContent = score;
}
function moveSnake() {
  if (dx === 0 && dy === 0) return;
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) { score++; generateFood(); }
  else snake.pop();
}
function checkCollision() {
  const head = snake[0];
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;
  for (let i = 1; i < snake.length; i++) if (head.x === snake[i].x && head.y === snake[i].y) return true;
  return false;
}
function generateFood() { food.x = Math.floor(Math.random() * tileCount); food.y = Math.floor(Math.random() * tileCount); }
function resetGame() { snake = [{ x: 10, y: 10 }]; dx = 0; dy = 0; score = 0; generateFood(); clearInterval(gameLoop); gameLoop = setInterval(drawGame, 100); }
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
    case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
    case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
    case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
  }
});
resetGame();
</script></body></html>`;
  }

  static buildWebsite(colors: ThemeColors): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Website</title><style>
${this.baseStyles(colors)}
header { background: ${colors.card}; padding: 20px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
h1 { color: ${colors.accent}; }
nav { background: ${colors.accent}; padding: 10px; text-align: center; }
nav a { color: white; margin: 0 15px; text-decoration: none; }
main { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
section { background: ${colors.card}; padding: 30px; margin-bottom: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
footer { background: ${colors.card}; padding: 20px; text-align: center; margin-top: 40px; }
</style></head><body>
<header><h1>My Website</h1><p>Welcome to our site</p></header>
<nav><a href="#home">Home</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a></nav>
<main>
  <section id="home"><h2>Home</h2><p>This is the home section of our website.</p></section>
  <section id="about"><h2>About</h2><p>Learn more about us in this section.</p></section>
  <section id="services"><h2>Services</h2><p>Check out our services here.</p></section>
  <section id="contact"><h2>Contact</h2><p>Get in touch with us.</p></section>
</main>
<footer><p>&copy; 2024 My Website. All rights reserved.</p></footer>
</body></html>`;
  }

  static buildDashboard(colors: ThemeColors): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Dashboard</title><style>
${this.baseStyles(colors)}
body { display: flex; min-height: 100vh; }
.sidebar { width: 250px; background: ${colors.card}; padding: 20px; box-shadow: 2px 0 10px rgba(0,0,0,0.1); }
.sidebar h2 { color: ${colors.accent}; margin-bottom: 30px; }
.sidebar ul { list-style: none; }
.sidebar li { padding: 10px; margin-bottom: 5px; cursor: pointer; border-radius: 5px; }
.sidebar li:hover { background: ${colors.accent}20; }
.main-content { flex: 1; padding: 30px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
.stat-card { background: ${colors.card}; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.stat-value { font-size: 2rem; font-weight: bold; color: ${colors.accent}; }
.stat-label { color: ${colors.text}; opacity: 0.7; }
</style></head><body>
<div class="sidebar">
  <h2>Dashboard</h2>
  <ul><li>Overview</li><li>Analytics</li><li>Reports</li><li>Settings</li></ul>
</div>
<div class="main-content">
  <h1>Overview</h1>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-value">1,234</div><div class="stat-label">Total Users</div></div>
    <div class="stat-card"><div class="stat-value">$45,678</div><div class="stat-label">Revenue</div></div>
    <div class="stat-card"><div class="stat-value">567</div><div class="stat-label">Orders</div></div>
    <div class="stat-card"><div class="stat-value">89%</div><div class="stat-label">Satisfaction</div></div>
  </div>
</div>
</body></html>`;
  }

  static buildChart(colors: ThemeColors): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Chart</title><style>
${this.baseStyles(colors)}
body { padding: 40px; }
h1 { color: ${colors.accent}; margin-bottom: 30px; }
.chart-container { background: ${colors.card}; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
canvas { max-width: 100%; }
</style></head><body>
<h1>Data Visualization</h1>
<div class="chart-container"><canvas id="chart" width="600" height="300"></canvas></div>
<script>
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
const data = [65, 59, 80, 81, 56, 55, 40];
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const barWidth = canvas.width / data.length / 2;
ctx.fillStyle = '${colors.accent}';
data.forEach((value, index) => {
  const x = index * (canvas.width / data.length) + barWidth / 2;
  const height = (value / 100) * canvas.height;
  const y = canvas.height - height;
  ctx.fillRect(x, y, barWidth, height);
  ctx.fillStyle = '${colors.text}';
  ctx.fillText(labels[index], x, canvas.height - 10);
  ctx.fillText(value, x + barWidth / 4, y - 5);
  ctx.fillStyle = '${colors.accent}';
});
</script></body></html>`;
  }

  static buildPlayer(colors: ThemeColors): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Media Player</title><style>
${this.baseStyles(colors)}
body { display: flex; align-items: center; justify-content: center; }
.player { background: ${colors.card}; padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); text-align: center; max-width: 400px; }
.album-art { width: 200px; height: 200px; background: ${colors.accent}; border-radius: 10px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 4rem; }
h2 { color: ${colors.accent}; margin-bottom: 10px; }
p { opacity: 0.7; margin-bottom: 20px; }
.controls { display: flex; justify-content: center; gap: 15px; }
button { padding: 12px 24px; background: ${colors.accent}; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 1rem; }
.progress { width: 100%; height: 6px; background: ${colors.bg}; border-radius: 3px; margin: 20px 0; overflow: hidden; }
.progress-bar { height: 100%; background: ${colors.accent}; width: 35%; border-radius: 3px; transition: width 0.3s; }
</style></head><body>
<div class="player">
  <div class="album-art">🎵</div>
  <h2>Sample Track</h2>
  <p>Artist Name</p>
  <div class="progress"><div class="progress-bar" id="progressBar"></div></div>
  <div class="controls">
    <button>⏮</button><button id="playBtn">▶</button><button>⏭</button>
  </div>
</div>
<script>
let playing = false;
let progress = 35;
document.getElementById('playBtn').onclick = function() {
  playing = !playing;
  this.textContent = playing ? '⏸' : '▶';
  if (playing) {
    const interval = setInterval(() => {
      if (!playing || progress >= 100) { clearInterval(interval); return; }
      progress += 0.5;
      document.getElementById('progressBar').style.width = progress + '%';
    }, 100);
  }
};
</script></body></html>`;
  }

  static buildEditor(colors: ThemeColors): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Text Editor</title><style>
${this.baseStyles(colors)}
body { padding: 20px; }
.editor-container { background: ${colors.card}; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); max-width: 800px; margin: 0 auto; }
.toolbar { padding: 10px; border-bottom: 1px solid ${colors.accent}40; display: flex; gap: 5px; flex-wrap: wrap; }
.toolbar button { padding: 8px 12px; background: ${colors.accent}20; border: none; border-radius: 5px; cursor: pointer; color: ${colors.text}; }
.toolbar button:hover { background: ${colors.accent}40; }
.editor { padding: 20px; min-height: 400px; outline: none; font-size: 16px; line-height: 1.6; color: ${colors.text}; }
.status-bar { padding: 8px 20px; border-top: 1px solid ${colors.accent}40; font-size: 12px; opacity: 0.7; color: ${colors.text}; }
</style></head><body>
<div class="editor-container">
  <div class="toolbar">
    <button onclick="document.execCommand('bold')"><b>B</b></button>
    <button onclick="document.execCommand('italic')"><i>I</i></button>
    <button onclick="document.execCommand('underline')"><u>U</u></button>
    <button onclick="document.execCommand('insertUnorderedList')">• List</button>
    <button onclick="document.execCommand('insertOrderedList')">1. List</button>
    <button onclick="document.execCommand('justifyLeft')">Left</button>
    <button onclick="document.execCommand('justifyCenter')">Center</button>
    <button onclick="document.execCommand('justifyRight')">Right</button>
  </div>
  <div class="editor" contenteditable="true" id="editor">Start typing here...</div>
  <div class="status-bar" id="statusBar">Words: 0 | Characters: 0</div>
</div>
<script>
const editor = document.getElementById('editor');
const statusBar = document.getElementById('statusBar');
editor.addEventListener('input', () => {
  const text = editor.innerText;
  const words = text.trim() ? text.trim().split(/\\s+/).length : 0;
  statusBar.textContent = 'Words: ' + words + ' | Characters: ' + text.length;
});
</script></body></html>`;
  }

  static buildGallery(colors: ThemeColors): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Gallery</title><style>
${this.baseStyles(colors)}
body { padding: 40px; }
h1 { color: ${colors.accent}; margin-bottom: 30px; text-align: center; }
.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
.gallery-item { background: ${colors.card}; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s; }
.gallery-item:hover { transform: scale(1.02); }
.gallery-item .thumb { width: 100%; height: 200px; background: ${colors.accent}30; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
.gallery-item .caption { padding: 15px; color: ${colors.text}; }
.lightbox { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; align-items: center; justify-content: center; }
.lightbox.active { display: flex; }
.lightbox-content { max-width: 80%; max-height: 80%; background: ${colors.card}; padding: 40px; border-radius: 20px; text-align: center; }
</style></head><body>
<h1>📸 Image Gallery</h1>
<div class="gallery" id="gallery"></div>
<div class="lightbox" id="lightbox" onclick="closeLightbox()">
  <div class="lightbox-content" id="lightboxContent"></div>
</div>
<script>
const items = [
  { emoji: '🌅', title: 'Sunset', desc: 'Beautiful sunset over the ocean' },
  { emoji: '🏔️', title: 'Mountains', desc: 'Snow-capped mountain peaks' },
  { emoji: '🌊', title: 'Ocean', desc: 'Waves crashing on the shore' },
  { emoji: '🌲', title: 'Forest', desc: 'Tall trees in the forest' },
  { emoji: '🌸', title: 'Flowers', desc: 'Spring flowers in bloom' },
  { emoji: '🏙️', title: 'City', desc: 'City skyline at night' }
];
const gallery = document.getElementById('gallery');
items.forEach((item, i) => {
  const div = document.createElement('div');
  div.className = 'gallery-item';
  div.innerHTML = '<div class="thumb">' + item.emoji + '</div><div class="caption"><strong>' + item.title + '</strong><p>' + item.desc + '</p></div>';
  div.onclick = () => openLightbox(item);
  gallery.appendChild(div);
});
function openLightbox(item) {
  document.getElementById('lightboxContent').innerHTML = '<div style="font-size:6rem">' + item.emoji + '</div><h2>' + item.title + '</h2><p>' + item.desc + '</p>';
  document.getElementById('lightbox').classList.add('active');
}
function closeLightbox() { document.getElementById('lightbox').classList.remove('active'); }
</script></body></html>`;
  }

  static buildOS(colors: ThemeColors): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>SynthOS</title><style>
${this.baseStyles(colors)}
body { overflow: hidden; }
.desktop { width: 100vw; height: 100vh; background: ${colors.bg}; position: relative; }
.taskbar { position: fixed; bottom: 0; left: 0; right: 0; height: 48px; background: ${colors.card}; border-top: 1px solid ${colors.accent}40; display: flex; align-items: center; padding: 0 10px; gap: 10px; }
.start-btn { padding: 8px 16px; background: ${colors.accent}; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
.clock { margin-left: auto; color: ${colors.text}; font-size: 14px; }
.window { position: absolute; background: ${colors.card}; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); min-width: 300px; min-height: 200px; }
.window-header { background: ${colors.accent}; color: white; padding: 8px 15px; border-radius: 10px 10px 0 0; display: flex; justify-content: space-between; align-items: center; cursor: move; }
.window-close { background: #ef4444; border: none; color: white; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; }
.window-body { padding: 15px; color: ${colors.text}; }
.desktop-icons { position: absolute; top: 20px; left: 20px; display: flex; flex-direction: column; gap: 20px; }
.desktop-icon { text-align: center; cursor: pointer; color: ${colors.text}; }
.desktop-icon .icon { font-size: 3rem; }
.desktop-icon .label { font-size: 12px; margin-top: 5px; }
</style></head><body>
<div class="desktop">
  <div class="desktop-icons">
    <div class="desktop-icon" ondblclick="openWindow('Terminal')"><div class="icon">💻</div><div class="label">Terminal</div></div>
    <div class="desktop-icon" ondblclick="openWindow('Files')"><div class="icon">📁</div><div class="label">Files</div></div>
    <div class="desktop-icon" ondblclick="openWindow('Settings')"><div class="icon">⚙️</div><div class="label">Settings</div></div>
  </div>
  <div id="windows"></div>
  <div class="taskbar">
    <button class="start-btn">Start</button>
    <div class="clock" id="clock"></div>
  </div>
</div>
<script>
let windowCount = 0;
function openWindow(title) {
  windowCount++;
  const div = document.createElement('div');
  div.className = 'window';
  div.style.left = (100 + windowCount * 30) + 'px';
  div.style.top = (50 + windowCount * 30) + 'px';
  div.innerHTML = '<div class="window-header"><span>' + title + '</span><button class="window-close" onclick="this.closest(\\'.window\\').remove()">×</button></div><div class="window-body"><p>Welcome to ' + title + '</p></div>';
  document.getElementById('windows').appendChild(div);
}
function updateClock() {
  document.getElementById('clock').textContent = new Date().toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();
</script></body></html>`;
  }

  static buildGeneric(component: string, colors: ThemeColors): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${component}</title><style>
${this.baseStyles(colors)}
body { display: flex; align-items: center; justify-content: center; }
.container { background: ${colors.card}; padding: 40px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
h1 { color: ${colors.accent}; margin-bottom: 20px; }
p { color: ${colors.text}; opacity: 0.8; }
</style></head><body>
<div class="container">
  <h1>${component.charAt(0).toUpperCase() + component.slice(1)}</h1>
  <p>This is a custom ${component} component.</p>
</div>
</body></html>`;
  }
}
