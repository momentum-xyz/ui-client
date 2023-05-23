import '@babylonjs/loaders/glTF/2.0/glTFLoader';
import '@babylonjs/loaders/glTF/2.0/Extensions/index';
import {DracoCompression, MeshoptCompression} from '@babylonjs/core';

// TODO: Bundle and serve these ourself.
const DRACO_CDN = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';
DracoCompression.Configuration.decoder = {
  wasmUrl: DRACO_CDN + 'draco_wasm_wrapper_gltf.js',
  wasmBinaryUrl: DRACO_CDN + 'draco_decoder_gltf.wasm',
  fallbackUrl: DRACO_CDN + 'draco_decoder_gltf.js'
};
MeshoptCompression.Configuration.decoder = {
  url: new URL('meshoptimizer/meshopt_decoder.js', import.meta.url).toString()
};
