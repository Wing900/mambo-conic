import type { MamboExpression } from '../types/mambo.types';

export const MAMBO_EXPRESSION_IMAGES: Record<MamboExpression, string> = {
  normal: '/images/mambo_normal.png',
  happy: '/images/mambo_happy.png',
  sad: '/images/mambo_sad.png',
  thinking: '/images/mambo_thinking.png',
  excited: '/images/mambo_excited.png',
  surprised: '/images/mambo_surprised.png',
};

export const MAMBO_IMAGE_URLS: string[] = Array.from(
  new Set(Object.values(MAMBO_EXPRESSION_IMAGES))
);
