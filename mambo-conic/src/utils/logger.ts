/**
 * 日志级别枚举
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * 日志级别优先级
 */
const LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error'];

/**
 * 环境类型
 */
type Environment = 'development' | 'production' | 'test';

/**
 * 日志配置
 */
interface LoggerConfig {
  level: LogLevel;
  environment: Environment;
  enableTimestamp: boolean;
  enableColors: boolean;
}

/**
 * 日志颜色配置
 */
const COLORS: Record<LogLevel, string> = {
  debug: '\x1b[36m',    // 青色
  info: '\x1b[32m',     // 绿色
  warn: '\x1b[33m',     // 黄色
  error: '\x1b[31m',    // 红色
};

const RESET_COLOR = '\x1b[0m';

/**
 * 全局日志配置
 */
let globalConfig: LoggerConfig = {
  level: import.meta.env.DEV ? 'debug' : 'warn',
  environment: import.meta.env.DEV ? 'development' : 'production',
  enableTimestamp: true,
  enableColors: import.meta.env.DEV,
};

/**
 * Logger 类
 */
class Logger {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  /**
   * 检查是否应该记录该级别的日志
   */
  private shouldLog(level: LogLevel): boolean {
    return LEVELS.indexOf(level) >= LEVELS.indexOf(globalConfig.level);
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(level: LogLevel, ...args: any[]): string[] {
    const parts: string[] = [];

    // 添加颜色
    if (globalConfig.enableColors) {
      parts.push(COLORS[level]);
    }

    // 添加时间戳
    if (globalConfig.enableTimestamp) {
      const now = new Date();
      const time = now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
      });
      parts.push(`[${time}]`);
    }

    // 添加前缀
    parts.push(`[${this.prefix}]`);

    // 重置颜色
    if (globalConfig.enableColors) {
      parts.push(RESET_COLOR);
    }

    return [parts.join(''), ...args];
  }

  /**
   * 核心日志方法
   */
  private log(level: LogLevel, ...args: any[]) {
    if (this.shouldLog(level)) {
      const formatted = this.formatMessage(level, ...args);
      console[level](...formatted);
    }
  }

  /**
   * Debug 级别日志
   */
  debug = (...args: any[]) => this.log('debug', ...args);

  /**
   * Info 级别日志
   */
  info = (...args: any[]) => this.log('info', ...args);

  /**
   * Warn 级别日志
   */
  warn = (...args: any[]) => this.log('warn', ...args);

  /**
   * Error 级别日志
   */
  error = (...args: any[]) => this.log('error', ...args);

  /**
   * 创建子日志器（继承当前前缀）
   */
  child(suffix: string): Logger {
    return new Logger(`${this.prefix}:${suffix}`);
  }
}

/**
 * 创建日志器实例
 */
export const createLogger = (prefix: string): Logger => {
  return new Logger(prefix);
};

/**
 * 设置全局日志配置
 */
export const setLoggerConfig = (config: Partial<LoggerConfig>) => {
  globalConfig = { ...globalConfig, ...config };
};

/**
 * 设置日志级别
 */
export const setLogLevel = (level: LogLevel) => {
  globalConfig.level = level;
};

/**
 * 获取当前日志级别
 */
export const getLogLevel = (): LogLevel => {
  return globalConfig.level;
};

/**
 * 设置环境
 */
export const setEnvironment = (environment: Environment) => {
  globalConfig.environment = environment;
};

/**
 * 预定义的日志器
 */
export const logger = createLogger('App');
export const audioLogger = createLogger('Audio');
export const sceneLogger = createLogger('Scene');
export const gameLogger = createLogger('Game');
export const blackboardLogger = createLogger('Blackboard');
export const labLogger = createLogger('Lab');
