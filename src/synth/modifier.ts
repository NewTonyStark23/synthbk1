// Code Modifier - Modifies existing generated code
// Supports: theme changes, color changes, size changes, beach enhancement, dark mode, iteration

import { THEMES, ThemeColors } from './generator';

export class CodeModifier {
  private lastCode: string = '';
  private lastTheme: string = 'default';
  private lastComponent: string = '';

  setLastGenerated(code: string, theme: string, component: string) {
    this.lastCode = code;
    this.lastTheme = theme;
    this.lastComponent = component;
  }

  canModify(): boolean {
    return this.lastCode.length > 0;
  }

  modify(input: string): { code: string; description: string } | null {
    if (!this.canModify()) return null;

    const lower = input.toLowerCase();

    // Theme change
    if (/(change|switch|make).*(theme|style|look)/i.test(lower)) {
      for (const [theme, keywords] of Object.entries({
        beach: ['beach', 'ocean', 'tropical'],
        dark: ['dark', 'night', 'black'],
        light: ['light', 'bright', 'white'],
        colorful: ['colorful', 'vibrant', 'rainbow'],
        minimal: ['minimal', 'simple'],
        modern: ['modern', 'sleek'],
        retro: ['retro', 'vintage'],
        futuristic: ['futuristic', 'cyber', 'neon'],
        nature: ['nature', 'forest', 'green'],
        space: ['space', 'galaxy', 'cosmic']
      })) {
        if (keywords.some(kw => lower.includes(kw))) {
          return this.changeTheme(theme);
        }
      }
    }

    // Dark mode
    if (/(dark mode|dark theme|make.*dark|night mode)/i.test(lower)) {
      return this.changeTheme('dark');
    }

    // Color change
    if (/(change|make).*(color|colour)/i.test(lower)) {
      const colorMatch = lower.match(/(red|blue|green|yellow|purple|orange|pink|cyan|gold|silver)/i);
      if (colorMatch) {
        return this.changeAccentColor(colorMatch[1]);
      }
    }

    // Size change
    if (/(bigger|larger|smaller|tinier|resize|size)/i.test(lower)) {
      if (/bigger|larger|increase/i.test(lower)) return this.changeSize(1.2);
      if (/smaller|tinier|decrease/i.test(lower)) return this.changeSize(0.8);
    }

    // Beach enhancement
    if (/(beach|palm|ocean|wave|sand|tropical)/i.test(lower) && !lower.includes('theme')) {
      return this.addBeachElements();
    }

    // Add animation
    if (/(animat|transition|fade|slide|bounce)/i.test(lower)) {
      return this.addAnimations();
    }

    return null;
  }

  changeTheme(newTheme: string): { code: string; description: string } {
    const oldColors = THEMES[this.lastTheme] || THEMES.default;
    const newColors = THEMES[newTheme] || THEMES.default;

    let code = this.lastCode;
    // Replace color values
    code = code.split(oldColors.bg).join(newColors.bg);
    code = code.split(oldColors.card).join(newColors.card);
    code = code.split(oldColors.accent).join(newColors.accent);
    code = code.split(oldColors.text).join(newColors.text);

    this.lastCode = code;
    this.lastTheme = newTheme;

    return { code, description: `Changed theme from ${this.lastTheme} to ${newTheme}` };
  }

  changeAccentColor(colorName: string): { code: string; description: string } {
    const colorMap: Record<string, string> = {
      red: '#ef4444', blue: '#3b82f6', green: '#22c55e', yellow: '#eab308',
      purple: '#a855f7', orange: '#f97316', pink: '#ec4899', cyan: '#06b6d4',
      gold: '#ffd700', silver: '#c0c0c0'
    };
    const newColor = colorMap[colorName.toLowerCase()] || '#667eea';
    const oldColors = THEMES[this.lastTheme] || THEMES.default;

    let code = this.lastCode;
    code = code.split(oldColors.accent).join(newColor);

    this.lastCode = code;
    return { code, description: `Changed accent color to ${colorName}` };
  }

  changeSize(factor: number): { code: string; description: string } {
    let code = this.lastCode;
    // Scale max-width values
    code = code.replace(/max-width:\s*(\d+)px/g, (match, px) => {
      return `max-width: ${Math.round(parseInt(px) * factor)}px`;
    });
    // Scale font sizes
    code = code.replace(/font-size:\s*([\d.]+)rem/g, (match, size) => {
      return `font-size: ${(parseFloat(size) * factor).toFixed(2)}rem`;
    });
    // Scale padding
    code = code.replace(/padding:\s*(\d+)px/g, (match, px) => {
      return `padding: ${Math.round(parseInt(px) * factor)}px`;
    });

    this.lastCode = code;
    return { code, description: `Scaled size by factor ${factor}` };
  }

  addBeachElements(): { code: string; description: string } {
    let code = this.lastCode;
    // Add beach-themed CSS
    const beachCSS = `
/* Beach Enhancement */
body::before {
  content: '🌴';
  position: fixed;
  bottom: 20px;
  left: 20px;
  font-size: 4rem;
  opacity: 0.5;
  z-index: -1;
}
body::after {
  content: '🌊';
  position: fixed;
  bottom: 10px;
  right: 20px;
  font-size: 3rem;
  opacity: 0.4;
  z-index: -1;
  animation: wave 2s ease-in-out infinite;
}
@keyframes wave {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}`;

    if (code.includes('</style>')) {
      code = code.replace('</style>', beachCSS + '\n</style>');
    }

    this.lastCode = code;
    return { code, description: 'Added beach elements (palm trees, waves)' };
  }

  addAnimations(): { code: string; description: string } {
    let code = this.lastCode;
    const animCSS = `
/* Animation Enhancement */
.container, .calendar, .calculator, .player, .game-container, .editor-container {
  animation: fadeIn 0.5s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
button { transition: transform 0.2s, opacity 0.2s; }
button:hover { transform: scale(1.05); }`;

    if (code.includes('</style>')) {
      code = code.replace('</style>', animCSS + '\n</style>');
    }

    this.lastCode = code;
    return { code, description: 'Added animations and transitions' };
  }
}
