/* eslint-disable */
// @ts-nocheck
import {gl} from '../gl.js';

export class Attributes {
  array = [];
  stride;
  formats;

  static typeStride(type) {
    switch (type) {
      default:
      case gl.FLOAT:
      case gl.UNSIGNED_INT:
        return 4;
      case gl.UNSIGNED_SHORT:
        return 2;
      case gl.UNSIGNED_BYTE:
        return 1;
    }
  }

  constructor(formats) {
    this.stride = formats.length;
    this.formats = formats;
  }

  get byteStride() {
    let stride = 0;

    for (let format = 0, formatCount = this.formats.length; format < formatCount; ++format)
      stride += Attributes.typeStride(this.formats[format]);

    return stride;
  }

  get count() {
    return this.array.length / this.stride;
  }

  format() {
    const buffer = new ArrayBuffer((this.byteStride * this.array.length) / this.stride);
    const view = new DataView(buffer);
    let byte = 0;

    for (let index = 0, indices = this.array.length; index < indices; index += this.stride) {
      for (let element = 0; element < this.stride; ++element) {
        switch (this.formats[element]) {
          case gl.FLOAT:
            view.setFloat32(byte, this.array[index + element], true);

            break;
          case gl.UNSIGNED_INT:
            view.setUint32(byte, this.array[index + element], true);

            break;
          case gl.UNSIGNED_SHORT:
            view.setUint16(byte, this.array[index + element], true);

            break;
          case gl.UNSIGNED_BYTE:
            view.setUint8(byte, this.array[index + element]);

            break;
        }

        byte += Attributes.typeStride(this.formats[element]);
      }
    }

    return buffer;
  }
}
