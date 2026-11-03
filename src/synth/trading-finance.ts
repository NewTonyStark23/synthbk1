// Trading & Finance - Items B.1-B.10
// Alpaca API integration, stock market rules, crypto trading, scalping strategies, short selling, technical analysis, risk management, trading psychology, market prediction, trading code generation

// ============================================
// ITEM B.1: Alpaca API Integration
// Integration with Alpaca trading API
// ============================================
export class AlpacaAPI {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;
  private isPaper: boolean;

  constructor(apiKey: string, apiSecret: string, isPaper: boolean = true) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.isPaper = isPaper;
    this.baseUrl = isPaper 
      ? 'https://paper-api.alpaca.markets' 
      : 'https://api.alpaca.markets';
  }

  async getAccount(): Promise<any> {
    // Simulated API call
    return {
      id: 'account-123',
      status: 'ACTIVE',
      equity: '100000.00',
      cash: '50000.00',
      buying_power: '200000.00',
      pattern_day_trader: false
    };
  }

  async getPositions(): Promise<any[]> {
    // Simulated API call
    return [
      {
        symbol: 'AAPL',
        qty: '10',
        side: 'long',
        market_value: '1500.00',
        avg_entry_price: '150.00',
        current_price: '155.00',
        unrealized_pl: '50.00'
      }
    ];
  }

  async placeOrder(symbol: string, qty: number, side: 'buy' | 'sell', type: 'market' | 'limit' = 'market', limitPrice?: number): Promise<any> {
    // Simulated API call
    return {
      id: `order-${Date.now()}`,
      symbol,
      qty: qty.toString(),
      side,
      type,
      status: 'accepted',
      limit_price: limitPrice?.toString()
    };
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    // Simulated API call
    return true;
  }

  async getClock(): Promise<any> {
    // Simulated API call
    return {
      timestamp: new Date().toISOString(),
      is_open: true,
      next_open: '2024-01-02T09:30:00Z',
      next_close: '2024-01-01T16:00:00Z'
    };
  }

  async getBars(symbol: string, timeframe: string, limit: number = 100): Promise<any[]> {
    // Simulated API call
    const bars = [];
    const now = Date.now();
    for (let i = 0; i < limit; i++) {
      bars.push({
        t: new Date(now - i * 60000).toISOString(),
        o: 150 + Math.random() * 10,
        h: 155 + Math.random() * 10,
        l: 145 + Math.random() * 10,
        c: 150 + Math.random() * 10,
        v: Math.floor(Math.random() * 10000)
      });
    }
    return bars.reverse();
  }

  getConfig(): { baseUrl: string; isPaper: boolean } {
    return {
      baseUrl: this.baseUrl,
      isPaper: this.isPaper
    };
  }
}

// ============================================
// ITEM B.2: Stock Market Rules
// SEC regulations, FINRA rules, settlement cycles
// ============================================
export class StockMarketRules {
  private rules: Map<string, { description: string; requirements: string[]; penalties: string[] }> = new Map();

  constructor() {
    this.loadRules();
  }

  private loadRules() {
    this.rules.set('pattern_day_trader', {
      description: 'PDT rule requires $25,000 minimum equity for day trading',
      requirements: [
        'Maintain $25,000 minimum equity',
        'Track day trades (4 or more in 5 business days)',
        'Day trade buying power limited to 4x maintenance excess'
      ],
      penalties: [
        'Account restricted to 2x maintenance excess',
        '90-day freeze if below minimum',
        'Cannot day trade until restored'
      ]
    });

    this.rules.set('settlement_cycle', {
      description: 'T+2 settlement cycle for stocks',
      requirements: [
        'Trade date (T) + 2 business days for settlement',
        'Cash must be settled before reuse',
        'Good faith violations if using unsettled funds'
      ],
      penalties: [
        'Good faith violation',
        'Cash account restriction',
        '90-day settlement period'
      ]
    });

    this.rules.set('short_sale_rule', {
      description: 'SEC Rule 201 (Circuit Breaker)',
      requirements: [
        'Cannot short sell on downtick after 10% decline',
        'Must locate shares before shorting',
        'Close-out requirement for fails to deliver'
      ],
      penalties: [
        'Trading suspension',
        'Fines up to $100,000',
        'Account restrictions'
      ]
    });

    this.rules.set('margin_requirements', {
      description: 'Regulation T margin requirements',
      requirements: [
        'Initial margin: 50% of purchase price',
        'Maintenance margin: 25% (FINRA minimum)',
        'Broker may require higher maintenance'
      ],
      penalties: [
        'Margin call',
        'Forced liquidation',
        'Account restriction'
      ]
    });

    this.rules.set('wash_sale_rule', {
      description: 'IRS wash sale rule',
      requirements: [
        'Cannot claim loss if repurchase within 30 days',
        'Applies to substantially identical securities',
        'Loss added to cost basis of new position'
      ],
      penalties: [
        'Loss disallowed for current year',
        'Tax liability increase',
        'IRS audit risk'
      ]
    });
  }

