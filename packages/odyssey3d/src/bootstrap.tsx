import {createRoot} from 'react-dom/client';

import App from './Emulator';

export * from './scenes';

const container = document.getElementById('babylonContainer');
const root = createRoot(container!);

root.render(<App />);
