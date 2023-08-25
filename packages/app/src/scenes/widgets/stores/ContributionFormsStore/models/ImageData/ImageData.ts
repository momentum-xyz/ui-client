import {Instance, types} from 'mobx-state-tree';

const ImageData = types.model('ImageData', {
  file: types.maybeNull(types.frozen<File>()),
  fileUrlOrHash: types.maybeNull(types.string)
});

export interface ImageDataModelInterface extends Instance<typeof ImageData> {}

export {ImageData};