  getRule(ruleName: string): { description: string; requirements: string[]; penalties: string[] } | null {
    return this.rules.get(ruleName.toLowerCase()) || null;
  }

  checkCompliance(ruleName: string, scenario: any): { compliant: boolean; issues: string[] } {
    const rule = this.rules.get(ruleName.toLowerCase());
    if (!rule) return { compliant: true, issues: [] };

    const issues: string[] = [];

    // Check specific scenarios
    if (ruleName === 'pattern_day_trader') {
      if (scenario.equity < 25000 && scenario.dayTrades >= 4) {
        issues.push('Below $25,000 minimum with 4+ day trades');
      }
    }

    if (ruleName === 'settlement_cycle') {
      if (scenario.usingUnsettledFunds) {
        issues.push('Using unsettled funds (good faith violation)');
      }
    }

    if (ruleName === 'short_sale_rule') {
      if (scenario.shortOnDowntick && scenario.declinedMoreThan10Percent) {
        issues.push('Short sale on downtick after 10% decline');
      }
    }

    if (ruleName === 'margin_requirements') {
      if (scenario.marginPercent < 50) {
        issues.push('Below 50% initial margin requirement');
      }
    }

    if (ruleName === 'wash_sale_rule') {
      if (scenario.repurchaseWithin30Days && scenario.claimingLoss) {
        issues.push('Wash sale: repurchased within 30 days');
      }
    }

    return {
      compliant: issues.length === 0,
      issues
    };
  }

  getRuleReport(ruleName: string): string {
    const rule = this.rules.get(ruleName.toLowerCase());
    if (!rule) return `No rule found: ${ruleName}`;

    let report = `**Rule: ${ruleName.replace(/_/g, ' ').toUpperCase()}**\n\n`;
    report += `**Description:** ${rule.description}\n\n`;
    report += `**Requirements:**\n`;
    rule.requirements.forEach(req => report += `- ${req}\n`);
    report += `\n**Penalties for Violation:**\n`;
    rule.penalties.forEach(pen => report += `- ${pen}\n`);

    return report;
  }

  addRule(name: string, description: string, requirements: string[], penalties: string[]) {
    this.rules.set(name.toLowerCase(), { description, requirements, penalties });
  }
}

// ============================================
// ITEM B.3: Crypto Trading
// 24/7 markets, volatility, exchanges, DeFi
// ============================================
export class CryptoTrading {
  private exchanges: Map<string, { fees: number; features: string[]; supportedCoins: string[] }> = new Map();
  private cryptoRules: Map<string, string[]> = new Map();

  constructor() {
    this.loadExchanges();
    this.loadRules();
  }

  private loadExchanges() {
    this.exchanges.set('coinbase', {
      fees: 0.5,
      features: ['fiat on-ramp', 'insurance', 'regulatory compliance'],
      supportedCoins: ['BTC', 'ETH', 'LTC', 'BCH', 'XRP']
    });

    this.exchanges.set('binance', {
      fees: 0.1,
      features: ['high liquidity', 'futures', 'margin trading'],
      supportedCoins: ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE']
    });

    this.exchanges.set('kraken', {
      fees: 0.26,
      features: ['security', 'margin', 'futures', 'staking'],
      supportedCoins: ['BTC', 'ETH', 'LTC', 'XRP', 'XLM', 'XTZ']
    });
  }

  private loadRules() {
    this.cryptoRules.set('volatility', [
      'Markets operate 24/7',
      'Higher volatility than traditional markets',
      'Weekend trading can have lower liquidity',
      'News-driven price movements common'
    ]);

    this.cryptoRules.set('security', [
      'Use hardware wallets for large holdings',
      'Enable 2FA on all accounts',
      'Never share private keys',
      'Verify contract addresses before transactions'
    ]);

    this.cryptoRules.set('defi', [
      'Smart contract risk',
      'Impermanent loss in liquidity pools',
      'Gas fees can be high',
      'Rug pull risk in new projects'
    ]);

    this.cryptoRules.set('taxes', [
      'Crypto-to-crypto trades are taxable',
      'Mining income is taxable',
      'Staking rewards are taxable',
      'Keep detailed transaction records'
    ]);
  }

  getExchangeInfo(exchange: string): { fees: number; features: string[]; supportedCoins: string[] } | null {
    return this.exchanges.get(exchange.toLowerCase()) || null;
  }

  getRuleCategory(category: string): string[] | null {
    return this.cryptoRules.get(category.toLowerCase()) || null;
  }

  compareExchanges(exchanges: string[]): string {
    let comparison = `**Exchange Comparison**\n\n`;

    exchanges.forEach(exchange => {
      const info = this.exchanges.get(exchange.toLowerCase());
      if (info) {
        comparison += `**${exchange.toUpperCase()}**\n`;
        comparison += `- Fees: ${info.fees}%\n`;
        comparison += `- Features: ${info.features.join(', ')}\n`;
        comparison += `- Supported Coins: ${info.supportedCoins.length}\n\n`;
      }
    });

    return comparison;
  }

