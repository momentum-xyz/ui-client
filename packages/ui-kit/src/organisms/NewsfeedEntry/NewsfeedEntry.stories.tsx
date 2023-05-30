import {ComponentMeta, Story} from '@storybook/react';
import {NewsfeedTypeEnum} from '@momentum-xyz/core';

import NewsfeedEntry, {NewsfeedEntryPropsInterface, NewsfeedEntryInterface} from './NewsfeedEntry';

export default {
  title: 'Organisms/NewsfeedEntry',
  component: NewsfeedEntry,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [(Story) => <Story />]
} as ComponentMeta<typeof NewsfeedEntry>;

const textEntries: NewsfeedEntryInterface[] = [
  {
    id: '1',
    author_id: 'user_1',
    author_name: 'John Doe',
    author_avatar: 'https://picsum.photos/201',
    universal: true,
    entry_type: NewsfeedTypeEnum.CREATED,
    created_at: new Date().toDateString(),
    data: {
      world_id: 'odyssey_world_1',
      world_name: 'Odyssey World 1',
      world_image: 'https://picsum.photos/301',
      user_name: 'John Doe',
      amount: null
    }
  },
  {
    id: '2',
    author_id: 'user_2',
    author_name: 'John Doe',
    author_avatar: 'https://picsum.photos/202',
    universal: true,
    entry_type: NewsfeedTypeEnum.BOOST,
    created_at: new Date().toDateString(),
    data: {
      world_id: 'odyssey_world_1',
      world_name: 'Odyssey World 1',
      world_image: 'https://picsum.photos/302',
      user_name: 'Booster man',
      amount: 100
    }
  }
];

const imageEntries: NewsfeedEntryInterface[] = [
  {
    id: '3',
    author_id: 'user_3',
    author_name: 'Jane Doe',
    author_avatar: 'https://picsum.photos/203',
    universal: true,
    entry_type: NewsfeedTypeEnum.IMAGE,
    created_at: new Date().toDateString(),
    data: {
      world_id: 'odyssey_world_1',
      image: 'https://picsum.photos/303',
      video: null,
      comment: null
    }
  },
  {
    id: '4',
    author_id: 'user_4',
    author_name: 'John Doe',
    author_avatar: 'https://picsum.photos/204',
    universal: true,
    entry_type: NewsfeedTypeEnum.IMAGE,
    created_at: new Date().toDateString(),
    data: {
      world_id: 'odyssey_world_1',
      image: 'https://picsum.photos/303',
      video: null,
      comment: 'Lorem ipsum dolor sit amet.'
    }
  },
  {
    id: '5',
    author_id: 'user_5',
    author_name: 'John Doe',
    author_avatar: 'https://picsum.photos/203',
    universal: false,
    entry_type: NewsfeedTypeEnum.IMAGE,
    created_at: new Date().toDateString(),
    data: {
      world_id: null,
      image: 'https://picsum.photos/303',
      video: null,
      comment: null
    }
  }
];

const videoEntries: NewsfeedEntryInterface[] = [
  {
    id: '3',
    author_id: 'user_3',
    author_name: 'Jane Doe',
    author_avatar: 'https://picsum.photos/203',
    universal: true,
    entry_type: NewsfeedTypeEnum.VIDEO,
    created_at: new Date().toDateString(),
    data: {
      world_id: 'odyssey_world_1',
      image: null,
      video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      comment: null
    }
  },
  {
    id: '4',
    author_id: 'user_4',
    author_name: 'John Doe',
    author_avatar: 'https://picsum.photos/204',
    universal: true,
    entry_type: NewsfeedTypeEnum.VIDEO,
    created_at: new Date().toDateString(),
    data: {
      world_id: 'odyssey_world_1',
      image: null,
      video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      comment: 'Lorem ipsum dolor sit amet.'
    }
  },
  {
    id: '5',
    author_id: 'user_5',
    author_name: 'John Doe',
    author_avatar: 'https://picsum.photos/203',
    universal: false,
    entry_type: NewsfeedTypeEnum.VIDEO,
    created_at: new Date().toDateString(),
    data: {
      world_id: null,
      image: null,
      video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      comment: null
    }
  }
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Template: Story<NewsfeedEntryPropsInterface> = (args) => {
  return <NewsfeedEntry {...args} onWorldOpen={() => {}} />;
};

export const General = Template.bind({});
General.args = {
  entry: textEntries[0]
};

export const CreatedEntry = Template.bind({});
CreatedEntry.args = {
  entry: textEntries[0]
};
export const BoostEntry = Template.bind({});
BoostEntry.args = {
  entry: textEntries[1]
};

export const ImageEntry = Template.bind({});
ImageEntry.args = {
  entry: imageEntries[0]
};
export const ImageCommentEntry = Template.bind({});
ImageCommentEntry.args = {
  entry: imageEntries[1]
};
export const ImageNoWorldEntry = Template.bind({});
ImageNoWorldEntry.args = {
  entry: imageEntries[2]
};

export const VideoEntry = Template.bind({});
VideoEntry.args = {
  entry: videoEntries[0]
};
export const VideoCommentEntry = Template.bind({});
VideoCommentEntry.args = {
  entry: videoEntries[0]
};
export const VideoNoWorldEntry = Template.bind({});
VideoNoWorldEntry.args = {
  entry: videoEntries[0]
};
