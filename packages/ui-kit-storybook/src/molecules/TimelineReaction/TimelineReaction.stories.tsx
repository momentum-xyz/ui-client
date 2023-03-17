import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import TimelineReaction, {TimelineReactionPropsInterface} from './TimelineReaction';
import {ReactionInterface} from './TimelineReaction';

const IMAGE_SRC = 'https://picsum.photos/300';
const REACTION_LIST: ReactionInterface[] = [
  {
    id: new Date().toISOString(),
    imageSrc: 'https://picsum.photos/300',
    value: 'This is awesome! Great design, great performance, I’ll join next time'
  }
];

export default {
  title: 'Molecules/TimelineReaction',
  component: TimelineReaction,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof TimelineReaction>;

const Template: Story<TimelineReactionPropsInterface> = (args) => {
  const [list, setList] = useState<ReactionInterface[]>(REACTION_LIST);

  return (
    <TimelineReaction
      {...args}
      list={list}
      onCreate={(value) => {
        if (value) {
          setList([{id: new Date().toISOString(), imageSrc: IMAGE_SRC, value}, ...list]);
        }
      }}
    />
  );
};

export const General = Template.bind({});
General.args = {
  userImageSrc: IMAGE_SRC
};

export const Readonly = Template.bind({});
Readonly.args = {
  isReadonly: true
};
