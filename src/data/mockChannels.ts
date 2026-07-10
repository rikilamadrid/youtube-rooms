import type { SubscriptionChannel } from '../types/channel';

/**
 * Cross-referenced by id from mockRooms.ts (Room.channelIds) and
 * mockVideos.ts (VideoSummary.channelId). Keep ids stable.
 */
export const mockChannels: SubscriptionChannel[] = [
  {
    id: 'channel-fireship',
    youtubeChannelId: 'UCsBjURrPoezykLs9EqgamOA',
    title: 'Fireship',
    description: 'High-intensity code tutorials and tech news, delivered fast.',
    thumbnailUrl: 'https://picsum.photos/seed/fireship/200/200',
    topicTags: ['coding', 'web-dev', 'javascript'],
    isMock: true,
  },
  {
    id: 'channel-theprimeagen',
    youtubeChannelId: 'UC8ENHE5xdFSwx71u3fDH5Xw',
    title: 'ThePrimeagen',
    description: 'Vim, terminal workflows, and unfiltered takes on software engineering.',
    thumbnailUrl: 'https://picsum.photos/seed/primeagen/200/200',
    topicTags: ['coding', 'vim', 'career'],
    isMock: true,
  },
  {
    id: 'channel-bon-appetit',
    youtubeChannelId: 'UCbpMy0Fg74eXXkvxJrtEn3w',
    title: 'Bon Appétit',
    description: 'Test Kitchen chefs cooking, baking, and taste-testing everything.',
    thumbnailUrl: 'https://picsum.photos/seed/bonappetit/200/200',
    topicTags: ['cooking', 'baking'],
    isMock: true,
  },
  {
    id: 'channel-joshua-weissman',
    youtubeChannelId: 'UChBEbMKI1eCcejTtmI32UEw',
    title: 'Joshua Weissman',
    description: 'A professional chef makes fast food, fancy food, and everything between.',
    thumbnailUrl: 'https://picsum.photos/seed/joshuaweissman/200/200',
    topicTags: ['cooking', 'recipes'],
    isMock: true,
  },
  {
    id: 'channel-proko',
    youtubeChannelId: 'UCwHECY3JDsFdCUpJn0kJv3w',
    title: 'Proko',
    description: 'Figure drawing and anatomy lessons for artists at every level.',
    thumbnailUrl: 'https://picsum.photos/seed/proko/200/200',
    topicTags: ['sketching', 'anatomy', 'fundamentals'],
    isMock: true,
  },
  {
    id: 'channel-draw-with-jazza',
    youtubeChannelId: 'UC5UN2xLKAipEE0kFrJH8i5g',
    title: 'Draw with Jazza',
    description: 'Illustration challenges, character design, and art tutorials.',
    thumbnailUrl: 'https://picsum.photos/seed/jazza/200/200',
    topicTags: ['sketching', 'illustration'],
    isMock: true,
  },
  {
    id: 'channel-northernlion',
    youtubeChannelId: 'UCJTfz1LqRP2TTBg6DsN5X5Q',
    title: 'Northernlion',
    description: 'Roguelike runs, commentary, and a whole lot of Isaac.',
    thumbnailUrl: 'https://picsum.photos/seed/northernlion/200/200',
    topicTags: ['gaming', 'roguelike', 'lets-play'],
    isMock: true,
  },
  {
    id: 'channel-game-grumps',
    youtubeChannelId: 'UC9CuvdOVfMPvKCiwdGKL3cQ',
    title: 'Game Grumps',
    description: 'Two friends playing video games and yelling about it.',
    thumbnailUrl: 'https://picsum.photos/seed/gamegrumps/200/200',
    topicTags: ['gaming', 'lets-play', 'comedy'],
    isMock: true,
  },
  {
    id: 'channel-rick-beato',
    youtubeChannelId: 'UCJquYOG5EL82sKTfH9aMA9Q',
    title: 'Rick Beato',
    description: 'Deep dives into music theory, production, and what makes songs work.',
    thumbnailUrl: 'https://picsum.photos/seed/rickbeato/200/200',
    topicTags: ['music', 'theory', 'production'],
    isMock: true,
  },
  {
    id: 'channel-adam-neely',
    youtubeChannelId: 'UCbLj9QP9FAaHIC3O2gxao6Q',
    title: 'Adam Neely',
    // Edge case: subscribed channel with no recent videos in mockVideos.ts.
    description: 'Jazz bassist exploring music theory, internet drama, and everything between.',
    thumbnailUrl: 'https://picsum.photos/seed/adamneely/200/200',
    topicTags: ['music', 'theory', 'jazz'],
    isMock: true,
  },
];
