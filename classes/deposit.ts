import { ethers } from 'ethers';
import { poseidonHash } from '../util';

export class Deposit {
  private constructor(
    public readonly nullifier: Uint8Array,
    public readonly secret: Uint8Array,
    public poseidon: any
  ) {
    this.poseidon = poseidon;
  }

  static new(nullifier: Uint8Array, secret: Uint8Array, poseidon: any) {
    return new this(nullifier, secret, poseidon);
  }

  get commitment(): string {
    return poseidonHash(this.poseidon, [this.nullifier, this.secret]);
  }

  get nullifierHash() {
    return poseidonHash(this.poseidon, [this.nullifier, 17]);
  }
}
