import {OdysseyFeedInterface} from './ExploreStore';

export const ODYSSEY_FEED: OdysseyFeedInterface[] = [
  {
    id: 1,
    collectionId: 1,
    name: '',
    description: '',
    image: 'https://picsum.photos/100',
    date: '',
    type: 'created'
  },
  {
    id: 2,
    collectionId: 1,
    name: '',
    description: '',
    image: 'https://picsum.photos/100',
    date: '',
    type: 'created'
  },
  {
    id: 3,
    collectionId: 1,
    name: '',
    description: '',
    image: 'https://picsum.photos/100',
    date: '',
    type: 'connected',
    connectedTo: {
      id: 4,
      collectionId: 1,
      name: '',
      description: '',
      image: 'https://picsum.photos/100',
      date: '',
      type: 'docked'
    }
  },
  {
    id: 1,
    collectionId: 1,
    name: '',
    description: '',
    image: 'https://picsum.photos/100',
    date: '',
    type: 'docked',
    dockedTo: ''
  }
];
