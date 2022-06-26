import { ethers } from 'ethers';
import { poseidonHash } from '../util';

export class Deposit {
  private constructor(
    public readonly nullifier: Uint8Array,
    public poseidon: any
  ) {
    this.poseidon = poseidon;
  }

  static new(nullifier: Uint8Array, poseidon: any) {
    return new this(nullifier, poseidon);
  }

  get commitment(): string {
    return poseidonHash(this.poseidon, [this.nullifier, 0]);
  }

  get nullifierHash() {
    return poseidonHash(this.poseidon, [this.nullifier, 17]);
  }
}
