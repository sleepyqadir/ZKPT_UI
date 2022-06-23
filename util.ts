import type { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { ethers, BigNumber } from 'ethers';
import { MerkleTree } from './classes/merkleTree';
import { PoseidonHasher } from './classes/PoseidonHasher';
import { Pool } from './contracts/types';
import path from 'path';
import getConfig from 'next/config';

import { Deposit } from './classes/deposit';
const circomlibjs = require('circomlibjs');
const snarkjs = require('snarkjs');

const serverPath = (staticFilePath: string) => {
  return path.join(
    getConfig().serverRuntimeConfig.PROJECT_ROOT,
    staticFilePath
  );
};

export function shortenHex(hex: string, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length
  )}`;
}

export const toHex = (number, length = 32) =>
  '0x' +
  (number instanceof Buffer
    ? number.toString('hex')
    : BigInt(number).toString(16)
  ).padStart(length * 2, '0');

const ETHERSCAN_PREFIXES = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
};

export const createDeposit = async (
  nullifier = ethers.utils.randomBytes(15)
) => {
  const poseidon = await circomlibjs.buildPoseidon();
  const deposit = Deposit.new(nullifier, poseidon);
  return deposit;
};

// TODO amount and networkId provided by the generateNote
// TODO add preimage functionality
export const generateNote = async (deposit: Deposit) => {
  const AMOUNT = '0.1';
  const netId = '5';

  // const preimage = Buffer.concat([deposit.nullifier]);
  // return `zkpt-eth-${AMOUNT}-${netId}-${toHex(preimage, 32)}`;
  return `zkpt-eth-${AMOUNT}-${netId}-0x${deposit.nullifier}`;
};

export const parseNote = async (noteString) => {
  const noteArray = noteString.split('0x');
  const noteRegex = /zkpt-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)/g;
  const match = noteRegex.exec(noteArray[0]);

  // we are ignoring `currency`, `amount`, and `netId` for this minimal example
  // const buf = Buffer.from(match.groups.note, 'hex');
  // console.log({ buf });
  // const nullifier = bigInt.leBuff2int(buf.slice(0, 31));
  const bytesArray = noteArray[1].split(',').map((x) => +x);
  const nullifier = new Uint8Array(bytesArray);
  return createDeposit(nullifier);
};

export const poseidonHash = (poseidon: any, inputs: BigNumberish[]) => {
  try {
    const hash = poseidon(inputs.map((x) => BigNumber.from(x).toBigInt()));
    // Make the number within the field size
    const hashStr = poseidon.F.toString(hash);
    // Make it a valid hex string
    const hashHex = BigNumber.from(hashStr).toHexString();
    // pad zero to make it 32 bytes, so that the output can be taken as a bytes32 contract argument
    const bytes32 = ethers.utils.hexZeroPad(hashHex, 32);
    return bytes32;
  } catch (err) {
    console.log('errrrr in poseidonHash ====>??', err);
  }
};

const generateMerkleProof = async (deposit, contract: Pool) => {
  console.log('Getting contract state...');
  const eventFilter = contract.filters.Deposit();
  const events = await contract.queryFilter(eventFilter, 0, 'latest');
  const poseidon = await circomlibjs.buildPoseidon();
  const tree = new MerkleTree(20, 'test', new PoseidonHasher(poseidon));

  const leaves = events
    .sort((a, b) => a.args.leafIndex - b.args.leafIndex) // Sort events in chronological order
    .map((e) => e.args.commitment);

  for (const iterator of leaves) {
    await tree.insert(iterator);
  }

  // Find current commitment in the tree
  const depositEvent = events.find(
    (e) => e.args.commitment === deposit.commitment
  );

  const leafIndex = depositEvent ? depositEvent.args.leafIndex : -1;
  // TODO error prompts on already used nullifier and
  // Validate that our data is correct (optional)
  const { root, path_elements, path_index } = await tree.path(leafIndex);
  // const isValidRoot = await contract.isKnownRoot(root);

  // const isSpent = await contract.isSpent(deposit.nullifierHash);
  // assert(isValidRoot === true, "Merkle tree is corrupted");
  // assert(isSpent === false, "The note is already spent");
  // assert(leafIndex >= 0, "The deposit is not found in the tree");

  // Compute merkle proof of our commitment
  return { path_elements, path_index, root };
};

export function formatEtherscanLink(
  type: 'Account' | 'Transaction',
  data: [number, string]
) {
  switch (type) {
    case 'Account': {
      const [chainId, address] = data;
      return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/address/${address}`;
    }
    case 'Transaction': {
      const [chainId, hash] = data;
      return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/tx/${hash}`;
    }
  }
}

export const parseBalance = (
  value: BigNumberish,
  decimals = 18,
  decimalsToDisplay = 3
) => parseFloat(formatUnits(value, decimals)).toFixed(decimalsToDisplay);

export const depositEth = async (deposit: Deposit, contract: Pool) => {
  console.log('Sending deposit transaction...');
  const commitment = deposit.commitment;
  const nullifierHash = deposit.nullifierHash;
  // @ts-ignore
  const tx = await contract.deposit(commitment, nullifierHash, {
    value: ethers.utils.parseEther('1'),
  });
  const txReceipt = await tx.wait();
  console.log(`https://rinkeby.etherscan.io/tx/${txReceipt.transactionHash}`);
};

