import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';

import POOL_ABI from '../../contracts/Pool.json';
import { getAddress, withdraw } from '../../util';

export default async (req, res) => {
  try {
    const {
      body: { proof, args },
    } = req;

    const provider = new ethers.providers.JsonRpcProvider(
      'https://polygon-mainnet.g.alchemy.com/v2/ZtJ_Tilj4-DWyigjZhIdQImHwkaljIYi'
    );

    console.log({ provider });

    const signer = new ethers.Wallet(process.env.WALLET, provider);

    console.log({ signer });

    const contract = new Contract(getAddress(), POOL_ABI, signer);

    console.log(...[...args.slice(2, 7)], args[0], proof);
    const maxFeePerGas = ethers.utils.parseUnits(60 + '', 'gwei');
    const maxPriorityFeePerGas = ethers.utils.parseUnits(57 + '', 'gwei');

    const tx = await contract.withdraw(
      proof,
      ...[...args.slice(2, 7), args[0]],
      {
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit: 10000000,
      }
    );

    const data = await tx.wait();

    console.log({ data });

    res.json(data);
  } catch (err) {
    console.log({ err });
    res.json(err);
  }
};
