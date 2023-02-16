import {ReactElement} from 'react';
import {render, RenderOptions} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

type CustomRenderType = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => ReturnType<typeof render>;

const customRender: CustomRenderType = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, {...options});

export * from '@testing-library/react';
export {customRender as render};
