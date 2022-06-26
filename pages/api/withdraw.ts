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

export default async (req, res) => {
  const {
    body: { proof, args },
  } = req;

  const contract = new Contract(
    '0x1FD0E73c732E5A1Ca3867674FA84446994891C41',
    POOL_ABI,
    signer
  );

  const tx = await contract.withdraw(proof, ...args, {});
  const txReciept = await tx.wait();
  console.log({ txReciept });
  res.json(txReciept);
};