  getTradingReport(category: string): string {
    const rules = this.cryptoRules.get(category.toLowerCase());
    if (!rules) return `No rules found for category: ${category}`;

    let report = `**Crypto Trading: ${category.toUpperCase()}**\n\n`;
    rules.forEach(rule => report += `- ${rule}\n`);

    return report;
  }

  addExchange(name: string, fees: number, features: string[], supportedCoins: string[]) {
    this.exchanges.set(name.toLowerCase(), { fees, features, supportedCoins });
  }

  addRuleCategory(category: string, rules: string[]) {
    this.cryptoRules.set(category.toLowerCase(), rules);
  }
}

// ============================================
// ITEM B.4: Scalping Strategies
// Time frames, indicators, entry/exit signals
// ============================================
export class ScalpingStrategies {
  private strategies: Map<string, { 
    timeFrame: string; 
    indicators: string[]; 
    entryRules: string[]; 
    exitRules: string[];
    riskReward: string 
  }> = new Map();

  constructor() {
    this.loadStrategies();
  }

  private loadStrategies() {
    this.strategies.set('momentum_scalp', {
      timeFrame: '1-minute',
      indicators: ['VWAP', 'EMA 9', 'EMA 20', 'Volume'],
      entryRules: [
        'Price crosses above VWAP with increasing volume',
        'EMA 9 crosses above EMA 20',
        'RSI between 50-70 (not overbought)'
      ],
      exitRules: [
        'Take profit at 0.5% gain',
        'Stop loss at 0.25% loss',
        'Exit if price closes below VWAP'
      ],
      riskReward: '1:2'
    });

    this.strategies.set('breakout_scalp', {
      timeFrame: '5-minute',
      indicators: ['Support/Resistance', 'Volume', 'Bollinger Bands'],
      entryRules: [
        'Price breaks above resistance with high volume',
        'Bollinger Bands expanding',
        'Volume 2x average'
      ],
      exitRules: [
        'Take profit at previous resistance level',
        'Stop loss below breakout point',
        'Exit if volume dries up'
      ],
      riskReward: '1:3'
    });

    this.strategies.set('mean_reversion_scalp', {
      timeFrame: '1-minute',
      indicators: ['RSI', 'Bollinger Bands', 'VWAP'],
      entryRules: [
        'RSI below 30 (oversold)',
        'Price touches lower Bollinger Band',
        'Price below VWAP'
      ],
      exitRules: [
        'Take profit at VWAP',
        'Stop loss at 0.3% below entry',
        'Exit if RSI crosses above 50'
      ],
      riskReward: '1:2'
    });
  }

  getStrategy(name: string): any {
    return this.strategies.get(name.toLowerCase()) || null;
  }

  getAllStrategies(): string[] {
    return Array.from(this.strategies.keys());
  }

  getStrategyReport(name: string): string {
    const strategy = this.strategies.get(name.toLowerCase());
    if (!strategy) return `No strategy found: ${name}`;

    let report = `**Scalping Strategy: ${name.replace(/_/g, ' ').toUpperCase()}**\n\n`;
    report += `**Time Frame:** ${strategy.timeFrame}\n\n`;
    
    report += `**Indicators:**\n`;
    strategy.indicators.forEach(ind => report += `- ${ind}\n`);
    
    report += `\n**Entry Rules:**\n`;
    strategy.entryRules.forEach(rule => report += `- ${rule}\n`);
    
    report += `\n**Exit Rules:**\n`;
    strategy.exitRules.forEach(rule => report += `- ${rule}\n`);
    
    report += `\n**Risk/Reward Ratio:** ${strategy.riskReward}`;

    return report;
  }

  addStrategy(name: string, timeFrame: string, indicators: string[], entryRules: string[], exitRules: string[], riskReward: string) {
    this.strategies.set(name.toLowerCase(), { timeFrame, indicators, entryRules, exitRules, riskReward });
  }
}

// ============================================
// ITEM B.5: Short Selling
// Locate requirement, borrow fees, margin, squeeze risk
// ============================================
export class ShortSelling {
  private shortRules: Map<string, string[]> = new Map();
  private risks: Map<string, { description: string; mitigation: string[] }> = new Map();

  constructor() {
    this.loadRules();
    this.loadRisks();
  }

  private loadRules() {
    this.shortRules.set('locate_requirement', [
      'Must locate shares before shorting',
      'Broker must confirm shares available to borrow',
      'Hard-to-borrow stocks may have higher fees',
      'Locate must be renewed daily'
    ]);

    this.shortRules.set('margin_requirements', [
      'Initial margin: 150% of short sale value',
      'Maintenance margin: 30% of current market value',
      'Minimum $2,000 equity required',
      'Margin call if equity falls below maintenance'
    ]);

    this.shortRules.set('uptick_rule', [
      'SEC Rule 201: Cannot short on downtick',
      'Applies after 10% decline in one day',
      'Must wait for uptick to enter short position',
      'Alternative: uptick rule satisfied by bid test'
    ]);

    this.shortRules.set('dividends', [
      'Short seller must pay dividends to lender',
      'Payment due on ex-dividend date',
      'Reduces profit potential',
      'Must be factored into trade planning'
    ]);
  }

