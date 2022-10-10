/// <reference types="react-scripts" />

declare const miroBoardsPicker: {
  open: (options: {
    action: string;
    clientId: string;
    success: (data: MiroBoardInterface) => Promise<void>;
  }) => void;
};
