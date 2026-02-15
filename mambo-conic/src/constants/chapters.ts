export interface ChapterMeta {
  id: string;
  title: string;
  description: string;
  startScene: string;
  locked: boolean;
  scenePrefix: string;
}

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'chapter01',
    title: '第一章：探秘圆锥曲线的由来',
    description: '椭圆从哪来？用平面切圆锥，亲手发现椭圆、抛物线和双曲线！',
    startScene: 'ch01_s01_welcome',
    locked: false,
    scenePrefix: 'ch01_',
  },
  {
    id: 'chapter02',
    title: '第二章：椭圆定义与数学严谨性探究',
    description: '从实验中发现椭圆的秘密，用严谨的逻辑推导出完美定义！',
    startScene: 'ch02_s01_logic',
    locked: false,
    scenePrefix: 'ch02_',
  },
  {
    id: 'chapter03',
    title: '第三章：代数之美——椭圆标准方程的构建',
    description: '从几何定义出发，用坐标法推导出椭圆标准方程，感受代数与几何的完美融合！',
    startScene: 'ch03_s01_intro',
    locked: false,
    scenePrefix: 'ch03_',
  },
];

export function getChapterBySceneId(sceneId: string): ChapterMeta | undefined {
  return CHAPTERS.find((chapter) => sceneId.startsWith(chapter.scenePrefix));
}
