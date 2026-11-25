// The two pills: where they sit in the portrait and what each one opens.
// Positions and sizes are in the photo file's own pixels (1100 x 1422).
export const PHOTO = { width: 1100, height: 1422 };

// How much of the photo's height the v2 hero shows: down to just below the hands.
export const CROP = 0.935;

export const PILLS = {
  blue: {
    colour: 'Blue',
    side: 'Designer',
    x: 246,
    y: 1149,
    cta: 'See the design work',
    href: '/work?show=design',
  },
  red: {
    colour: 'Red',
    side: 'Developer',
    x: 858,
    y: 1139.5,
    cta: 'See the development work',
    href: '/work?show=development',
  },
};

// The box drawn round the head in the design view (photo pixels).
export const HEAD_BOX = { x: 366, y: 12, width: 380, height: 505 };

// photo pixels -> percentages of the cropped frame
export const across = (px) => `${(px / PHOTO.width) * 100}%`;
export const down = (px) => `${(px / (PHOTO.height * CROP)) * 100}%`;