  private loadRisks() {
    this.risks.set('short_squeeze', {
      description: 'Rapid price increase forcing short sellers to cover',
      mitigation: [
        'Use stop-loss orders',
        'Limit position size',
        'Avoid heavily shorted stocks',
        'Monitor short interest ratio'
      ]
    });

    this.risks.set('unlimited_loss', {
      description: 'Theoretical unlimited loss potential',
      mitigation: [
        'Always use stop-loss',
        'Position sizing based on account size',
        'Never risk more than 2% per trade',
        'Have exit strategy before entry'
      ]
    });

    this.risks.set('borrow_recall', {
      description: 'Lender can demand shares back',
      mitigation: [
        'Maintain good relationship with broker',
        'Have backup exit plan',
        'Monitor borrow availability',
        'Be prepared to cover immediately'
      ]
    });

    this.risks.set('hard_to_borrow', {
      description: 'Limited share availability increases costs',
      mitigation: [
        'Check borrow availability before trading',
        'Be prepared for higher fees',
        'Have alternative stocks to short',
        'Monitor borrow rates'
      ]
    });
  }

  getRuleCategory(category: string): string[] | null {
    return this.shortRules.get(category.toLowerCase()) || null;
  }

  getRisk(riskName: string): { description: string; mitigation: string[] } | null {
    return this.risks.get(riskName.toLowerCase()) || null;
  }

  getShortReport(category: string): string {
    const rules = this.shortRules.get(category.toLowerCase());
    if (!rules) return `No rules found for category: ${category}`;

    let report = `**Short Selling: ${category.replace(/_/g, ' ').toUpperCase()}**\n\n`;
    rules.forEach(rule => report += `- ${rule}\n`);

    return report;
  }

  getRiskReport(riskName: string): string {
    const risk = this.risks.get(riskName.toLowerCase());
    if (!risk) return `No risk found: ${riskName}`;

    let report = `**Risk: ${riskName.replace(/_/g, ' ').toUpperCase()}**\n\n`;
    report += `**Description:** ${risk.description}\n\n`;
    report += `**Mitigation Strategies:**\n`;
    risk.mitigation.forEach(m => report += `- ${m}\n`);

    return report;
  }

  addRuleCategory(category: string, rules: string[]) {
    this.shortRules.set(category.toLowerCase(), rules);
  }

  addRisk(name: string, description: string, mitigation: string[]) {
    this.risks.set(name.toLowerCase(), { description, mitigation });
  }
}

// ============================================
// ITEM B.6: Technical Analysis
// Chart patterns, candlesticks, indicators
// ============================================
export class TechnicalAnalysis {
  private patterns: Map<string, { type: string; description: string; signal: string; reliability: number }> = new Map();
  private indicators: Map<string, { calculation: string; interpretation: string[] }> = new Map();

  constructor() {
    this.loadPatterns();
    this.loadIndicators();
  }

  private loadPatterns() {
    this.patterns.set('head_and_shoulders', {
      type: 'reversal',
      description: 'Three peaks with middle peak highest',
      signal: 'Bearish reversal signal',
      reliability: 0.83
    });

    this.patterns.set('double_top', {
      type: 'reversal',
      description: 'Two peaks at similar price level',
      signal: 'Bearish reversal after uptrend',
      reliability: 0.77
    });

    this.patterns.set('double_bottom', {
      type: 'reversal',
      description: 'Two troughs at similar price level',
      signal: 'Bullish reversal after downtrend',
      reliability: 0.77
    });

    this.patterns.set('bullish_engulfing', {
      type: 'candlestick',
      description: 'Large green candle completely engulfs previous red candle',
      signal: 'Bullish reversal',
      reliability: 0.75
    });

    this.patterns.set('bearish_engulfing', {
      type: 'candlestick',
      description: 'Large red candle completely engulfs previous green candle',
      signal: 'Bearish reversal',
      reliability: 0.75
    });

    this.patterns.set('doji', {
      type: 'candlestick',
      description: 'Open and close at same level, long wicks',
      signal: 'Indecision, potential reversal',
      reliability: 0.60
    });
  }

