// 导入其他类型文件
import type { MamboExpression, MamboAction, MamboConfig } from './mambo.types';
import type { BlackboardType, BlackboardContentBase, ImageBlackboard, VideoBlackboard, MathBlackboard, LabBlackboard, IframeBlackboard, BlackboardContent } from './blackboard.types';
import type { DialogueContent, SceneOption } from './dialogue.types';
import type { GameMode } from './game.types';

// 重新导出所有类型以保持向后兼容
export type { MamboExpression, MamboAction, MamboConfig };
export type { BlackboardType, BlackboardContentBase, ImageBlackboard, VideoBlackboard, MathBlackboard, LabBlackboard, IframeBlackboard, BlackboardContent };
export type { DialogueContent, SceneOption };
export type { GameMode };

// 场景基础接口
export interface SceneBase {
  id: string;
  type: 'dialogue' | 'choice';
  mambo?: MamboConfig;
  dialogue?: DialogueContent;
  blackboard?: BlackboardContent;
}

// 对话场景
export interface DialogueScene extends SceneBase {
  type: 'dialogue';
  next?: string | null;
}

// 选择场景
export interface ChoiceScene extends SceneBase {
  type: 'choice';
  options: SceneOption[];
}

// 场景联合类型
export type Scene = DialogueScene | ChoiceScene;

// 章节数据
export interface ChapterData {
  chapter: string;
  scenes: Scene[];
}
