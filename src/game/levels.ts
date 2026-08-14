import { makeRoom } from './metroidvaniaLayouts';
import type { Level } from './types';

export const levels: Level[] = [{
  name: "Pip's Giant Bedroom",
  chapter: 'The whole room',
  accent: '#ffbd72',
  enemyTheme: 'bedroom',
  background: '/assets/giant-bedroom-map.png',
  hint: 'The furniture is the map. Look behind drawers and beneath the bed.',
  gimmick: 'Sleepy shadows guard the hidden routes.',
  ...makeRoom(),
}];
