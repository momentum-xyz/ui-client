import {ThemeStore} from './ThemeStore';

describe('ThemeStore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is initial colors', () => {
    const store = ThemeStore.create();

    expect(store.theme.bg).not.toBeNull();
    expect(store.theme.text).not.toBeNull();
    expect(store.theme.accent).not.toBeNull();
  });

  it('is changed colors', () => {
    const store = ThemeStore.create();

    store.changeBackgroundColor('#1');
    store.changeAccentColor('#2');
    store.changeTextColor('#3');

    expect(store.theme.bg).toBe('#1');
    expect(store.theme.accent).toBe('#2');
    expect(store.theme.text).toBe('#3');
  });
});

export {};
