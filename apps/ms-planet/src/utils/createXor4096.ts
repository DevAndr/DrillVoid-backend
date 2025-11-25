import { hashString } from './hashString';

export const createXor4096 = (seed: string | number): (() => number) => {
  let state = typeof seed === 'string' ? hashString(seed) : seed >>> 0;

  return function rng(): number {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
};
