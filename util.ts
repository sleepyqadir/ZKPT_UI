import type { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { ethers, BigNumber } from 'ethers';
import { MerkleTree } from './classes/merkleTree';
import { PoseidonHasher } from './classes/PoseidonHasher';
import path from 'path';
import getConfig from 'next/config';
import { Deposit } from './classes/deposit';
import type { Pool } from './contracts/types';
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
export const generateNote = async (deposit: Deposit) => {
  const AMOUNT = '1';
  const netId = '4';
  return `zkpt-eth-${AMOUNT}-${netId}-0x${deposit.nullifier}`;
};

export const parseNote = async (noteString) => {
  try {
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
  } catch (err) {
    console.log({ err });
  }
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

  const { root, path_elements, path_index } = await tree.path(leafIndex);
  const isValidRoot = await contract.isKnownRoot(root);

  if (!isValidRoot) {
    return {
      type: 'error',
      title: 'Merkle Tree',
      message: 'Merkle Tree is corrupted either invalid paths',
    };
  }

  const isSpent = await contract.isSpent(deposit.nullifierHash);

  if (isSpent) {
    return {
      type: 'error',
      title: 'Already Spent',
      message: 'The provided ticket is already spent',
    };
  }
  if (leafIndex < 0) {
    return {
      type: 'error',
      title: 'Deposit Leaf',
      message: 'The deposit is not found in the tree',
    };
  }

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
  try {
    const network = await contract.signer.provider.getNetwork();
    const valid = isSupportedNetwork(network.chainId);
    if (!valid) {
      return {
        type: 'error',
        title: 'Network Errr',
        message: 'the selected network is not supported yet try [rinkeby]',
      };
    } else {
      console.log('Sending deposit transaction...');
      const commitment = deposit.commitment;
      const nullifierHash = deposit.nullifierHash;
      // @ts-ignore
      const tx = await contract.deposit(commitment, nullifierHash, {
        value: ethers.utils.parseEther('1'),
      });
      const txReceipt = await tx.wait();
      console.log(
        `https://rinkeby.etherscan.io/tx/${txReceipt.transactionHash}`
      );
      return {
        type: 'success',
        title: 'Transaction Success',
        message: `https://rinkeby.etherscan.io/tx/${txReceipt.transactionHash}`,
      };
    }
  } catch (err) {
    return {
      type: 'error',
      title: 'Something went wrong',
      message: err.message,
    };
  }
};

export const withdraw = async (note, recipient, contract: Pool) => {
  try {
    const deposit = await parseNote(note);
    console.log('deposit created ====>', { deposit });
    if (!deposit) {
      return {
        type: 'error',
        title: 'Invalid Note formet',
        message: 'note formet should be [zkpt]-[amount]-[netId]-0x[nullifier]',
      };
    }
    const snarkProof = await generateSnarkProof(
      deposit,
      recipient,
      contract,
      '0x99d667ff3e5891a5f40288cb94276158ae8176a0'
    );

    if (!snarkProof.proof) {
      return snarkProof;
    }

    console.log('Sending withdrawal transaction...');
    console.log({ proof: snarkProof.proof, args: snarkProof.args });
    const response = await fetch(`/api/withdraw/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        proof: snarkProof.proof,
        args: snarkProof.args,
      }),
    });
    console.log({ response });

    return {
      type: 'success',
      title: 'Transaction Success',
      message: `https://rinkeby.etherscan.io/tx/`,
    };
  } catch (err) {
    console.log('error while withdrawing', { err });
    return {
      type: 'error',
      title: 'Something went wrong',
      message: err.message,
    };
  }
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

  const response = await generateMerkleProof(deposit, contract);

  console.log({ response });

  if (response.type) {
    return { ...response };
  }

  const { root, path_elements, path_index } = response;

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

export const getNetwork = (id: number) => {
  const networks = {
    1: 'mainnet',
    3: 'robston',
    4: 'rinkeby',
    5: 'goerli',
    137: 'Polygon Mainnet',
    1666600000: 'Mainnet Harmony',
    1666900000: 'Devnet Harmony',
  };

  return networks[id];
};

export const isSupportedNetwork = (id: number) => {
  const networks = {
    1: false,
    3: false,
    4: true,
    5: false,
    137: false,
    1666600000: false,
    1666900000: false,
  };

  return networks[id];
};