  private loadIndicators() {
    this.indicators.set('rsi', {
      calculation: 'RSI = 100 - (100 / (1 + RS)) where RS = avg gain / avg loss',
      interpretation: [
        'RSI > 70: Overbought, potential reversal down',
        'RSI < 30: Oversold, potential reversal up',
        'RSI 30-70: Neutral territory'
      ]
    });

    this.indicators.set('macd', {
      calculation: 'MACD = 12-day EMA - 26-day EMA, Signal = 9-day EMA of MACD',
      interpretation: [
        'MACD crosses above signal: Bullish',
        'MACD crosses below signal: Bearish',
        'MACD above zero: Bullish momentum',
        'MACD below zero: Bearish momentum'
      ]
    });

    this.indicators.set('bollinger_bands', {
      calculation: 'Middle = 20-day SMA, Upper = Middle + 2σ, Lower = Middle - 2σ',
      interpretation: [
        'Price touches upper band: Overbought',
        'Price touches lower band: Oversold',
        'Bands narrowing: Low volatility, breakout coming',
        'Bands widening: High volatility'
      ]
    });

    this.indicators.set('moving_averages', {
      calculation: 'SMA = sum of prices / n periods, EMA = weighted average',
      interpretation: [
        'Golden cross (50 MA crosses above 200 MA): Bullish',
        'Death cross (50 MA crosses below 200 MA): Bearish',
        'Price above MA: Bullish trend',
        'Price below MA: Bearish trend'
      ]
    });
  }

  getPattern(name: string): { type: string; description: string; signal: string; reliability: number } | null {
    return this.patterns.get(name.toLowerCase()) || null;
  }

  getIndicator(name: string): { calculation: string; interpretation: string[] } | null {
    return this.indicators.get(name.toLowerCase()) || null;
  }

  getPatternReport(name: string): string {
    const pattern = this.patterns.get(name.toLowerCase());
    if (!pattern) return `No pattern found: ${name}`;

    let report = `**Pattern: ${name.replace(/_/g, ' ').toUpperCase()}**\n\n`;
    report += `**Type:** ${pattern.type}\n`;
    report += `**Description:** ${pattern.description}\n`;
    report += `**Signal:** ${pattern.signal}\n`;
    report += `**Reliability:** ${(pattern.reliability * 100).toFixed(0)}%`;

    return report;
  }

  getIndicatorReport(name: string): string {
    const indicator = this.indicators.get(name.toLowerCase());
    if (!indicator) return `No indicator found: ${name}`;

    let report = `**Indicator: ${name.toUpperCase()}**\n\n`;
    report += `**Calculation:** ${indicator.calculation}\n\n`;
    report += `**Interpretation:**\n`;
    indicator.interpretation.forEach(interp => report += `- ${interp}\n`);

    return report;
  }

  addPattern(name: string, type: string, description: string, signal: string, reliability: number) {
    this.patterns.set(name.toLowerCase(), { type, description, signal, reliability });
  }

  addIndicator(name: string, calculation: string, interpretation: string[]) {
    this.indicators.set(name.toLowerCase(), { calculation, interpretation });
  }
}

// ============================================
// ITEM B.7: Risk Management
// Position sizing, stop loss, portfolio risk
// ============================================
export class RiskManagement {
  calculatePositionSize(accountSize: number, riskPercent: number, entryPrice: number, stopLoss: number): number {
    const riskAmount = accountSize * (riskPercent / 100);
    const priceRisk = Math.abs(entryPrice - stopLoss);
    const positionSize = riskAmount / priceRisk;
    
    return Math.floor(positionSize);
  }

  calculateRiskReward(entryPrice: number, stopLoss: number, takeProfit: number): { risk: number; reward: number; ratio: string } {
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(takeProfit - entryPrice);
    const ratio = reward / risk;
    
    return {
      risk,
      reward,
      ratio: `1:${ratio.toFixed(2)}`
    };
  }

  calculatePortfolioRisk(positions: Array<{ symbol: string; weight: number; volatility: number }>): number {
    // Simplified portfolio volatility calculation
    // In production, would use covariance matrix
    let portfolioVariance = 0;
    
    positions.forEach(pos => {
      portfolioVariance += Math.pow(pos.weight * pos.volatility, 2);
    });
    
    return Math.sqrt(portfolioVariance);
  }

  checkRiskLimits(accountSize: number, currentRisk: number, maxRiskPercent: number): { withinLimits: boolean; message: string } {
    const maxRisk = accountSize * (maxRiskPercent / 100);
    const withinLimits = currentRisk <= maxRisk;
    
    return {
      withinLimits,
      message: withinLimits 
        ? `Risk within limits: $${currentRisk.toFixed(2)} / $${maxRisk.toFixed(2)}`
        : `Risk exceeds limits: $${currentRisk.toFixed(2)} / $${maxRisk.toFixed(2)}`
    };
  }

  getRiskReport(accountSize: number, positions: Array<{ symbol: string; weight: number; volatility: number; risk: number }>): string {
    let report = `**Risk Management Report**\n\n`;
    report += `**Account Size:** $${accountSize.toFixed(2)}\n\n`;
    
    report += `**Positions:**\n`;
    let totalRisk = 0;
    positions.forEach(pos => {
      report += `- ${pos.symbol}: ${pos.weight.toFixed(2)}% weight, $${pos.risk.toFixed(2)} risk\n`;
      totalRisk += pos.risk;
    });
    
    report += `\n**Total Risk:** $${totalRisk.toFixed(2)}\n`;
    report += `**Risk as % of Account:** ${((totalRisk / accountSize) * 100).toFixed(2)}%\n`;
    
    const portfolioRisk = this.calculatePortfolioRisk(positions);
    report += `**Portfolio Volatility:** ${(portfolioRisk * 100).toFixed(2)}%`;
    
    return report;
  }
}

