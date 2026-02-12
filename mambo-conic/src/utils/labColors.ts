/**
 * 数学实验颜色配置
 * 与主题色保持一致的配色方案
 */

/**
 * 实验背景色
 */
export const LAB_COLORS = {
  // 背景色
  bg: '#FFFBF5',

  // 坐标轴颜色
  axis: '#8B7355',
  grid: '#D4C4A8',

  // 曲线颜色
  curve: '#5D4E37',
  curveSecondary: '#8B7355',
  curveAccent: '#E07A5F',

  // 点的颜色
  point: '#FFE4E1',
  pointStroke: '#5D4E37',
  pointFocus: '#FFAB91',
  pointFocusStroke: '#FF6F00',

  // 线段颜色
  line: '#8B7355',
  lineDashed: '#B8A88A',
  lineHighlight: '#E07A5F',

  // 文字颜色
  text: '#5D4E37',
  textSecondary: '#8B7355',
  textAccent: '#E07A5F',

  // 填充颜色
  fill: '#FFF9E6',
  fillHighlight: '#FFE4E1',
} as const;

/**
 * 默认点样式配置
 */
export const DEFAULT_POINT_STYLE = {
  size: 4,
  fillColor: LAB_COLORS.point,
  strokeColor: LAB_COLORS.pointStroke,
  strokeWidth: 2,
  fixed: false,
} as const;

/**
 * 焦点点样式配置
 */
export const FOCUS_POINT_STYLE = {
  size: 4,
  fillColor: LAB_COLORS.pointFocus,
  strokeColor: LAB_COLORS.pointFocusStroke,
  strokeWidth: 2,
  fixed: false,
} as const;

/**
 * 曲线样式配置
 */
export const CURVE_STYLE = {
  strokeColor: LAB_COLORS.curve,
  strokeWidth: 2,
  fillColor: LAB_COLORS.fill,
  fillOpacity: 0.1,
  highlight: false,
} as const;

/**
 * 虚线样式配置
 */
export const DASHED_LINE_STYLE = {
  strokeColor: LAB_COLORS.lineDashed,
  strokeWidth: 1,
  dash: 2,
  highlight: false,
} as const;

/**
 * 实线样式配置
 */
export const SOLID_LINE_STYLE = {
  strokeColor: LAB_COLORS.line,
  strokeWidth: 2,
  highlight: false,
} as const;

/**
 * 高亮线段样式配置
 */
export const HIGHLIGHT_LINE_STYLE = {
  strokeColor: LAB_COLORS.lineHighlight,
  strokeWidth: 2,
  highlight: false,
} as const;
