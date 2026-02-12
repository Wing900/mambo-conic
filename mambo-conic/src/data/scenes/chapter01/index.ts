import part1 from './part1.json';
import part2 from './part2.json';
import part3 from './part3.json';
import type { ChapterData } from '../../../types/scene.types';

const chapter01: ChapterData = {
  chapter: part1.chapter,
  scenes: [
    ...part1.scenes,
    ...part2.scenes,
    ...part3.scenes,
  ] as ChapterData['scenes'],
};

export default chapter01;
