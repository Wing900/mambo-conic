import JXG from 'jsxgraph';
import { LAB_COLORS } from './labColors';

/**
 * JSXGraph 画板配置接口
 */
export interface JXGBoardConfig {
  /** 坐标范围 [xMin, yMax, xMax, yMin] */
  boundingbox: [number, number, number, number];
  /** 是否显示坐标轴 */
  showAxis?: boolean;
  /** 是否显示网格 */
  showGrid?: boolean;
  /** 背景色 */
  backgroundColor?: string;
}

/**
 * 默认 JSXGraph 配置
 * 关闭坐标轴、网格等默认元素，提供干净的画布
 */
export const DEFAULT_JXG_CONFIG = {
  axis: false,              // 【重点】关掉坐标轴，只在需要时手画
  grid: false,              // 【重点】关掉密密麻麻的网格
  showNavigation: false,     // 隐藏右下角的导航按钮
  showCopyright: false,     // 隐藏版权 logo
  pan: {
    enabled: false,         // 禁止随意拖动
  },
  zoom: {
    enabled: false,         // 禁止缩放
  },
  keepAspectRatio: true,    // 保持宽高比
} as const;

/**
 * 创建 JSXGraph 画板
 * @param container - 容器元素或容器 ID
 * @param config - 画板配置
 * @returns JSXGraph 画板实例
 */
export function createJXGBoard(
  container: HTMLElement | string,
  config: JXGBoardConfig
): JXG.Board {
  const board = JXG.JSXGraph.initBoard(container, {
    ...DEFAULT_JXG_CONFIG,
    boundingbox: config.boundingbox,
    axis: config.showAxis ?? false,
    grid: config.showGrid ?? false,
  });

  // 设置背景色（如果指定）
  if (config.backgroundColor) {
    const container = board.container as HTMLElement;
    if (container && container.style) {
      container.style.backgroundColor = config.backgroundColor;
    }
  }

  return board;
}

/**
 * 清理 JSXGraph 画板
 * @param board - 要清理的画板实例
 */
export function cleanupJXGBoard(board: JXG.Board | null | undefined): void {
  if (board) {
    JXG.JSXGraph.freeBoard(board);
  }
}

/**
 * 创建自定义坐标轴
 * @param board - JSXGraph 画板实例
 * @param options - 可选样式配置
 */
export function createCustomAxis(
  board: JXG.Board,
  options?: {
    strokeColor?: string;
    strokeWidth?: number;
    tickColor?: string;
    labelColor?: string;
  }
) {
  const strokeColor = options?.strokeColor ?? LAB_COLORS.axis;
  const strokeWidth = options?.strokeWidth ?? 2;
  const tickColor = options?.tickColor ?? LAB_COLORS.axis;
  const labelColor = options?.labelColor ?? LAB_COLORS.textSecondary;

  // 创建 X 轴
  void board.create('axis', [[0, 0], [1, 0]], {
    ticks: {
      strokeColor: tickColor,
      majorHeight: 8,
      minorHeight: 4,
      drawLabels: true,
      label: { offset: [0, 15], color: labelColor },
    },
    strokeColor: strokeColor,
    strokeWidth: strokeWidth,
  });

  // 创建 Y 轴
  void board.create('axis', [[0, 0], [0, 1]], {
    ticks: {
      strokeColor: tickColor,
      majorHeight: 8,
      minorHeight: 4,
      drawLabels: true,
      label: { offset: [10, 0], color: labelColor },
    },
    strokeColor: strokeColor,
    strokeWidth: strokeWidth,
  });
}

/**
 * 创建网格
 * @param board - JSXGraph 画板实例
 * @param options - 可选配置
 */
export function createGrid(
  board: JXG.Board,
  options?: {
    gridX?: number;
    gridY?: number;
    strokeColor?: string;
    strokeWidth?: number;
  }
) {
  const gridX = options?.gridX ?? 1;
  const gridY = options?.gridY ?? 1;
  const strokeColor = options?.strokeColor ?? LAB_COLORS.grid;
  const strokeWidth = options?.strokeWidth ?? 0.5;

  void board.create('grid', [], {
    gridX: gridX,
    gridY: gridY,
    strokeColor: strokeColor,
    strokeWidth: strokeWidth,
  });
}
