// Logging System - Centralized logging for the autonomous learning system
// Part of Autonomous Learning System - Week 1 Foundation

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  component: string;
  message: string;
  data?: any;
}

class LoggingSystem {
  private logs: LogEntry[] = [];
  private maxLogs: number = 10000;
  private logLevel: LogLevel = 'info';
  
  private readonly LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  /**
   * Set the minimum log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Log a debug message
   */
  debug(component: string, message: string, data?: any): void {
    this.log('debug', component, message, data);
  }

  /**
   * Log an info message
   */
  info(component: string, message: string, data?: any): void {
    this.log('info', component, message, data);
  }

  /**
   * Log a warning message
   */
  warn(component: string, message: string, data?: any): void {
    this.log('warn', component, message, data);
  }

  /**
   * Log an error message
   */
  error(component: string, message: string, data?: any): void {
    this.log('error', component, message, data);
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, component: string, message: string, data?: any): void {
    // Check if this level should be logged
    if (this.LOG_LEVELS[level] < this.LOG_LEVELS[this.logLevel]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      component,
      message,
      data
    };

    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console for important levels
    if (level === 'error' || level === 'warn') {
      console.log(`[${level.toUpperCase()}] ${component}: ${message}`, data || '');
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs by component
   */
  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component);
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Generate log report
   */
  generateReport(): string {
    const stats = {
      total: this.logs.length,
      debug: this.logs.filter(l => l.level === 'debug').length,
      info: this.logs.filter(l => l.level === 'info').length,
      warn: this.logs.filter(l => l.level === 'warn').length,
      error: this.logs.filter(l => l.level === 'error').length
    };

    let report = '**Logging System Report**\n\n';
    report += `**Total Logs:** ${stats.total}\n`;
    report += `- Debug: ${stats.debug}\n`;
    report += `- Info: ${stats.info}\n`;
    report += `- Warn: ${stats.warn}\n`;
    report += `- Error: ${stats.error}\n\n`;

    if (stats.error > 0) {
      report += '**Recent Errors:**\n';
      this.getLogsByLevel('error').slice(-5).forEach((log, i) => {
        report += `${i + 1}. [${log.timestamp.toLocaleTimeString()}] ${log.component}: ${log.message}\n`;
      });
    }

    return report;
  }
}

// Singleton instance
export const logger = new LoggingSystem();
