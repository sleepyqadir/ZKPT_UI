import { ethers } from 'ethers';
import { poseidonHash } from '../util';

export class Deposit {
  private constructor(
    public readonly nullifier: Uint8Array,
    public readonly secret: Uint8Array,
    public readonly guess: number,
    public poseidon: any
  ) {
    this.poseidon = poseidon;
  }

  static new(
    nullifier: Uint8Array,
    secret: Uint8Array,
    guess: number,
    poseidon: any
  ) {
    return new this(nullifier, secret, guess, poseidon);
  }

  get commitment(): string {
    return poseidonHash(this.poseidon, [
      this.nullifier,
      this.secret,
      this.guess,
    ]);
  }

  get nullifierHash() {
    return poseidonHash(this.poseidon, [this.nullifier, 17]);
  }
}
