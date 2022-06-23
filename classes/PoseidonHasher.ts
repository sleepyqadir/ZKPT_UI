import { poseidonHash } from '../util';

export class PoseidonHasher {
  poseidon: any;

  constructor(poseidon: any) {
    this.poseidon = poseidon;
  }

  hash(left: string, right: string) {
    return poseidonHash(this.poseidon, [left, right]);
  }
}
