import {Instance, types} from 'mobx-state-tree';

const ImageData = types.model('ImageData', {
  renderHash: ''
});

export interface ImageDataModelInterface extends Instance<typeof ImageData> {}

export {ImageData};
