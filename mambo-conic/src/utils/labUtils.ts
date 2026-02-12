/**
 * 数学实验工具模块
 * 统一导出 JSXGraph 配置和颜色常量
 */

// JSXGraph 配置
export {
  createJXGBoard,
  cleanupJXGBoard,
  createCustomAxis,
  createGrid,
  DEFAULT_JXG_CONFIG,
  type JXGBoardConfig,
} from './jsxgraphConfig';

// 实验颜色常量
export {
  LAB_COLORS,
  DEFAULT_POINT_STYLE,
  FOCUS_POINT_STYLE,
  CURVE_STYLE,
  DASHED_LINE_STYLE,
  SOLID_LINE_STYLE,
  HIGHLIGHT_LINE_STYLE,
} from './labColors';
