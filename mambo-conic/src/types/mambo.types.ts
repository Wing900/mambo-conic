// 曼波表情类型
export type MamboExpression = 'normal' | 'happy' | 'sad' | 'thinking' | 'excited' | 'surprised';

// 曼波动作类型
export type MamboAction = 'bounce' | 'shake' | 'idle' | 'excited';

// 曼波配置
export interface MamboConfig {
  expression?: MamboExpression;
  action?: MamboAction;
}
