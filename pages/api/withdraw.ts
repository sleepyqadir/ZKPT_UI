import { Contract } from '@ethersproject/contracts';
const {
  DefenderRelaySigner,
  DefenderRelayProvider,
} = require('defender-relay-client/lib/ethers');

const credentials = {
  apiKey: process.env.DEFENDER_API_KEY,
  apiSecret: process.env.DEFENDER_SECRET_KEY,
};
const provider = new DefenderRelayProvider(credentials);

import { Relayer } from 'defender-relay-client';
const relayer = new Relayer({
  apiKey: credentials.apiKey,
  apiSecret: credentials.apiSecret,
});

const signer = new DefenderRelaySigner(credentials, provider, {
  validForSeconds: 120,
});

import POOL_ABI from '../../contracts/Pool.json';
import { getAddress, withdraw } from '../../util';

export default async (req, res) => {
  try {
    const {
      body: { proof, args },
    } = req;

    const contract = new Contract(getAddress(), POOL_ABI, signer);

    const data = await contract.populateTransaction.withdraw(
      proof,
      ...[...args.slice(2, 7), args[0]]
    );

    console.log(data);

    console.log(...[...args.slice(2, 7)], args[0]);

    console.log('testing');

    const tx = await relayer.sendTransaction({
      to: data.to,
      data: data.data,
      speed: 'fast',
      gasLimit: 100000,
    });
    console.log({ tx });

    const txReciept = await tx.wait();

    console.log({ txReciept });
    res.json(txReciept);
  } catch (err) {
    console.log({ err });
    res.json(err);
  }
};
