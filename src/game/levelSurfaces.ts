import type { EnemyTheme, Platform } from './types';

const shelf = (x: number, y: number, w: number): Platform => (
  { x, y, w, h: 16, scenery: 'wood', dropThrough: true }
);

const surfaces: Record<EnemyTheme, Platform[]> = {
  bedroom: [
    shelf(0, 445, 355), shelf(335, 420, 225), shelf(545, 415, 430),
    shelf(0, 360, 285), shelf(300, 345, 190), shelf(585, 350, 350),
    shelf(0, 280, 385), shelf(405, 275, 210), shelf(625, 285, 350),
    shelf(0, 198, 390), shelf(400, 205, 315), shelf(700, 198, 300),
    shelf(115, 95, 370), shelf(675, 100, 250),
  ],
  greenhouse: [
    shelf(0, 475, 275), shelf(675, 465, 325), shelf(45, 405, 170),
    shelf(735, 395, 265), shelf(0, 325, 130), shelf(820, 310, 180),
    shelf(150, 520, 155), shelf(580, 525, 180),
  ],
  clockwork: [
    shelf(0, 435, 165), shelf(100, 375, 175), shelf(205, 305, 195),
    shelf(300, 245, 170), shelf(420, 355, 140), shelf(565, 430, 120),
    shelf(630, 380, 110), shelf(690, 325, 110), shelf(750, 270, 110),
    shelf(810, 215, 110), shelf(865, 445, 135),
  ],
  studio: [
    shelf(0, 435, 250), shelf(255, 405, 145), shelf(390, 405, 255),
    shelf(650, 435, 195), shelf(830, 410, 170), shelf(55, 330, 190),
    shelf(205, 275, 175), shelf(720, 310, 165), shelf(825, 250, 175),
    shelf(0, 245, 125), shelf(450, 505, 145),
  ],
  theatre: [
    shelf(0, 475, 180), shelf(150, 420, 145), shelf(290, 500, 180),
    shelf(530, 500, 170), shelf(760, 460, 240), shelf(40, 350, 150),
    shelf(220, 320, 160), shelf(605, 305, 150), shelf(810, 340, 190),
    shelf(390, 235, 180),
  ],
  storm: [
    shelf(0, 455, 265), shelf(250, 445, 175), shelf(435, 430, 160),
    shelf(590, 445, 155), shelf(745, 470, 255), shelf(25, 340, 175),
    shelf(180, 290, 155), shelf(670, 320, 150), shelf(820, 300, 180),
    shelf(385, 355, 190),
  ],
  workshop: [
    shelf(0, 420, 175), shelf(150, 375, 175), shelf(305, 335, 180),
    shelf(470, 295, 220), shelf(675, 345, 165), shelf(820, 410, 180),
    shelf(45, 500, 150), shelf(225, 485, 140), shelf(730, 500, 145),
    shelf(520, 245, 250),
  ],
  attic: [
    shelf(0, 400, 335), shelf(300, 355, 390), shelf(690, 400, 310),
    shelf(45, 305, 190), shelf(215, 275, 155), shelf(720, 300, 200),
    shelf(810, 225, 190), shelf(530, 485, 125), shelf(120, 500, 130),
  ],
  dream: [
    shelf(0, 405, 300), shelf(335, 410, 285), shelf(620, 415, 380),
    shelf(40, 305, 190), shelf(760, 300, 205), shelf(180, 500, 140),
    shelf(680, 505, 155), shelf(430, 315, 145),
  ],
};

export function getLevelSurfaces(theme: EnemyTheme) {
  return surfaces[theme].map((platform) => ({ ...platform }));
}
