// 对话内容
export interface DialogueContent {
  speaker?: string;
  text: string;
  speed?: number;
}

// 选项配置
export interface SceneOption {
  text: string;
  correct?: boolean;
  next?: string;
  scoreChange?: number;
}
