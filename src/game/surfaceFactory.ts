import type { Platform } from './types';

export const shelf = (x: number, y: number, w: number): Platform => (
  { x, y, w, h: 16, scenery: 'wood', dropThrough: true }
);

export const solidObject = (x: number, y: number, w: number, h: number): Platform => (
  { x, y, w, h, scenery: 'wood', dropThrough: false }
);

export function ladderRungs(
  x: number,
  firstY: number,
  width: number,
  gap: number,
  count: number,
) {
  return Array.from({ length: count }, (_, index) => shelf(
    x - index * 2,
    firstY + index * gap,
    width + index * 4,
  ));
}