// ============================================
// ITEM B.8: Trading Psychology
// Emotional control, discipline, journaling
// ============================================
export class TradingPsychology {
  private biases: Map<string, { description: string; impact: string; mitigation: string[] }> = new Map();
  private emotions: Map<string, { description: string; effect: string; control: string[] }> = new Map();

  constructor() {
    this.loadBiases();
    this.loadEmotions();
  }

  private loadBiases() {
    this.biases.set('confirmation_bias', {
      description: 'Seeking information that confirms existing beliefs',
      impact: 'Ignore warning signs, hold losing positions too long',
      mitigation: [
        'Actively seek disconfirming evidence',
        'Write down reasons before entering trade',
        'Review trades objectively after completion',
        'Keep trading journal'
      ]
    });

    this.biases.set('loss_aversion', {
      description: 'Pain of losses feels greater than pleasure of gains',
      impact: 'Hold losers too long, sell winners too early',
      mitigation: [
        'Use stop-loss orders',
        'Focus on process, not outcome',
        'Accept losses as part of trading',
        'Review risk/reward before entry'
      ]
    });

    this.biases.set('overconfidence', {
      description: 'Overestimating ability to predict markets',
      impact: 'Take excessive risks, ignore stop-losses',
      mitigation: [
        'Keep position sizes small',
        'Track win rate objectively',
        'Review losing trades carefully',
        'Maintain trading plan discipline'
      ]
    });

    this.biases.set('recency_bias', {
      description: 'Giving too much weight to recent events',
      impact: 'Chase trends, ignore long-term patterns',
      mitigation: [
        'Review longer time frames',
        'Use systematic trading rules',
        'Keep perspective on market cycles',
        'Avoid emotional decisions'
      ]
    });
  }

  private loadEmotions() {
    this.emotions.set('fear', {
      description: 'Fear of loss or missing out',
      effect: 'Premature exits, missed opportunities, hesitation',
      control: [
        'Use predetermined stop-losses',
        'Trade small position sizes',
        'Focus on process, not outcome',
        'Accept uncertainty as normal'
      ]
    });

    this.emotions.set('greed', {
      description: 'Desire for excessive profits',
      effect: 'Overtrading, excessive risk, ignoring stop-losses',
      control: [
        'Set profit targets before entry',
        'Use position sizing rules',
        'Take partial profits',
        'Stick to trading plan'
      ]
    });

    this.emotions.set('frustration', {
      description: 'Anger from losses or missed trades',
      effect: 'Revenge trading, breaking rules, emotional decisions',
      control: [
        'Take breaks after losses',
        'Review trades objectively',
        'Accept losses as learning',
        'Return to trading plan'
      ]
    });

    this.emotions.set('euphoria', {
      description: 'Excessive confidence from winning streak',
      effect: 'Overtrading, excessive risk, ignoring warning signs',
      control: [
        'Stay humble after wins',
        'Maintain position sizing',
        'Continue following plan',
        'Remember losses are inevitable'
      ]
    });
  }

  getBias(name: string): { description: string; impact: string; mitigation: string[] } | null {
    return this.biases.get(name.toLowerCase()) || null;
  }

  getEmotion(name: string): { description: string; effect: string; control: string[] } | null {
    return this.emotions.get(name.toLowerCase()) || null;
  }

  getBiasReport(name: string): string {
    const bias = this.biases.get(name.toLowerCase());
    if (!bias) return `No bias found: ${name}`;

    let report = `**Cognitive Bias: ${name.replace(/_/g, ' ').toUpperCase()}**\n\n`;
    report += `**Description:** ${bias.description}\n\n`;
    report += `**Impact on Trading:** ${bias.impact}\n\n`;
    report += `**Mitigation Strategies:**\n`;
    bias.mitigation.forEach(m => report += `- ${m}\n`);

    return report;
  }

  getEmotionReport(name: string): string {
    const emotion = this.emotions.get(name.toLowerCase());
    if (!emotion) return `No emotion found: ${name}`;

    let report = `**Emotion: ${name.toUpperCase()}**\n\n`;
    report += `**Description:** ${emotion.description}\n\n`;
    report += `**Effect on Trading:** ${emotion.effect}\n\n`;
    report += `**Control Strategies:**\n`;
    emotion.control.forEach(c => report += `- ${c}\n`);

    return report;
  }

  addBias(name: string, description: string, impact: string, mitigation: string[]) {
    this.biases.set(name.toLowerCase(), { description, impact, mitigation });
  }

  addEmotion(name: string, description: string, effect: string, control: string[]) {
    this.emotions.set(name.toLowerCase(), { description, effect, control });
  }
}

// ============================================
// ITEM B.9: Market Prediction
// Technical indicators, sentiment, ML models
// ============================================
export class MarketPrediction {
  private models: Map<string, { type: string; inputs: string[]; output: string; accuracy: number }> = new Map();

