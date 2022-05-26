import {stringify as uuidStringify} from 'uuid';
import {Buffer} from 'buffer';

export function uuidToBytes(uuid: string): Buffer {
  return Buffer.from(uuid.replace(/-/g, ''), 'hex');
}

export function bytesToUuid(uuid: Buffer): string {
  return uuidStringify(uuid);
}

export function hexToAsciiUuid(uuid: Buffer): Buffer {
  return Buffer.from(uuidStringify(uuid), 'ascii');
}
