// 黑板内容类型
export type BlackboardType = 'image' | 'video' | 'math' | 'lab';

// 黑板内容 - 基础接口
export interface BlackboardContentBase {
  type: BlackboardType;
  // 可选的样式配置
  style?: React.CSSProperties;
  className?: string;
}

// 图片黑板
export interface ImageBlackboard extends BlackboardContentBase {
  type: 'image';
  src: string;
  alt?: string;
}

// 视频黑板
export interface VideoBlackboard extends BlackboardContentBase {
  type: 'video';
  src: string;
  autoplay?: boolean;
  loop?: boolean;
}

// 数学公式黑板
export interface MathBlackboard extends BlackboardContentBase {
  type: 'math';
  content: string;
}

// 实验黑板
// labType 现在是 string 类型，可以支持任意的实验 ID（如 "ch1_ellipse_discovery"）
export interface LabBlackboard extends BlackboardContentBase {
  type: 'lab';
  labType: string;  // 实验组件 ID，对应 LAB_MAP 中的 key
  step?: number;    // 当前实验步骤（可选，用于控制实验的不同状态）
  config?: any;     // 可选的额外配置（为了向后兼容）
}

// 黑板内容联合类型
export type BlackboardContent = ImageBlackboard | VideoBlackboard | MathBlackboard | LabBlackboard;
