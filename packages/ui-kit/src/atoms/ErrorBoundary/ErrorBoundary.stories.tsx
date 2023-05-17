import {ComponentMeta, Story} from '@storybook/react';

import ErrorBoundary, {ErrorBoundaryPropsInterface} from './ErrorBoundary';

export default {
  title: 'Atoms/ErrorBoundary',
  component: ErrorBoundary
} as ComponentMeta<typeof ErrorBoundary>;

const Template: Story<ErrorBoundaryPropsInterface> = (args) => {
  return (
    <div style={{marginTop: '50px'}}>
      <ErrorBoundary {...args}>
        <div style={{width: '100px', background: 'black', textAlign: 'center', color: 'white'}}>
          Div by zero: {1 / 0}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export const General = Template.bind({});
General.args = {
  errorMessage: 'Something went wrong.'
};
