import {ThemeStore} from './ThemeStore';

describe('ThemeStore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is initial colors', () => {
    const store = ThemeStore.create();

    expect(store.theme.bg).not.toBeNull();
    expect(store.theme.text).not.toBeNull();
  });
});

export {};
