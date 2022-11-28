import {NftItemInterface} from 'scenes/birthOfMe/stores/NftStore/models';

import {OdysseyFeedInterface, OdysseyItemInterface} from './ExploreStore';

export const ODYSSEY_FEED: OdysseyFeedInterface[] = [
  {
    id: 1,
    collectionId: 1,
    owner: '',
    name: 'Jeroenski',
    description: '',
    image: 'https://picsum.photos/100',
    date: '2022-11-25T08:05:48.447Z',
    type: 'created'
  },
  {
    id: 3,
    collectionId: 1,
    owner: '',
    name: 'Polkajor',
    description: '',
    image: 'https://picsum.photos/102',
    date: '2022-11-25T08:05:48.447Z',
    type: 'connected',
    connectedTo: {
      id: 4,
      collectionId: 1,
      owner: '',
      name: 'Space Odyssey',
      description: '',
      image: 'https://picsum.photos/104',
      date: '2022-11-25T08:05:48.447Z',
      type: 'connected'
    }
  },
  {
    id: 2,
    collectionId: 1,
    owner: '',
    name: 'Brandskari',
    description: '',
    image: 'https://picsum.photos/106',
    date: '2022-11-25T08:05:48.447Z',
    type: 'created'
  },
  {
    id: 5,
    collectionId: 1,
    owner: '',
    name: 'Kidachu',
    description: '',
    image: 'https://picsum.photos/108',
    date: '2022-11-25T08:05:48.447Z',
    type: 'docked',
    dockedTo: {
      id: 6,
      collectionId: 1,
      owner: '',
      name: 'Space Odyssey',
      description: '',
      image: 'https://picsum.photos/110',
      date: '2022-11-25T08:05:48.447Z',
      type: 'docked'
    }
  },
  {
    id: 6,
    collectionId: 1,
    owner: '',
    name: 'Jeroenski',
    description: '',
    image: 'https://picsum.photos/112',
    date: '2022-11-25T08:05:48.447Z',
    type: 'created'
  },
  {
    id: 7,
    collectionId: 1,
    owner: '',
    name: 'Polkajor',
    description: '',
    image: 'https://picsum.photos/114',
    date: '2022-11-25T08:05:48.447Z',
    type: 'connected',
    connectedTo: {
      id: 4,
      collectionId: 1,
      owner: '',
      name: 'Space Odyssey',
      description: '',
      image: 'https://picsum.photos/116',
      date: '2022-11-25T08:05:48.447Z',
      type: 'connected'
    }
  },
  {
    id: 8,
    collectionId: 1,
    owner: '',
    name: 'Brandskari',
    description: '',
    image: 'https://picsum.photos/118',
    date: '2022-11-25T08:05:48.447Z',
    type: 'created'
  },
  {
    id: 9,
    collectionId: 1,
    owner: '',
    name: 'Kidachu',
    description: '',
    image: 'https://picsum.photos/120',
    date: '2022-11-25T08:05:48.447Z',
    type: 'docked',
    dockedTo: {
      id: 6,
      collectionId: 1,
      owner: '',
      name: 'Space Odyssey',
      description: '',
      image: 'https://picsum.photos/122',
      date: '2022-11-25T08:05:48.447Z',
      type: 'docked'
    }
  },
  {
    id: 10,
    collectionId: 1,
    owner: '',
    name: 'Jeroenski',
    description: '',
    image: 'https://picsum.photos/124',
    date: '2022-11-25T08:05:48.447Z',
    type: 'created'
  },
  {
    id: 11,
    collectionId: 1,
    owner: '',
    name: 'Polkajor',
    description: '',
    image: 'https://picsum.photos/126',
    date: '2022-11-25T08:05:48.447Z',
    type: 'connected',
    connectedTo: {
      id: 4,
      collectionId: 1,
      owner: '',
      name: 'Space Odyssey',
      description: '',
      image: 'https://picsum.photos/128',
      date: '2022-11-25T08:05:48.447Z',
      type: 'connected'
    }
  },
  {
    id: 12,
    collectionId: 1,
    owner: '',
    name: 'Brandskari',
    description: '',
    image: 'https://picsum.photos/130',
    date: '2022-11-25T08:05:48.447Z',
    type: 'created'
  },
  {
    id: 13,
    collectionId: 1,
    owner: '',
    name: 'Kidachu 2',
    description: '',
    image: 'https://picsum.photos/132',
    date: '2022-11-25T08:05:48.447Z',
    type: 'docked',
    dockedTo: {
      id: 6,
      collectionId: 1,
      owner: '',
      name: 'Space Odyssey',
      description: '',
      image: 'https://picsum.photos/100',
      date: '2022-11-25T08:05:48.447Z',
      type: 'docked'
    }
  },
  {
    id: 14,
    collectionId: 1,
    owner: '',
    name: 'Brandskari',
    description: '',
    image: 'https://picsum.photos/102',
    date: '2022-11-25T08:05:48.447Z',
    type: 'created'
  },
  {
    id: 15,
    collectionId: 1,
    owner: '',
    name: 'Kidachu 2',
    description: '',
    image: 'https://picsum.photos/105',
    date: '2022-11-25T08:05:48.447Z',
    type: 'docked',
    dockedTo: {
      id: 6,
      collectionId: 1,
      owner: '',
      name: 'Space Odyssey',
      description: '',
      image: 'https://picsum.photos/107',
      date: '2022-11-25T08:05:48.447Z',
      type: 'docked'
    }
  }
];

export const ODYSSEY_ITEM: OdysseyItemInterface = {
  id: 1,
  collectionId: 1,
  owner: '',
  name: 'Kidachu',
  description:
    'Short user bio that the user fills in themselves. this can be a short bio or some funny words or what ever. Max ‘n’ amount of characters. We can Fit aprroxmiately 3 lines of text here.',
  image: 'https://picsum.photos/100',
  connections: 14,
  docking: 3,
  events: 4
};

export const ODYSSEY_LIST: NftItemInterface[] = [
  {
    id: 1,
    collectionId: 1,
    owner: '',
    name: 'Jeroenski',
    description: '',
    image: 'https://picsum.photos/100'
  },
  {
    id: 2,
    collectionId: 1,
    owner: '',
    name: 'Tsani',
    description: '',
    image: 'https://picsum.photos/100'
  },
  {
    id: 3,
    collectionId: 1,
    owner: '',
    name: 'Jorrit',
    description: '',
    image: 'https://picsum.photos/100'
  },
  {
    id: 4,
    collectionId: 1,
    owner: '',
    name: 'Kovi',
    description: '',
    image: 'https://picsum.photos/100'
  },
  {
    id: 5,
    collectionId: 1,
    owner: '',
    name: 'Amin',
    description: '',
    image: 'https://picsum.photos/100'
  },
  {
    id: 6,
    collectionId: 1,
    owner: '',
    name: 'Anton',
    description: '',
    image: 'https://picsum.photos/100'
  }
];
