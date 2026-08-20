import { ladderRungs, shelf, solidObject } from './surfaceFactory';
import type { EnemyTheme, Platform } from './types';

export const physicalSurfaces: Record<EnemyTheme, Platform[]> = {
  bedroom: [
    shelf(0, 486, 368), ...ladderRungs(918, 451, 55, 34, 4),
    solidObject(374, 483, 84, 107), solidObject(458, 488, 155, 102),
  ],
  greenhouse: [
    shelf(0, 432, 340), shelf(0, 381, 48), shelf(50, 396, 52),
    shelf(105, 380, 48), shelf(155, 404, 58), shelf(500, 432, 58),
    shelf(650, 334, 70), shelf(650, 371, 70), shelf(710, 435, 250),
    shelf(728, 407, 45), shelf(785, 396, 48), shelf(846, 380, 52),
  ],
  clockwork: [
    shelf(0, 427, 215), shelf(214, 287, 262), ...ladderRungs(188, 300, 43, 32, 6),
    shelf(610, 470, 55), shelf(640, 444, 55), shelf(670, 418, 55),
    shelf(700, 392, 55), shelf(730, 366, 55), shelf(760, 340, 55),
    shelf(790, 314, 55), shelf(820, 288, 55), shelf(850, 262, 150),
    shelf(0, 500, 72), shelf(875, 475, 125),
  ],
  studio: [
    shelf(104, 66, 108), shelf(102, 174, 125), shelf(98, 286, 145),
    shelf(102, 339, 145), shelf(220, 420, 105), shelf(346, 410, 360),
    shelf(687, 383, 148), shelf(915, 356, 85), shelf(0, 402, 86),
    shelf(0, 410, 72), solidObject(835, 420, 80, 170),
  ],
  theatre: [
    shelf(0, 450, 90), shelf(40, 385, 135), shelf(76, 333, 120),
    ...ladderRungs(135, 325, 62, 35, 5),
    shelf(675, 466, 105), shelf(770, 432, 92), shelf(860, 450, 90),
    shelf(930, 493, 70), shelf(0, 478, 55), shelf(865, 460, 95),
  ],
  storm: [
    shelf(0, 420, 182), shelf(205, 420, 188), shelf(395, 455, 218),
    shelf(690, 462, 165), shelf(850, 430, 150), shelf(580, 300, 72),
    shelf(710, 286, 112), shelf(0, 430, 150),
    solidObject(210, 430, 160, 160), solidObject(735, 470, 120, 120),
  ],
  workshop: [
    shelf(0, 272, 348), shelf(0, 322, 135), shelf(135, 386, 145),
    shelf(280, 335, 160), shelf(452, 283, 415), shelf(715, 337, 285),
    shelf(0, 410, 122), shelf(865, 258, 135),
    shelf(0, 420, 120), shelf(865, 270, 135),
  ],
  attic: [
    shelf(0, 312, 320), ...ladderRungs(58, 326, 68, 31, 5),
    shelf(288, 348, 380), shelf(645, 308, 88), shelf(720, 284, 280),
    shelf(0, 410, 92), solidObject(642, 315, 70, 105), shelf(875, 383, 125),
  ],
  dream: [
    shelf(0, 380, 285), shelf(298, 415, 355), shelf(720, 388, 280),
    shelf(812, 244, 155), shelf(808, 311, 160), shelf(900, 505, 100),
    shelf(0, 335, 85), shelf(90, 318, 52), shelf(150, 300, 55),
    shelf(0, 390, 255), shelf(900, 515, 100),
  ],
};
