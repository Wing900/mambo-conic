import { MamboExpression, MamboAction, DialogueContent, BlackboardContent, SceneOption } from './scene.types';

// Mambo 组件 Props
export interface MamboProps {
  expression?: MamboExpression;
  action?: MamboAction;
  visible?: boolean;
  mode?: 'full' | 'avatar';
  labelScale?: number;
  showLabel?: boolean;
}

// Dialogue 组件 Props
export interface DialogueProps {
  content?: DialogueContent;
  onNext?: () => void;
  onComplete?: () => void;
  className?: string;
}

// ChoiceMenu 组件 Props
export interface ChoiceMenuProps {
  options: SceneOption[];
  onChoice: (index: number) => void;
}

// Blackboard 组件 Props
export interface BlackboardProps {
  content?: BlackboardContent;
}

// 各类型黑板节点 Props
export interface ImageNodeProps {
  src: string;
  alt?: string;
  width?: string;   // 可选：自定义宽（默认使用原始尺寸）
  height?: string;  // 可选：自定义高（默认使用原始尺寸）
}

export interface VideoNodeProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  width?: string;   // 可选：自定义宽（默认使用原始尺寸）
  height?: string;  // 可选：自定义高（默认使用原始尺寸）
}

export interface MathNodeProps {
  content: string;
}

export interface LabNodeProps {
  labType: string;
  step?: number;
  config?: any;
}