export const withdraw = async (note, recipient, contract: Pool) => {
  const deposit = await parseNote(note);
  console.log('deposit created ====>', { deposit });
  const relayer = new ethers.Wallet(
    '0x78b62bbad5c89e71f2d5609ce4b3f829e55239056d7ab9b9836e03faf5a552ef'
  );
  const { proof, args } = await generateSnarkProof(
    deposit,
    recipient,
    contract,
    relayer.address
  );
  console.log('Sending withdrawal transaction...');
  console.log({ proof, args });

  console.log({ relayer });
  const tx = await contract.withdraw(proof, ...args, {});
  const txReciept = await tx.wait();
  console.log(`https://rinkeby.etherscan.io/tx/${txReciept.transactionHash}`);
};

interface Proof {
  a: [BigNumberish, BigNumberish];
  b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]];
  c: [BigNumberish, BigNumberish];
}

export const prove = async (witness: any): Promise<Proof> => {
  let wasmPath = '/withdraw.wasm';
  let zkeyPath = '/circuit_final.zkey';
  if (typeof window === 'undefined') {
    wasmPath = serverPath(`/public${wasmPath}`);
    zkeyPath = serverPath(`/public${zkeyPath}`);
  }
  const { proof } = await snarkjs.groth16.fullProve(
    witness,
    wasmPath,
    zkeyPath
  );
  const solProof: Proof = {
    a: [proof.pi_a[0], proof.pi_a[1]],
    b: [
      [proof.pi_b[0][1], proof.pi_b[0][0]],
      [proof.pi_b[1][1], proof.pi_b[1][0]],
    ],
    c: [proof.pi_c[0], proof.pi_c[1]],
  };
  return solProof;
};

const generateSnarkProof = async (
  deposit: Deposit,
  recipient,
  contract: Pool,
  relayer
) => {
  // Compute merkle proof of our commitment
  const { root, path_elements, path_index } = await generateMerkleProof(
    deposit,
    contract
  );

  const witness = {
    // Public
    root,
    nullifierHash: deposit.nullifierHash,
    recipient: recipient,
    relayer,
    fee: 0,
    secret: 1,
    // Private
    nullifier: BigNumber.from(deposit.nullifier).toBigInt(),
    pathElements: path_elements,
    pathIndices: path_index,
  };

  const solidityProof = await prove(witness);

  const args = [
    witness.root,
    witness.nullifierHash,
    witness.recipient,
    witness.relayer,
    witness.fee,
  ];

  return { proof: solidityProof, args };
};
