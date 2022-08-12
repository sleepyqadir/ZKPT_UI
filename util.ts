import type { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { ethers, BigNumber } from 'ethers';
import { MerkleTree } from './classes/merkleTree';
import { PoseidonHasher } from './classes/PoseidonHasher';
import path from 'path';
import getConfig from 'next/config';
import { Deposit } from './classes/deposit';
import type { Pool } from './contracts/types';
import {
  ETHERSCAN_PREFIXES,
  networks,
  poolContracts,
  providers,
  relayerAddress,
} from './config';
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

export const createDeposit = async (
  nullifier = ethers.utils.randomBytes(15),
  secret = ethers.utils.randomBytes(15),
  guess = 4
) => {
  const poseidon = await circomlibjs.buildPoseidon();
  const deposit = Deposit.new(nullifier, secret, guess, poseidon);
  return deposit;
};

export const generateNote = async (deposit: Deposit, draw: number) => {
  const AMOUNT = '1';
  const guess = deposit.guess;
  return `zkpt-eth-${AMOUNT}-${guess}-${draw}-0x${deposit.nullifier}-0x${deposit.secret}`;
};

export const parseNote = async (noteString) => {
  try {
    const noteArray = noteString.split('0x');
    const noteRegex =
      /zkpt-(?<currency>\w+)-(?<amount>[\d.]+)-(?<guess>\d+)-(?<drawId>\d+)/g;
    const match = noteRegex.exec(noteArray[0]);
    const bytesArrayNullifier = noteArray[1]
      .replace('-', '')
      .split(',')
      .map((x) => +x);
    const nullifier = new Uint8Array(bytesArrayNullifier);
    const bytesArraySecret = noteArray[2]
      .replace('-', '')
      .split(',')
      .map((x) => +x);
    const secret = new Uint8Array(bytesArraySecret);
    return {
      deposit: await createDeposit(nullifier, secret, parseInt(match[3])),
      drawId: parseInt(match[4]),
    };
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

const generateMerkleProof = async (deposit, drawId, contract: Pool) => {
  const eventFilter = contract.filters.Deposit();
  const events = await contract.queryFilter(eventFilter, 30339000, 'latest');
  const poseidon = await circomlibjs.buildPoseidon();
  const tree = new MerkleTree(20, 'test', new PoseidonHasher(poseidon));

  const saltedCommitment = await poseidonHash(poseidon, [
    deposit.commitment,
    drawId,
  ]);

  const leaves = events
    .sort((a, b) => a.args.leafIndex - b.args.leafIndex) // Sort events in chronological order
    .map((e) => e.args.commitment);

  for (const iterator of leaves) {
    await tree.insert(iterator);
  }

  // Find current commitment in the tree
  const depositEvent = events.find((e) => {
    return e.args.commitment === saltedCommitment;
  });

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
      message: 'The provided note is already spent',
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

export const parseBalance = (
  value: BigNumberish,
  decimals = 18,
  decimalsToDisplay = 3
) => parseFloat(formatUnits(value, decimals)).toFixed(decimalsToDisplay);

export const depositEth = async (
  deposit: Deposit,
  contract: Pool,
) => {
  try {
    const network = await contract.signer.provider.getNetwork();
    let currentDraw: number = (await contract.currentDrawId()).toNumber();
    const valid = isSupportedNetwork(network.chainId);
    if (!valid) {
      return {
        type: 'error',
        title: 'Network Errr',
        message:
          'the selected network is not supported yet try connection [polygon mainnet , polygon testnet , rinkeby ]',
      };
    } else {
      const commitment = deposit.commitment;
      const tx = await contract.deposit(commitment, {
        value: ethers.utils.parseEther('1'),
      });
      const txReceipt = await tx.wait();
      return {
        type: 'success',
        title: 'Transaction Success',
        message: `${ETHERSCAN_PREFIXES[network.chainId]}${txReceipt.transactionHash}`,
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

export const withdraw = async (
  random,
  note,
  recipient,
  contract: Pool,
  chainId: number
) => {
  try {
    const { deposit, drawId } = await parseNote(note);
    if (!deposit) {
      return {
        type: 'error',
        title: 'Invalid Note formet',
        message:
          'note formet should be [zkpt]-[amount]-[netId]-0x[nullifier]0x[secret]',
      };
    }
    const snarkProof = await generateSnarkProof(
      drawId,
      random,
      deposit,
      recipient,
      contract,
      relayerAddress[chainId],
      false
    );

    if (!snarkProof.proof) {
      return snarkProof;
    }

    const response = await fetch(`/api/withdraw/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        proof: snarkProof.proof,
        args: snarkProof.args,
        chainId: chainId,
      }),
    });

    const txResponse = await response.json();

    if (txResponse.transactionHash) {
      return {
        type: 'success',
        title: 'Transaction Success',
        message: `${ETHERSCAN_PREFIXES[chainId]}${txResponse.transactionHash}`,
      };
    } else {
      return {
        type: 'error',
        title: 'Something went wrong',
        message: txResponse.reason
          ? txResponse.reason
          : 'Something went wrong please try again!',
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

export const getProviderByChainId = async (chainId) => {
  return providers[chainId];
};

export const winning = async (
  drawId,
  random,
  note,
  recipient,
  contract: Pool,
  chainId: number
) => {
  try {
    const { deposit } = await parseNote(note);
    if (!deposit) {
      return {
        type: 'error',
        title: 'Invalid Note formet',
        message:
          'note formet should be [zkpt]-[amount]-[netId]-0x[nullifier]0x[secret]',
      };
    }
    const snarkProof = await generateSnarkProof(
      drawId,
      random,
      deposit,
      recipient,
      contract,
      relayerAddress[chainId],
      true
    );

    if (!snarkProof.proof) {
      return snarkProof;
    }

    const response = await fetch(`/api/winning/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        proof: snarkProof.proof,
        args: snarkProof.args,
        chainId: chainId,
      }),
    });

    const txResponse = await response.json();

    return {
      type: 'success',
      title: 'Transaction Success',
      // @ts-ignore
      message: `${ETHERSCAN_PREFIXES[chainId]}${response.transactionHash}`,
    };
  } catch (err) {
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

export const prove = async (witness: any, won): Promise<Proof> => {
  let wasmPath: string;
  let zkeyPath: string;
  if (won) {
    wasmPath = '/winning.wasm';
    zkeyPath = '/winning.zkey';
  } else {
    wasmPath = '/withdraw.wasm';
    zkeyPath = '/withdraw.zkey';
  }
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
  drawId,
  random,
  deposit: Deposit,
  recipient,
  contract: Pool,
  relayer,
  won
) => {
  // Compute merkle proof of our commitment

  const response = await generateMerkleProof(deposit, drawId, contract);

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
    random: parseInt(random),
    draw: parseInt(drawId),

    // Private
    blind: deposit.guess,
    secret: BigNumber.from(deposit.secret).toBigInt(),
    nullifier: BigNumber.from(deposit.nullifier).toBigInt(),
    pathElements: path_elements,
    pathIndices: path_index,
  };

  const solidityProof = await prove(witness, won);

  const args = [
    witness.draw,
    witness.random,
    witness.root,
    witness.nullifierHash,
    witness.recipient,
    witness.relayer,
    witness.fee,
  ];

  return { proof: solidityProof, args };
};

export const getNetwork = (id: number) => {
  return networks[id];
};

export const isSupportedNetwork = (id: number): boolean => {
  const networks = {
    1: false,
    3: false,
    4: true,
    5: false,
    137: true,
    80001: true,
  };

  return networks[id];
};

export const getAddress = (chainId) => {
  return poolContracts[chainId];
};

export const checkBlindGuess = async (note: string, random: any, draw: any) => {
  const { deposit, drawId } = await parseNote(note);
  if (!deposit) {
    return {
      type: 'error',
      title: 'Invalid Note formet',
      message:
        'note formet should be [zkpt]-[amount]-[netId]-0x[nullifier]0x[secret]',
    };
  }
  if (drawId !== parseInt(draw)) {
    return {
      type: 'error',
      title: 'Invalid Draw',
      message: `Your deposited note has drawId ${drawId} and your are checking in draw ${draw}`,
    };
  }
  if (deposit.guess === parseInt(random)) {
    return {
      type: 'eligibility',
      msg: 'Hurray you have won the draw enter the withdrawal address to withdraw winning amount',
      status: true,
      won: true,
    };
  } else {
    return {
      type: 'eligibility',
      msg: "Sorry you haven't won this draw try another note or withdraw your amount",
      status: true,
      won: false,
    };
  }
};

export const switchNetwork = (hexId) => {
  // @ts-ignore
  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });
  // @ts-ignore
  window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: hexId }],
  });
  return;
};
