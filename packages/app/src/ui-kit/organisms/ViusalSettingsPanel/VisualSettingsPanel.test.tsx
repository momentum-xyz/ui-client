import React from 'react';

import {render} from 'ui-kit/utils/test.utils';

import VisualSettingsPanel from './VisualSettingsPanel';

describe('VisualSettingsPanel', () => {
  test('renders', () => {
    const navigationBar = render(
      <VisualSettingsPanel onAccentColorSelect={() => {}} onBackgroundColorSelect={() => {}} />
    );

    expect(navigationBar.baseElement).not.toBeNull();
  });
});