  constructor() {
    this.loadModels();
  }

  private loadModels() {
    this.models.set('moving_average_crossover', {
      type: 'technical',
      inputs: ['50-day MA', '200-day MA'],
      output: 'Trend direction',
      accuracy: 0.65
    });

    this.models.set('rsi_divergence', {
      type: 'technical',
      inputs: ['RSI', 'Price action'],
      output: 'Reversal signal',
      accuracy: 0.70
    });

    this.models.set('sentiment_analysis', {
      type: 'sentiment',
      inputs: ['News headlines', 'Social media', 'Fear & Greed Index'],
      output: 'Market sentiment',
      accuracy: 0.60
    });

    this.models.set('volume_analysis', {
      type: 'technical',
      inputs: ['Volume', 'Price', 'Moving averages'],
      output: 'Trend confirmation',
      accuracy: 0.68
    });

    this.models.set('support_resistance', {
      type: 'technical',
      inputs: ['Historical highs/lows', 'Volume profiles'],
      output: 'Key price levels',
      accuracy: 0.72
    });
  }

  getModel(name: string): { type: string; inputs: string[]; output: string; accuracy: number } | null {
    return this.models.get(name.toLowerCase()) || null;
  }

  predict(modelName: string, inputs: any): { prediction: string; confidence: number } {
    const model = this.models.get(modelName.toLowerCase());
    if (!model) return { prediction: 'Unknown model', confidence: 0 };

    // Simplified prediction logic
    // In production, would use actual ML models
    let prediction = '';
    let confidence = model.accuracy;

    switch (modelName.toLowerCase()) {
      case 'moving_average_crossover':
        prediction = inputs.ma50 > inputs.ma200 ? 'Bullish trend' : 'Bearish trend';
        break;
      case 'rsi_divergence':
        prediction = inputs.rsi < 30 ? 'Oversold, potential reversal up' : inputs.rsi > 70 ? 'Overbought, potential reversal down' : 'Neutral';
        break;
      case 'sentiment_analysis':
        prediction = inputs.sentiment > 0.6 ? 'Bullish sentiment' : inputs.sentiment < 0.4 ? 'Bearish sentiment' : 'Neutral sentiment';
        break;
      default:
        prediction = 'Analysis in progress';
        confidence = 0.5;
    }

    return { prediction, confidence };
  }

  getModelReport(name: string): string {
    const model = this.models.get(name.toLowerCase());
    if (!model) return `No model found: ${name}`;

    let report = `**Prediction Model: ${name.replace(/_/g, ' ').toUpperCase()}**\n\n`;
    report += `**Type:** ${model.type}\n\n`;
    report += `**Inputs:**\n`;
    model.inputs.forEach(input => report += `- ${input}\n`);
    report += `\n**Output:** ${model.output}\n`;
    report += `**Historical Accuracy:** ${(model.accuracy * 100).toFixed(0)}%`;

    return report;
  }

  addModel(name: string, type: string, inputs: string[], output: string, accuracy: number) {
    this.models.set(name.toLowerCase(), { type, inputs, output, accuracy });
  }
}

// ============================================
// ITEM B.10: Trading Code Generation
// Alpaca clients, backtesting, live bots
// ============================================
export class TradingCodeGenerator {
  generateAlpacaClient(language: string = 'python'): string {
    if (language === 'python') {
      return `import alpaca_trade_api as tradeapi
import os

# Initialize Alpaca API
api = tradeapi.REST(
    key_id=os.environ.get('APCA_API_KEY_ID'),
    secret_key=os.environ.get('APCA_API_SECRET_KEY'),
    base_url='https://paper-api.alpaca.markets'  # Use 'https://api.alpaca.markets' for live
)

# Get account info
account = api.get_account()
print(f"Account equity: \${account.equity}")

# Get positions
positions = api.list_positions()
for position in positions:
    print(f"{position.symbol}: {position.qty} shares @ \${position.avg_entry_price}")

# Submit order
api.submit_order(
    symbol='AAPL',
    qty=10,
    side='buy',
    type='market',
    time_in_force='gtc'
)

print("Order submitted successfully")`;
    }
    
    return '// Code generation not supported for this language';
  }

