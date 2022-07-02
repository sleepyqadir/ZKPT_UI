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

const signer = new DefenderRelaySigner(credentials, provider, {
  speed: 'fast',
});

import POOL_ABI from '../../contracts/Pool.json';
import { getAddress } from '../../util';

export default async (req, res) => {
  const {
    body: { proof, args },
  } = req;
  try {
    const contract = new Contract(getAddress(), POOL_ABI, signer);

    console.log(...[...args.slice(2, 7), args[0]]);

    const tx = await contract.winning(
      proof,
      ...[...args.slice(2, 7), args[0]],
      {}
    );
    const txReciept = await tx.wait();
    console.log({ txReciept });
    res.json(txReciept);
  } catch (err) {
    console.log({ err });
    res.json(err);
  }
};
