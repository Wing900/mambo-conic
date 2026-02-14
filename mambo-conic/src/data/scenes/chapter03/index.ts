import part1 from './part1.json';
import part2 from './part2.json';
import part3 from './part3.json';
import part4 from './part4.json';
import type { ChapterData } from '../../../types/scene.types';

const chapter03: ChapterData = {
  chapter: part1.chapter,
  scenes: [
    ...part1.scenes,
    ...part2.scenes,
    ...part3.scenes,
    ...part4.scenes,
  ] as ChapterData['scenes'],
};

export default chapter03;