  generateBacktestTemplate(strategy: string = 'moving_average_crossover'): string {
    return `import pandas as pd
import numpy as np
from datetime import datetime

class Backtest:
    def __init__(self, initial_capital=100000):
        self.initial_capital = initial_capital
        self.capital = initial_capital
        self.positions = {}
        self.trades = []
        
    def run(self, data):
        """Run backtest on historical data"""
        for i in range(len(data)):
            signal = self.generate_signal(data, i)
            self.execute_trade(signal, data.iloc[i])
        
        return self.calculate_performance()
    
    def generate_signal(self, data, index):
        """Generate trading signal based on strategy"""
        # ${strategy} strategy
        # Implement your strategy logic here
        return 'hold'
    
    def execute_trade(self, signal, current_data):
        """Execute trade based on signal"""
        if signal == 'buy' and 'AAPL' not in self.positions:
            qty = int(self.capital * 0.1 / current_data['close'])
            self.positions['AAPL'] = {'qty': qty, 'entry_price': current_data['close']}
            self.capital -= qty * current_data['close']
            self.trades.append({'type': 'buy', 'price': current_data['close'], 'qty': qty})
        
        elif signal == 'sell' and 'AAPL' in self.positions:
            pos = self.positions['AAPL']
            self.capital += pos['qty'] * current_data['close']
            self.trades.append({'type': 'sell', 'price': current_data['close'], 'qty': pos['qty']})
            del self.positions['AAPL']
    
    def calculate_performance(self):
        """Calculate backtest performance metrics"""
        final_value = self.capital
        for symbol, pos in self.positions.items():
            final_value += pos['qty'] * pos['entry_price']
        
        total_return = (final_value - self.initial_capital) / self.initial_capital
        num_trades = len(self.trades)
        
        return {
            'total_return': total_return,
            'num_trades': num_trades,
            'final_value': final_value
        }

# Usage
# backtest = Backtest(initial_capital=100000)
# data = pd.read_csv('historical_data.csv')
# results = backtest.run(data)
# print(results)`;
  }

  generateLiveBotTemplate(): string {
    return `import alpaca_trade_api as tradeapi
import time
from datetime import datetime

class LiveTradingBot:
    def __init__(self):
        self.api = tradeapi.REST(
            key_id='YOUR_KEY_ID',
            secret_key='YOUR_SECRET_KEY',
            base_url='https://paper-api.alpaca.markets'
        )
        self.running = True
        
    def start(self):
        """Start the trading bot"""
        print("Starting live trading bot...")
        
        while self.running:
            try:
                # Check for trading signals
                signal = self.check_signals()
                
                # Execute trades if signal detected
                if signal:
                    self.execute_trade(signal)
                
                # Wait before next iteration
                time.sleep(60)  # Check every minute
                
            except Exception as e:
                print(f"Error: {e}")
                time.sleep(60)
    
    def check_signals(self):
        """Check for trading signals"""
        # Implement your signal logic here
        # Example: Check moving average crossover
        return None
    
    def execute_trade(self, signal):
        """Execute trade based on signal"""
        try:
            if signal['action'] == 'buy':
                self.api.submit_order(
                    symbol=signal['symbol'],
                    qty=signal['qty'],
                    side='buy',
                    type='market',
                    time_in_force='gtc'
                )
                print(f"Bought {signal['qty']} shares of {signal['symbol']}")
            
            elif signal['action'] == 'sell':
                self.api.submit_order(
                    symbol=signal['symbol'],
                    qty=signal['qty'],
                    side='sell',
                    type='market',
                    time_in_force='gtc'
                )
                print(f"Sold {signal['qty']} shares of {signal['symbol']}")
                
        except Exception as e:
            print(f"Trade execution error: {e}")
    
    def stop(self):
        """Stop the trading bot"""
        self.running = False
        print("Trading bot stopped")

# Usage
# bot = LiveTradingBot()
# bot.start()`;
  }

  generateRiskCalculator(): string {
    return `class RiskCalculator:
    def __init__(self, account_size, max_risk_percent=2):
        self.account_size = account_size
        self.max_risk_percent = max_risk_percent
    
    def calculate_position_size(self, entry_price, stop_loss):
        """Calculate position size based on risk"""
        risk_amount = self.account_size * (self.max_risk_percent / 100)
        price_risk = abs(entry_price - stop_loss)
        position_size = risk_amount / price_risk
        
        return int(position_size)
    
    def calculate_risk_reward(self, entry_price, stop_loss, take_profit):
        """Calculate risk/reward ratio"""
        risk = abs(entry_price - stop_loss)
        reward = abs(take_profit - entry_price)
        ratio = reward / risk
        
        return {
            'risk': risk,
            'reward': reward,
            'ratio': f'1:{ratio:.2f}'
        }
    
    def check_risk_limits(self, current_risk):
        """Check if current risk is within limits"""
        max_risk = self.account_size * (self.max_risk_percent / 100)
        
        if current_risk <= max_risk:
            return True, f"Risk within limits: \${current_risk:.2f} / \${max_risk:.2f}"
        else:
            return False, f"Risk exceeds limits: \${current_risk:.2f} / \${max_risk:.2f}"

# Usage
# calculator = RiskCalculator(account_size=100000, max_risk_percent=2)
# position_size = calculator.calculate_position_size(entry_price=150, stop_loss=145)
# print(f"Position size: {position_size} shares")`;
  }
}

// ============================================
// Export all Trading & Finance systems
// ============================================
export const TradingFinanceSystems = {
  AlpacaAPI,
  StockMarketRules,
  CryptoTrading,
  ScalpingStrategies,
  ShortSelling,
  TechnicalAnalysis,
  RiskManagement,
  TradingPsychology,
  MarketPrediction,
  TradingCodeGenerator,
};
